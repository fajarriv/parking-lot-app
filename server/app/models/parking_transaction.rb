class ParkingTransaction < ApplicationRecord
  belongs_to :vehicle
  belongs_to :parking_slot

  enum :status, { parked: 0, exited: 1 }
end
