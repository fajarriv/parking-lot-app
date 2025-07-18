import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { VehicleType, EntryPoint } from "@/types";
import { useParkVehicle } from "@/hooks/useParkVehicle";
import { toast } from "sonner";

interface ParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryPoints: EntryPoint[];
  refreshMap: () => void;
}

export function ParkingModal({
  isOpen,
  onClose,
  entryPoints,
  refreshMap,
}: ParkingModalProps) {
  const [vehicleType, setVehicleType] = useState<VehicleType>("small");
  const [plateNumber, setPlateNumber] = useState("");
  const [entryPointId, setEntryPointId] = useState<number>(
    entryPoints[0]?.id || 1
  );

  const { parkVehicle, isLoading } = useParkVehicle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    try {
      const result = await parkVehicle({
        vehicle_type: vehicleType,
        plate_number: plateNumber.trim().toUpperCase(),
        entry_point_id: entryPointId,
      });
      
      refreshMap();
      handleClose();
      toast.success(`Vehicle ${plateNumber} parked successfully!`, {
        description: `Assigned to ${result.data.slot_type} slot at Row ${result.data.slot_position.row}, Col ${result.data.slot_position.col}`,
      });
    } catch (error) {
      console.error("Failed to park vehicle:", error);
      toast.error("Failed to park vehicle", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleClose = () => {
    setPlateNumber("");
    setVehicleType("small");
    setEntryPointId(entryPoints[0]?.id || 1);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Park Vehicle</DialogTitle>
          <DialogDescription>
            Enter vehicle details to find and assign a parking slot.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Vehicle Type
            </label>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as VehicleType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVehicleType(type)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    vehicleType === type
                      ? "bg-blue-600 text-white border-2 border-blue-500"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="plateNumber"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Plate Number
            </label>
            <input
              id="plateNumber"
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="ABC-1234"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="entryPoint"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Entry Point
            </label>
            <select
              id="entryPoint"
              value={entryPointId}
              onChange={(e) => setEntryPointId(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {entryPoints.map((entry) => (
                <option
                  key={entry.id}
                  value={entry.id}
                >
                  Entry Point {entry.id} (Row {entry.row}, Col {entry.col})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !plateNumber.trim()}
              className="flex-1"
            >
              {isLoading ? "Parking..." : "Park Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
