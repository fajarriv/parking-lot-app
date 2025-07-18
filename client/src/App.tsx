import { useState } from "react";
import type { ViewMode } from "./types";
import { NavBar } from "./components/NavBar";
import { Button } from "./components/ui/button";
import { ParkingGrid } from "./components/ParkingMap";
import { Car } from "lucide-react";
import { useParkingMap } from "./hooks";
import ParkButton from "./components/ParkButton";
import { ParkingModal } from "./components/ParkingModal";
import { Toaster } from "./components/ui/sonner";
import UnparkButton from "./components/UnparkButton";
import { UnparkingModal } from "./components/UnparkingModal";
import { GenerateParkingMapForm } from "./components/GenerateParkingMapForm";
import { AddEntryPointForm } from "./components/AddEntryPointForm";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false);
  const [isUnparkingModalOpen, setIsUnparkingModalOpen] = useState(false);
  const {
    data: parkingMapData,
    isLoading: mapLoading,
    error: mapError,
    mutate: refreshMap,
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
              <div className="flex flex-col items-center text-center space-y-4">
                <h2 className="text-xl font-semibold text-white text-center">
                  Parking Map
                </h2>
                <ParkingGrid data={parkingMapData} />

                {/* */}
                <div className="flex flex-col space-y-2">
                  <ParkButton setIsParkingModalOpen={setIsParkingModalOpen} />
                  <UnparkButton
                    setIsUnparkingModalOpen={setIsUnparkingModalOpen}
                  />
                </div>
              </div>
            )}

            {viewMode === "manage" && (
              <div className="flex justify-center">
                <div className="w-full max-w-md space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-center text-white">
                      Create New Map
                    </h2>
                    <GenerateParkingMapForm
                      refreshMap={refreshMap}
                      setViewMode={setViewMode}
                    />
                  </div>

                  {parkingMapData && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 text-center text-white">
                        Add Entry Point
                      </h2>
                      <AddEntryPointForm
                        maxRows={parkingMapData.rows}
                        maxCols={parkingMapData.cols}
                        refreshMap={refreshMap}
                        setViewMode={setViewMode}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      {parkingMapData && (
        <>
          <ParkingModal
            isOpen={isParkingModalOpen}
            onClose={() => setIsParkingModalOpen(false)}
            entryPoints={parkingMapData.entry_points}
            refreshMap={refreshMap}
          />
          <UnparkingModal
            isOpen={isUnparkingModalOpen}
            onClose={() => setIsUnparkingModalOpen(false)}
            refreshMap={refreshMap}
          />
        </>
      )}

      <Toaster />
    </div>
  );
}

export default App;
