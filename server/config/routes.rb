Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "parking-map", to: "parking_map#create"
      get "parking-map", to: "parking_map#show"
      post "parking-map/entry-point", to: "parking_map#add_entry_point"
      get "parking-map/entry-points", to: "parking_map#entry_points"

      post "parking-management/park", to: "parking_management#park_vehicle"
      patch "parking-management/unpark", to: "parking_management#unpark_vehicle"
      get "parking-management/vehicle/:plate_number", to: "parking_management#vehicle_status"
    end
  end
end
