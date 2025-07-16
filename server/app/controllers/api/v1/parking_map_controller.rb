class Api::V1::ParkingMapController < ApplicationController
  # Create a new parking map with a given number of rows and columns
  def create
    rows = params.require(:rows).to_i
    cols = params.require(:cols).to_i

    created_parking_map = ParkingMapService.reset_and_initialize_map(rows, cols)
    render json: created_parking_map, status: :created
  rescue => e
    Rails.logger.error "ParkingMapController#create error: #{e.class}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: { error: e.message }, status: :bad_request
  end

  def show
    render json: ParkingMapService.get_parking_map, status: :ok
  end

  def add_entry_point
    row = params.require(:row).to_i
    col = params.require(:col).to_i
    result = ParkingMapService.add_entry_point(row, col)

    render json: result, status: :created
  rescue => e
    render json: { error: e.message }, status: :bad_request
  end
end
