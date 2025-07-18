import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface ParkingButtonProps {
  setIsParkingModalOpen: (isOpen: boolean) => void;
}

export default function ParkingButton({
  setIsParkingModalOpen,
}: ParkingButtonProps) {
  return (
    <Button
      onClick={() => setIsParkingModalOpen(true)}
      variant="default"
      className="bg-green-600 hover:bg-green-700"
    >
      <Plus className="w-4 h-4 mr-2" />
      Park Vehicle
    </Button>
  );
}
