class AllowNullParkingSlotInTransactions < ActiveRecord::Migration[8.0]
  def change
    change_column_null :parking_transactions, :parking_slot_id, true
  end
end
