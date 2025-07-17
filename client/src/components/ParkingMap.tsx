import { cn } from "@/lib/utils";
import type { ParkingMapData, ParkingSlot, EntryPoint } from "@/types";

interface ParkingGridProps {
  data: ParkingMapData;
}

export function ParkingGrid({ data }: ParkingGridProps) {
  const { rows, cols, parking_slots, entry_points } = data;

  const gridMap = new Map<
    string,
    { type: "slot" | "entry"; data: ParkingSlot | EntryPoint }
  >();

  parking_slots.forEach((slot) => {
    gridMap.set(`${slot.row}-${slot.col}`, { type: "slot", data: slot });
  });

  entry_points.forEach((entry) => {
    gridMap.set(`${entry.row}-${entry.col}`, { type: "entry", data: entry });
  });

  const getSlotTypeColor = (slotType: string) => {
    switch (slotType) {
      case "small":
        return "bg-blue-500/20 border-blue-500";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500";
      case "large":
        return "bg-red-500/20 border-red-500";
      default:
        return "bg-gray-500/20 border-gray-500";
    }
  };

  const getVehicleTypeColor = (vehicleType: string) => {
    switch (vehicleType) {
      case "small":
        return "bg-blue-600";
      case "medium":
        return "bg-yellow-600";
      case "large":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="grid gap-1 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => {
            const key = `${row}-${col}`;
            const cell = gridMap.get(key);

            if (!cell) {
              return (
                <div
                  key={key}
                  className="w-16 h-16 bg-gray-900/50 border border-gray-600 rounded"
                />
              );
            }

            if (cell.type === "entry") {
              const entry = cell.data as EntryPoint;
              return (
                <div
                  key={key}
                  className="w-16 h-16 bg-green-500/30 border-2 border-green-500 rounded cursor-pointer hover:bg-green-500/40 transition-colors flex items-center justify-center"
                >
                  <div className="text-green-400 text-xs font-bold">
                    E{entry.id}
                  </div>
                </div>
              );
            }

            const slot = cell.data as ParkingSlot;
            return (
              <div
                key={key}
                className={cn(
                  "w-16 h-16 border-2 rounded cursor-pointer transition-all duration-200 flex flex-col items-center justify-center relative",
                  slot.is_occupied
                    ? "bg-gray-700 border-gray-500"
                    : `${getSlotTypeColor(slot.slot_type)} hover:opacity-80`,
                  "hover:scale-105"
                )}
              >
                {slot.is_occupied && slot.occupied_by ? (
                  <>
                    <div
                      className={cn(
                        "w-10 h-6 rounded-sm mb-1",
                        getVehicleTypeColor(slot.occupied_by.vehicle_type)
                      )}
                    />
                    <p className="text-xs text-gray-300 font-mono">
                      {slot.occupied_by.plate_number.slice(-6)}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-xs font-bold text-gray-300">
                      {slot.slot_type.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-400">{slot.id}</div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legends */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500/20 border border-blue-500 rounded" />
          <span className="text-gray-300">Small</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500 rounded" />
          <span className="text-gray-300">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/20 border border-red-500 rounded" />
          <span className="text-gray-300">Large</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/30 border border-green-500 rounded" />
          <span className="text-gray-300">Entry Point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded" />
          <span className="text-gray-300">Occupied</span>
        </div>
      </div>
    </div>
  );
}
