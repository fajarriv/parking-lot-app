class CreateEntryPoints < ActiveRecord::Migration[8.0]
  def change
    create_table :entry_points do |t|
      t.integer :row
      t.integer :col

      t.timestamps
    end
  end
end
