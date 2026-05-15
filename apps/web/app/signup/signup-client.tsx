"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { SiweMessage } from "siwe";
import { Btn, Field, Hero, Input, Section } from "@workspace/ui/kit";
import { cn } from "@workspace/ui/lib/utils";
import type { Sdk } from "@aboutcircles/sdk";

import type { SignupForm, SignupReachChannel } from "@/lib/content";
import { type AvatarState } from "@/lib/circles";
import {
  ensureGnosis,
  signEip191,
  type ConnectedWallet,
} from "@/lib/wallet";

const SIGNUP_STATEMENT =
  "circles/garage — sign in to register as a builder.";

const ConnectCircles = dynamic(
  () => import("./ConnectCircles").then((m) => m.ConnectCircles),
  { ssr: false },
);

const OrgPicker = dynamic(
  () => import("./OrgPicker").then((m) => m.OrgPicker),
  { ssr: false },
);

type HumanAvatar = Extract<AvatarState, { kind: "human" }>;

type Connected = {
  wallet: ConnectedWallet;
  avatar: HumanAvatar;
  sdk: Sdk;
};

type FormState = {
  handle: string;
  reach_channel: SignupReachChannel;
  reach_handle: string;
  org_addr: `0x${string}` | null;
  consent: boolean;
};

const HANDLE_RE = /^[a-z0-9._-]{3,30}$/;
const DISABLED_CLS = "disabled:opacity-40 disabled:cursor-not-allowed";

function slugifyHandle(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 30);
}

