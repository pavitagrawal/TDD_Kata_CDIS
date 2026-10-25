import { describe, expect, it } from "vitest";
import { addToCart, cartTotal, setCartQuantity } from "./cart";
import { showroomVehicles } from "../data/showroom";

describe("cart", () => {
  it("adds cars, updates quantity and computes totals", () => {
    const one = addToCart([], showroomVehicles[0]);
    const two = addToCart(one, showroomVehicles[0]);
    expect(two[0].quantity).toBe(2);
    expect(cartTotal(two)).toBe(97800);
    expect(setCartQuantity(two, showroomVehicles[0].id, 0)).toEqual([]);
  });
});
