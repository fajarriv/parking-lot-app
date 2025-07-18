import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface ParkingButtonProps {
  setIsParkingModalOpen: (isOpen: boolean) => void;
}

export default function ParkButton({
  setIsParkingModalOpen,
}: ParkingButtonProps) {
  return (
    <Button
      onClick={() => setIsParkingModalOpen(true)}
      variant="default"
      className="bg-green-600 hover:bg-green-700 w-1/2"
    >
      <Plus className="w-4 h-4 mr-2" />
      Park Vehicle
    </Button>
  );
}
