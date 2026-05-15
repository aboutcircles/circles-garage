// Cycle math.
//
// circles/garage is a 6-week program. Cycles run Friday→Friday, with
// snapshots + prizes + builder Q&A at the end of each Friday.
//
// Cycle 01 is the opener — it's a short cycle (Mon 18 May 2026 → Fri 22 May
// 2026 23:59 CET, ~5 days) because the program launches on Monday but we
// hand out the first prizes that same Friday. Cycles 02–06 are the regular
// 7-day Friday→Friday rhythm. Cycle 06 ends Fri 26 Jun 2026 = the grand
// finale.
//
// All anchors are stored as fixed UTC timestamps with the CEST offset
// baked in. We don't currently model the CET ↔ CEST DST switch within the
// 6-week window because the whole program sits inside CEST (last Sun of
// March → last Sun of October). If circles/garage runs again in winter,
// re-pin the constants below.

// All anchors below are 23:59:59 CEST = 21:59:59 UTC.
const CYCLE_01_END_MS = Date.UTC(2026, 4, 22, 21, 59, 59); // Fri 22 May 2026
const CYCLE_01_START_MS = Date.UTC(2026, 4, 17, 22, 0, 0); // Mon 18 May 00:00 CEST
const FINALE_END_MS = Date.UTC(2026, 5, 26, 21, 59, 59); // Fri 26 Jun 2026
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const TOTAL_CYCLES = 6;

export type CycleInfo = {
  cycle: number;
  totalCycles: number;
  /** UTC ms when the current cycle's snapshot fires (Friday 23:59 CET). */
  endsAtMs: number;
  /** UTC ms when the current cycle started. */
  startedAtMs: number;
  /** Padded label, e.g. "01". */
  cycleLabel: string;
  /** e.g. "01/06" — current cycle vs total. */
  cycleOfTotal: string;
  /** e.g. "FRI 22" — day of cycle end in Europe/Berlin. */
  endsAtLabel: string;
  /** UTC ms of the grand finale (cycle 06 end). */
  finaleAtMs: number;
  /** e.g. "FRI 26 JUN". */
  finaleLabel: string;
  /** True when current cycle is cycle 06. */
  isFinalCycle: boolean;
  /** True when the program has ended (now > finale). */
  isOver: boolean;
  /** Time remaining in ms to the current cycle's snapshot. */
  msUntilEnd: number;
  /** e.g. "3d 12h" — coarse human-readable countdown. */
  countdownLabel: string;
};

export function getCycleInfo(now: Date = new Date()): CycleInfo {
  const nowMs = now.getTime();

  let cycle: number;
  let endsAtMs: number;
  let startedAtMs: number;

  if (nowMs <= CYCLE_01_END_MS) {
    // Inside (or before) the short opener cycle.
    cycle = 1;
    endsAtMs = CYCLE_01_END_MS;
    startedAtMs = CYCLE_01_START_MS;
  } else {
    // Subsequent cycles are 7-day Fri→Fri. Cycle 02 ends one week after
    // cycle 01.
    const weeksSinceCycle1End = Math.floor(
      (nowMs - CYCLE_01_END_MS) / WEEK_MS,
    );
    const additionalCycles = weeksSinceCycle1End + 1; // +1 because we're already in cycle 02 the moment cycle 01 ends
    cycle = Math.min(1 + additionalCycles, TOTAL_CYCLES);
    endsAtMs = CYCLE_01_END_MS + additionalCycles * WEEK_MS;
    startedAtMs = endsAtMs - WEEK_MS + 1000;
  }

  // `>=` so the snapshot second itself flips the program to "over" and the
  // override below clamps us to cycle 06 (avoids a 1-second window where the
  // else branch above would compute cycle 07 ending Fri 3 Jul).
  const isOver = nowMs >= FINALE_END_MS;
  if (isOver) {
    cycle = TOTAL_CYCLES;
    endsAtMs = FINALE_END_MS;
    startedAtMs = FINALE_END_MS - WEEK_MS + 1000;
  }

  const msUntilEnd = Math.max(0, endsAtMs - nowMs);

  return {
    cycle,
    totalCycles: TOTAL_CYCLES,
    endsAtMs,
    startedAtMs,
    cycleLabel: String(cycle).padStart(2, "0"),
    cycleOfTotal: `${String(cycle).padStart(2, "0")}/${String(TOTAL_CYCLES).padStart(2, "0")}`,
    endsAtLabel: formatBerlinDate(endsAtMs),
    finaleAtMs: FINALE_END_MS,
    finaleLabel: formatBerlinDateLong(FINALE_END_MS),
    isFinalCycle: cycle === TOTAL_CYCLES,
    isOver,
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

function formatBerlinDateLong(ms: number): string {
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
  const month = d
    .toLocaleDateString("en-US", {
      month: "short",
      timeZone: "Europe/Berlin",
    })
    .toUpperCase();
  return `${weekday} ${day} ${month}`;
}
