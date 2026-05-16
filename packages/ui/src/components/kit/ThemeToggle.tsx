"use client";

import { useEffect, useState } from "react";

type ThemeChoice = "system" | "light" | "dark";

const STORAGE_KEY = "theme";

function readStored(): ThemeChoice {
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

const GLYPH = { system: "◐", light: "☀", dark: "☾" } as const;

/**
 * Footer-sized three-state toggle: system → light → dark → system.
 *
 * The pre-paint script in <body> applies any stored override to <html>
 * before the first paint; this button only owns the label + the cycle.
 *
 * Why the placeholder: reading localStorage during render would make the
 * server-rendered "system" label disagree with the client's first render
 * for any returning user who chose light/dark. The mismatch is hidable
 * with suppressHydrationWarning but the bug isn't cosmetic — until the
 * label catches up, a click cycles from the *stored* value while showing
 * the *server* value, which surprises the user. Solution: render a
 * width-stable, aria-hidden placeholder until mount, then swap in the
 * real button with the correct state.
 */
export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice | null>(null);

  // Intentional post-mount read: localStorage is client-only, so the initial
  // state must be null during SSR + hydration to avoid a mismatched label.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(readStored());
  }, []);

  if (choice === null) {
    // Same characters and width as the live button so the footer doesn't
    // reflow when it appears. Hidden from AT until the real control mounts.
    return (
      <span
        aria-hidden
        className="invisible font-mono text-[11px] text-faint"
      >
        ◐ theme: system
      </span>
    );
  }

  const cycle = () => {
    const next: ThemeChoice =
      choice === "system" ? "light" : choice === "light" ? "dark" : "system";
    setChoice(next);
    apply(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${choice}. Click to cycle.`}
      className="cursor-pointer font-mono text-[11px] text-faint hover:text-ink"
    >
      {`${GLYPH[choice]} theme: ${choice}`}
    </button>
  );
}
