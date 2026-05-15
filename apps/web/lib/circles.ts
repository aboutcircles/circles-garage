/**
 * Circles SDK helpers — client-only.
 *
 * Wraps `@aboutcircles/sdk` for the /signup flow with three concerns:
 *   1. `makeSdk` — construct an Sdk bound to Gnosis Chain (chainId 100).
 *   2. `probeAvatar` — non-throwing avatar lookup that discriminates by type.
 *   3. `listGroups`  — first-page group memberships for the avatar.
 *
 * The /signup flow needs read-only access; we deliberately do NOT attach a
 * `ContractRunner` here because the SDK throws if one is supplied without a
 * working `sendTransaction`. If a future flow needs to send transactions,
 * the caller should build a runner separately and pass it via a new helper.
 *
 * IMPORTANT: This module is browser-only (the underlying SDK pulls in
 * `@safe-global/protocol-kit`). Only import it from `'use client'`
 * components or behind `next/dynamic({ ssr: false })`.
 */

import { Sdk } from "@aboutcircles/sdk";

type EIP1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

/**
 * Subset of `@aboutcircles/sdk-types` `AvatarInfo` that this module actually
 * uses. We declare it locally because the sub-package isn't a direct workspace
 * dep — relying on its transitive pnpm path would break type resolution.
 */
type AvatarInfoLite = {
  type:
    | "CrcV2_RegisterHuman"
    | "CrcV2_RegisterGroup"
    | "CrcV2_RegisterOrganization"
    | "CrcV1_Signup"
    | "CrcV1_OrganizationSignup";
  avatar: `0x${string}`;
  name?: string;
};

type GroupMembershipRowLite = {
  group: `0x${string}`;
  member: `0x${string}`;
  expiryTime: number;
};

export type AvatarState =
  | { kind: "no-avatar" }
  | { kind: "group"; address: `0x${string}` }
  | { kind: "organization"; address: `0x${string}` }
  | { kind: "human"; address: `0x${string}`; name?: string };

export type GroupOption = { address: `0x${string}`; name?: string };

/**
 * Build an Sdk pointed at Gnosis Chain (chainId 100).
 *
 * The `provider` and `address` parameters are accepted for API symmetry with
 * future transaction flows. The chain switch must already have been performed
 * by `ensureGnosis` from `./wallet`; this helper does not double-check.
 */
export async function makeSdk(
  provider: EIP1193Provider,
  address: `0x${string}`,
): Promise<Sdk> {
  if (!provider || typeof provider.request !== "function") {
    throw new Error(
      "makeSdk: invalid EIP-1193 provider (missing .request method).",
    );
  }
  if (!address || !address.startsWith("0x")) {
    throw new Error("makeSdk: address must be a 0x-prefixed hex string.");
  }
  try {
    // Sdk() with no args defaults to Gnosis Chain (chainId 100) via the
    // bundled circlesConfig. We omit the contractRunner because we only
    // need read paths (data.getAvatar, rpc.group.*, profile.get).
    return new Sdk();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`makeSdk: failed to initialize Circles Sdk — ${message}`);
  }
}

/**
 * Non-throwing avatar probe. Returns a discriminated state so the caller can
 * branch into the right /signup screen (no-avatar / group / org / human).
 *
 * For human avatars we additionally read the IPFS profile to pull `name` for
 * handle prefill. That read is best-effort and silently falls back to no name.
 */
export async function probeAvatar(
  sdk: Sdk,
  address: `0x${string}`,
): Promise<AvatarState> {
  let info: AvatarInfoLite | undefined;
  try {
    // `sdk.data.getAvatar` wraps `rpc.avatar.getAvatarInfo` and is the
    // documented non-throwing probe. Returns undefined for unregistered.
    info = (await sdk.data.getAvatar(address)) as AvatarInfoLite | undefined;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`probeAvatar: Circles RPC lookup failed — ${message}`);
  }

  if (!info) return { kind: "no-avatar" };

  if (info.type === "CrcV2_RegisterGroup") {
    return { kind: "group", address };
  }
  if (info.type === "CrcV2_RegisterOrganization") {
    return { kind: "organization", address };
  }

  // Anything else (CrcV2_RegisterHuman, CrcV1_Signup, …) we treat as human
  // for the /signup happy path. Best-effort profile.name read for handle
  // prefill — never let an IPFS hiccup break the page.
  let name: string | undefined;
  try {
    const avatar = await sdk.getAvatar(address);
    const profile = await avatar.profile.get();
    if (profile?.name) name = profile.name;
  } catch {
    // intentionally swallowed: name is optional, page must still render.
  }

  return { kind: "human", address, name };
}

/**
 * Return up to 25 group memberships for an address (first page only).
 *
 * Builders with more than 25 groups can fall back to pasting an address
 * manually on /signup; cycle 01 does not paginate.
 */
export async function listGroups(
  sdk: Sdk,
  address: `0x${string}`,
): Promise<GroupOption[]> {
  let rows: GroupMembershipRowLite[];
  try {
    // sdk-rpc 0.1.30: getGroupMemberships(avatar, limit) returns
    // PagedResponse<GroupMembershipRow> directly — no .queryNextPage().
    const page = await sdk.rpc.group.getGroupMemberships(address, 25);
    rows = (page.results ?? []) as GroupMembershipRowLite[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `listGroups: failed to load group memberships — ${message}`,
    );
  }

  if (rows.length === 0) return [];

  // Resolve display names in parallel. Each lookup is best-effort: a missing
  // profile must not knock the rest of the picker offline.
  const options = await Promise.all(
    rows.map(async (row): Promise<GroupOption> => {
      const groupAddress = row.group;
      try {
        const info = (await sdk.data.getAvatar(groupAddress)) as
          | AvatarInfoLite
          | undefined;
        return { address: groupAddress, name: info?.name };
      } catch {
        return { address: groupAddress };
      }
    }),
  );

  return options;
}
