export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IApiError {
  error: string;
}

export type ViewMode = "map" | "manage";
export type VehicleType = "small" | "medium" | "large";
export type SlotType = "small" | "medium" | "large";

export interface SlotPosition {
  row: number;
  col: number;
}

export interface ParkingMapData {
  rows: number;
  cols: number;
  parking_slots: ParkingSlot[];
  entry_points: EntryPoint[];
}
export interface ParkingSlot {
  id: number;
  row: number;
  col: number;
  slot_type: SlotType;
  is_occupied: boolean;
  occupied_by?: OccupiedBy;
}
export interface OccupiedBy {
  plate_number: string;
  vehicle_type: VehicleType;
  entry_time: string;
}
export interface EntryPoint {
  id: number;
  row: number;
  col: number;
  // created_at?: string;
}
export interface EntryPointsResponse {
  entry_points: EntryPoint[];
  count: number;
}

export interface Vehicle {
  plate_number: string;
  vehicle_type: VehicleType;
}

export interface ParkVehicleForm {
  vehicle_type: VehicleType;
  plate_number: string;
  entry_point_id: number;
}

export interface ParkVehicleData {
  parking_transaction_id: number;
  slot_id: number;
  slot_type: SlotType;
  slot_position: SlotPosition;
  vehicle: Vehicle;
  entry_time: string;
  entry_point_id: number;
}
export interface UnparkVehicleData {
  vehicle: Vehicle;
  parking_details: ParkingDetails;
  billing: Billing;
}
export interface ParkingDetails {
  slot_id: number;
  slot_type: SlotType;
  slot_position: SlotPosition;
  entry_time: string;
  exit_time?: string;
  total_hours?: number;
}
export interface Billing {
  fee_charged_pesos: number;
  fee_charged_cents: number;
  breakdown: FeeBreakdown;
}
export interface FeeBreakdown {
  total_hours: number;
  full_days?: number;
  remainder_hours?: number;
  daily_charges?: {
    days: number;
    rate_per_day_pesos: number;
    total_pesos: number;
  };
  remainder_hours_charges?: {
    hours: number;
    hourly_rate_pesos: number;
    total_pesos: number;
  };
  hourly_charges?: {
    hours?: number;
    flat_rate_hours?: number;
    flat_rate_pesos: number;
    exceeding_hours?: number;
    hourly_rate_pesos?: number;
    exceeding_total_pesos?: number;
    total_pesos: number;
  };
}

export interface GenerateParkingMapForm {
  rows: number;
  cols: number;
}

export interface AddEntryPointForm {
  row: number;
  col: number;
}
export interface AddEntryPointResponse {
  entry_point: {
    id: number;
    row: number;
    col: number;
  };
  updated_map: ParkingMapData;
}
