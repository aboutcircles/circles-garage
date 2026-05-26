"use client";

import { useState, type ReactElement } from "react";

type AgentId = "claude" | "codex";

type Agent = {
  id: AgentId;
  label: string;
  binary: string;
  Logo: () => ReactElement;
};

function AnthropicMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M5 20 L9.6 4 H11.6 L16.2 20 H13.7 L12.7 16.4 H8.5 L7.5 20 Z M9.1 14.4 H12.1 L10.6 8.7 Z" />
      <path d="M17 4 H18.6 L20 20 H18.4 Z" />
    </svg>
  );
}

function OpenAIMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <ellipse cx="12" cy="12" rx="9" ry="3.4" />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3.4"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="3.4"
        transform="rotate(120 12 12)"
      />
    </svg>
  );
}

const AGENTS: readonly Agent[] = [
  { id: "claude", label: "Claude Code", binary: "claude", Logo: AnthropicMark },
  { id: "codex", label: "Codex CLI", binary: "codex", Logo: OpenAIMark },
];

type Props = {
  prompt: string;
  blurb: string;
};

export function AgentPaste({ prompt, blurb }: Props) {
  const [activeId, setActiveId] = useState<AgentId>("claude");
  const [copied, setCopied] = useState(false);

  const agent = AGENTS.find((a) => a.id === activeId) ?? AGENTS[0]!;
  const command = `${agent.binary} "${prompt}"`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be unavailable in non-secure contexts; ignore
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="agent CLI"
        className="flex border-b border-hair"
      >
        {AGENTS.map((a) => {
          const isActive = a.id === activeId;
          return (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(a.id)}
              className={
                "flex cursor-pointer items-center gap-2 border-r border-hair px-3 py-2 font-mono text-xs " +
                (isActive
                  ? "bg-paper font-bold text-ink"
                  : "text-faint hover:bg-ghost hover:text-ink")
              }
            >
              <a.Logo />
              <span>{a.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-stretch border-b border-hair">
        <pre className="flex-1 overflow-x-auto whitespace-pre px-3 py-2.5 font-mono text-[13px] leading-[1.5] text-ink">
          <span className="text-faint">$ </span>
          {command}
        </pre>
        <button
          type="button"
          onClick={onCopy}
          aria-label="copy command"
          className="shrink-0 cursor-pointer border-l border-hair bg-ghost px-3 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink hover:bg-paper"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>

      <p className="px-3 py-2.5 font-mono text-[11px] leading-[1.55] text-faint">
        {blurb}
      </p>
    </div>
  );
}
