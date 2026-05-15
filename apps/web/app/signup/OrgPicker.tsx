"use client";

import { useEffect, useState } from "react";
import type { Sdk } from "@aboutcircles/sdk";
import { cn } from "@workspace/ui/lib/utils";
import type { SignupOrgCopy } from "@/lib/content";
import { listGroups, type GroupOption } from "@/lib/circles";

type Props = {
  sdk: Sdk;
  address: `0x${string}`;
  copy: SignupOrgCopy;
  value: `0x${string}` | null;
  onChange: (next: `0x${string}` | null) => void;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; groups: readonly GroupOption[] }
  | { kind: "error" };

const SKIP_VALUE = "__skip__";

export function OrgPicker({ sdk, address, copy, value, onChange }: Props) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    listGroups(sdk, address)
      .then((groups) => {
        if (!cancelled) setState({ kind: "ready", groups });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [sdk, address]);

  if (state.kind === "loading") {
    return (
      <div className="border-b border-dotted border-hair py-2.5">
        <div className="flex items-baseline gap-3 font-mono text-[13px]">
          <span className="w-[220px] shrink-0 text-faint">{copy.label}:</span>
          <span className="font-mono text-[13px] italic text-faint">
            loading groups…
          </span>
        </div>
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <div className="border-b border-dotted border-hair py-2.5">
        <div className="flex items-baseline gap-3 font-mono text-[13px]">
          <span className="w-[220px] shrink-0 text-faint">{copy.label}:</span>
          <span className="font-mono text-[13px] italic text-faint">
            unavailable
          </span>
        </div>
        <div className="mt-1 font-mono text-[11px] text-faint">
          ! couldn&apos;t load groups — paste manually below if needed.
        </div>
      </div>
    );
  }

  const selectValue = value ?? SKIP_VALUE;

  const handleChange = (next: string) => {
    if (next === SKIP_VALUE) {
      onChange(null);
      return;
    }
    if (next.startsWith("0x")) {
      onChange(next as `0x${string}`);
      return;
    }
    onChange(null);
  };

  return (
    <div className="border-b border-dotted border-hair py-2.5">
      <div className="flex items-baseline gap-3 font-mono text-[13px]">
        <label
          htmlFor="org_addr"
          className="w-[220px] shrink-0 text-faint"
        >
          {copy.label}:
        </label>
        <div className="relative flex flex-1 items-baseline">
          <select
            id="org_addr"
            name="org_addr"
            value={selectValue}
            onChange={(e) => handleChange(e.target.value)}
            className={cn(
              "w-full appearance-none border-0 bg-transparent pr-5 font-mono text-[13px] text-ink outline-none",
              selectValue === SKIP_VALUE && "italic text-faint",
            )}
          >
            <option value={SKIP_VALUE} className="not-italic text-ink">
              {copy.skipLabel}
            </option>
            {state.groups.map((g) => (
              <option
                key={g.address}
                value={g.address}
                className="not-italic text-ink"
              >
                {g.name ?? g.address}
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 text-faint"
          >
            ▾
          </span>
        </div>
      </div>
      <div className="mt-0.5 ml-[232px] font-mono text-[11px] text-faint">
        ↳ {copy.hint}
      </div>
    </div>
  );
}
