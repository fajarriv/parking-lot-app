import { Minus  } from "lucide-react";
import { Button } from "./ui/button";

interface ParkingButtonProps {
  setIsUnparkingModalOpen: (isOpen: boolean) => void;
}

export default function ParkButton({
  setIsUnparkingModalOpen,
}: ParkingButtonProps) {
  return (
    <Button
      onClick={() => setIsUnparkingModalOpen(true)}
      variant="destructive"
      className="bg-red-600 hover:bg-red-700 w-1/2"
    >
      <Minus className="w-4 h-4 mr-2" />
      Unpark Vehicle
    </Button>
  );
}
