class ParkingMapService
  # Create / recreate a parking map with a given number of rows and columns
  def self.reset_and_initialize_map(rows, cols)
    # Validate minimum requirements
    raise ArgumentError, "Minimum sizes for parking map are 4" if (rows*cols) < 4

    # Clear all existing data
    ActiveRecord::Base.transaction do
      ParkingTransaction.delete_all
      ParkingSlotDistance.delete_all
      Vehicle.delete_all
      EntryPoint.delete_all
      ParkingSlot.delete_all
    end

    # Create parking slots
    parking_slots = []
    rows.times do |r|
      cols.times do |c|
        parking_slots << {
          slot_type: ParkingSlot.slot_types.values.sample,
          is_occupied: false,
          row: r,
          col: c
        }
      end
    end
    ParkingSlot.insert_all(parking_slots)

    # Create 3 default random entry points
    generated_coords = Set.new
    3.times do
      loop do
        random_row = rand(rows)
        random_col = rand(cols)
        # Ensure the randomized entry point coordinates are unique
        if generated_coords.add?([ random_row, random_col ])
          add_entry_point(random_row, random_col)
          break
        end
      end
    end

    {
      success: true,
      message: "Parking map created successfully",
      data: get_parking_map
    }
  end

  def self.add_entry_point(row, col)
    # Check if an entry point already exists at this location
    existing_entry_point = EntryPoint.find_by(row: row, col: col)
    if existing_entry_point
      raise ArgumentError, "Entry point already exists at row #{row}, col #{col}"
    end

    entry_point = nil
    ActiveRecord::Base.transaction do
      # Find and destroy any parking slot at the new entry point's location.
      slot_to_replace = ParkingSlot.find_by(row: row, col: col)
      slot_to_replace&.destroy

      entry_point = EntryPoint.create!(row: row, col: col)

      new_parking_slot_distances = []
      ParkingSlot.all.each do |slot|
        # Calculate distance using Manhattan distance
        distance = (slot.row - row).abs + (slot.col - col).abs
        new_parking_slot_distances << {
          parking_slot_id: slot.id,
          entry_point_id: entry_point.id,
          distance: distance
        }
      end
      ParkingSlotDistance.insert_all(new_parking_slot_distances) if new_parking_slot_distances.any?
    end

    {
      success: true,
      message: "Entry point added successfully",
      data: {
        entry_point: {
          id: entry_point.id,
          row: entry_point.row,
          col: entry_point.col
        },
        updated_map: get_parking_map
      }
    }
  end


  def self.get_parking_map
    all_slots = ParkingSlot.all
    all_entry_points = EntryPoint.all

    # Find grid dimensions
    max_row = (all_slots.map(&:row) + all_entry_points.map(&:row)).max || -1
    max_col = (all_slots.map(&:col) + all_entry_points.map(&:col)).max || -1

    slots_data = all_slots.includes(parking_transactions: :vehicle).map do |slot|
      slot_info = {
        id: slot.id,
        row: slot.row,
        col: slot.col,
        slot_type: slot.slot_type,
        is_occupied: slot.is_occupied
      }

      # Add vehicle information if slot is occupied
      if slot.is_occupied
        transaction = slot.parking_transactions.parked.first
        if transaction
          slot_info[:occupied_by] = {
            plate_number: transaction.vehicle.plate_number,
            vehicle_type: transaction.vehicle.vehicle_type,
            entry_time: transaction.entry_time.iso8601
          }
        end
      end

      slot_info
    end

    entry_points_data = all_entry_points.map do |ep|
      {
        id: ep.id,
        row: ep.row,
        col: ep.col
      }
    end

    {
      rows: max_row + 1,
      cols: max_col + 1,
      parking_slots: slots_data,
      entry_points: entry_points_data
    }
  end
end
