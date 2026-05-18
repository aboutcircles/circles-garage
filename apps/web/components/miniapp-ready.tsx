"use client";

import { useEffect } from "react";

/**
 * Signals to the Farcaster host that the mini-app has finished booting,
 * so it can dismiss the splash screen. Safe to mount on every route —
 * outside a mini-app context this is a no-op (the SDK detects the host).
 */
export function MiniappReady() {
  useEffect(() => {
    let cancelled = false;
    import("@farcaster/miniapp-sdk")
      .then(({ sdk }) => {
        if (cancelled) return;
        return sdk.actions.ready();
      })
      .catch(() => {
        // not in a mini-app frame, or SDK not installed yet — ignore.
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
