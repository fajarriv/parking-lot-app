class RemoveOccupiedAtFromParkingSlots < ActiveRecord::Migration[8.0]
  def change
    remove_column :parking_slots, :occupied_at, :datetime
  end
end
