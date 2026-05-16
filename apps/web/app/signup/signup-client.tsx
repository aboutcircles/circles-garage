"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Btn, Field, Hero, Input, Section, Steps } from "@workspace/ui/kit";
import { cn } from "@workspace/ui/lib/utils";
import { createBuilder } from "./actions";
import { HotkeyEnter } from "@/components/hotkey-enter";
import type { SignupForm } from "@/lib/content";

type FormState = {
  handle: string;
  reach: string;
  circles_addr: string;
  org_addr: string;
  team: string;
};

const STEP_REQUIRED: readonly (readonly (keyof FormState)[])[] = [
  ["handle", "reach", "circles_addr"],
  [],
];

const DISABLED_CLS = "disabled:opacity-40 disabled:cursor-not-allowed";

const ADDR_RE = /^0x[a-fA-F0-9]{40}$/;
const ADDR_EXTRACT_RE = /0x[a-fA-F0-9]{40}/;
const ADDR_FIELDS: ReadonlySet<keyof FormState> = new Set([
  "circles_addr",
  "org_addr",
]);

/** Extract a 0x40-hex address from any pasted string (e.g. a profile URL). */
function normalizeAddr(name: keyof FormState, value: string): string {
  if (!ADDR_FIELDS.has(name)) return value;
  const match = value.match(ADDR_EXTRACT_RE);
  return match ? match[0] : value;
}

function validateAddr(name: keyof FormState, value: string): string | null {
  if (!ADDR_FIELDS.has(name)) return null;
  const v = value.trim();
  if (v === "") return null; // empty handled by required-check, not the format check
  return ADDR_RE.test(v) ? null : "must be a 0x address (40 hex chars)";
}

