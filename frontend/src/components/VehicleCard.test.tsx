import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { VehicleCard } from "./VehicleCard";

describe("VehicleCard", () => {
  it("disables purchase when stock is unavailable", () => {
    render(
      <VehicleCard
        vehicle={{
          id: "vehicle-1",
          make: "Aster",
          model: "Grand Touring",
          category: "Coupe",
          price: "89500.00",
          stock_quantity: 0,
          created_at: "2026-10-25T00:00:00Z",
          updated_at: "2026-10-25T00:00:00Z",
        }}
        onPurchase={vi.fn()}
        onView={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: /out of stock/i }),
    ).toBeDisabled();
  });
});
