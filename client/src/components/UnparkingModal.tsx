import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUnparkVehicle } from "@/hooks/useUnparkVehicle";
import { toast } from "sonner";
import type { UnparkVehicleData } from "@/types";

interface UnparkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshMap: () => void;
}

export function UnparkingModal({
  isOpen,
  onClose,
  refreshMap,
}: UnparkingModalProps) {
  const [plateNumber, setPlateNumber] = useState("");
  const [showBilling, setShowBilling] = useState(false);
  const { unparkVehicle, isLoading } = useUnparkVehicle();
  const [billingData, setBillingData] = useState<
    UnparkVehicleData | undefined
  >();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    try {
      const result = await unparkVehicle(plateNumber.trim().toUpperCase());
      setBillingData(result.data);
      setShowBilling(true);
      refreshMap();
      toast.success(`Vehicle ${plateNumber} unparked successfully!`);
    } catch (error) {
      console.error("Failed to unpark vehicle:", error);
      toast.error("Failed to unpark vehicle", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleClose = () => {
    setPlateNumber("");
    setShowBilling(false);
    setBillingData(undefined);
    onClose();
  };

  // Show billing details after successful unpark
  if (billingData && !showBilling) {
    setShowBilling(true);
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderBillingBreakdown = () => {
    if (!billingData) return null;

    const { breakdown } = billingData.billing;

    return (
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-200 mb-3">Parking Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Vehicle:</span>
              <span className="text-white">
                {billingData.vehicle.plate_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vehicle Type:</span>
              <span className="text-white capitalize">
                {billingData.vehicle.vehicle_type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Slot:</span>
              <span className="text-white">
                {billingData.parking_details.slot_type.toUpperCase()} - Row{" "}
                {billingData.parking_details.slot_position.row}, Col{" "}
                {billingData.parking_details.slot_position.col}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Entry Time:</span>
              <span className="text-white">
                {formatDateTime(billingData.parking_details.entry_time)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Exit Time:</span>
              <span className="text-white">
                {formatDateTime(billingData.parking_details.exit_time!)}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-gray-400">Total Hours:</span>
              <span className="text-white">
                {billingData.parking_details.total_hours} hours
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-200 mb-3">Billing Breakdown</h4>
          <div className="space-y-3 text-sm">
            {breakdown.hourly_charges && (
              <div className="space-y-2">
                {breakdown.hourly_charges.flat_rate_hours && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      First {breakdown.hourly_charges.flat_rate_hours} hours
                      (Flat Rate):
                    </span>
                    <span className="text-white">
                      ₱{breakdown.hourly_charges.flat_rate_pesos}
                    </span>
                  </div>
                )}
                {breakdown.hourly_charges.exceeding_hours &&
                  breakdown.hourly_charges.exceeding_hours > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Additional {breakdown.hourly_charges.exceeding_hours}{" "}
                        hours @ ₱{breakdown.hourly_charges.hourly_rate_pesos}
                        /hr:
                      </span>
                      <span className="text-white">
                        ₱{breakdown.hourly_charges.exceeding_total_pesos}
                      </span>
                    </div>
                  )}
              </div>
            )}

            {breakdown.daily_charges && (
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {breakdown.daily_charges.days} day(s) @ ₱
                  {breakdown.daily_charges.rate_per_day_pesos}/day:
                </span>
                <span className="text-white">
                  ₱{breakdown.daily_charges.total_pesos}
                </span>
              </div>
            )}

            {breakdown.remainder_hours_charges && (
              <div className="flex justify-between">
                <span className="text-gray-400">
                  Remainder {breakdown.remainder_hours_charges.hours} hours @ ₱
                  {breakdown.remainder_hours_charges.hourly_rate_pesos}/hr:
                </span>
                <span className="text-white">
                  ₱{breakdown.remainder_hours_charges.total_pesos}
                </span>
              </div>
            )}

            <div className="border-t border-gray-600 pt-3 mt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-200">Total Amount:</span>
                <span className="text-green-400">
                  ₱{billingData.billing.fee_charged_pesos}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
    >
      <DialogContent className={showBilling ? "sm:max-w-2xl" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>
            {showBilling ? "Billing Summary" : "Unpark Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {showBilling
              ? "Vehicle has been successfully unparked. Here are the billing details."
              : "Enter the plate number of the vehicle to unpark."}
          </DialogDescription>
        </DialogHeader>

        {showBilling ? (
          <div className="space-y-6">
            {renderBillingBreakdown()}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleClose}
                className="px-8"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="unparkPlateNumber"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Plate Number
              </label>
              <input
                id="unparkPlateNumber"
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="ABC-1234"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
                variant="destructive"
              >
                {isLoading ? "Unparking..." : "Unpark Vehicle"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
