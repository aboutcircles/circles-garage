"use client";

import { useRef, useState } from "react";
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
import { createSubmission } from "./actions";
import type { Draft } from "@/lib/content";

type ReadmeState = { what: string; why: string; try: string };

type FormState = {
  app_name: string;
  slug: string;
  pitch: string;
  track: string;
  status: string;
  contracts_text: string;
  live_url: string;
  repo_url: string;
  readme: ReadmeState;
};

export type SubmissionRow = {
  app_name: string;
  slug: string;
  pitch: string;
  track: string | null;
  status: string;
  cycle: number;
  live_url: string;
  repo_url: string | null;
  contracts: { chain?: string; addr?: string; label?: string }[];
  readme: { what?: string; why?: string; try?: string } | null;
};

const TRACK_OPTIONS = [
  { value: "payments", label: "payments" },
  { value: "social", label: "social" },
  { value: "games", label: "games" },
  { value: "tools", label: "tools" },
  { value: "other", label: "other" },
] as const;

const STEPS = ["identity", "contracts", "proof", "review"] as const;

const DISABLED_CLS = "disabled:opacity-40 disabled:cursor-not-allowed";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseContracts(text: string): { chain: string; addr: string; label: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((addr) => ({ chain: "gnosis", addr, label: "" }));
}

function looksLikeUrl(s: string): boolean {
  const t = s.trim();
  return t.startsWith("http://") || t.startsWith("https://");
}

function initialFormState(existing: SubmissionRow | null): FormState {
  if (!existing) {
    return {
      app_name: "",
      slug: "",
      pitch: "",
      track: "",
      status: "",
      contracts_text: "",
      live_url: "",
      repo_url: "",
      readme: { what: "", why: "", try: "" },
    };
  }
  const contracts_text = (existing.contracts ?? [])
    .map((c) => (typeof c?.addr === "string" ? c.addr : ""))
    .filter((a) => a.length > 0)
    .join("\n");
  return {
    app_name: existing.app_name ?? "",
    slug: existing.slug ?? "",
    pitch: existing.pitch ?? "",
    track: existing.track ?? "",
    status: existing.status ?? "",
    contracts_text,
    live_url: existing.live_url ?? "",
    repo_url: existing.repo_url ?? "",
    readme: {
      what: existing.readme?.what ?? "",
      why: existing.readme?.why ?? "",
      try: existing.readme?.try ?? "",
    },
  };
}

type CheckItem = { label: string; ok: boolean };

function computeChecks(data: FormState): CheckItem[] {
  const liveOk = data.live_url.trim() !== "" && looksLikeUrl(data.live_url);
  const contractOk = parseContracts(data.contracts_text).length > 0;
  const readmeOk =
    data.readme.what.trim() !== "" &&
    data.readme.why.trim() !== "" &&
    data.readme.try.trim() !== "";
  return [
    { label: "name", ok: data.app_name.trim() !== "" },
    { label: "pitch", ok: data.pitch.trim() !== "" },
    { label: "live link", ok: liveOk },
    { label: "contract", ok: contractOk },
    { label: "readme", ok: readmeOk },
  ];
}

