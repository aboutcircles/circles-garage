"use client";

import { useEffect, useState } from "react";

const VIMEO_SRC =
  "https://player.vimeo.com/video/1193323348?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1";

type Props = {
  thumbnailUrl: string | null;
};

export function IntroVideoModal({ thumbnailUrl }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="play welcome video"
        className="group relative block aspect-video w-full cursor-pointer overflow-hidden bg-ink text-left"
      >
        {thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-95"
          />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center border border-paper bg-ink/70 font-mono text-lg leading-none text-paper backdrop-blur-[2px] transition-colors group-hover:border-ember group-hover:bg-ember">
            ▶
          </span>
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-baseline gap-1.5 bg-gradient-to-t from-ink/90 via-ink/60 to-transparent px-3 pb-2 pt-7 font-mono text-[11px] text-paper">
          <span className="font-bold">welcome to circles</span>
          <span className="opacity-70">· hackathon · prizes</span>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="welcome to circles"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-7 right-0 cursor-pointer font-mono text-[11px] uppercase tracking-[0.08em] text-paper hover:text-ember"
            >
              [ esc · close ]
            </button>
            <div className="aspect-video w-full border border-paper bg-ink">
              <iframe
                src={VIMEO_SRC}
                title="welcome to circles"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
