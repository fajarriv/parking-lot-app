class Vehicle < ApplicationRecord
  has_many :parking_transactions, dependent: :destroy

  validates :plate_number, presence: true, uniqueness: true

  enum vehicle_type: { small: 0, medium: 1, large: 2 }
end
