class CreateParkingTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :parking_transactions do |t|
      t.references :vehicle, null: false, foreign_key: true
      t.references :parking_slot, null: false, foreign_key: true
      t.datetime :entry_time
      t.datetime :exit_time
      t.integer :fee
      t.integer :status

      t.timestamps
    end
  end
end
