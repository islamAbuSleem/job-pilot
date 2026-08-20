import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("landing page", () => {
  it("renders CTA linking to dashboard", () => {
    render(<Home />);
    const links = screen.getAllByRole("link", { name: /Go to Dashboard/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute("href")).toBe("/dashboard");
  });

  it("shows JobPilot branding and key sections", () => {
    render(<Home />);
    expect(screen.getByText("JobPilot")).toBeInTheDocument();
    expect(screen.getByText(/Paste any job/)).toBeInTheDocument();
    expect(screen.getByText(/Analyze fit/)).toBeInTheDocument();
  });
});
