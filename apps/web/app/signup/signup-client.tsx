"use client";

import { useState } from "react";
import {
  Btn,
  Field,
  Hero,
  Input,
  Section,
  Select,
  Steps,
  Textarea,
} from "@workspace/ui/kit";
import { createBuilder } from "./actions";
import type { SignupForm } from "@/lib/content";

type FormState = {
  handle: string;
  reach: string;
  circles_addr: string;
  org_addr: string;
  team: string;
  app_name: string;
  track: string;
  pitch: string;
};

const STEP_REQUIRED: readonly (readonly (keyof FormState)[])[] = [
  ["handle", "reach", "circles_addr"],
  ["org_addr"],
  ["app_name"],
  [],
];

const TRACK_OPTIONS = [
  { value: "payments", label: "payments" },
  { value: "social", label: "social" },
  { value: "games", label: "games" },
  { value: "tools", label: "tools" },
  { value: "other", label: "other" },
] as const;

const DISABLED_CLS = "disabled:opacity-40 disabled:cursor-not-allowed";

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
    app_name: "",
    track: "",
    pitch: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">(
    "idle",
  );
  const [err, setErr] = useState<string | null>(null);

  const set = (n: keyof FormState) => (v: string) =>
    setData((d) => ({ ...d, [n]: v }));

  const required = STEP_REQUIRED[step] ?? [];
  const canAdvance = required.every((n) => data[n].trim() !== "");
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
      org_addr: data.org_addr.trim(),
      team: data.team
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      app_name: data.app_name.trim(),
      track: data.track || null,
      pitch: data.pitch.trim() || null,
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
          {"// "}next step: submit a mini-app under{" "}
          {data.org_addr || "your org"}.
        </div>
        <div className="mt-7 flex items-center gap-2.5">
          <Btn primary href="/register">
            submit a mini-app →
          </Btn>
          <Btn href="/">← back to landing</Btn>
        </div>
      </>
    );
  }

  const section = form.sections[step];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <Hero
          size="lg"
          sub="Three minutes. We need to know where to send prize money and where to look up your numbers."
        >
          who&apos;s shipping?
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
            if (f.name === "track") {
              return (
                <Select
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  value={data.track}
                  onChange={set("track")}
                  options={TRACK_OPTIONS}
                  placeholder={f.placeholder}
                  required={f.required}
                  hint={f.hint}
                />
              );
            }
            if (f.name === "pitch") {
              return (
                <Textarea
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  value={data.pitch}
                  onChange={set("pitch")}
                  placeholder={f.placeholder}
                  required={f.required}
                  hint={f.hint}
                  rows={2}
                />
              );
            }
            const fname = f.name as keyof FormState;
            return (
              <Input
                key={f.name}
                name={f.name}
                label={f.label}
                value={data[fname]}
                onChange={set(fname)}
                placeholder={f.placeholder}
                required={f.required}
                hint={f.hint}
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
                disabled={status === "submitting"}
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

          {form.sections.map((sec) => (
            <Section
              key={sec.num}
              num={sec.num}
              label={sec.label}
              hint={sec.hint}
            >
              {sec.fields.map((f) => {
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
          ))}
          <div className="mt-7 border-t border-hair pt-[18px] font-mono text-xs leading-[1.55] text-faint">
            [ ] {form.consent}
          </div>
        </>
      )}

      {err && (
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
            disabled={status === "submitting"}
            className={DISABLED_CLS}
          >
            {status === "submitting" ? "writing..." : form.submit}
          </Btn>
        )}
      </div>
    </>
  );
}
