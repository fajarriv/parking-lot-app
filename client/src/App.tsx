import { useState } from "react";
import type { ViewMode } from "./types";
import { NavBar } from "./components/NavBar";
import { useParkingMap } from "./hooks/useParkingMap";
import { Button } from "./components/ui/button";
import { ParkingGrid } from "./components/ParkingMap";
import { Car } from "lucide-react";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const {
    data: parkingMapData,
    isLoading: mapLoading,
    error: mapError,
    // mutate: refreshMap,
  } = useParkingMap();

  if (mapError) {
    return (
      <div className="min-h-screen bg-[#242424] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Parking Data
          </h1>
          <p className="text-gray-300 mb-4">{mapError.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#242424]">
      <NavBar
        parkingMapData={parkingMapData}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <main className="flex px-6 py-6">
        {mapLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Car className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
              <p className="text-gray-300">Loading parking data...</p>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {viewMode === "map" && parkingMapData && (
              <div className="flex flex-col items-center text-center">
                <h2 className="text-xl font-semibold mb-4 text-white text-center">
                  Parking Map
                </h2>
                <ParkingGrid data={parkingMapData} />
              </div>
            )}

            {viewMode === "manage" && <div className="">MANAGE VIEW</div>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
