# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_16_203221) do
  create_table "entry_points", force: :cascade do |t|
    t.integer "row"
    t.integer "col"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "parking_slot_distances", force: :cascade do |t|
    t.integer "parking_slot_id", null: false
    t.integer "entry_point_id", null: false
    t.decimal "distance"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index [ "entry_point_id" ], name: "index_parking_slot_distances_on_entry_point_id"
    t.index [ "parking_slot_id" ], name: "index_parking_slot_distances_on_parking_slot_id"
  end

  create_table "parking_slots", force: :cascade do |t|
    t.integer "slot_type"
    t.integer "row"
    t.integer "col"
    t.boolean "is_occupied", default: false
    t.datetime "occupied_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "parking_transactions", force: :cascade do |t|
    t.integer "vehicle_id", null: false
    t.integer "parking_slot_id"
    t.datetime "entry_time"
    t.datetime "exit_time"
    t.integer "fee"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index [ "parking_slot_id" ], name: "index_parking_transactions_on_parking_slot_id"
    t.index [ "vehicle_id" ], name: "index_parking_transactions_on_vehicle_id"
  end

  create_table "vehicles", force: :cascade do |t|
    t.string "plate_number"
    t.integer "vehicle_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index [ "plate_number" ], name: "index_vehicles_on_plate_number", unique: true
  end

  add_foreign_key "parking_slot_distances", "entry_points"
  add_foreign_key "parking_slot_distances", "parking_slots"
  add_foreign_key "parking_transactions", "parking_slots"
  add_foreign_key "parking_transactions", "vehicles"
end
