import type { Vehicle } from "../types/domain";
import { isShowroomVehicle } from "../data/showroom";

export interface CartItem {
  vehicle: Vehicle;
  quantity: number;
}

const STORAGE_KEY = "northstar-cart-v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value) || !isRecord(value.vehicle)) return false;
  const vehicle = value.vehicle;
  return (
    typeof vehicle.id === "string" &&
    typeof vehicle.price === "string" &&
    Number.isFinite(Number(vehicle.price)) &&
    typeof vehicle.make === "string" &&
    typeof vehicle.model === "string" &&
    typeof vehicle.category === "string" &&
    typeof vehicle.stock_quantity === "number" &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0 &&
    value.quantity <= 10
  );
}

export function loadCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]",
    );
    if (!Array.isArray(parsed)) return [];
    return (parsed as unknown[]).filter(isCartItem);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* Browsing remains usable without storage. */
  }
}

export function addToCart(items: CartItem[], vehicle: Vehicle): CartItem[] {
  const existing = items.find((item) => item.vehicle.id === vehicle.id);
  if (existing)
    return items.map((item) =>
      item.vehicle.id === vehicle.id
        ? {
            ...item,
            quantity: Math.min(
              isShowroomVehicle(vehicle) ? 10 : vehicle.stock_quantity,
              item.quantity + 1,
            ),
          }
        : item,
    );
  return [...items, { vehicle, quantity: 1 }];
}

export function setCartQuantity(
  items: CartItem[],
  id: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) return items.filter((item) => item.vehicle.id !== id);
  return items.map((item) =>
    item.vehicle.id === id
      ? {
          ...item,
          quantity: Math.min(
            isShowroomVehicle(item.vehicle) ? 10 : item.vehicle.stock_quantity,
            quantity,
          ),
        }
      : item,
  );
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + Number(item.vehicle.price) * item.quantity,
    0,
  );
}
