"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/cycle";

type Props = {
  /** UTC ms when the cycle's snapshot fires. */
  targetMs: number;
};

/**
 * Ticks every 30 seconds. We render at minute precision so a half-minute
 * cadence is enough to avoid showing stale values for more than a beat.
 */
export function LiveCountdown({ targetMs }: Props) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    // Align the first re-render to the next 30s boundary so the displayed
    // minute doesn't lag by up to 30s from page load.
    const initialDelay = 30_000 - (Date.now() % 30_000);
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      setNow(Date.now());
      intervalId = setInterval(() => setNow(Date.now()), 30_000);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return <>{formatCountdown(targetMs - now)}</>;
}
