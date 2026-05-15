# /signup — pre-implementation research

Companion to [`signup.md`](./signup.md). Verifies the dependencies and APIs
the spec assumes, flags places the spec is wrong, and lists the open
decisions a coding agent needs answered before touching files.

## Dependency verification

All three packages exist on npm and are current as of 2026-05-14.

| Package | Version | Notes |
|---|---|---|
| `@aboutcircles/sdk` | `0.1.30` | "Simplified Circles SDK for non-crypto users with low entrance barrier" |
| `viem` | `2.49.0` | required peer for the SDK, also used for signature verification |
| `jose` | `6.2.3` | JWT helpers for the session cookie |
| `@walletconnect/ethereum-provider` | latest | WalletConnect v2 EIP-1193 provider for the "connect with Gnosis app" path (decided 2026-05-14, overrides spec's no-WC rule) |

`@aboutcircles/sdk` is a **meta-package**. Its `dependencies` already
include every sub-package the spec lists separately:

```
@aboutcircles/sdk-types
@aboutcircles/sdk-core
@aboutcircles/sdk-rpc
@aboutcircles/sdk-runner          ← pulls in @safe-global/protocol-kit
@aboutcircles/sdk-profiles
@aboutcircles/sdk-utils
@aboutcircles/sdk-pathfinder
@aboutcircles/sdk-transfers
@aboutcircles/sdk-invitations
viem
```

**Install only `@aboutcircles/sdk`, `viem`, `jose`.** The spec's three-line
list (`sdk` + `sdk-core` + `sdk-types`) is over-specified; the sub-packages
are transitively resolved and pinning them ourselves invites version skew.

**Bundle-size note.** `@aboutcircles/sdk-runner` pulls in
`@safe-global/protocol-kit` + `@safe-global/safe-core-sdk-types`, which
together are heavy on the client. The `ConnectCircles` / `OrgPicker`
subtree on `/signup` should be loaded with `next/dynamic({ ssr: false })`
so the rest of the site does not pay the cost.

## Spec corrections

### 1. `sdk.getAvatar(addr)` throws on unregistered addresses

`signup.md` step 2 reads:

> `sdk.getAvatar(address)` → returns the on-chain avatar record. **No
> avatar** → user isn't on Circles yet. Show a wall: …

`getAvatar` actually **throws** for an unregistered address. The
non-throwing probe is `sdk.data.getAvatarInfo(addr)`, which returns
`AvatarRow | undefined`. Implementation must be:

```ts
const info = await sdk.data.getAvatarInfo(addr);
if (!info) return { state: "no-avatar" };
if (info.type === "CrcV2_RegisterGroup") return { state: "is-group" };
if (info.type === "CrcV2_RegisterOrganization") return { state: "is-org" };
// type === "CrcV2_RegisterHuman" — green path
const avatar = await sdk.getAvatar(addr);
const profile = await avatar.profile.get();
```

The `avatarInfo.type` discriminator and the three string values in the
spec are correct.

### 2. `getGroupMemberships` returns a paged query, not rows

`signup.md` writes:

> `sdk.rpc.group.getGroupMemberships(address, 10)` returns the groups
> they belong to.

The real return type is `PagedQuery<GroupMembershipRow>` (cursor-paged).
Correct usage:

```ts
const q = sdk.rpc.group.getGroupMemberships(addr, 25);
await q.queryNextPage();
const rows = q.currentPage?.results ?? [];
```

For cycle 01 a single page is enough. If a builder belongs to more than
25 groups they can paste an address manually as a fallback.

### 3. Signature verification: EIP-1271, not EOA-only

`signup.md` step 7 says "Server `verifyMessage` against `address`." The
standalone `verifyMessage` util in viem only supports EOA sigs. **Many
Circles users sign in with Safe** (smart-contract wallet on Gnosis); a
plain util call rejects their signature.

Use `publicClient.verifyMessage` instead — the **action**, not the util —
which falls back to EIP-1271 (`isValidSignature`) when the signer is a
contract:

```ts
import { createPublicClient, http } from "viem";
import { gnosis } from "viem/chains";

const publicClient = createPublicClient({
  chain: gnosis,
  transport: http(process.env.GNOSIS_RPC_URL),
});

const ok = await publicClient.verifyMessage({ address, message, signature });
```

Cost is one Gnosis `eth_call` per signup (cheap, but it does need an
RPC). The util can stay as a fast-path for EOAs if we care about latency,
but starting with the action is simpler and correct.

## Decisions to lock in before coding

These are not in the original spec. Defaults given are the recommendation;
flag any you want to change. Each row is annotated with the second-opinion
verdict from codex review (session `019e282d-0fdf-7733-978f-8c5c94dffff9`).

| # | Decision | Verdict | Notes |
|---|---|---|---|
| 1 | JWT signing secret env var: `AUTH_SESSION_SECRET` (32-byte hex via `openssl rand -hex 32`). Fail hard on boot if missing. | SOUND | — |
| 2 | Gnosis RPC env var. **Revised:** use two vars — `NEXT_PUBLIC_GNOSIS_RPC_URL` (client SDK init, can be the public `https://rpc.gnosischain.com`) and `GNOSIS_RPC_URL` (server `publicClient` for `verifyMessage`, set to a non-public/SLA endpoint). | SOUND (after revision) | Original single-var proposal flagged RISKY: the public RPC has no SLA and rate-limits Safe (EIP-1271) signup verification. |
| 3 | Nonce: stateless signed JWT cookie, 5 min expiry, echoed in the signed message. **Added:** include a `jti` claim and reject reuse within the window via a short-lived in-memory `Set` keyed by `jti` (fine for cycle 01 since one signup-rate is human-typing-bounded). | SOUND (after revision) | Original was RISKY — replayable within the 5-min window. The signed message must also bind `chainId=100`, `domain` (`location.origin`), `purpose`, `cycle`, `address`, `nonce`, and `iat`. |
| 4 | Handle prefill from `profile.name`, 409 on collision, defer on-blur check. | SOUND | — |
| 5 | Migration sequencing | OVERRIDDEN | **Single PR end-to-end** (decided 2026-05-14). Migration 0004 + service-role wiring + `/api/signup` + UI rewrite + `/register` cookie gate all ship together. Accepts the spec's "option 2: higher risk if both endpoints are not ready together" because the alternative (staged migrations) is overhead for a 2-route app. |
| 6 | `next/dynamic({ ssr: false })` for `ConnectCircles` and `OrgPicker`. | SOUND | SDK is browser-only; SSR would crash on `window.ethereum` access. |
| 7 | `org_addr` nullable per migration 0004. | SOUND | — |

## Locked-in product decisions (2026-05-14)

| # | Decision | Resolution |
|---|---|---|
| A | Wallet types accepted | **EOA + Safe (EIP-1271)** — server uses `publicClient.verifyMessage` against a private Gnosis RPC. |
| B | Handle charset | `^[a-z0-9._-]{3,30}$` (ASCII lowercase + digits + `.` `_` `-`, 3–30 chars). Pre-fill from `profile.name` is slugified to this charset; user can override. |
| C | Migration safety | Trust the spec's "builders is empty in prod" claim; no pre-check. |
| D | Session cookie | 7-day JWT, no auto-renew. Builder re-signs each cycle. Flags: `httpOnly`, `secure` (prod), `sameSite=lax`, `path=/`. Claims: `address`, `iss=circles/garage`, `aud=builder.circles.garage`, `iat`, `exp`. |
| E | No-wallet UX | Inline "no wallet detected · get a Circles avatar in the Gnosis app, then come back" with link to `https://app.gnosis.io/circles`. Expandable `?` adds one paragraph; no install links for MetaMask/Rabby/etc. |
| F | Supabase service-role env | `SUPABASE_SERVICE_ROLE_KEY` (canonical Supabase name). |
| G | TG opt-in | **Dropped for v1.** Revisit when the TG group is operational. Remove the field from the success-screen design. |
| H | Surface | **Standalone web app only for cycle 01.** Mini-app variant (`@aboutcircles/miniapp-sdk` + passkey, loaded inside Gnosis app) is a separate, post-cycle-01 project. |
| I | WalletConnect | **Ship WC v2 + injected from day one.** Two paths on /signup: `connect browser wallet` (injected) and `connect with Gnosis app` (WC QR on desktop, deeplink on mobile). New dep: `@walletconnect/ethereum-provider`. |

## Additional risks (from codex review)

Things neither doc addresses. Fold each into implementation:

- **Hard chain check.** Require `chainId === 100` after `eth_requestAccounts`. Attempt `wallet_switchEthereumChain` / `wallet_addEthereumChain` on mismatch. Encode `chainId` in the signed message so a signature from another chain doesn't pass server verification.
- **Bind the signed message.** Include `domain` (origin), app name, route/purpose (`signup`), `cycle`, `address`, `nonce`, and `iat`/`exp`. Plain `"sign in as 0x…"` is too replayable across deploys.
- **Public RPC is not for the server.** `NEXT_PUBLIC_GNOSIS_RPC_URL` only for client; server uses `GNOSIS_RPC_URL` (private endpoint or paid provider). Otherwise Gnosis-side rate limits silently break Safe (EIP-1271) signup verification.
- **Handle normalisation.** `lower(handle)` is not enough for Unicode spoofing. Trim, length cap, NFKC normalise, restrict charset (e.g. `^[a-z0-9._-]{3,30}$` after lowercase), reserved-name list. Apply server-side before insert.
- **Address validation.** Use `viem.isAddress` server-side; normalise to canonical checksum or lowercase consistently. The `lower(circles_addr)` index already enforces case-insensitive uniqueness — make sure inserts are lower-cased to match.
- **`profile.name` is untrusted.** Cap length, strip control chars, never render unsanitised (React already escapes, but the handle pre-fill goes back into a form).
- **Direct sub-package imports.** If we ever need to import from `@aboutcircles/sdk-runner` (e.g., for Safe-specific code), declare it as a direct dep — relying on transitive resolution is fragile under pnpm.
- **Verify `org_addr` membership server-side.** The picker is populated client-side; the server should re-check the picked group is actually in `getGroupMemberships(address)` before accepting the row. Otherwise a hostile client posts an arbitrary `0x…`.
- **Session cookie attributes.** `httpOnly`, `secure` (in prod), `sameSite=lax`, `path=/`, set `iss` + `aud` claims, short expiry (recommend 7d sliding for cycle 01, refreshed on `/register` activity).
- **CSRF posture.** `sameSite=lax` is enough for `/api/signup` POST (top-level navigation only); `/register` submit endpoint must reject cross-origin requests via origin/referer check.

## Sources

- [Circles SDK Quickstart (docs.aboutcircles.com)](https://docs.aboutcircles.com/circles-sdk/getting-started-with-the-sdk)
- [Circles SDK `getAvatarInfo` reference](https://docs.aboutcircles.com/querying-circles-profiles-and-data/query-data) — confirms `getAvatarInfo` returns `Promise<AvatarRow | undefined>` while `getAvatar` does not.
- [Circles SDK `getGroupMemberships` (PagedQuery)](https://docs.aboutcircles.com/circles-sdk/circles-avatars/group-avatars/find-groups-and-memberships)
- [Circles SDK on GitHub (CirclesUBI/circles-sdk)](https://github.com/CirclesUBI/circles-sdk)
- [About Circles org on GitHub](https://github.com/aboutcircles)
- [viem `verifyMessage` action — EIP-1271 fallback](https://viem.sh/docs/actions/public/verifyMessage)
- [viem `verifyMessage` util — EOA-only](https://viem.sh/docs/utilities/verifyMessage.html)
- [jose `SignJWT` reference](https://github.com/panva/jose/blob/main/docs/jwt/sign/classes/SignJWT.md)
- [Gnosis Chain public RPC list](https://docs.gnosischain.com/tools/rpc)

Codex review session id (resumable via `/codex`): `019e282d-0fdf-7733-978f-8c5c94dffff9`.
