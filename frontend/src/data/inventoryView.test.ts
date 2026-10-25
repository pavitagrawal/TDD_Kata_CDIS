import { describe, expect, it } from "vitest";
import { filterInventory, inventoryInsights } from "./inventoryView";
import type { Vehicle } from "../types/domain";

const vehicle = (
  id: string,
  make: string,
  price: string,
  quantity: number,
): Vehicle => ({
  id,
  make,
  model: "Test",
  category: "SUV",
  price,
  stock_quantity: quantity,
  created_at: "",
  updated_at: "",
});
const cars = [
  vehicle("a", "Ford", "25000", 0),
  vehicle("b", "BMW", "60000", 2),
  vehicle("c", "Toyota", "30000", 5),
];

describe("inventory dashboard view", () => {
  it("derives truthful stock and value metrics", () => {
    expect(inventoryInsights(cars)).toEqual({
      models: 3,
      units: 7,
      lowStock: 1,
      outOfStock: 1,
      stockValue: 270000,
    });
  });

  it("combines search, stock, price and ordering", () => {
    expect(
      filterInventory(cars, {
        query: "suv",
        stock: "available",
        sort: "price-high",
        minPrice: "20000",
        maxPrice: "65000",
      }).map((car) => car.make),
    ).toEqual(["BMW", "Toyota"]);
    expect(
      filterInventory(cars, {
        query: "",
        stock: "empty",
        sort: "name",
        minPrice: "",
        maxPrice: "",
      }).map((car) => car.make),
    ).toEqual(["Ford"]);
  });
});
