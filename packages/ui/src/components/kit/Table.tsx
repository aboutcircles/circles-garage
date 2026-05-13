import type { CSSProperties, ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";

export type TableCell =
  | ReactNode
  | {
      v: ReactNode;
      muted?: boolean;
      bold?: boolean;
      size?: number;
    };

export type TableRow = {
  _muted?: boolean;
  cells: TableCell[];
};

export type TableColumnSize = {
  w?: number | string;
  right?: boolean;
};

type TableProps = {
  head: ReactNode[];
  rows: TableRow[];
  sizes?: TableColumnSize[];
};

function isCellObject(
  cell: TableCell,
): cell is { v: ReactNode; muted?: boolean; bold?: boolean; size?: number } {
  return (
    typeof cell === "object" &&
    cell !== null &&
    !Array.isArray(cell) &&
    "v" in (cell as Record<string, unknown>)
  );
}

/**
 * Generic monospace table. Uppercase faint header underlined by the ink hair,
 * dotted row separators. Per-cell objects let rows override colour / weight /
 * size — useful for the leaderboard's "muted" rows and the rank column.
 */
export function Table({ head, rows, sizes }: TableProps) {
  return (
    <table className="w-full border-collapse font-mono text-xs">
      <thead>
        <tr className="text-[9px] uppercase tracking-[0.18em] text-faint">
          {head.map((h, i) => {
            const size = sizes?.[i];
            const colStyle: CSSProperties = {};
            if (size?.w !== undefined) colStyle.width = size.w;
            return (
              <th
                key={i}
                className={cn(
                  "border-b border-ink py-1.5 pr-2 font-normal",
                  size?.right ? "text-right" : "text-left",
                )}
                style={colStyle}
              >
                {h}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr
            key={ri}
            className={cn(
              "border-b border-dotted border-hair",
              row._muted && "opacity-50",
            )}
          >
            {row.cells.map((cell, ci) => {
              const size = sizes?.[ci];
              const isObj = isCellObject(cell);
              const value = isObj ? cell.v : cell;
              const cellStyle: CSSProperties = {};
              if (isObj && cell.size) cellStyle.fontSize = cell.size;
              return (
                <td
                  key={ci}
                  className={cn(
                    "py-2.5 pr-2",
                    size?.right ? "text-right" : "text-left",
                    isObj && cell.muted ? "text-faint" : "text-ink",
                    isObj && cell.bold ? "font-bold" : "font-normal",
                  )}
                  style={cellStyle}
                >
                  {value}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
