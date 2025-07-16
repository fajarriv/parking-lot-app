class Api::V1::ParkingManagementController < ApplicationController
  def park_vehicle
    result = ParkingManagementService.park_vehicle(
      params.require(:vehicle_type),
      params.require(:plate_number),
      params.require(:entry_point_id).to_i
    )
    render json: result, status: :created
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def unpark_vehicle
    result = ParkingManagementService.unpark_vehicle(params.require(:plate_number))
    render json: result, status: :ok
  rescue => e
    render json: { error: e.message }, status: :not_found
  end

  def vehicle_status
    plate_number = params.require(:plate_number)
    vehicle = Vehicle.find_by(plate_number: plate_number)

    unless vehicle
      render json: {
        success: false,
        error: "Vehicle not found"
      }, status: :not_found
      return
    end

    current_transaction = ParkingTransaction.parked.find_by(vehicle: vehicle)

    if current_transaction
      parking_slot = current_transaction.parking_slot
      render json: {
        success: true,
        data: {
          vehicle: {
            plate_number: vehicle.plate_number,
            vehicle_type: vehicle.vehicle_type
          },
          status: "parked",
          parking_details: {
            slot_id: parking_slot.id,
            slot_type: parking_slot.slot_type,
            slot_position: {
              row: parking_slot.row,
              col: parking_slot.col
            },
            entry_time: current_transaction.entry_time.iso8601,
            duration_minutes: ((Time.current - current_transaction.entry_time) / 60).round
          }
        }
      }, status: :ok
    else
      render json: {
        success: true,
        data: {
          vehicle: {
            plate_number: vehicle.plate_number,
            vehicle_type: vehicle.vehicle_type
          },
          status: "not_parked"
        }
      }, status: :ok
    end
  end
end
