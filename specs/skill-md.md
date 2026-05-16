# SKILL.md Spec

## Problem

Circles is launching a 6-week builder program (circles/garage) where devs
ship mini-apps and get judged weekly. Builders are increasingly using AI
coding agents (Claude Code, Codex CLI, etc.) and need a single URL they
can paste into one prompt to bootstrap the agent with: what the program
is, where to submit, how to scaffold a mini-app, and where the official
docs live.

CLAUDE.md serves agents *working inside this repo*. There's no equivalent
for agents *helping a builder ship a Circles mini-app from scratch*. The
Tempo SKILL.md pattern (`claude -p "Read <URL> and set up X"`) is the
target.

## Success Criteria

A builder can paste this one-liner into a fresh agent session and the
agent has enough context to scaffold a working mini-app and explain how
to submit it:

```
claude -p "Read https://garage.aboutcircles.com/SKILL.md and help me ship a Circles mini-app"
```

Concretely, after reading SKILL.md the agent must be able to:

1. Explain what circles/garage is (one paragraph, accurate).
2. Tell the builder to clone `aboutcircles/circles-org-miniapp` as the
   starter template, and run it.
3. Point at `docs.aboutcircles.com` for SDK / primitive docs.
4. Walk the builder to `garage.aboutcircles.com/signup` and
   `/register` for submission.
5. Surface the builder telegram thread when the builder gets stuck.
6. Defer to `garage.aboutcircles.com/rules` for judging criteria and
   anti-patterns — without restating them.

Rebuildability test: an agent given **only** SKILL.md (no repo access,
no CLAUDE.md, no prior chat) should be able to do all six above.

## Scope

### In Scope

- One markdown file at `apps/web/public/SKILL.md`, served as
  `https://garage.aboutcircles.com/SKILL.md`.
