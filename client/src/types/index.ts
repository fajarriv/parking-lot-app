export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IApiError {
  error: string;
}

export type ViewMode = 'map' | 'manage';
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
