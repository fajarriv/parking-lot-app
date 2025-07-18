import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGenerateParkingMap } from "@/hooks/useGenerateParkingMap";
import { toast } from "sonner";
import type { ViewMode } from "@/types";

interface GenerateParkingMapFormProps {
  refreshMap: () => void;
  setViewMode: (mode: ViewMode) => void;
}

export function GenerateParkingMapForm({
  refreshMap,
  setViewMode,
}: GenerateParkingMapFormProps) {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const { createMap, isLoading } = useGenerateParkingMap();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMap({ rows, cols });
      refreshMap();
      setViewMode("map");
      toast.success("Parking map created successfully!", {
        description: `Created ${rows}x${cols} grid with parking slots`,
      });
    } catch (error) {
      console.error("Failed to create map:", error);
      toast.error("Failed to create parking map", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="rows"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Rows
          </label>
          <input
            id="rows"
            type="number"
            min="2"
            max="20"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="cols"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Columns
          </label>
          <input
            id="cols"
            type="number"
            min="2"
            max="20"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
        variant="destructive"
      >
        {isLoading ? "Creating..." : "Create New Map"}
      </Button>

      <p className="text-xs text-gray-400">
        Warning: This will clear all existing data and create a new parking map.
      </p>
    </form>
  );
}
