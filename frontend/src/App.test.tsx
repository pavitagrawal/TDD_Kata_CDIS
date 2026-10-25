import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("introduces the inventory workspace", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /drive what moves you/i }),
    ).toBeVisible();
    expect(screen.getByText(/illustrative models and prices/i)).toBeVisible();
  });

  it("keeps the showroom visible and filters by category", () => {
    render(<App />);
    expect(screen.getAllByText("Arc GT").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "SUV" }));

    expect(screen.getByText("Roam XL")).toBeVisible();
    expect(screen.queryByText("Arc GT")).not.toBeInTheDocument();
  });

  it("adds a concept to the cart and completes demo checkout", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    fireEvent.click(screen.getByRole("button", { name: /cart 1/i }));
    expect(screen.getByRole("heading", { name: "Your cart" })).toBeVisible();
    expect(
      screen.getByText(/no payment, order, or vehicle reservation/i),
    ).toBeVisible();
    fireEvent.click(
      screen.getByRole("button", { name: "Complete demo checkout" }),
    );
    expect(screen.getByText(/demo checkout complete/i)).toBeVisible();
    expect(screen.getByText(/your cart is empty/i)).toBeVisible();
  });
});
