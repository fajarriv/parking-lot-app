class EntryPoint < ApplicationRecord
  has_many :parking_slot_distances, dependent: :destroy
  has_many :parking_slots, through: :parking_slot_distances
  validates :row, :col, presence: true
end
