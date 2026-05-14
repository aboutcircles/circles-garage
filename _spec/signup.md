# /signup — what we ask, what we actually need

The landing promises *"sign up · handle · org · contact. 3 fields, no kyc"*.
The form delivers 7 required fields and duplicates `/register`. This doc
sets the v1 intake we'll actually open to builders.

## Target user (cycle 01)

- Already holds a Circles v2 avatar (or can create one before signing up).
- Crypto-native; comfortable connecting an injected wallet on Gnosis Chain.
- Possibly solo, possibly a 2–3 person crew. **Not** a fund or DAO.
- Showed up because of the €500/wk pool and the no-deck promise.
- Will only fill what loads fast and explains *why* before *what*.

We are **not** courting:
- Pre-Circles browsers — they bounce off `0x…` fields anyway.
- Established teams with a fund — wrong size.

## How they identify themselves: "Connect Circles", not SIWE-flavoured

Critical change from the wireframe: there is no `circles_addr` text input.
Instead, the user clicks **`connect circles →`**, which opens their
injected wallet on Gnosis Chain (MetaMask / Rabby / Coinbase Wallet).

Under the hood — using `@aboutcircles/sdk` ([docs](https://docs.aboutcircles.com/circles-sdk/getting-started-with-the-sdk.md)):

1. `runner.init()` → `eth_requestAccounts` returns the connected address.
2. `sdk.getAvatar(address)` → returns the on-chain avatar record.
   - **No avatar** → user isn't on Circles yet. Show a wall:
     *"You need a Circles avatar to join. Get one at app.gnosis.io
     → come back."* Link out. We do not enrol them.
   - **`CrcV2_RegisterHuman`** → green path. Continue.
   - **`CrcV2_RegisterGroup` / `CrcV2_RegisterOrganization`** → ask them
     to reconnect with their *personal* wallet ("garage is for builders,
     not orgs — connect the wallet you build from").
3. `avatar.profile.get()` returns the user's on-chain `name`. We
   pre-fill it as the default handle.
4. Optional: `sdk.rpc.group.getGroupMemberships(address, 10)` returns
   the groups they belong to. We render them as a dropdown so they can
   pick their submission org without typing a `0x…`.

Server-side proof of control (so nobody can POST another user's address):

5. Client requests a nonce from `/api/signup/nonce`.
6. Wallet signs a short EIP-191 message:
   `circles/garage cycle 01 · sign in as 0x… · nonce …`
7. Client POSTs `{address, signature, message, handle, reach, org_addr}`
   to `/api/signup`. Server `verifyMessage` against `address`, then
   inserts via the service role.
8. Server returns an httpOnly session cookie (signed JWT, `address`
   in claims). `/register` reads the cookie to gate the submit endpoint.

This replaces the "connect wallet" / "sign in w/ email link" buttons on
the right rail. The whole signup is one wallet prompt + one signature.

## What v1 collects

| Field | Source | Required | Why |
|---|---|---|---|
| `circles_v2_addr` | wallet connect | yes (implicit) | identity + prize payout |
| `handle` | profile.name (override-able) | yes | leaderboard row, dashboard greeting |
| `reach_channel` | segmented control `tg \| fc \| email` | yes | which channel we DM you on |
| `reach_handle` | typed | yes | the address/handle on that channel |
| `org_addr` | group-membership picker, "skip" if none | optional | submission ownership; can be set later in `/register` |
| consent | one checkbox | yes | rules + leaderboard publication |
| TG opt-in | one checkbox, on success screen | optional | adds them to builder TG |

**`reach` split rationale.** The current `reach text` column is one
freeform field with placeholder `"telegram / farcaster / email"`. A
senior reader (the user, during the spec review) hit it and asked
*"what goes in there?"* — if they hit it, real builders will too. The
fix is to make the channel explicit:

```
where can we reach you? *
[ tg | fc | email ]                  ← segmented control, default `tg`
┌────────────────────────────────┐
│ @your_tg                       │  ← placeholder swaps by channel
└────────────────────────────────┘
// we'll DM you with the wed call link + prize details
```

Storage: `reach_channel` (enum check constraint), `reach_handle` (text,
normalised — strip leading `@`, lowercase email). Both required.

**Dropped** (vs current form): `app_name`, `track`, `pitch`, `team[]`.
All live on the **submission**, not the **builder**.

**Not added** (and why):
- `note` textarea — invites noise, hard to act on, replaceable with a
  typed field later if a real need emerges. Confirmed in spec review.
- `tz` — `reach_*` captures contact context; the wed-call invite handles
  scheduling itself.
- email-confirm step — we have on-chain identity already, email
  confirmation adds friction without trust.

## DB schema changes

`apps/web/supabase/migrations/0004_signup_circles_auth.sql`:

```sql
-- builders: tighten to what we actually keep on a person, not on their app.
alter table public.builders
  drop column if exists app_name,
  drop column if exists track,
  drop column if exists pitch,
  drop column if exists team;

alter table public.builders
  alter column org_addr drop not null;

-- Replace the freeform `reach text` with an explicit channel + handle pair.
-- Table is empty in prod, so we can drop and replace without a backfill.
alter table public.builders
  drop column if exists reach,
  add column if not exists reach_channel text,
  add column if not exists reach_handle  text;

alter table public.builders
  add constraint builders_reach_channel_chk
    check (reach_channel in ('tg', 'fc', 'email'));

-- Audit trail for the SIWE-style signature we required to insert.
alter table public.builders
  add column if not exists signed_at  timestamptz,
  add column if not exists signature  text,
  add column if not exists nonce      text;

-- Treat the on-chain address as identity (case-insensitive). Handle is
-- display-only and must also be unique to keep the leaderboard sane.
create unique index if not exists builders_circles_addr_uniq
  on public.builders (lower(circles_addr));
create unique index if not exists builders_handle_uniq
  on public.builders (lower(handle));

-- Submissions: tie each to the submitter's CRC v2 address. No FK to
-- builders.id needed — the address is the identity.
alter table public.submissions
  add column if not exists submitter_addr text;

create index if not exists submissions_submitter_addr_idx
  on public.submissions (lower(submitter_addr));

-- Revoke the open-door insert policies. All writes now go through API
-- routes that verify a signature first.
drop policy if exists "anon insert builders"   on public.builders;
drop policy if exists "anon insert submissions" on public.submissions;
```

Note: the table is empty in prod, so the destructive `drop column` is
safe. Verify before running.

### Sequencing gotcha

The migration revokes `anon insert` on **both** `builders` and
`submissions`. The existing `apps/web/app/register/register-client.tsx`
writes submissions via the anon supabase-js client (line 150) and will
break the moment this migration lands. Two options for the implementing
agent:

1. **Split the migration.** Land `0004_signup_circles_auth.sql` (builder
   trim + builders policy revoke + signup endpoint) first; ship a
   second migration `0005_submissions_auth.sql` that revokes the
   submissions policy *only after* `/api/register` is verifying the
   session cookie from `/api/signup`.
2. **Bundle and switch both at once.** Land migration + `/api/signup` +
   `/api/register` in a single PR. Higher risk; only if both endpoints
   are ready together.

Default to option 1. `/register` is a separate spec doc anyway.

## Front-end changes

### Files to touch

- `apps/web/lib/content.ts` — trim `content.signup.sections`; rework
  copy to reflect "connect → review → submit" instead of "you / circle
  / app / review".
- `apps/web/app/signup/signup-client.tsx`:
  - Replace step 1 with a **`<ConnectCircles />`** component (new):
    button → `runner.init()` → `sdk.getAvatar()` → branch on result.
  - Drop state for `app_name / track / pitch / team`.
  - Replace `reach` (single field) state with `reach_channel` (default
    `"tg"`) + `reach_handle` (string). Render a segmented control for
    the channel; placeholder of the text input swaps by channel
    (`@your_tg` / `fc:you.eth` / `you@mail.com`).
  - Pre-fill `handle` from `avatar.profile.name`; allow override.
  - Replace `org_addr` text input with `<OrgPicker />` (new): a dropdown
    populated from `sdk.rpc.group.getGroupMemberships()` plus a "skip"
    option.
  - On submit: request nonce → wallet sign → POST `/api/signup`.
- `apps/web/app/signup/page.tsx` — update the "what you get" rail copy
  to match the connect-flow promise.
- `apps/web/app/api/signup/nonce/route.ts` (new) — issues a nonce
  (Redis-less for cycle 01: signed-cookie or in-memory map keyed by IP).
- `apps/web/app/api/signup/route.ts` (new) — verifies signature with
  `viem.verifyMessage`, validates handle uniqueness, writes via
  service-role client, sets session cookie.
- `apps/web/lib/circles.ts` (new) — wraps SDK init + avatar reads, so
  pages don't import viem directly.
- `apps/web/lib/auth.ts` (new) — session JWT helpers.

### New deps (gate on user approval per `CLAUDE.md`)

```
@aboutcircles/sdk
@aboutcircles/sdk-core
@aboutcircles/sdk-types
viem
jose                  # JWT for session cookie
```

`viem` is the only "heavy" one; everything else is tiny. No
`react-hook-form`, no `@radix-ui`, no `framer-motion`.

## Success criteria

A returning Circles user, on a desktop, scrolling from the landing:

1. Taps `sign up →`.
2. Clicks `connect circles` → wallet pops, they approve.
3. Their handle is pre-filled. The channel control is on `tg` by
   default; they type their TG handle, pick their org from the
   dropdown (or skip), tick the consent box.
4. Clicks `sign & create →` → one wallet signature prompt.
5. Lands on `/register` with a session cookie, ready to submit an app.

Total: 2 wallet prompts (connect, sign), ~1 control click + ~10 typed
characters.

If any of those break, the spec failed.

## Carry-forward decisions

1. **Mobile experience** — pages are responsive; the wallet flow
   degrades gracefully. See `_spec/responsive.md` for the full plan.
   In short: the form renders on phones via the `Grid` `collapseAt`
   prop, `connect circles` is attempted (it works inside MetaMask /
   Rabby in-app browsers), and falls back to an inline "no wallet
   detected" note after 1s on a phone without an injected provider.
   WalletConnect is out for cycle 01.
2. **Sybil after auth.** Signature + Circles-avatar requirement is
   the floor. If we see abuse, add a "must have ≥ N trust connections"
   gate using `sdk.rpc.trust.getTrustRelations()`.
3. **Submission ↔ builder** — single submitter for cycle 01. If we
   want true co-builder edit rights later, add a `submission_signers`
   table; don't bake that into v1.
4. **Handle collisions** — `/api/signup` returns `409` with a clear
   message; the form should also pre-check via `/api/handles/check`
   on blur (nice-to-have, defer).

## What this spec does NOT cover

- The submission flow on `/register` (deserves its own spec doc).
- Cycle/snapshot logic (already encoded in `lib/cycle.ts`).
- Payout pipeline (xDAI batch send) — out of scope until cycle 01 closes.
- Admin tooling (verify avatars, run snapshots, send payouts).
