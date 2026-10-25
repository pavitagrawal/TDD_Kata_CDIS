import type { Vehicle } from "../types/domain";

// Editorial showroom examples. They are never represented as purchasable stock.
export const showroomVehicles: Vehicle[] = [
  ["northstar-arc", "Northstar", "Arc", "Electric", "48900.00"],
  ["northstar-arc-gt", "Northstar", "Arc GT", "Electric", "63500.00"],
  ["northstar-roam", "Northstar", "Roam", "SUV", "52900.00"],
  ["northstar-roam-xl", "Northstar", "Roam XL", "SUV", "68700.00"],
  ["northstar-velocity", "Northstar", "Velocity", "Performance", "82900.00"],
  [
    "northstar-velocity-r",
    "Northstar",
    "Velocity R",
    "Performance",
    "104500.00",
  ],
].map(([id, make, model, category, price]) => ({
  id: `showroom-${id}`,
  make,
  model,
  category,
  price,
  stock_quantity: 0,
  created_at: "",
  updated_at: "",
}));

export function isShowroomVehicle(vehicle: Vehicle): boolean {
  return vehicle.id.startsWith("showroom-");
}

export function vehicleImage(vehicle: Vehicle): string {
  const modelImages: Record<string, string> = {
    "showroom-northstar-arc": "/images/arc.png",
    "showroom-northstar-arc-gt": "/images/arc-gt.png",
    "showroom-northstar-roam": "/images/roam.png",
    "showroom-northstar-roam-xl": "/images/roam-xl.png",
    "showroom-northstar-velocity": "/images/velocity.png",
    "showroom-northstar-velocity-r": "/images/velocity-r.png",
  };
  if (modelImages[vehicle.id]) return modelImages[vehicle.id];
  const category = vehicle.category.toLowerCase();
  if (category.includes("suv") || category.includes("utility"))
    return "/images/luxury-suv.png";
  if (
    category.includes("performance") ||
    category.includes("sport") ||
    category.includes("coupe")
  )
    return "/images/sports-coupe.png";
  return "/images/electric-sedan.png";
}
