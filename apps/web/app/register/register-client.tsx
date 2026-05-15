"use client";

import { useRef, useState } from "react";
import {
  Btn,
  Check,
  Field,
  Hero,
  Input,
  Section,
  Select,
  Slot,
  Steps,
  Textarea,
} from "@workspace/ui/kit";
import { getSupabase } from "@/lib/supabase";
import { getCycleInfo } from "@/lib/cycle";
import type { Draft } from "@/lib/content";

type Contract = { chain: string; addr: string; label: string };
type ReadmeState = { what: string; why: string; try: string };

type FormState = {
  app_name: string;
  slug: string;
  pitch: string;
  track: string;
  status: string;
  contracts: Contract[];
  live_url: string;
  repo_url: string;
  readme: ReadmeState;
  measures: string[];
};

const TRACK_OPTIONS = [
  { value: "payments", label: "payments" },
  { value: "social", label: "social" },
  { value: "games", label: "games" },
  { value: "tools", label: "tools" },
  { value: "other", label: "other" },
] as const;

const STEPS = ["identity", "contracts", "proof", "measures", "review"] as const;

const DISABLED_CLS = "disabled:opacity-40 disabled:cursor-not-allowed";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function RegisterClient({ draft }: { draft: Draft }) {
  const [step, setStep] = useState(0);
  const slugTouched = useRef(false);

  const [data, setData] = useState<FormState>({
    app_name: "",
    slug: "",
    pitch: "",
    track: "",
    status: "",
    contracts: [{ chain: "", addr: "", label: "" }],
    live_url: "",
    repo_url: "",
    readme: { what: "", why: "", try: "" },
    measures: [],
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">(
    "idle",
  );
  const [err, setErr] = useState<string | null>(null);

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
  const setText = (n: Exclude<keyof FormState, "contracts" | "readme" | "measures">) => (v: string) =>
    setData((d) => ({ ...d, [n]: v }));
  const setReadme = (n: keyof ReadmeState) => (v: string) =>
    setData((d) => ({ ...d, readme: { ...d.readme, [n]: v } }));

  const setContract = (i: number, key: keyof Contract) => (v: string) =>
    setData((d) => {
      const next = d.contracts.slice();
      next[i] = { ...next[i]!, [key]: v };
      return { ...d, contracts: next };
    });
  const addContract = () =>
    setData((d) => ({
      ...d,
      contracts: [...d.contracts, { chain: "", addr: "", label: "" }],
    }));
  const removeContract = (i: number) =>
    setData((d) => ({
      ...d,
      contracts: d.contracts.filter((_, j) => j !== i),
    }));

  const toggleMeasure = (label: string) =>
    setData((d) => ({
      ...d,
      measures: d.measures.includes(label)
        ? d.measures.filter((m) => m !== label)
        : [...d.measures, label],
    }));

  const stepValid = (s: number): boolean => {
    if (s === 0) return data.app_name.trim() !== "" && data.pitch.trim() !== "";
    if (s === 2) return data.live_url.trim() !== "";
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
    let client;
    try {
      client = getSupabase();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Supabase not configured.");
      setStatus("err");
      return;
    }
    const cleanedContracts = data.contracts
      .map((c) => ({
        chain: c.chain.trim(),
        addr: c.addr.trim(),
        label: c.label.trim(),
      }))
      .filter((c) => c.chain || c.addr || c.label);
    const { error } = await client.from("submissions").insert({
      app_name: data.app_name.trim(),
      slug: (data.slug || slugify(data.app_name)).trim(),
      pitch: data.pitch.trim(),
      track: data.track || null,
      status: "draft",
      cycle: getCycleInfo().cycle,
      contracts: cleanedContracts,
      live_url: data.live_url.trim(),
      repo_url: data.repo_url.trim() || null,
      screenshots: [],
      readme: data.readme,
      measures: data.measures,
    });
    if (error) {
      setErr(error.message);
      setStatus("err");
    } else {
      setStatus("ok");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (status === "ok") {
    return (
      <>
        <Hero
          size="lg"
          sub={`row written · ${data.app_name} queued. measurement starts at the next snapshot.`}
        >
          submitted.
        </Hero>
        <div className="mt-7 border-t border-hair pt-4 font-mono text-xs leading-[1.6] text-faint">
          {"// "}submissions/{data.slug || slugify(data.app_name)} — status:
          draft.
          <br />
          {"// "}editing existing submissions is not yet wired up; resubmit to
          amend.
        </div>
        <div className="mt-7 flex items-center gap-2.5">
          <Btn primary href="/leaderboard">
            see leaderboard →
          </Btn>
          <Btn href="/">← back to landing</Btn>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <Hero
          size="md"
          sub="Save as you go — only “submit” makes it eligible for the next snapshot."
        >
          new submission
          <span className="text-faint">.draft</span>
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
          hint="up to 5 · we subscribe to events"
        >
          <div className="flex flex-col gap-1">
            {data.contracts.map((c, i) => (
              <div
                key={i}
                className="grid items-baseline gap-2 border-b border-dotted border-hair py-2.5"
                style={{ gridTemplateColumns: "80px 1fr 140px auto" }}
              >
                <input
                  aria-label={`contract ${i + 1} chain`}
                  className="border-0 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:italic placeholder:text-faint"
                  placeholder="chain"
                  value={c.chain}
                  onChange={(e) => setContract(i, "chain")(e.target.value)}
                />
                <input
                  aria-label={`contract ${i + 1} address`}
                  className="border-0 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:italic placeholder:text-faint"
                  placeholder="0x____________________________________"
                  value={c.addr}
                  onChange={(e) => setContract(i, "addr")(e.target.value)}
                />
                <input
                  aria-label={`contract ${i + 1} label`}
                  className="border-0 bg-transparent font-mono text-[13px] text-ink outline-none placeholder:italic placeholder:text-faint"
                  placeholder="label · e.g. hub"
                  value={c.label}
                  onChange={(e) => setContract(i, "label")(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeContract(i)}
                  disabled={data.contracts.length === 1}
                  className={`cursor-pointer font-mono text-[11px] text-faint hover:text-ink ${DISABLED_CLS}`}
                  aria-label={`remove contract ${i + 1}`}
                >
                  × remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Btn sm onClick={addContract} disabled={data.contracts.length >= 5} className={DISABLED_CLS}>
              + add contract
            </Btn>
            <span className="font-mono text-[11px] text-faint">
              {data.contracts.length}/5 · optional
            </span>
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section
          num="03"
          label="proof of life"
          hint="live · repo · screenshots · readme"
        >
          <Input
            name="live_url"
            label="live link"
            required
            type="url"
            value={data.live_url}
            onChange={setText("live_url")}
            placeholder={draft.liveLink}
          />
          <Input
            name="repo_url"
            label="repo"
            type="url"
            value={data.repo_url}
            onChange={setText("repo_url")}
            placeholder={draft.repo}
          />
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            <Slot label="screenshot · home" h={84} />
            <Slot label="screenshot · flow" h={84} />
            <Slot label="+ upload (soon)" h={84} />
          </div>
          <div className="mt-1 font-mono text-[10px] text-faint">
            ↳ uploads not yet wired · readme below is what we read for now.
          </div>

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

      {step === 3 && (
        <Section
          num="04"
          label="how to be measured"
          hint="tick what counts · changeable once per cycle"
        >
          <div className="flex flex-col">
            {draft.measures.map((m) => {
              const on = data.measures.includes(m.label);
              return (
                <label
                  key={m.label}
                  className="flex cursor-pointer items-center gap-2.5 border-b border-dotted border-hair py-2.5 font-mono text-[13px]"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => toggleMeasure(m.label)}
                  />
                  <span
                    className={`relative inline-block h-3.5 w-3.5 shrink-0 border-[1.5px] border-ink ${on ? "bg-ink" : "bg-transparent"}`}
                  >
                    {on && (
                      <span className="absolute top-[-4px] left-px text-[13px] font-bold text-paper">
                        ✓
                      </span>
                    )}
                  </span>
                  <span className="flex-1">{m.label}</span>
                  {m.hint && (
                    <span className="text-[11px] text-faint">{m.hint}</span>
                  )}
                </label>
              );
            })}
          </div>
        </Section>
      )}

      {isReview && (
        <>
          <div className="mt-7 border-2 border-ink p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                  last step · cycle 01
                </div>
                <div className="font-mono text-[18px] font-bold leading-tight tracking-[-0.3px]">
                  review &amp; submit
                </div>
                <div className="mt-2 font-mono text-[11px] leading-[1.55] text-faint">
                  ↳ Check details below. Click submit to write a row to{" "}
                  <code className="bg-ghost px-1">submissions</code>.
                </div>
              </div>
              <Btn
                primary
                onClick={submit}
                disabled={status === "submitting"}
                className={DISABLED_CLS}
              >
                {status === "submitting"
                  ? "writing..."
                  : "submit for cycle 01 →"}
              </Btn>
            </div>
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
              {data.contracts.filter((c) => c.chain || c.addr || c.label)
                .length === 0 ? (
                <div className="text-faint italic">— none added —</div>
              ) : (
                data.contracts
                  .filter((c) => c.chain || c.addr || c.label)
                  .map((c, i) => (
                    <div key={i}>
                      [{c.chain || "?"}] {c.addr || "0x?"} ·{" "}
                      {c.label || "(unlabeled)"}
                    </div>
                  ))
              )}
            </div>
          </Section>

          <Section num="03" label="proof of life">
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

          <Section num="04" label="measures">
            {draft.measures.map((m) => (
              <Check
                key={m.label}
                line
                on={data.measures.includes(m.label)}
                label={m.label}
                hint={m.hint}
              />
            ))}
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
            disabled={status === "submitting"}
            className={DISABLED_CLS}
          >
            {status === "submitting" ? "writing..." : "submit for cycle 01 →"}
          </Btn>
        )}
      </div>
    </>
  );
}
