// Leaderboard derivation.
//
// `content.cycles` holds one ranked snapshot per cycle. This module derives
// the two views the UI renders:
//   • the latest cycle (the "this week" / home leaderboard), and
//   • the cumulative "all time" board — each project's scores summed across
//     every cycle it placed in, then re-ranked.
//
// Projects are matched across cycles by a normalised URL key (protocol,
// `www.`, query, hash and trailing slash stripped), so e.g. cycle 01's
// `https://app.circles-chat.org` and cycle 02's `https://app.circles-chat.org/?p1a`
// are recognised as the same project and their scores add up.

import { content } from "./content";
import type { CycleResult, LeaderboardRow } from "./content";

/** Stable identity for a project across cycles, derived from its URL. */
export function projectKey(url: string): string {
  let u = url.trim().toLowerCase();
  u = u.replace(/^https?:\/\//, "");
  u = u.replace(/^www\./, "");
  u = u.split(/[?#]/)[0] ?? u; // drop query + hash
  u = u.replace(/\/+$/, ""); // drop trailing slash(es)
  return u;
}

/** The cycle with the highest number that has results, or undefined. */
export function getLatestCycle(): CycleResult | undefined {
  return content.cycles.reduce<CycleResult | undefined>(
    (latest, c) => (!latest || c.cycle > latest.cycle ? c : latest),
    undefined,
  );
}

/** Rows for the most recent cycle, already ranked. */
export function getLatestCycleRows(): readonly LeaderboardRow[] {
  return getLatestCycle()?.rows ?? [];
}

/**
 * Cumulative leaderboard: every project's score summed across all cycles,
 * sorted by total descending and re-ranked. A project's display name + URL
 * track its most recent appearance. Ties keep first-seen order (cycle 01
 * projects first, then later newcomers).
 */
export function getAllTimeRows(): LeaderboardRow[] {
  type Acc = { project: string; url: string; score: number; lastCycle: number };
  const byKey = new Map<string, Acc>();

  for (const c of content.cycles) {
    for (const r of c.rows) {
      const key = projectKey(r.url);
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, {
          project: r.project,
          url: r.url,
          score: r.score,
          lastCycle: c.cycle,
        });
        continue;
      }
      existing.score += r.score;
      // Latest cycle wins the display identity.
      if (c.cycle >= existing.lastCycle) {
        existing.project = r.project;
        existing.url = r.url;
        existing.lastCycle = c.cycle;
      }
    }
  }

  return Array.from(byKey.values())
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({
      rank: i + 1,
      project: p.project,
      url: p.url,
      score: p.score,
    }));
}
