# /signup simplification

Codex review surfaced bugs and over-engineering. This doc consolidates the
fixes and the simpler architecture. Source: `apps/web/app/signup/*`,
`apps/web/app/api/signup/*`, `apps/web/lib/auth.ts`, `apps/web/lib/wallet.ts`.

## Why a nonce at all (and why the in-memory dedup is silly)

The nonce defends against **signature replay**. Without it, an attacker who
sniffs one valid signature off the network can forge `/api/signup` calls
forever — the message they signed once is the message the server keeps
accepting.

With a nonce, the server tells the client "sign this exact random value."
Each signature is bound to that value and is single-use **if** the value
itself is single-use. The single-use guarantee comes from the cookie
lifecycle, not from a global ledger:

1. `GET /api/signup/nonce` → mint a random 32-byte nonce, sign a JWT
   wrapping it, set as a 5-min `httpOnly` `garage_nonce` cookie.
2. Client signs message that includes that nonce.
3. `POST /api/signup` → read the cookie, verify the JWT, **clear the
   cookie** in the response.

After step 3 the cookie is gone. A replay of the same signature would have
to also restore the cookie, which the attacker can't do because it's
`httpOnly` + `Secure` + signed with our server secret. The 5-minute TTL
caps the worst case (attacker captures the signature *and* the cookie
mid-flight before consumption) at 5 minutes.

**The `consumedJtis: Set<string>` in `auth.ts` adds nothing useful.** It
only catches the case of one server process seeing the same `jti` twice.
On Vercel/serverless that's effectively never (cold starts, multiple
invocation slots). It's misleading defense-in-depth that we can drop with
zero loss. The cookie-lifecycle invariant carries the whole load.

There is no Circles-SDK auth primitive to defer to — Circles doesn't ship
a SIWE module. The pattern above (random nonce → cookie → signed message
→ verify via `viem.verifyMessage` which supports EIP-1271) is the
standard for Safe-compatible auth.

## Decisions (answers to the AskUserQuestion round)

| # | Question                       | Answer                          |
|---|--------------------------------|---------------------------------|
| 1 | What's "process-local dedup"?  | Drop the in-memory `Set`.       |
| 2 | Signed-message format          | Keep human-readable multi-line. |
| 3 | Wizard flow                    | Collapse to single screen.      |

Plus the user's free-text asks:
- Domain from env var (not hard-coded `builder.circles.garage`).
- Reserved-handle list + Circles `profile.name` default prefill.
- Reproduce the EIP-55 checksum server-side via `viem.getAddress`.

## Changes

### 1. Address case (P0 bug)

`apps/web/lib/wallet.ts:67,113` lowercases the address before calling
`personal_sign`. Some wallets (notably Ledger via WC) reject non-checksum
addresses or mismatched casing.

**Fix:** pass the wallet's original-case address through to `personal_sign`
and into the signed message. On the server, normalise both sides to
checksum form via `viem.getAddress()` for comparison and storage. The
session cookie + DB row store the lowercase form (existing schema), but
verification uses checksum equality.

```ts
// wallet.ts
return {
  provider,
  address: getAddress(first) as `0x${string}`, // EIP-55, not lowercase
  chainId,
  kind: "injected",
};
```

```ts
// api/signup/route.ts — after parseSignedMessage
if (getAddress(parsed.address) !== getAddress(body.address)) {
  return bad(400, "message-binding");
}
// then for DB + cookie:
const lower = getAddress(body.address).toLowerCase();
```

### 2. Drop the in-memory replay set

Delete `consumedJtis`, `consumeJti`, and the `setJti(crypto.randomUUID())`
call. The nonce JWT itself is now a single-use credential by virtue of the
cookie being cleared on consumption.

`NonceClaims` becomes `{ nonce: string }`. `signNonce`/`verifyNonce` drop
the `jti` field.

The "anti-replay across server restarts" property is now: signature is
unusable as soon as `POST /api/signup` finishes, because the cookie is
gone. An attacker who captures the signature mid-flight has at most 5
minutes, and only until any legitimate completion clears the cookie.

### 3. Env-driven JWT audience + signed-message domain

