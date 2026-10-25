import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api } from "../api/client";
import { AuthContext } from "../auth/authState";
import type { Vehicle } from "../types/domain";
import { AdminInventoryPage } from "./AdminInventoryPage";

const record = (id: string, make: string, stock_quantity: number): Vehicle => ({
  id,
  make,
  model: "Test",
  category: "Sedan",
  price: "10000",
  stock_quantity,
  created_at: "",
  updated_at: "",
});

afterEach(() => vi.restoreAllMocks());

describe("admin inventory workspace", () => {
  it("shows live metrics and filters low-stock vehicles", async () => {
    vi.spyOn(api, "vehicles").mockResolvedValue([
      record("1", "BMW", 2),
      record("2", "Ford", 0),
      record("3", "Toyota", 5),
    ]);
    render(
      <AuthContext.Provider
        value={{
          user: {
            id: "admin",
            email: "admin@example.test",
            role: "admin",
            created_at: "",
            updated_at: "",
          },
          token: "test-token",
          isAuthenticated: true,
          isLoading: false,
          login: () => undefined,
          logout: () => undefined,
        }}
      >
        <AdminInventoryPage />
      </AuthContext.Provider>,
    );
    await screen.findByText("BMW Test");
    expect(screen.getByText("$70,000")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /low stock/i }));
    expect(screen.getByText("BMW Test")).toBeVisible();
    expect(screen.queryByText("Ford Test")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /add vehicle/i }));
    expect(screen.getByRole("heading", { name: "Add vehicle" })).toBeVisible();
    await waitFor(() =>
      expect(api.vehicles).toHaveBeenCalledWith({}, "test-token"),
    );
  });

  it("restocks by the quantity selected by the admin", async () => {
    vi.spyOn(api, "vehicles").mockResolvedValue([record("1", "BMW", 2)]);
    const restock = vi.spyOn(api, "restock").mockResolvedValue({
      message: "inventory restocked",
      vehicle: record("1", "BMW", 5),
    });
    render(
      <AuthContext.Provider
        value={{
          user: {
            id: "admin",
            email: "admin@example.test",
            role: "admin",
            created_at: "",
            updated_at: "",
          },
          token: "test-token",
          isAuthenticated: true,
          isLoading: false,
          login: () => undefined,
          logout: () => undefined,
        }}
      >
        <AdminInventoryPage />
      </AuthContext.Provider>,
    );
    await screen.findByText("BMW Test");
    fireEvent.change(screen.getByLabelText("Restock quantity for BMW Test"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Restock" }));
    await waitFor(() =>
      expect(restock).toHaveBeenCalledWith("1", { quantity: 3 }, "test-token"),
    );
    expect(
      await screen.findByText("BMW Test restocked by 3 units."),
    ).toBeVisible();
  });
});
