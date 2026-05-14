// Cycle math.
//
// Each cycle is 7 days. Cycle N ends Sunday 23:59:59 CET, with the snapshot
// taken at that moment; prizes are paid the following Monday morning.
//
// The anchor below pins "cycle 01" to the week ending Sunday 17 May 2026
// 23:59:59 CET. To re-launch under a different cycle 01, change CYCLE_01_END.
//
// Timezone handling: we anchor against a fixed UTC timestamp and use 7-day
// real-time increments, so "Sunday 23:59 CET" drifts by one hour across the
// CET ↔ CEST DST transitions (last Sunday of March / October). For
// week-scale accuracy this is fine; if it matters later, swap to a tz-aware
// library.

// Sunday 17 May 2026 23:59:59 CEST = 21:59:59 UTC.
const CYCLE_01_END_MS = Date.UTC(2026, 4, 17, 21, 59, 59);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type CycleInfo = {
  cycle: number;
  /** UTC ms when the current cycle's snapshot fires. */
  endsAtMs: number;
  /** UTC ms when the current cycle started (Monday 00:00 CET). */
  startedAtMs: number;
  /** Padded label, e.g. "01". */
  cycleLabel: string;
  /** e.g. "SUN 17" — day of cycle end in Europe/Berlin. */
  endsAtLabel: string;
  /** Time remaining in ms. */
  msUntilEnd: number;
  /** e.g. "3d 12h" — coarse human-readable. */
  countdownLabel: string;
};

export function getCycleInfo(now: Date = new Date()): CycleInfo {
  const nowMs = now.getTime();
  // Cycle index: how many full cycles have ended before "now".
  // Cycle 01 ends at CYCLE_01_END_MS. If now ≤ that, we're in cycle 01.
  const cyclesElapsed =
    nowMs <= CYCLE_01_END_MS
      ? 0
      : Math.floor((nowMs - CYCLE_01_END_MS) / WEEK_MS) + 1;
  const cycle = cyclesElapsed + 1;
  const endsAtMs = CYCLE_01_END_MS + cyclesElapsed * WEEK_MS;
  // Started at the Monday 00:00 CET of the same week — 6d 23h 59m 59s before
  // the snapshot.
  const startedAtMs = endsAtMs - (WEEK_MS - 1000);
  const msUntilEnd = Math.max(0, endsAtMs - nowMs);

  return {
    cycle,
    endsAtMs,
    startedAtMs,
    cycleLabel: String(cycle).padStart(2, "0"),
    endsAtLabel: formatBerlinDate(endsAtMs),
    msUntilEnd,
    countdownLabel: formatCountdown(msUntilEnd),
  };
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "snapshotting…";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${String(hours).padStart(2, "0")}h`;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  return `${minutes}m`;
}

function formatBerlinDate(ms: number): string {
  const d = new Date(ms);
  const weekday = d
    .toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Europe/Berlin",
    })
    .toUpperCase();
  const day = d.toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: "Europe/Berlin",
  });
  return `${weekday} ${day}`;
}
