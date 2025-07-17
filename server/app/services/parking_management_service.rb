class ParkingManagementService
  # Constants for pricing
  FLAT_RATE_HOURS = 3
  FLAT_RATE_CENTS = 4000
  DAILY_RATE_CENTS = 500000
  DAILY_HOURS = 24
  HOURLY_RATES_CENTS = { small: 2000, medium: 6000, large: 10000 }.freeze

  # Vehicle-slot compatibility rules
  COMPATIBILITY_RULES = {
    small: [ :small, :medium, :large ],
    medium: [ :medium, :large ],
    large: [ :large ]
  }.freeze

  # Time acceleration: 1 hour = 3 seconds (1200x speed)
  # TIME_ACCELERATION_FACTOR = 1     # Real-time
  # TIME_ACCELERATION_FACTOR = 60    # 1 minute = 1 hour
  # TIME_ACCELERATION_FACTOR = 1200  # 3 seconds = 1 hour
  # TIME_ACCELERATION_FACTOR = 3600  # 1 second = 1 hour
  TIME_ACCELERATION_FACTOR = 1200.freeze

  def self.park_vehicle(vehicle_type, plate_number, entry_point_id)
    vehicle = find_or_create_vehicle(plate_number, vehicle_type)
    validate_vehicle_not_parked(vehicle)

    best_slot = find_best_available_slot(vehicle, entry_point_id)
    validate_slot_available(best_slot, vehicle)

    # update slot and create parking transaction
    parking_transaction = nil
    ActiveRecord::Base.transaction do
      best_slot.update!(is_occupied: true)
      parking_transaction = ParkingTransaction.create!(
        vehicle: vehicle,
        parking_slot: best_slot,
        entry_time: Time.current,
        status: :parked
      )
    end

    {
      success: true,
      message: "Vehicle parked successfully",
      data: {
        parking_transaction_id: parking_transaction.id,
        slot_id: best_slot.id,
        slot_type: best_slot.slot_type,
        slot_position: {
          row: best_slot.row,
          col: best_slot.col
        },
        vehicle: {
          plate_number: vehicle.plate_number,
          vehicle_type: vehicle.vehicle_type
        },
        entry_time: parking_transaction.entry_time.iso8601,
        entry_point_id: entry_point_id
      }
    }
  end

  def self.unpark_vehicle(plate_number)
    vehicle = Vehicle.find_by!(plate_number: plate_number)
    current_transaction = ParkingTransaction.parked.find_by!(vehicle: vehicle)
    parking_slot = current_transaction.parking_slot

    exit_time = Time.current
    total_parking_duration = calculate_total_parking_duration(current_transaction, exit_time)
    fee_in_cents = calculate_fee_in_cents(total_parking_duration, parking_slot.slot_type.to_sym)

    # Update the transaction and parking slot
    ActiveRecord::Base.transaction do
      parking_slot.update!(is_occupied: false)
      current_transaction.update!(
        exit_time: exit_time,
        status: :exited,
        fee: fee_in_cents
      )
    end
    {
      success: true,
      message: "Vehicle unparked successfully",
      data: {
        vehicle: {
          plate_number: vehicle.plate_number,
          vehicle_type: vehicle.vehicle_type
        },
        parking_details: {
          slot_id: parking_slot.id,
          slot_type: parking_slot.slot_type,
          slot_position: {
            row: parking_slot.row,
            col: parking_slot.col
          },
          entry_time: current_transaction.entry_time.iso8601,
          exit_time: exit_time.iso8601,
          total_hours: total_parking_duration.ceil
        },
        billing: {
          fee_charged_pesos: fee_in_cents / 100.0,
          fee_charged_cents: fee_in_cents,
          breakdown: calculate_fee_breakdown(total_parking_duration, parking_slot.slot_type.to_sym)
        }
      }
    }
  end

  private

  # Vehicle management
  def self.find_or_create_vehicle(plate_number, vehicle_type)
    Vehicle.find_or_create_by!(plate_number: plate_number) do |v|
      v.vehicle_type = vehicle_type
    end
  end

  def self.validate_vehicle_not_parked(vehicle)
    if ParkingTransaction.parked.exists?(vehicle: vehicle)
      raise "Vehicle #{vehicle.plate_number} is already parked."
    end
  end

  # Slot management
  def self.find_best_available_slot(vehicle, entry_point_id)
    compatible_slot_types = COMPATIBILITY_RULES[vehicle.vehicle_type.to_sym]

    ParkingSlot.joins(:parking_slot_distances)
               .where(is_occupied: false, slot_type: compatible_slot_types)
               .where(parking_slot_distances: { entry_point_id: entry_point_id })
               .order("parking_slot_distances.distance ASC")
               .first
  end

  def self.validate_slot_available(slot, vehicle)
    unless slot
      raise "No available parking slot for vehicle type #{vehicle.vehicle_type}."
    end
  end

  # Time and duration calculations
  def self.calculate_total_parking_duration(current_transaction, exit_time)
    current_duration_seconds = exit_time - current_transaction.entry_time
    previous_duration_seconds = get_previous_parking_duration(current_transaction)

    total_real_seconds = current_duration_seconds + previous_duration_seconds
    accelerated_seconds = total_real_seconds * TIME_ACCELERATION_FACTOR
    accelerated_seconds / 3600.0
  end

  def self.get_previous_parking_duration(current_transaction)
    previous_transaction = find_recent_previous_transaction(current_transaction.vehicle)

    return 0 unless previous_transaction
    return 0 unless within_continuous_parking_window?(previous_transaction, current_transaction)

    previous_transaction.exit_time - previous_transaction.entry_time
  end

  def self.find_recent_previous_transaction(vehicle)
    ParkingTransaction.exited
                     .where(vehicle: vehicle)
                     .order(exit_time: :desc)
                     .first
  end

  def self.within_continuous_parking_window?(previous_transaction, current_transaction)
    time_gap = current_transaction.entry_time - previous_transaction.exit_time
    accelerated_one_hour = 1.hour / TIME_ACCELERATION_FACTOR

    time_gap <= accelerated_one_hour
  end

  # Fee calculation
  def self.calculate_fee_in_cents(duration_hours, slot_type)
    total_hours = duration_hours.ceil

    if total_hours >= DAILY_HOURS
      # For 24+ hours: daily chunks + remainder hours using method b
      daily_fee = calculate_daily_fee(total_hours)
      remainder_hours = total_hours % DAILY_HOURS
      remainder_fee = calculate_remainder_hours_fee(remainder_hours, slot_type)
      daily_fee + remainder_fee
    else
      # For under 24 hours: use normal pricing (flat rate + exceeding hours)
      calculate_hourly_fee(total_hours, slot_type)
    end
  end

  def self.calculate_daily_fee(total_hours)
    full_days = total_hours / DAILY_HOURS
    full_days * DAILY_RATE_CENTS
  end

  def self.calculate_remainder_hours_fee(remainder_hours, slot_type)
    return 0 if remainder_hours == 0
    remainder_hours * HOURLY_RATES_CENTS[slot_type]
  end

  def self.calculate_hourly_fee(total_hours, slot_type)
    # Normal pricing for under 24 hours: flat rate + exceeding hours
    return 0 if total_hours == 0
    return FLAT_RATE_CENTS if total_hours <= FLAT_RATE_HOURS

    exceeding_hours = total_hours - FLAT_RATE_HOURS
    FLAT_RATE_CENTS + (exceeding_hours * HOURLY_RATES_CENTS[slot_type])
  end

  def self.calculate_fee_breakdown(duration_hours, slot_type)
    total_hours = duration_hours.ceil

    breakdown = {
      total_hours: total_hours
    }

    # Check if parking exceeds 24 hours
    if total_hours >= DAILY_HOURS
      # For 24+ hours parking
      full_days = total_hours / DAILY_HOURS
      remainder_hours = total_hours % DAILY_HOURS

      breakdown[:full_days] = full_days
      breakdown[:remainder_hours] = remainder_hours

      # Daily charges breakdown (full_days is always > 0 when total_hours >= 24)
      breakdown[:daily_charges] = {
        days: full_days,
        rate_per_day_pesos: DAILY_RATE_CENTS / 100.0,
        total_pesos: (full_days * DAILY_RATE_CENTS) / 100.0
      }
      if remainder_hours > 0
        breakdown[:remainder_hours_charges] = {
          hours: remainder_hours,
          hourly_rate_pesos: HOURLY_RATES_CENTS[slot_type] / 100.0,
          total_pesos: (remainder_hours * HOURLY_RATES_CENTS[slot_type]) / 100.0
        }
      end
    else
      # For under 24 hours parking
      if total_hours <= FLAT_RATE_HOURS
        breakdown[:hourly_charges] = {
          hours: total_hours,
          flat_rate_pesos: FLAT_RATE_CENTS / 100.0,
          total_pesos: FLAT_RATE_CENTS / 100.0
        }
      else
        exceeding_hours = total_hours - FLAT_RATE_HOURS
        breakdown[:hourly_charges] = {
          flat_rate_hours: FLAT_RATE_HOURS,
          flat_rate_pesos: FLAT_RATE_CENTS / 100.0,
          exceeding_hours: exceeding_hours,
          hourly_rate_pesos: HOURLY_RATES_CENTS[slot_type] / 100.0,
          exceeding_total_pesos: (exceeding_hours * HOURLY_RATES_CENTS[slot_type]) / 100.0,
          total_pesos: (FLAT_RATE_CENTS + (exceeding_hours * HOURLY_RATES_CENTS[slot_type])) / 100.0
        }
      end
    end

    breakdown
  end
end
