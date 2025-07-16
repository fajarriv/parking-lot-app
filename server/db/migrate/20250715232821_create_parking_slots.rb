class CreateParkingSlots < ActiveRecord::Migration[8.0]
  def change
    create_table :parking_slots do |t|
      t.integer :slot_type
      t.integer :row
      t.integer :col
      t.boolean :is_occupied, default: false
      t.datetime :occupied_at

      t.timestamps
    end
  end
end