function shortAddr(a: string): string {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function SignupClient({ form }: { form: SignupForm }) {
  const [connected, setConnected] = useState<Connected | null>(null);
  const [data, setData] = useState<FormState>({
    handle: "",
    reach_channel: "tg",
    reach_handle: "",
    org_addr: null,
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">(
    "idle",
  );
  const [err, setErr] = useState<string | null>(null);

  const handleConnected = (result: Connected) => {
    setConnected(result);
    const prefill = slugifyHandle(result.avatar.name ?? "");
    setData((d) => ({ ...d, handle: d.handle || prefill }));
  };

  const reachChannel = useMemo(
    () => form.reach.channels.find((c) => c.value === data.reach_channel),
    [data.reach_channel, form.reach.channels],
  );

  const handleValid = HANDLE_RE.test(data.handle);
  const reachValid = data.reach_handle.trim().length > 0;
  const canSubmit =
    connected !== null && handleValid && reachValid && data.consent;

  const prefillFromAvatar = () => {
    if (!connected) return;
    const next = slugifyHandle(connected.avatar.name ?? "");
    if (next) setData((d) => ({ ...d, handle: next }));
  };

  const submit = async () => {
    if (!connected || !canSubmit) return;
    setStatus("submitting");
    setErr(null);
    try {
      await ensureGnosis(connected.wallet.provider);

      const nonceRes = await fetch("/api/signup/nonce", {
        method: "GET",
        credentials: "same-origin",
      });
      if (!nonceRes.ok) {
        setErr("could not start signup — please retry.");
        setStatus("err");
        return;
      }
      const { nonce } = (await nonceRes.json()) as { nonce: string };

      const message = new SiweMessage({
        domain: window.location.host,
        address: connected.wallet.address,
        statement: SIGNUP_STATEMENT,
        uri: window.location.origin,
        version: "1",
        chainId: 100,
        nonce,
        issuedAt: new Date().toISOString(),
      }).prepareMessage();

      const signature = await signEip191(
        connected.wallet.provider,
        connected.wallet.address,
        message,
      );

      const postRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          address: connected.wallet.address,
          signature,
          message,
          handle: data.handle.trim(),
          reach_channel: data.reach_channel,
          reach_handle: data.reach_handle.trim(),
          org_addr: data.org_addr,
        }),
      });
      if (postRes.status === 409) {
        setErr("handle or address already taken — try another handle.");
        setStatus("err");
        return;
      }
      if (!postRes.ok) {
        const body = (await postRes.json().catch(() => null)) as
          | { error?: string }
          | null;
        if (body?.error === "handle-reserved") {
          setErr("that handle is reserved — pick another.");
        } else {
          setErr(body?.error ?? `signup failed (HTTP ${postRes.status})`);
        }
        setStatus("err");
        return;
      }
      setStatus("ok");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "signature failed");
      setStatus("err");
    }
  };

  if (status === "ok") {
    return (
      <>
        <Hero
          size="lg"
          sub={`row written · handle: ${data.handle} · we'll reach you via ${data.reach_channel}.`}
        >
          you&apos;re in.
        </Hero>
        <div className="mt-7 border-t border-hair pt-4 font-mono text-xs leading-[1.6] text-faint">
          {"// "}builders/{data.handle} — accepted into cycle queue.
          <br />
          {"// "}next step: submit a mini-app.
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

  return (
    <>
      <Hero size="lg" sub={form.hero.sub}>
        {form.hero.title}
      </Hero>

      <Section
        num={form.sections[0]!.num}
        label={form.sections[0]!.label}
        hint={form.sections[0]!.hint}
      >
        {connected ? (
          <div className="font-mono text-[13px] leading-[1.95]">
            <div>
              ✓ connected as{" "}
              <span className="text-ink">
                {shortAddr(connected.wallet.address)}
              </span>{" "}
              <span className="text-faint">
                · {connected.wallet.kind === "injected" ? "browser" : "wc"}
              </span>
            </div>
            {connected.avatar.name && (
              <div className="text-faint">
                ↳ welcome,{" "}
                <span className="text-ink">{connected.avatar.name}</span>
              </div>
            )}
          </div>
        ) : (
          <ConnectCircles copy={form.connect} onConnected={handleConnected} />
        )}
      </Section>

      {connected && (
        <Section
          num={form.sections[1]!.num}
          label={form.sections[1]!.label}
          hint={form.sections[1]!.hint}
        >
          <Input
            name="handle"
            label={form.handle.label}
            value={data.handle}
            onChange={(v) =>
              setData((d) => ({ ...d, handle: v.toLowerCase() }))
            }
            placeholder="builder"
            required
            hint={
              data.handle && !handleValid
                ? `invalid · ${form.handle.hint}`
                : form.handle.hint
            }
          />

          {connected.avatar.name &&
            data.handle !== slugifyHandle(connected.avatar.name) && (
              <div className="-mt-1 ml-[232px] font-mono text-[11px] text-faint">
                <button
                  type="button"
                  onClick={prefillFromAvatar}
                  className="cursor-pointer underline decoration-dotted underline-offset-2 hover:text-ink"
                >
                  ↺ use avatar name ({slugifyHandle(connected.avatar.name)})
                </button>
              </div>
            )}

          <div className="border-b border-dotted border-hair py-2.5">
            <div className="flex items-baseline gap-3 font-mono text-[13px]">
              <span className="w-[220px] shrink-0 text-faint">
                {form.reach.label}
                <span className="text-ink"> *</span>:
              </span>
              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                {form.reach.channels.map((c) => {
                  const on = c.value === data.reach_channel;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          reach_channel: c.value,
                          reach_handle: "",
                        }))
                      }
                      className={cn(
                        "cursor-pointer border px-2.5 py-[3px] font-mono text-[11px] uppercase tracking-[0.04em]",
                        on
                          ? "border-ink bg-ink text-paper"
                          : "border-ink bg-transparent text-ink",
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-0.5 ml-[232px] font-mono text-[11px] text-faint">
              ↳ {form.reach.hint}
            </div>
          </div>

          <Input
            name="reach_handle"
            label={
              reachChannel ? `${reachChannel.label} handle` : "reach handle"
            }
            value={data.reach_handle}
            onChange={(v) => setData((d) => ({ ...d, reach_handle: v }))}
            placeholder={reachChannel?.placeholder ?? ""}
            required
          />

          <OrgPicker
            sdk={connected.sdk}
            address={connected.wallet.address}
            copy={form.org}
            value={data.org_addr}
            onChange={(v) => setData((d) => ({ ...d, org_addr: v }))}
          />

          <Field
            label="circles address"
            required
            value={connected.wallet.address}
          />
        </Section>
      )}

      {connected && (
        <>
          <label className="mt-7 flex cursor-pointer items-start gap-2.5 border-t border-hair pt-[18px] font-mono text-xs leading-[1.55]">
            <input
              type="checkbox"
              className="sr-only"
              checked={data.consent}
              onChange={(e) =>
                setData((d) => ({ ...d, consent: e.target.checked }))
              }
            />
            <span
              className={cn(
                "relative mt-[2px] inline-block h-3.5 w-3.5 shrink-0 border-[1.5px] border-ink",
                data.consent ? "bg-ink" : "bg-transparent",
              )}
            >
              {data.consent && (
                <span className="absolute top-[-4px] left-px text-[13px] font-bold text-paper">
                  ✓
                </span>
              )}
            </span>
            <span className={cn(data.consent ? "text-ink" : "text-faint")}>
              {form.consent}
            </span>
          </label>

          {err && (
            <div className="mt-4 font-mono text-[11px] text-ink">! {err}</div>
          )}

          <div className="mt-7 flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-faint">
              one signature creates your builder row.
            </span>
            <Btn
              primary
              onClick={submit}
              disabled={!canSubmit || status === "submitting"}
              className={cn("ml-auto", DISABLED_CLS)}
            >
              {status === "submitting" ? "signing..." : form.submit}
            </Btn>
          </div>
        </>
      )}
    </>
  );
}