- Plain agent-readable prose. Normal capitalization, normal punctuation,
  no monospace cypherpunk styling (that's for the UI, not the doc).
- Sections covering: what circles/garage is, how to scaffold a mini-app
  (template repo + run command), how to submit, where the docs live,
  where to ask for help (telegram).
- Cycle-agnostic content. Nothing that goes stale between cycles 01 and
  06. No specific dates, no current-cycle number, no current pool size.
- Length: whatever the content needs. Don't pad, don't crunch.

### Out of Scope

- **Cycle-specific data** (current cycle number, snapshot date, current
  prize pool, leaderboard) — those live in `apps/web/lib/content.ts`
  and on the site. Including them in SKILL.md guarantees drift.
- **Judging criteria text** — already maintained at
  `garage.aboutcircles.com/rules` and in `content.ts:judging`. SKILL.md
  links there. Duplicating invites drift.
- **Anti-patterns list** ("don't bolt CRC on", etc.) — same reason. Live
  next to judging criteria on /rules.
- **Build-time generation from content.ts** — explicitly skipped. The
  file is hand-edited because nothing in it should track per-cycle state.
- **Marketing copy** — landing page handles that.
- **Repo-internal conventions** (RSC rules, kit imports, Tailwind) —
  that's CLAUDE.md's job. SKILL.md is for agents helping someone build a
  Circles mini-app *somewhere else*, not contribute to this repo.
- **A `/SKILL.md` repo-root copy** — single source of truth at
  `apps/web/public/SKILL.md`. No symlink, no duplicate.

## Constraints

### Must Follow

- File path: `apps/web/public/SKILL.md`. Next.js serves
  `public/` at the site root, so this resolves to
  `https://garage.aboutcircles.com/SKILL.md`.
- All outbound URLs must already exist in the codebase. Verified set
  (from `packages/ui/src/components/kit/BrandBar.tsx:3-7` and
  `apps/web/lib/content.ts`):
  - `https://aboutcircles.com`
  - `https://docs.aboutcircles.com`
  - `https://t.me/about_circles/499` (builder telegram thread)
  - `https://garage.aboutcircles.com` (this site)
  - `https://garage.aboutcircles.com/signup`
  - `https://garage.aboutcircles.com/register`
  - `https://garage.aboutcircles.com/rules`
  - `https://github.com/aboutcircles/circles-org-miniapp` (starter
    template, provided by user)
- Tone: plain, declarative, optimized for LLM parsing. No emoji, no
  ASCII art, no lowercase-only stylization. Sentences, not fragments.
- Structure: H1 title, H2 sections. Standard CommonMark. Code fences for
  shell commands. No HTML, no frontmatter.
- The doc opens with a one-paragraph TL;DR an agent can quote back to
  the builder verbatim.
- Office hours are referenced as "TBD" until `content.ts:landing.bulletin`
  has a real link — do NOT invent a calendar URL.

### Must Avoid

- Do NOT include any date, cycle number, or pool amount. Even "currently
  cycle 01" — once cycle 02 starts, that's wrong.
- Do NOT reference "Metri" or any host name. The user confirmed Metri
  doesn't exist as a product the doc should link to. Mini-apps in this
  program just need a live URL; the doc must stay host-agnostic.
- Do NOT restate judging criteria. Link to `/rules` and stop.
- Do NOT add a repo-root `SKILL.md`. Single canonical path.
- Do NOT add cypherpunk styling (lowercase, monospace flavor, `// kicker`
  comments). That voice belongs to the UI; the doc is for agents.
- Do NOT add a `"use client"` consumer or build-step that reads this
  file from the Next.js app. It's a static asset served from `public/`.
- Do NOT generate this file from `content.ts`. The whole point of the
  split is that SKILL.md is hand-edited and cycle-agnostic.

## Technical Approach

Drop a single markdown file in `apps/web/public/`. Next.js App Router
serves `public/*` verbatim at the site root with no route file needed.

Recommended section outline (the writer of the file makes final calls
on phrasing):

1. **circles/garage** — one paragraph: what the program is, format
   (6-week builder program, weekly snapshot, top 3 paid in CRC),
   without specific numbers or dates. End with: "Current cycle details
   live at https://garage.aboutcircles.com."
2. **Build a mini-app** — `git clone https://github.com/aboutcircles/circles-org-miniapp`
   and follow that repo's README for install/run. SKILL.md must NOT
   restate install commands — the template README is the source of
   truth and may evolve. Mention that a mini-app just needs to use
   Circles primitives and ship at a public URL; format (pure webapp vs.
   contracts + UI) is open.
3. **The Circles SDK and docs** — `docs.aboutcircles.com` is the source
   of truth for primitives, SDK install, and protocol concepts. Do not
   inline SDK examples — they go stale.
4. **Submit** — direct the builder to
   `https://garage.aboutcircles.com/signup` (builder profile) then
   `https://garage.aboutcircles.com/register` (per mini-app
   submission: name, pitch, live link, repo, readme).
5. **Judging** — one line: "Judging criteria and anti-patterns live at
   https://garage.aboutcircles.com/rules."
6. **Help** — builder telegram thread
   `https://t.me/about_circles/499`. Office hours: TBD (do not link).

### Key Files

- `apps/web/public/SKILL.md` — the new file. Create.
- `apps/web/lib/content.ts:227-240` — reference for the canonical
  telegram URL and bulletin shape. Don't duplicate the content; copy
  only the URL.
- `packages/ui/src/components/kit/BrandBar.tsx:3-7` — verified canonical
  outbound link set. Use exactly these URLs.
- `apps/web/app/rules/page.tsx` — exists. Linked from SKILL.md but not
  modified.

### Existing Code to Leverage

- `BrandBar.tsx` link array is the source of truth for outbound links.
  If a URL isn't there or in `content.ts`, it doesn't exist.
- `public/` is already wired (`favicon.svg`, `brand/`). No Next.js
  configuration needed for the new file.

## Edge Cases

- **An agent reads SKILL.md but the builder hasn't signed up yet** —
  SKILL.md must self-contain the signup URL. Do not assume prior state.
- **The starter template repo is renamed or moved** — that's a future
  problem. Document the current URL; if it moves, update SKILL.md.
- **Builder asks the agent for judging criteria** — agent must be able
  to redirect to `/rules` without inventing criteria. The "Judging"
  section in SKILL.md must make this redirect path explicit.
- **Builder asks "what cycle are we in?"** — agent should direct them
  to `https://garage.aboutcircles.com` (the site shows current cycle).
  SKILL.md must NOT answer this itself.
- **Builder pastes SKILL.md into a non-Claude agent** (Codex, Cursor) —
  the prose-not-monospace tone choice supports this. No
  Claude-Code-specific assumptions in the body.
- **content.ts gets a real office-hours link later** — at that point,
  update SKILL.md to surface it. Not a v1 blocker.

## Failed Approaches

None yet. One pattern that was considered and rejected during the
interview: generating SKILL.md at build time from `content.ts`. Rejected
because SKILL.md must be cycle-agnostic on purpose — coupling it to the
data source defeats the split.

## Resolved Decisions

- **Starter repo README**: assume `aboutcircles/circles-org-miniapp`
  ships a current README before devs start using SKILL.md. SKILL.md
  defers to it (`git clone … && cd … && follow the README`). No fallback
  install commands inlined — they'd drift the moment the template
  changes.
- **Leaderboard URL**: not included. The site nav surfaces it; the doc
  stays focused on building and submitting.

## Open Questions

- Stretch: should we publish a parallel `AGENTS.md` (the convention some
  agents prefer) that just `<meta http-equiv="refresh">`-style points to
  SKILL.md? Not v1.
