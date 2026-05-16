"use client";

import { useState } from "react";

type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

function readStored(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    // localStorage may be unavailable (private mode, denied permissions) —
    // fall through to "system".
  }
  return "system";
}

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") {
    root.removeAttribute("data-theme");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // see readStored — localStorage may be unavailable.
    }
  } else {
    root.setAttribute("data-theme", choice);
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // see readStored — localStorage may be unavailable.
    }
  }
}

/**
 * Footer-sized three-state toggle: system → light → dark → system.
 *
 * The pre-paint script in <body> applies any stored override to <html>
 * before the first paint; this button only owns the label + the cycle.
 * Initial render on the server is "system" — `suppressHydrationWarning`
 * lets the client swap in the real label without React complaining.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(readStored);

  const cycle = () => {
    const next: ThemeChoice =
      choice === "system" ? "light" : choice === "light" ? "dark" : "system";
    setChoice(next);
    apply(next);
  };

  const glyph = choice === "light" ? "☀" : choice === "dark" ? "☾" : "◐";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${choice}. Click to cycle.`}
      className="cursor-pointer font-mono text-[11px] text-faint hover:text-ink"
      suppressHydrationWarning
    >
      {`${glyph} theme: ${choice}`}
    </button>
  );
}
