import { useState } from "react";
import { Button } from "./ui/button";
import { useAddEntryPoint } from "@/hooks/useAddEntryPoint";
import { toast } from "sonner";
import type { ViewMode } from "@/types";
interface AddEntryPointFormProps {
  maxRows: number;
  maxCols: number;
  refreshMap: () => void;
  setViewMode: (mode: ViewMode) => void;
}

export function AddEntryPointForm({
  maxRows,
  maxCols,
  refreshMap,
  setViewMode,
}: AddEntryPointFormProps) {
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const { addEntryPoint, isLoading } = useAddEntryPoint();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEntryPoint({ row, col });
      refreshMap();
      toast.success("Entry point added successfully!", {
        description: `Added entry point at Row ${row}, Col ${col}`,
      });
      // Reset form
      setRow(0);
      setCol(0);
      setViewMode("map");
    } catch (error) {
      console.error("Failed to add entry point:", error);
      toast.error("Failed to add entry point", {
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
            htmlFor="entryRow"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Row
          </label>
          <input
            id="entryRow"
            type="number"
            min="0"
            max={maxRows - 1}
            value={row}
            onChange={(e) => setRow(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="entryCol"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Column
          </label>
          <input
            id="entryCol"
            type="number"
            min="0"
            max={maxCols - 1}
            value={col}
            onChange={(e) => setCol(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Adding..." : "Add Entry Point"}
      </Button>
    </form>
  );
}
