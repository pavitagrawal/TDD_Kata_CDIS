import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("introduces the inventory workspace", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /keep every vehicle visible/i }),
    ).toBeVisible();
    expect(
      screen.getByText(/inventory workflow will arrive in phase 2/i),
    ).toBeVisible();
  });
});
