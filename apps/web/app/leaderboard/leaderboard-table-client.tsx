"use client";

import { useState } from "react";
import type { LeaderboardRow } from "@/lib/content";
import { Table } from "@workspace/ui/kit";

type View = "week" | "all";

/**
 * The main leaderboard table with a "this cycle / all time" toggle. The
 * surrounding pane, podium and side panels stay server-rendered — only this
 * filterable table needs client state.
 */
export function LeaderboardTable({
  weekRows,
  allTimeRows,
  weekLabel,
}: {
  weekRows: readonly LeaderboardRow[];
  allTimeRows: readonly LeaderboardRow[];
  /** e.g. "cycle 02" — label for the current-cycle tab. */
  weekLabel: string;
}) {
  const [view, setView] = useState<View>("week");
  const rows = view === "week" ? weekRows : allTimeRows;

  const tab = (v: View, label: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      className={
        view === v
          ? "-mb-[11px] cursor-pointer border-b-2 border-ink pb-2.5 font-bold text-ink"
          : "cursor-pointer pb-2.5 transition-colors hover:text-ink"
      }
    >
      {label}
    </button>
  );

  return (
    <>
      {/* filter strip */}
      <div className="mb-3 flex gap-[22px] border-b border-ink pb-2.5 font-mono text-[11px] text-faint">
        {tab("week", weekLabel)}
        {tab("all", "all time")}
      </div>

      <div className="overflow-x-auto">
        <Table
          head={["#", "project", "score"]}
          sizes={[{ w: 30 }, {}, { right: true, w: 80 }]}
          rows={rows.map((r) => ({
            cells: [
              { v: String(r.rank).padStart(2, "0"), muted: true },
              {
                v: (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-ink text-ink hover:bg-ghost"
                  >
                    {r.project}
                  </a>
                ),
                bold: true,
              },
              { v: r.score, bold: true },
            ],
          }))}
        />
      </div>

      <div className="mt-3.5 flex justify-between font-mono text-[11px] text-faint">
        <span>
          ↳ {rows.length} projects
          {view === "all" ? " · cumulative across all cycles" : ""}
        </span>
      </div>
    </>
  );
}
