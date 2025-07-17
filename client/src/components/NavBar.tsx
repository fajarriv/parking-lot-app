import type { ParkingMapData, ViewMode } from "@/types";
import { MapPin, Settings } from "lucide-react";
import { Button } from "./ui/button";

interface INavBarProps {
  parkingMapData: ParkingMapData | undefined;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function NavBar({
  parkingMapData,
  viewMode,
  setViewMode,
}: INavBarProps) {
  const getOccupiedCount = () => {
    if (!parkingMapData) return 0;
    return parkingMapData.parking_slots.filter((slot) => slot.is_occupied)
      .length;
  };

  const getTotalSlots = () => {
    return parkingMapData?.parking_slots.length || 0;
  };
  return (
    <header className="bg-gray-800/50 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Parking Lot Management
          </h1>
          {parkingMapData && (
            <p className="text-gray-400 text-sm">
              {getOccupiedCount()} / {getTotalSlots()} slots occupied •{" "}
              {parkingMapData.entry_points.length} entry points
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            onClick={() => setViewMode("map")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Map
          </Button>
          <Button
            variant={viewMode === "manage" ? "default" : "outline"}
            onClick={() => setViewMode("manage")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
      </div>
    </header>
  );
}
