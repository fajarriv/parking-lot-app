class CreateParkingSlotDistances < ActiveRecord::Migration[8.0]
  def change
    create_table :parking_slot_distances do |t|
      t.references :parking_slot, null: false, foreign_key: true
      t.references :entry_point, null: false, foreign_key: true
      t.decimal :distance

      t.timestamps
    end
  end
end