- New env: `AUTH_AUDIENCE` (e.g. `builder.circles.garage` in prod).
- `auth.ts` reads it via `getAudience()` which throws if absent in prod
  and defaults to `"localhost"` in dev. Same pattern as
  `AUTH_SESSION_SECRET`.
- The signed-message `domain` field stays = `window.location.origin` on
  the client, matched against `req.headers.get("origin")` on the server.
  No change needed there; just no longer hard-coded in the JWT layer.

Add to `turbo.json` globalEnv: `"AUTH_AUDIENCE"`.

### 4. Reserved-handle list + Circles-name default

Add to `auth.ts` (or a new `apps/web/lib/handles.ts`):

```ts
export const RESERVED_HANDLES = new Set([
  "admin", "root", "api", "signup", "register", "login",
  "builders", "garage", "circles", "leaderboard", "dashboard",
  "settings", "support", "help", "about", "terms", "privacy",
  "www", "app", "mail", "static", "assets",
]);
```

In `/api/signup`, after `HANDLE_RE` passes:

```ts
if (RESERVED_HANDLES.has(handle)) return bad(400, "handle-reserved");
```

Default-prefill: already wired (`slugifyHandle(avatar.name)` in
`signup-client.tsx:83`). Make it more prominent: show the avatar name
verbatim on the Connect step ("welcome, **{name}**") and prefill the
handle field with a "reset to avatar name" affordance if the user clears
it. No new field — pure UX polish.

### 5. Collapse to single screen

`signup-client.tsx` is currently a 3-step wizard. Simpler version:

```
┌─────────────────────────────────────────┐
│  who's shipping?                        │
│  ─────────────                          │
│  [ connect wallet ] [ gnosis app ]      │  ← step (a)
│                                         │
│  ✓ connected as 0x4a82...f12            │  ← step (b), inline reveal
│    welcome, alice.eth                   │
│                                         │
│  handle:        [ alice         ]       │
│  reach:         (tg) fc  email          │
│  reach handle:  [ @alice        ]       │
│  submit under:  [ — skip —  ▼   ]       │
│                                         │
│  [✓] I read the rules ...               │
│                                         │
│           [ sign & create →  ]          │
└─────────────────────────────────────────┘
```

State machine:
- `idle`: only `<ConnectCircles>` shown, rest hidden.
- `connected`: form revealed below the connect block (which collapses
  into a compact "✓ connected as 0x…" row with a "disconnect" link).
- `submitting`: submit button → "signing…".
- `ok`: full-screen confetti-less "you're in" view (unchanged).

Drop: `Steps`, `step` state, `next`/`back`, the duplicated nav bars at
top + bottom, and the `signup.steps`/`signup.sections` content tree (or
keep it as labels for visual sections; don't drive flow with it).

### 6. Trim `parseSignedMessage`

It's a regex parser for a message we built ourselves. Replace with a
strict line-by-line splitter that's easier to read and less likely to
quietly accept malformed input:

```ts
const lines = message.split("\n");
if (lines[0] !== MESSAGE_HEADER) return null;
if (lines[1] !== "") return null;
const fields = Object.fromEntries(
  lines.slice(2).map((l) => {
    const i = l.indexOf(": ");
    return i < 0 ? ["", ""] : [l.slice(0, i), l.slice(i + 2)];
  }),
);
// then read fields.domain, fields.address, etc., with explicit checks
```

### 7. Drop the iat freshness check

With single-use nonce cookie + 5-min TTL, iat doesn't add anything. The
nonce JWT exp does the freshness work. Remove `MESSAGE_MAX_AGE_S` checks
and the `iat` field from the message. Removes one source of clock-skew
failures.

Keep `iat` as a benign field in the message text for human readability if
desired, but don't validate it.

### 8. Stop calling `makeSdk` twice

`ConnectCircles` builds an SDK to probe the avatar, then throws it away.
`signup-client.tsx:86` builds a second one for the org picker. Either:
- (a) Have `ConnectCircles` pass the SDK out via `onConnected({ wallet,
  avatar, sdk })`, OR
- (b) Defer SDK creation to `OrgPicker`'s mount (it's the only consumer
  in the simplified flow).

Pick (a) — one round of SDK construction, shared.

## Login paths — current and future

