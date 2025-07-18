import type { ParkingMapData } from "@/types";

interface ParkingStatisticsProps {
  data: ParkingMapData;
}

export function ParkingStatistics({ data }: ParkingStatisticsProps) {
  const getOccupiedCount = () => {
    return data.parking_slots.filter((slot) => slot.is_occupied).length;
  };

  const getTotalSlots = () => {
    return data.parking_slots.length;
  };

  const getOccupancyRate = () => {
    const total = getTotalSlots();
    const occupied = getOccupiedCount();
    return total > 0 ? Math.round((occupied / total) * 100) : 0;
  };

  const getSlotTypeStats = () => {
    return ["small", "medium", "large"].map((type) => {
      const slotsOfType = data.parking_slots.filter(
        (slot) => slot.slot_type === type
      );
      const occupiedOfType = slotsOfType.filter(
        (slot) => slot.is_occupied
      ).length;
      return {
        type,
        total: slotsOfType.length,
        occupied: occupiedOfType,
        available: slotsOfType.length - occupiedOfType,
      };
    });
  };

  const occupied = getOccupiedCount();
  const total = getTotalSlots();
  const available = total - occupied;
  const occupancyRate = getOccupancyRate();
  const slotTypeStats = getSlotTypeStats();

  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-fit w-fit">
      <h3 className="font-semibold mb-4 text-lg text-white">Parking Lot Stats</h3>

      <div className="space-y-4">
        {/* Main Statistics */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Slots:</span>
            <span className="font-medium text-lg text-white">{total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Occupied:</span>
            <span className="font-medium text-lg text-red-400">{occupied}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Available:</span>
            <span className="font-medium text-lg text-green-400">
              {available}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Entry Points:</span>
            <span className="font-medium text-lg text-white">
              {data.entry_points.length}
            </span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400 mb-3">Occupancy Rate</div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-2 text-center">
            {occupancyRate}%
          </div>
        </div>

        {/* Slot Type Breakdown */}
        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400 mb-3">Slot Types</div>
          <div className="space-y-2">
            {slotTypeStats.map(({ type, occupied, total }) => (
              <div
                key={type}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-400 capitalize">{type}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">
                    {occupied}/{total}
                  </span>
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        type === "small"
                          ? "bg-blue-500"
                          : type === "medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${total > 0 ? (occupied / total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400 mb-3">Status</div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-400">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-400">Entry Point</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
