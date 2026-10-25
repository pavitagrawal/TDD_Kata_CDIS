export type Role = "user" | "admin";
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}
export interface Credentials {
  email: string;
  password: string;
}
export type RegisterInput = Credentials;
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}
export interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  stock_quantity: number;
}
export interface VehicleQuery {
  make?: string;
  model?: string;
  category?: string;
  min_price?: string;
  max_price?: string;
  offset?: number;
  limit?: number;
}
export interface RestockInput {
  quantity: number;
}
export interface InventoryResponse {
  message: string;
  vehicle: Vehicle;
}
