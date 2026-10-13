import { useEffect, useState } from "react";

/*
  Usage (in the checkout page):

    const [open, setOpen] = useState(false);

    <SchedulePickupModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onSchedule={(window) => console.log("schedule", window)}  // replace when ready
      windows={["9:30–10:00 PM", "9:45–10:15 PM", "10:00–10:30 PM"]}
    />
*/

const DEFAULT_WINDOWS = [
  "9:30–10:00 PM",
  "9:45–10:15 PM",
  "10:00–10:30 PM",
  "10:15–10:45 PM",
];

/* ---------- Days container: day chip + subtitle ---------- */
function DaysContainer({ dayLabel, subtitle }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="inline-block rounded-lg border-[3px] border-neutral-900 bg-neutral-100 px-5 py-2 font-bold">
          {dayLabel}
        </span>
      </div>
      <p className="text-sm text-neutral-500">{subtitle}</p>
    </div>
  );
}

/* ---------- One line in the list ---------- */
function TimeWindowRow({ timeWindow, checked, onSelect }) {
  return (
    <label className="flex cursor-pointer items-center justify-between border-b border-neutral-300 py-4 last:border-b-0">
      <span>{timeWindow}</span>
      <input
        type="radio"
        name="pickup-window"
        value={timeWindow}
        checked={checked}
        onChange={() => onSelect(timeWindow)}
        className="h-5 w-5 cursor-pointer accent-blue-600"
      />
    </label>
  );
}

/* ---------- Main container ---------- */
export default function SchedulePickupModal({
  isOpen,
  onClose,
  onSchedule,
  windows = DEFAULT_WINDOWS,
  dayLabel = "Today",
}) {
  const [selected, setSelected] = useState(windows[0] ?? null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sheet */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-title"
        className={`absolute inset-x-0 bottom-0 top-[90px] mx-auto flex max-w-md flex-col rounded-t-2xl border-2 border-neutral-900 bg-white transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-11 w-11 rounded-full border-2 border-neutral-900 text-xl"
          >
            ×
          </button>

          <h2 id="schedule-title" className="text-2xl font-bold">
            Schedule pickup
          </h2>

          <DaysContainer
            dayLabel={dayLabel}
            subtitle="30-minute windows · today only"
          />

          <div role="radiogroup" aria-label="Pickup windows">
            {windows.map((w) => (
              <TimeWindowRow
                key={w}
                timeWindow={w}
                checked={w === selected}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>

        {/* Footer: summary + buttons */}
        <footer className="flex flex-col gap-3 border-t-2 border-neutral-900 p-4">
          <p className="text-center text-sm text-neutral-500">
            {selected ? `${dayLabel}, ${selected}` : "Select a time"}
          </p>
          <button
            type="button"
            disabled={!selected}
            onClick={() => onSchedule?.(selected)} // parent decides what happens next
            className="h-12 w-full cursor-pointer rounded-lg border-2 border-neutral-900 bg-neutral-900 font-bold text-white disabled:opacity-40"
          >
            Schedule
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-12 w-full cursor-pointer rounded-lg border-2 border-neutral-900 bg-white font-bold text-neutral-900"
          >
            Cancel
          </button>
        </footer>
      </section>
    </div>
  );
}
