/**
 * Wallet helpers — client-only.
 *
 * Two connection paths for /signup:
 *   - `connectInjected` for browser-extension wallets (MetaMask, Rabby, etc.).
 *   - `connectWalletConnect` for the "connect with Gnosis app" QR / deeplink.
 *
 * Plus chain-pinning (`ensureGnosis`) and EIP-191 signing (`signEip191`)
 * shared between both paths.
 *
 * IMPORTANT: This module touches `window`; only import it from `'use client'`
 * components or behind `next/dynamic({ ssr: false })`.
 */

import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { getAddress } from "viem";

type EIP1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export type WalletKind = "injected" | "walletconnect";

export type ConnectedWallet = {
  provider: EIP1193Provider;
  address: `0x${string}`;
  chainId: number;
  kind: WalletKind;
};

const GNOSIS_CHAIN_ID = 100;
const GNOSIS_CHAIN_HEX = "0x64";

/** True when a browser-extension wallet is present (`window.ethereum`). */
export function hasInjected(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean((window as unknown as { ethereum?: unknown }).ethereum);
}

/**
 * Connect to a browser-extension wallet via `window.ethereum`.
 * Throws a clear error when no injected provider is available.
 */
export async function connectInjected(): Promise<ConnectedWallet> {
  if (!hasInjected()) {
    throw new Error(
      "No browser wallet detected. Install MetaMask/Rabby or use the WalletConnect flow.",
    );
  }
  const provider = (window as unknown as { ethereum: EIP1193Provider })
    .ethereum;

  const accounts = (await provider.request({
    method: "eth_requestAccounts",
  })) as string[];
  const first = accounts?.[0];
  if (!first) {
    throw new Error("Wallet returned no accounts. Unlock the wallet and retry.");
  }

  const chainIdHex = (await provider.request({
    method: "eth_chainId",
  })) as string;
  const chainId = parseInt(chainIdHex, 16);

  return {
    provider,
    address: getAddress(first),
    chainId,
    kind: "injected",
  };
}

/**
 * Open a WalletConnect v2 session targeted at Gnosis Chain.
 * Reads `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`; fails loudly if missing.
 */
export async function connectWalletConnect(): Promise<ConnectedWallet> {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. Create a project at https://walletconnect.com/cloud and add it to apps/web/.env.local.",
    );
  }

  const wc = await EthereumProvider.init({
    projectId,
    chains: [GNOSIS_CHAIN_ID],
    showQrModal: true,
    metadata: {
      name: "circles/garage",
      description: "Get paid to ship mini-apps on Circles.",
      url: "https://builder.circles.garage",
      icons: ["https://builder.circles.garage/favicon.ico"],
    },
  });

  try {
    await wc.connect();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`WalletConnect session failed — ${message}`);
  }

  const [first] = wc.accounts;
  if (!first) {
    throw new Error(
      "WalletConnect returned no accounts. Approve the session in your wallet and retry.",
    );
  }

  return {
    provider: wc as unknown as EIP1193Provider,
    address: getAddress(first),
    chainId: wc.chainId,
    kind: "walletconnect",
  };
}

/**
 * Pin the active provider to Gnosis Chain (chainId 100).
 * Tries `wallet_switchEthereumChain` first; falls back to
 * `wallet_addEthereumChain` on the standard "chain not added" error (4902).
 */
export async function ensureGnosis(provider: EIP1193Provider): Promise<void> {
  let current = await readChainId(provider);
  if (current === GNOSIS_CHAIN_ID) return;

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GNOSIS_CHAIN_HEX }],
    });
  } catch (err) {
    const code = (err as { code?: number })?.code;
    if (code !== 4902) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Could not switch wallet to Gnosis Chain — ${message}. Switch manually and retry.`,
      );
    }
    // Chain not known to the wallet — try to add it.
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: GNOSIS_CHAIN_HEX,
            chainName: "Gnosis",
            rpcUrls: ["https://rpc.gnosischain.com"],
            nativeCurrency: { name: "xDAI", symbol: "XDAI", decimals: 18 },
            blockExplorerUrls: ["https://gnosisscan.io"],
          },
        ],
      });
    } catch (addErr) {
      const message =
        addErr instanceof Error ? addErr.message : String(addErr);
      throw new Error(
        `Could not add Gnosis Chain to wallet — ${message}. Add it manually and retry.`,
      );
    }
  }

  current = await readChainId(provider);
  if (current !== GNOSIS_CHAIN_ID) {
    throw new Error(
      `Wallet is still on chain ${current}; this app only runs on Gnosis Chain (100).`,
    );
  }
}

/**
 * Sign `message` with `personal_sign` (EIP-191).
 * Returns the 0x-prefixed signature.
 */
export async function signEip191(
  provider: EIP1193Provider,
  address: `0x${string}`,
  message: string,
): Promise<`0x${string}`> {
  try {
    const sig = (await provider.request({
      method: "personal_sign",
      params: [message, address],
    })) as string;
    if (!sig || !sig.startsWith("0x")) {
      throw new Error("Wallet returned a malformed signature.");
    }
    return sig as `0x${string}`;
  } catch (err) {
    const reason =
      err instanceof Error ? err.message : String(err ?? "unknown error");
    throw new Error(`Signature request rejected — ${reason}`);
  }
}

async function readChainId(provider: EIP1193Provider): Promise<number> {
  const hex = (await provider.request({ method: "eth_chainId" })) as string;
  return parseInt(hex, 16);
}
