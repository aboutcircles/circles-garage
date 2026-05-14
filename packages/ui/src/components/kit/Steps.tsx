type StepsProps = {
  all: readonly string[];
  current: number;
};

/**
 * Horizontal row of step badges. Completed = filled (bg-ink); current =
 * outlined bold; future = outlined faint. Used by guided forms.
 */
export function Steps({ all, current }: StepsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
      {all.map((s, i) => {
        const completed = i < current;
        const isCurrent = i === current;
        const className = completed
          ? "bg-ink text-paper font-bold"
          : isCurrent
            ? "border border-hair text-ink font-bold"
            : "border border-hair text-faint";

        return (
          <span
            key={s}
            className={`px-2.5 py-1 uppercase tracking-[0.12em] ${className}`}
          >
            {String(i + 1).padStart(2, "0")} · {s}
          </span>
        );
      })}
    </div>
  );
}