### What we ship today
Direct-EOA login: user connects a browser-extension wallet whose address is
itself a registered Circles avatar. Works for V1 users and the rare V2 user
who registered manually from an EOA. Does **not** work for the majority of
V2 users, whose Circles avatar is a Safe smart account managed by Metri
(`app.metri.xyz`).

### Path A — Safe-signer login (recommended next addition)

Metri does not support WalletConnect v2, so Metri users cannot sign messages
on our domain directly. But Circles avatars are Safes, and Safes have
signers — typically an EOA the user already controls. If we let the user
sign in with that EOA and discover the Safe(s) it signs for, we cover most
Circles V2 humans.

Flow:
1. User connects EOA via browser wallet (`connectInjected`, no WC).
2. Server calls Safe Tx Service to list owned Safes:
   `getSafesByOwner(eoaAddress)` via `@safe-global/api-kit`.
3. Server probes each Safe with `sdk.data.getAvatar(safe)`; keeps the ones
   where `info?.type` matches a human registration.
4. If 0 → "your EOA doesn't sign for any Circles avatar — add it as a
   signer in Metri first". If 1 → auto-select. If >1 → show a picker.
5. SIWE message includes `address: <eoa>` and `resources:
   ["urn:circles-avatar:<safe_address>"]`. EOA signs.
6. Server re-confirms EOA is still a signer of the Safe at submit time
   (one more `getSafesByOwner` call), then writes the row with
   `circles_addr=safe`, `submitter_addr=eoa`.

Code sketch:

```ts
import SafeApiKit from '@safe-global/api-kit';

const apiKit = new SafeApiKit({
  chainId: 100n,
  apiKey: process.env.SAFE_API_KEY,
});

const { safes } = await apiKit.getSafesByOwner(eoa);
const candidates: string[] = [];
for (const safe of safes) {
  const info = await sdk.data.getAvatar(safe as `0x${string}`);
  if (
    info?.type === 'CrcV2_RegisterHuman' ||
    info?.type === 'CrcV1_Signup'
  ) {
    candidates.push(safe);
  }
}
```

Cost: ~3 hours. New deps: `@safe-global/api-kit`. New env: `SAFE_API_KEY`
(free dev tier covers cycle 01 — 2 RPS, 5k/month).

Coverage gap: Metri-only users whose Safe is signed by a passkey *only*
(no EOA signer) cannot use this path either. The fix is a one-time
"add a browser wallet as an additional signer" step in Metri, which we
should document in the connect copy.

### Path B — Metri-passkey direct (blocked, track only)

What it would look like: user has a Metri passkey, taps "sign in with
Metri", produces a WebAuthn assertion, Safe's WebAuthn-signer module
generates an EIP-1271 signature we can verify with viem.

Why it doesn't work today: WebAuthn binds passkeys to a Relying Party ID
(the domain). Metri's passkeys are scoped to `metri.xyz`. A site at
`builder.circles.garage` cannot prompt for them.

What would unblock it: Metri ships **Related Origin Requests** — hosts a
`/.well-known/webauthn` on `metri.xyz` listing our origin as related.
Then browsers would let our site request a passkey assertion against
Metri's RP ID. This is a Metri-side change; we cannot do it unilaterally.

Until then: passkey-only Metri users have no signature path to our site.
They must add an EOA signer to their Safe (path A) or wait.

Refs:
- [Related Origin Requests — passkeys.dev](https://passkeys.dev/docs/advanced/related-origins/)
- [Safe Passkeys docs](https://docs.safe.global/advanced/passkeys/passkeys-safe)

## Out of scope (acknowledged, not done now)

- WalletConnect chain-switch retry UX (codex flagged untested switching).
  Cycle-01 traffic is low; if it bites we'll add a "still wrong chain"
  guard with a retry button.
- Redis-backed replay set. Single-use cookie is enough until/unless we
  see distributed-write abuse, which we won't on signup volume.
- Email-verified reach channel. We're shipping with self-declared reach
  values; verification would be a Phase 3.

## Done criteria

- `pnpm check` green.
- `/signup` is one screen.
- `/api/signup` requires `AUTH_AUDIENCE`, `AUTH_SESSION_SECRET`,
  `GNOSIS_RPC_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- A real wallet signature against checksum address verifies in dev.
- Reserved-handle rejection returns `409 handle-reserved` (or 400).
- No `consumedJtis` reference anywhere.
