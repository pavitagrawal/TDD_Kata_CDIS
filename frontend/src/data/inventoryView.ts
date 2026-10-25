import type { Vehicle } from "../types/domain";

export type StockView = "all" | "available" | "low" | "empty";
export type InventorySort = "name" | "price-low" | "price-high" | "stock-low";

export function inventoryInsights(vehicles: Vehicle[]) {
  return {
    models: vehicles.length,
    units: vehicles.reduce((sum, vehicle) => sum + vehicle.stock_quantity, 0),
    lowStock: vehicles.filter(
      (vehicle) => vehicle.stock_quantity > 0 && vehicle.stock_quantity <= 3,
    ).length,
    outOfStock: vehicles.filter((vehicle) => vehicle.stock_quantity === 0)
      .length,
    stockValue: vehicles.reduce(
      (sum, vehicle) => sum + Number(vehicle.price) * vehicle.stock_quantity,
      0,
    ),
  };
}

export function filterInventory(
  vehicles: Vehicle[],
  {
    query,
    stock,
    sort,
    minPrice,
    maxPrice,
  }: {
    query: string;
    stock: StockView;
    sort: InventorySort;
    minPrice: string;
    maxPrice: string;
  },
) {
  const term = query.trim().toLowerCase();
  const min = minPrice === "" ? null : Number(minPrice);
  const max = maxPrice === "" ? null : Number(maxPrice);
  return vehicles
    .filter((vehicle) => {
      const quantity = vehicle.stock_quantity;
      const price = Number(vehicle.price);
      return (
        `${vehicle.make} ${vehicle.model} ${vehicle.category}`
          .toLowerCase()
          .includes(term) &&
        (stock === "all" ||
          (stock === "available" && quantity > 0) ||
          (stock === "low" && quantity > 0 && quantity <= 3) ||
          (stock === "empty" && quantity === 0)) &&
        (min === null || price >= min) &&
        (max === null || price <= max)
      );
    })
    .sort((a, b) => {
      if (sort === "price-low") return Number(a.price) - Number(b.price);
      if (sort === "price-high") return Number(b.price) - Number(a.price);
      if (sort === "stock-low") return a.stock_quantity - b.stock_quantity;
      return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
    });
}
