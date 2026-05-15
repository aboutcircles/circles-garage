"use client";

import { useEffect, useState } from "react";
import { Btn } from "@workspace/ui/kit";
import type { Sdk } from "@aboutcircles/sdk";
import type { SignupConnectCopy } from "@/lib/content";
import {
  hasInjected,
  connectInjected,
  connectWalletConnect,
  ensureGnosis,
  type ConnectedWallet,
} from "@/lib/wallet";
import { makeSdk, probeAvatar, type AvatarState } from "@/lib/circles";

type HumanAvatar = Extract<AvatarState, { kind: "human" }>;

type ConnectMethod = "injected" | "walletconnect";

const hasWalletConnect = Boolean(
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
);

type Phase =
  | { phase: "idle" }
  | { phase: "connecting"; method: ConnectMethod }
  | { phase: "checking"; wallet: ConnectedWallet }
  | { phase: "error"; message: string }
  | {
      phase: "blocked";
      reason: "no-avatar" | "group" | "organization";
      wallet: ConnectedWallet;
    };

type Props = {
  copy: SignupConnectCopy;
  onConnected: (result: {
    wallet: ConnectedWallet;
    avatar: HumanAvatar;
    sdk: Sdk;
  }) => void;
};

export function ConnectCircles({ copy, onConnected }: Props) {
  const [state, setState] = useState<Phase>({ phase: "idle" });
  // Default true to avoid SSR/CSR mismatch; effect flips it after mount.
  const [hasInjectedState, setHasInjectedState] = useState(true);

  useEffect(() => {
    // Mount-only flip; SSR has no `window.ethereum`, so we hydrate optimistic
    // then correct. The plain effect is the documented hydration-safe pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasInjectedState(hasInjected());
  }, []);

  const reset = () => setState({ phase: "idle" });

  const runConnect = async (method: ConnectMethod) => {
    setState({ phase: "connecting", method });
    let wallet: ConnectedWallet;
    try {
      wallet =
        method === "injected"
          ? await connectInjected()
          : await connectWalletConnect();
    } catch (e) {
      setState({
        phase: "error",
        message: e instanceof Error ? e.message : String(e),
      });
      return;
    }

    setState({ phase: "checking", wallet });

    try {
      await ensureGnosis(wallet.provider);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setState({
        phase: "error",
        message: wallet.chainId !== 100 ? copy.wrongChain : message,
      });
      return;
    }

    try {
      const sdk = await makeSdk(wallet.provider, wallet.address);
      const avatar = await probeAvatar(sdk, wallet.address);
      if (avatar.kind === "no-avatar") {
        setState({ phase: "blocked", reason: "no-avatar", wallet });
        return;
      }
      if (avatar.kind === "group") {
        setState({ phase: "blocked", reason: "group", wallet });
        return;
      }
      if (avatar.kind === "organization") {
        setState({ phase: "blocked", reason: "organization", wallet });
        return;
      }
      onConnected({ wallet, avatar, sdk });
    } catch (e) {
      setState({
        phase: "error",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const isBusy = state.phase === "connecting" || state.phase === "checking";

  return (
    <div>
      <div className="font-mono text-base font-bold tracking-[-0.2px]">
        {copy.headline}
      </div>
      <div className="mt-1.5 font-mono text-[11px] leading-[1.6] text-faint">
        {copy.sub}
      </div>

      {!hasInjectedState && (
        <div className="mt-3 font-mono text-[11px] text-faint">
          ↳ {copy.noWallet}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Btn
          primary
          onClick={() => runConnect("injected")}
          disabled={!hasInjectedState || isBusy}
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copy.primary}
        </Btn>
        {hasWalletConnect && (
          <Btn
            onClick={() => runConnect("walletconnect")}
            disabled={isBusy}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copy.secondary}
          </Btn>
        )}
      </div>

      {state.phase === "connecting" && (
        <div className="mt-3 font-mono text-[11px] text-faint">connecting…</div>
      )}
      {state.phase === "checking" && (
        <div className="mt-3 font-mono text-[11px] text-faint">
          checking your avatar…
        </div>
      )}

      {state.phase === "error" && (
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <div className="font-mono text-[11px] text-ink">! {state.message}</div>
          <Btn sm onClick={reset}>
            try again
          </Btn>
        </div>
      )}

      {state.phase === "blocked" && state.reason === "no-avatar" && (
        <div className="mt-3">
          <div className="font-mono text-[11px] text-ink">! {copy.noAvatar}</div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <a
              href={copy.gnosisAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 border border-ink bg-ink px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-[0.04em] text-paper"
            >
              open gnosis app →
            </a>
            <Btn sm onClick={reset}>
              try again
            </Btn>
          </div>
        </div>
      )}

      {state.phase === "blocked" && state.reason === "group" && (
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <div className="font-mono text-[11px] text-ink">
            ! {copy.notHuman.group}
          </div>
          <Btn sm onClick={reset}>
            try again
          </Btn>
        </div>
      )}

      {state.phase === "blocked" && state.reason === "organization" && (
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <div className="font-mono text-[11px] text-ink">
            ! {copy.notHuman.organization}
          </div>
          <Btn sm onClick={reset}>
            try again
          </Btn>
        </div>
      )}
    </div>
  );
}
