class ParkingSlotDistance < ApplicationRecord
  belongs_to :parking_slot
  belongs_to :entry_point
end
