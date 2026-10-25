import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("introduces the inventory workspace", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /exceptional vehicles/i }),
    ).toBeVisible();
    expect(screen.getByText(/curated preview/i)).toBeVisible();
  });
});
