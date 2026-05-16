"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const INTERACTIVE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]);

/**
 * Wires up a global "press enter to continue" hotkey that navigates to `href`.
 * Renders nothing. Ignores Enter when the user is typing in a field or when
 * focus is already on a link/button (so native activation still wins).
 */
export function HotkeyEnter({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (INTERACTIVE_TAGS.has(t.tagName) || t.isContentEditable)) return;
      e.preventDefault();
      router.push(href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, href]);
  return null;
}