function ChecksStrip({ checks }: { checks: CheckItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px]">
      <span className="text-faint">checks:</span>
      {checks.map((c, i) => (
        <span key={c.label} className="flex items-center gap-1">
          <span className={c.ok ? "text-ink" : "text-faint"}>
            {c.ok ? "✓" : "✗"} {c.label}
          </span>
          {i < checks.length - 1 && (
            <span className="text-faint">·</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function RegisterClient({
  draft,
  existing = null,
}: {
  draft: Draft;
  existing?: SubmissionRow | null;
}) {
  const [step, setStep] = useState(0);
  const slugTouched = useRef(!!existing?.slug);

  const [data, setData] = useState<FormState>(() => initialFormState(existing));
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">(
    "idle",
  );
  const [err, setErr] = useState<string | null>(null);

  const isEditing = !!existing;

  const setName = (v: string) => {
    setData((d) => ({
      ...d,
      app_name: v,
      slug: slugTouched.current ? d.slug : slugify(v),
    }));
  };
  const setSlug = (v: string) => {
    slugTouched.current = true;
    setData((d) => ({ ...d, slug: v }));
  };
  const setText =
    (n: Exclude<keyof FormState, "contracts_text" | "readme">) =>
    (v: string) =>
      setData((d) => ({ ...d, [n]: v }));
  const setContractsText = (v: string) =>
    setData((d) => ({ ...d, contracts_text: v }));
  const setReadme = (n: keyof ReadmeState) => (v: string) =>
    setData((d) => ({ ...d, readme: { ...d.readme, [n]: v } }));

  const checks = computeChecks(data);
  const allChecksOk = checks.every((c) => c.ok);

  const stepValid = (s: number): boolean => {
    if (s === 0) return data.app_name.trim() !== "" && data.pitch.trim() !== "";
    if (s === 2)
      return (
        data.live_url.trim() !== "" && looksLikeUrl(data.live_url)
      );
    // Review step gates on all checks — keeps a cleared pitch / wiped live
    // link from slipping past on a resubmit.
    if (s === 3) return allChecksOk;
    return true;
  };
  const canAdvance = stepValid(step);
  const isReview = step === STEPS.length - 1;

  const next = () => {
    if (canAdvance && step < STEPS.length - 1) setStep(step + 1);
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    setStatus("submitting");
    setErr(null);
    const cleanedContracts = parseContracts(data.contracts_text);
    const result = await createSubmission({
      app_name: data.app_name.trim(),
      slug: (data.slug || slugify(data.app_name)).trim(),
      pitch: data.pitch.trim(),
      track: data.track || null,
      contracts: cleanedContracts,
      live_url: data.live_url.trim(),
      repo_url: data.repo_url.trim() || null,
      readme: data.readme,
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
          sub={`${data.app_name} ${isEditing ? "updated" : "queued"}. measurement starts at the next snapshot.`}
        >
          saved.
        </Hero>
        <div className="mt-7 border-t border-hair pt-4 font-mono text-xs leading-[1.6] text-faint">
          {"// "}submissions/{data.slug || slugify(data.app_name)} — status:
          draft.
          <br />
          {"// "}resubmit anytime before the snapshot to overwrite.
        </div>
        <div className="mt-7 flex items-center gap-2.5">
          <Btn primary href="/leaderboard">
            see leaderboard →
          </Btn>
          <Btn href="/dashboard">← back to dashboard</Btn>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 border-b border-hair pb-3">
        <ChecksStrip checks={checks} />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <Hero
          size="md"
          sub={
            isEditing
              ? "You're editing your submission for this cycle. Each save replaces the current entry. The latest version on Friday at 23:59 CET is what we judge."
              : "Each submit replaces your current entry. The latest version on Friday at 23:59 CET is what we judge."
          }
        >
          {isEditing ? "editing" : "new submission"}
          <span className="text-faint">{isEditing ? "" : ".draft"}</span>
        </Hero>
        <Steps all={STEPS} current={step} />
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
          step {step + 1}/{STEPS.length}
          {isReview ? "" : ` · next → ${STEPS[step + 1]}`}
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

      {step === 0 && (
        <Section num="01" label="identity" hint="who & what is this">
          <Input
            name="app_name"
            label="app name"
            required
            value={data.app_name}
            onChange={setName}
            placeholder={draft.name}
          />
          <Input
            name="slug"
            label="slug"
            value={data.slug}
            onChange={setSlug}
            placeholder={draft.slug}
            hint={`garage.aboutcircles.com/p/${data.slug || slugify(data.app_name) || "________"}`}
          />
          <Textarea
            name="pitch"
            label="one-line pitch"
            required
            value={data.pitch}
            onChange={setText("pitch")}
            placeholder={draft.pitch}
            rows={2}
          />
          <Select
            name="track"
            label="track"
            value={data.track}
            onChange={setText("track")}
            options={TRACK_OPTIONS}
            placeholder="payments | social | games | tools | other"
          />
          <Input
            name="status"
            label="status"
            value={data.status}
            onChange={setText("status")}
            placeholder={draft.appStatus}
            hint="e.g. live · v0.4, alpha, prototype"
          />
        </Section>
      )}

      {step === 1 && (
        <Section
          num="02"
          label="contracts"
          hint="one address per line · gnosis"
        >
          <Textarea
            name="contracts_text"
            label="gnosis contracts"
            value={data.contracts_text}
            onChange={setContractsText}
            placeholder={"0x4a82…9f12\n0x9911…c0e0"}
            hint="one address per line"
            rows={5}
          />
        </Section>
      )}

      {step === 2 && (
        <Section
          num="03"
          label="show it works"
          hint="live · repo · readme"
        >
          <Input
            name="live_url"
            label="live link"
            required
            type="url"
            value={data.live_url}
            onChange={setText("live_url")}
            placeholder={draft.liveLink}
            hint="full URL · starts with http:// or https://"
          />
          <Input
            name="repo_url"
            label="repo"
            type="url"
            value={data.repo_url}
            onChange={setText("repo_url")}
            placeholder={draft.repo}
          />

          <div className="mt-4">
            <Textarea
              name="readme_what"
              label="readme · what"
              value={data.readme.what}
              onChange={setReadme("what")}
              placeholder={draft.readme.what}
              rows={2}
            />
            <Textarea
              name="readme_why"
              label="readme · why"
              value={data.readme.why}
              onChange={setReadme("why")}
              placeholder={draft.readme.why}
              rows={2}
            />
            <Textarea
              name="readme_try"
              label="readme · try"
              value={data.readme.try}
              onChange={setReadme("try")}
              placeholder={draft.readme.try}
              rows={2}
            />
          </div>
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
                  review &amp; {isEditing ? "save" : "submit"}
                </div>
                <div className="mt-2 font-mono text-[11px] leading-[1.55] text-faint">
                  ↳ Check details below. Click{" "}
                  {isEditing ? "save" : "submit"} to write a row to{" "}
                  <code className="bg-ghost px-1">submissions</code>.
                </div>
              </div>
              <Btn
                primary
                onClick={submit}
                disabled={status === "submitting" || !allChecksOk}
                className={DISABLED_CLS}
              >
                {status === "submitting"
                  ? "writing..."
                  : isEditing
                    ? "save changes →"
                    : "submit →"}
              </Btn>
            </div>
            {!allChecksOk && (
              <div className="mt-3 border-t border-hair pt-3 font-mono text-[11px] text-faint">
                ↳ fix the missing checks above before submitting.
              </div>
            )}
            {err && (
              <div className="mt-3 border-t border-hair pt-3 font-mono text-[11px] text-ink">
                ! {err}
              </div>
            )}
          </div>

          <Section num="01" label="identity">
            <Field
              label="app name"
              required
              value={data.app_name || undefined}
              placeholder="________"
            />
            <Field
              label="slug"
              value={data.slug || slugify(data.app_name) || undefined}
              hint={`garage.aboutcircles.com/p/${data.slug || slugify(data.app_name) || "________"}`}
            />
            <Field
              label="one-line pitch"
              required
              value={data.pitch || undefined}
            />
            <Field label="track" value={data.track || undefined} />
            <Field label="status" value={data.status || undefined} />
          </Section>

          <Section num="02" label="contracts">
            <div className="font-mono text-[13px] leading-[1.95]">
              {parseContracts(data.contracts_text).length === 0 ? (
                <div className="text-faint italic">— none added —</div>
              ) : (
                parseContracts(data.contracts_text).map((c, i) => (
                  <div key={i}>
                    [{c.chain}] {c.addr}
                  </div>
                ))
              )}
            </div>
          </Section>

          <Section num="03" label="show it works">
            <Field
              label="live link"
              required
              value={data.live_url || undefined}
            />
            <Field label="repo" value={data.repo_url || undefined} />
            <div className="mt-3.5 bg-ghost px-3 py-2.5 font-mono text-xs leading-[1.7]">
              <div className="text-faint"># readme.md</div>
              <div>
                <b>what:</b>{" "}
                <span className={data.readme.what ? "" : "italic text-faint"}>
                  {data.readme.what || "—"}
                </span>
              </div>
              <div>
                <b>why:</b>{" "}
                <span className={data.readme.why ? "" : "italic text-faint"}>
                  {data.readme.why || "—"}
                </span>
              </div>
              <div>
                <b>try:</b>{" "}
                <span className={data.readme.try ? "" : "italic text-faint"}>
                  {data.readme.try || "—"}
                </span>
              </div>
            </div>
          </Section>
        </>
      )}

      {err && (
        <div className="mt-4 font-mono text-[11px] text-ink">! {err}</div>
      )}

      <div className="mt-7 flex items-center gap-2.5">
        <Btn
          onClick={back}
          disabled={step === 0 || status === "submitting"}
          className={DISABLED_CLS}
        >
          ← back
        </Btn>
        <span className="ml-auto font-mono text-[11px] text-faint">
          step {step + 1}/{STEPS.length}
          {isReview ? "" : ` · next → ${STEPS[step + 1]}`}
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
            disabled={status === "submitting" || !allChecksOk}
            className={DISABLED_CLS}
          >
            {status === "submitting"
              ? "writing..."
              : isEditing
                ? "save changes →"
                : "submit →"}
          </Btn>
        )}
      </div>
    </>
  );
}