function composeHint(
  hint: ReactNode | undefined,
  createLink: { href: string; label: string } | undefined,
  error: string | null,
): ReactNode | undefined {
  if (!hint && !createLink && !error) return undefined;
  return (
    <>
      {hint}
      {createLink && (
        <>
          {hint && <br />}
          <a
            href={createLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-ink text-ink hover:bg-ghost"
          >
            {createLink.label} →
          </a>
        </>
      )}
      {error && (
        <>
          {(hint || createLink) && <br />}
          <span className="text-ink">! {error}</span>
        </>
      )}
    </>
  );
}

export function SignupClient({
  form,
  githubLogin = "",
}: {
  form: SignupForm;
  githubLogin?: string;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>({
    handle: githubLogin,
    reach: "",
    circles_addr: "",
    org_addr: "",
    team: "",
  });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">(
    "idle",
  );
  const [err, setErr] = useState<string | null>(null);
  const successCtaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (status === "ok") successCtaRef.current?.focus();
  }, [status]);

  const set = (n: keyof FormState) => (v: string) =>
    setData((d) => ({ ...d, [n]: normalizeAddr(n, v) }));

  const required = STEP_REQUIRED[step] ?? [];
  const requiredOk = required.every((n) => data[n].trim() !== "");

  // Format errors on current section's fields (skip review step).
  const currentSection = form.sections[step];
  const formatErrors: Partial<Record<keyof FormState, string>> = {};
  if (currentSection) {
    for (const f of currentSection.fields) {
      const name = f.name as keyof FormState;
      const err = validateAddr(name, data[name] ?? "");
      if (err) formatErrors[name] = err;
    }
  }
  const hasFormatErrors = Object.keys(formatErrors).length > 0;
  const canAdvance = requiredOk && !hasFormatErrors;

  const isReview = step === form.steps.length - 1;

  const next = () => {
    if (canAdvance && step < form.steps.length - 1) setStep(step + 1);
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    setStatus("submitting");
    setErr(null);
    const result = await createBuilder({
      handle: data.handle.trim(),
      reach: data.reach.trim(),
      circles_addr: data.circles_addr.trim(),
      org_addr: data.org_addr.trim() || null,
      team: data.team
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    if (!result.ok) {
      setErr(result.message);
      setStatus("err");
      return;
    }
    setStatus("ok");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (status === "ok") {
    return (
      <>
        <Hero
          size="lg"
          sub={`handle: ${data.handle} · we'll reach you via ${data.reach}.`}
        >
          you&apos;re in.
        </Hero>
        <div className="mt-7 border-t border-hair pt-4 font-mono text-xs leading-[1.6] text-faint">
          {"// "}builders/{data.handle} — accepted into cycle queue.
          <br />
          {"// "}next step: submit your mini-app.
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            ref={successCtaRef}
            href="/register"
            className="inline-flex cursor-pointer items-center gap-2 border border-ink bg-ink px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.04em] text-paper focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-paper"
          >
            submit a mini-app →
          </Link>
          <Link
            href="/"
            className="font-mono text-xs text-faint underline underline-offset-[3px] hover:text-ink"
          >
            ← back to landing
          </Link>
        </div>
        <div className="mt-3 font-mono text-[11px] text-faint">
          ↳ press <kbd className="border border-hair px-1">enter</kbd> to
          continue
        </div>
        <HotkeyEnter href="/register" />
      </>
    );
  }

  const section = form.sections[step];
  const submitDisabled = !consent || status === "submitting";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <Hero
          size="lg"
          sub="We need a way to reach you and a Circles address to pay you. That's it — apps go on /register."
        >
          tell us about you.
        </Hero>
        <Steps all={form.steps} current={step} />
      </div>

      <div className="mt-4 flex items-center gap-2.5 border-b border-hair pb-3">
        <Btn
          sm
          onClick={back}
          disabled={step === 0 || status === "submitting"}
          className={DISABLED_CLS}
        >
          ← back
        </Btn>
        <span className="ml-auto font-mono text-[11px] text-faint">
          step {step + 1}/{form.steps.length}
          {isReview ? "" : ` · next → ${form.steps[step + 1]}`}
        </span>
        {!isReview && (
          <Btn
            sm
            primary
            onClick={next}
            disabled={!canAdvance}
            className={DISABLED_CLS}
          >
            next →
          </Btn>
        )}
      </div>

      {!isReview && section && (
        <Section num={section.num} label={section.label} hint={section.hint}>
          {section.fields.map((f) => {
            const fname = f.name as keyof FormState;
            const fieldError = formatErrors[fname] ?? null;
            const hint = composeHint(f.hint, f.createLink, fieldError);

            return (
              <Input
                key={f.name}
                name={f.name}
                label={f.label}
                value={data[fname]}
                onChange={set(fname)}
                placeholder={f.placeholder}
                required={f.required}
                hint={hint}
                readOnly={f.locked}
                aria-readonly={f.locked || undefined}
                tabIndex={f.locked ? -1 : undefined}
                className={
                  f.locked ? "cursor-not-allowed bg-ghost" : undefined
                }
              />
            );
          })}
        </Section>
      )}

      {isReview && (
        <>
          <div className="mt-7 border-2 border-ink p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  last step
                </div>
                <div className="font-mono text-[18px] font-bold leading-tight tracking-[-0.3px]">
                  review &amp; submit
                </div>
                <div className="mt-2 font-mono text-[11px] leading-[1.55] text-faint">
                  ↳ Check details below. Click submit to write a row to{" "}
                  <code className="bg-ghost px-1">builders</code>.
                </div>
              </div>
              <Btn
                primary
                onClick={submit}
                disabled={submitDisabled}
                className={DISABLED_CLS}
              >
                {status === "submitting" ? "writing..." : form.submit}
              </Btn>
            </div>
            {err && (
              <div className="mt-3 border-t border-hair pt-3 font-mono text-[11px] text-ink">
                ! {err}
              </div>
            )}
          </div>

          {form.sections.map((sec) => {
            const visible = sec.fields.filter((f) => {
              const v = data[f.name as keyof FormState] ?? "";
              // Always show required fields (even if empty, so the user sees gaps).
              if (f.required) return true;
              // Hide optional fields the user left empty.
              return v.trim() !== "";
            });
            if (visible.length === 0) return null;
            return (
              <Section
                key={sec.num}
                num={sec.num}
                label={sec.label}
                hint={sec.hint}
              >
                {visible.map((f) => {
                  const v = data[f.name as keyof FormState];
                  return (
                    <Field
                      key={f.name}
                      label={f.label}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={v || undefined}
                      hint={f.hint}
                    />
                  );
                })}
              </Section>
            );
          })}

          <label className="mt-7 flex cursor-pointer items-start gap-2.5 border-t border-hair pt-[18px] font-mono text-xs leading-[1.55] text-ink">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "relative mt-0.5 inline-block h-3.5 w-3.5 shrink-0 border-[1.5px] border-ink",
                consent ? "bg-ink" : "bg-transparent",
              )}
            >
              {consent && (
                <span className="absolute top-[-4px] left-px text-[13px] font-bold text-paper">
                  ✓
                </span>
              )}
            </span>
            <span className="flex-1">
              I read the{" "}
              <a
                href={form.consentHref}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-ink text-ink hover:bg-ghost"
              >
                rules
              </a>
              . The weekly snapshot is final. My handle &amp; app can show on
              the public leaderboard.
            </span>
          </label>
        </>
      )}

      {err && !isReview && (
        <div className="mt-4 font-mono text-[11px] text-ink">! {err}</div>
      )}

      <div className="mt-4 flex items-center gap-2.5">
        <Btn
          onClick={back}
          disabled={step === 0 || status === "submitting"}
          className={DISABLED_CLS}
        >
          ← back
        </Btn>
        <span className="ml-auto font-mono text-[11px] text-faint">
          step {step + 1}/{form.steps.length}
          {isReview ? "" : ` · next → ${form.steps[step + 1]}`}
        </span>
        {!isReview ? (
          <Btn
            primary
            onClick={next}
            disabled={!canAdvance}
            className={DISABLED_CLS}
          >
            next →
          </Btn>
        ) : (
          <Btn
            primary
            onClick={submit}
            disabled={submitDisabled}
            className={DISABLED_CLS}
          >
            {status === "submitting" ? "writing..." : form.submit}
          </Btn>
        )}
      </div>
    </>
  );
}
