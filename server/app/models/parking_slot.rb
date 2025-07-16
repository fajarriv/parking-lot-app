class ParkingSlot < ApplicationRecord
  has_many :parking_slot_distances, dependent: :destroy
  has_many :entry_points, through: :parking_slot_distances
  has_many :parking_transactions, dependent: :nullify

  enum :slot_type, {
    small: 0,
    medium: 1,
    large: 2
  }

  validates :row, :col, presence: true
  validates :slot_type, presence: true
end
