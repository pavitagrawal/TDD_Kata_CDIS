import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  beforeEach(() => window.history.replaceState({}, "", "/"));

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

  it("compares two real cars without treating concepts as stock", () => {
    render(<App />);
    const comparison = screen.getByRole("region", { name: /two icons/i });
    fireEvent.change(within(comparison).getByLabelText("Second car"), {
      target: { value: "ford-mustang-gt" },
    });
    expect(
      within(comparison).getByRole("heading", {
        name: "Ford Mustang GT Fastback",
      }),
    ).toBeVisible();
    expect(
      within(comparison).getByText(/editorial comparison, not a stock/i),
    ).toBeVisible();
  });

  it("uses advanced budget filters without hiding the existing storefront by default", () => {
    render(<App />);
    fireEvent.click(screen.getByText(/advanced inventory filters/i));
    fireEvent.change(screen.getByLabelText("Maximum price"), {
      target: { value: "50000" },
    });
    expect(screen.getByRole("heading", { name: "Arc" })).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Arc GT" }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Clear advanced filters" }),
    );
    expect(screen.getByRole("heading", { name: "Arc GT" })).toBeVisible();
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

  it("opens a dedicated, shareable iconic-car profile", () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole("button", {
        name: /tesla.*model 3 performance.*explore model/i,
      }),
    );
    expect(window.location.pathname).toBe("/cars/tesla-model-3-performance");
    expect(
      screen.getByRole("heading", { name: "Tesla Model 3 Performance" }),
    ).toBeVisible();
    expect(screen.getByText("316 mi")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /tesla model 3 specifications/i }),
    ).toHaveAttribute("href", "https://www.tesla.com/model3");
  });

  it("loads an iconic-car profile directly from its URL", () => {
    window.history.replaceState({}, "", "/cars/porsche-911-carrera");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Porsche 911 Carrera" }),
    ).toBeVisible();
  });

  it("opens a dedicated showroom concept page with labelled video inspiration", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Details" })[0]);
    expect(window.location.pathname).toBe("/showroom/arc");
    expect(
      screen.getByRole("heading", { name: "Northstar Arc" }),
    ).toBeVisible();
    expect(screen.getByText(/does not depict Northstar Arc/i)).toBeVisible();
    expect(
      screen.getByTitle(/real-car inspiration, not Northstar Arc/i),
    ).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/krQKnhMwxn4",
    );
  });

  it("loads a showroom concept directly and lets visitors swipe the gallery", () => {
    window.history.replaceState({}, "", "/showroom/velocity-r");
    const { unmount } = render(<App />);
    expect(
      screen.getByRole("heading", { name: "Northstar Velocity R" }),
    ).toBeVisible();
    unmount();
    window.history.replaceState({}, "", "/");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Next car" }));
    expect(
      within(
        screen.getByRole("region", {
          name: /swipe through all featured cars/i,
        }),
      ).getByRole("heading", { name: "Porsche 911 Carrera" }),
    ).toBeVisible();
  });
});
