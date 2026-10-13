import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SchedulePickupModal from "./SchedulePickupModal";

describe("SchedulePickupModal", () => {
  const customWindows = ["12:00–12:30 PM", "12:30–1:00 PM"];

  it("sets pointer-events-none and translates out of view when isOpen is false", () => {
    const { container } = render(
      <SchedulePickupModal isOpen={false} onClose={vi.fn()} />
    );

    const outerWrapper = container.firstChild;
    expect(outerWrapper).toHaveClass("pointer-events-none");

    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveClass("translate-y-full");
  });

  it("renders correctly when isOpen is true with default props", () => {
    render(<SchedulePickupModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /schedule pickup/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();

    // Verifies first default window is selected by default
    const firstRadio = screen.getByLabelText("9:30–10:00 PM");
    expect(firstRadio).toBeChecked();
    expect(screen.getByText("Today, 9:30–10:00 PM")).toBeInTheDocument();
  });

  it("renders custom time windows and day label when provided", () => {
    render(
      <SchedulePickupModal
        isOpen={true}
        onClose={vi.fn()}
        dayLabel="Tomorrow"
        windows={customWindows}
      />
    );

    expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    expect(screen.getByLabelText("12:00–12:30 PM")).toBeInTheDocument();
    expect(screen.getByLabelText("12:30–1:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow, 12:00–12:30 PM")).toBeInTheDocument();
  });

  it("allows selecting a different time window", async () => {
    const user = userEvent.setup();
    render(<SchedulePickupModal isOpen={true} onClose={vi.fn()} />);

    const secondRadio = screen.getByLabelText("9:45–10:15 PM");
    await user.click(secondRadio);

    expect(secondRadio).toBeChecked();
    expect(screen.getByText("Today, 9:45–10:15 PM")).toBeInTheDocument();
  });

  it("calls onSchedule with the selected time window when Schedule button is clicked", async () => {
    const handleSchedule = vi.fn();
    const user = userEvent.setup();

    render(
      <SchedulePickupModal
        isOpen={true}
        onClose={vi.fn()}
        onSchedule={handleSchedule}
        windows={customWindows}
      />
    );

    // Select second radio option
    const secondRadio = screen.getByLabelText("12:30–1:00 PM");
    await user.click(secondRadio);

    // Click Schedule button
    const scheduleBtn = screen.getByRole("button", { name: /^schedule$/i });
    await user.click(scheduleBtn);

    expect(handleSchedule).toHaveBeenCalledTimes(1);
    expect(handleSchedule).toHaveBeenCalledWith("12:30–1:00 PM");
  });

  it("calls onClose when the '×' button, backdrop, or Cancel button is clicked", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <SchedulePickupModal isOpen={true} onClose={handleClose} />
    );

    // 1. Click top close '×' button
    const topCloseBtn = screen.getByRole("button", { name: "Close" });
    await user.click(topCloseBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // 2. Click Cancel button
    rerender(<SchedulePickupModal isOpen={true} onClose={handleClose} />);
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // 3. Click Backdrop overlay
    const backdrop = document.querySelector(".bg-black\\/30");
    await user.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });

  it("triggers onClose when the Escape key is pressed", () => {
    const handleClose = vi.fn();
    render(<SchedulePickupModal isOpen={true} onClose={handleClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});