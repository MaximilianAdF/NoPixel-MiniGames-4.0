# Async Ghost Mode — Spec

**Status:** Draft
**Goal:** Make 1v1 never empty. Let a solo player race a *recorded run* of an
absent opponent — same seed, their inputs replayed as a "ghost" — and try to
beat their time. Solves the cold-start / liquidity problem: there is always
something to play, even with one person online.

**Disclosure principle:** a ghost is always labelled as a recorded run of a
real named player ("Beat manzuul's run · 26.3s"). It is never presented as a
live opponent. This is the honest version of "always-on opponents" — a
feature, not a deception. (This is the line that makes it acceptable where the
"fake bot lobbies" idea was not.)

---

## 1. What already exists (verified in the tree)

| Building block | File | Notes |
|---|---|---|
| Deterministic board | `lib/lobby/seededRandom.ts` | Mulberry32. Same `seed` → identical board everywhere. `generateMatchSeed()` for new runs. |
| Engine contract | `app/game/types.ts` | `GameEngine.init(config, rng)` + `applyInput(state, input)`. Pure, no React/timers. `GameResult { won, score, elapsedMs }`. |
| State-replay hook | `app/utils/useReplayedState.ts` | Replays `(engine, config, seed, inputs[])` by applying inputs in order → reconstructs state. **Not time-based** (see §2). |
| Live input message | `lib/lobby/messages.ts` → `MatchInputMessage` | `{ type:'match:input', input: unknown }`. Opaque per-game engine input. **No timestamp.** |
| Split-screen player/spectator | `app/lobby/[code]/MatchView.tsx` | Local board + opponent board fed by `opponentInputs[]`. |
| Outcome / opponent summary | `OutcomeView` (LobbyClient), `app/lobby/OpponentSummary.tsx` | Reusable end screens. |
| Persistence pattern | `lib/lobby/recentMatches.ts`, `stats.ts` | `client.db('nopixel')`, lazy `getCollection()` + index, TTL via `expiresAt`. Mirror this. |

The manzuul vs Guest#73631F session (2026-05-29, ~18 live matches) ran through
exactly this machinery, so the live path is proven.

---

## 2. The one real correction (this is the actual work)

The existing spectator replay is **state-based, not time-based.** In a live
match, the opponent's board advances because `match:input` messages *arrive
over the network* at the cadence the opponent played — the timing is implicit
in network arrival. `useReplayedState` just folds inputs into state; it has no
concept of "when" each input happened.

A stored ghost has no network feeding it. If we hand its full `inputs[]` to
`useReplayedState`, it computes the **final** state instantly — the ghost would
"teleport" to done. To make a ghost *race in real time* we must:

1. **Capture timing at record time.** Each recorded input needs a `t` = ms
   since match start. (Today inputs carry no timestamp — this is new.)
2. **Schedule playback.** A small driver releases ghost inputs into the
   spectator board as wall-clock time passes `t`, reproducing the original
   cadence. `useReplayedState` then renders the progressively-growing input
   slice exactly as it does live.

So ghost input type is `RecordedInput = { t: number; input: unknown }`, and we
add a `useGhostPlayback(recorded, startedAt)` hook that returns the
`inputs[]` slice whose `t <= now - startedAt`. Everything downstream
(`useReplayedState`, `MatchView` spectator) is unchanged.

This also means **recording must stamp `t` on every local input** during a
match (and during solo recording). We add a capture ref in the match client
that pushes `{ t: now - matchStartTime, input }` whenever the local player
emits an input.

---

## 3. User flow (v1)

1. Player on `/lobby` with no opponent → sees **"Race a ghost"** with a list of
   available ghosts per game ("manzuul · 26.3s · Thermite", fastest/newest).
2. Pick a ghost (or "fastest" / "random"). A ghost carries its own `seed`.
3. Reuse the 3-2-1 countdown, then the existing split-screen: live board left,
   ghost replaying right (via `useGhostPlayback`).
4. Finish → outcome vs the ghost's recorded `result`: did you finish faster /
   at all? Reuse `OutcomeView` + `OpponentSummary`.
5. CTA: **"Race another"** (rotate ghost) and, on a good run, **"Save your run"**
   → your run becomes a raceable ghost (flywheel: each visitor seeds content
   for the next).

No second Ably presence is required for a ghost race — it's single-player vs a
fixed recording. (Bonus: ghost races keep working even if realtime/Ably is
degraded, unlike live 1v1.)

---

## 4. Data model — new `ghosts` collection

```ts
interface GhostDoc {
  _id: ObjectId;
  game: GameType;
  seed: number;
  config: unknown;                 // engine config used (per-game; e.g. levels)
  inputs: RecordedInput[];         // [{ t, input }]  ← timed, see §2
  result: { won: boolean; score: number; elapsedMs: number };
  recorderName: string;            // displayName at record time (for label)
  recorderDiscordId?: string;
  recorderAvatarHash?: string;
  recorderClientId: string;        // self-ghost filter / dedup
  source: 'match' | 'solo';
  createdAt: Date;
  expiresAt: Date;                 // TTL (e.g. 30d)
  timesRaced: number;
  timesBeaten: number;
}
```

Indexes: `{expiresAt:1}` TTL; `{game:1,'result.elapsedMs':1}` (fastest);
`{game:1,createdAt:-1}` (newest).

`lib/lobby/ghosts.ts` mirrors `recentMatches.ts`:
`recordGhost`, `listGhosts(game,{sort,limit})` (summary only — **never ship
`inputs` in the list**), `getGhost(id)` (full, incl. inputs),
`incrementGhostRaced(id, beaten)`.

---

## 5. API — `/api/lobby/ghosts` (mirror recent-matches route)

- `GET ?game=&sort=fast|new&limit=` → summaries (no `inputs`).
- `GET /[id]` → full ghost incl. `inputs` (only when a race starts).
- `POST` → record a run. Validated + IP rate-limited (`checkRateLimit`).
- `POST /[id]/raced` (optional, fire-and-forget) → bump counters.

Not auth-gated (players can be guests), consistent with the rest of 1v1.

---

## 6. Where ghosts come from — DECIDED

The model: **passive harvest of 1v1 winners, disclosed + opt-out. Explicit
"save run" for solo, later. Never silent harvesting of the solo `/puzzles`
flow.** Rationale: a pool that depends on people clicking "save" stays empty at
this traffic level (opt-in ≈ near-zero content), and an empty ghost pool
defeats the entire purpose. Passive is the only model that reliably solves
cold-start — but it's scoped so consent isn't a problem:

**6a. Passive harvest from 1v1 matches (primary, v1).**
- On match completion, the host persists the **winner's** timed input stream as
  a ghost (in the same per-seed, deduped effect that already writes
  `recentMatches`/`lobbyStats`). Requires the capture ref from §2.
- **Winners only** (and only genuine wins, not timeouts/forfeits) — a pool of
  losing runs is useless to race. Quality filter + smaller pool in one rule.
- **Why this is consensual:** entering a 1v1 match is already opting into a
  competitive, named, you-vs-someone context. The ghost reuses the **same
  display name** that was already visible to the opponent in that match — no
  new exposure. Contrast with the solo `/puzzles` flow, which is casual
  practice; harvesting *that* silently would be the violation, so we don't.
- **Disclosure + opt-out (required):** a one-line notice in the 1v1 area
  ("Winning runs may become ghosts others can race") + a user setting to opt
  out. Default-on (keeps the pool full; almost nobody opts out) but honest and
  reversible. This is the line that separates this from the rejected
  "fake bot lobbies" idea.
- → Every real match seeds the pool for free. The 107 matches played so far
  would already be ~100 ghosts.

**6b. Explicit "save this run" for SOLO (later, Phase 3).**
The consensual way to let the high-traffic practice games contribute without
silent harvesting: after a solo run, an opt-in "save as ghost" button. The
solo player chooses. Passive for 1v1 (fills the pool), explicit for solo
(protects the golden path). Never automatic on solo.

**6c. Manual backfill (launch only).** Record a few good runs per game before
Phase 2 launches so the picker isn't empty on day one (esp. chopping +
word-memory, the two most-played).

NEVER: silently turn casual `/puzzles` solo plays into ghosts. That's the
consent line.

---

## 7. Integrity (pragmatic v1 — match existing 1v1 threat model)

Validation + clamp + rate-limit + TTL; no money at stake.
- POST validation: `game` allowlisted; `inputs` array, length ≤ ~5000, each
  `{ t: finite ≥ 0, input: defined }`; `result` finite, `elapsedMs ≤
  MATCH_MAX_MS`.
- Cheap sanity: reject empty inputs with `won:true`, or `elapsedMs`
  implausibly low for input count.
- Self-ghost filter by `recorderClientId`.
- **Deferred:** server-side deterministic replay verification (re-run
  `engine` on `(seed, config, inputs)` and confirm it yields `result`). This is
  the strong guarantee and is *very feasible* because engines are pure — but
  it's real work; defer past v1. Same accepted risk as `recentMatches` today.

---

## 8. Out of scope for v1
- Glicko-2 / ranked ladder (parked `matches` had rating fields; no math in
  current tree). v1 ranks ghosts by raw time only.
- Server-side replay verification (§7).
- Discord "you were beaten" re-engagement (strong fast-follow, not v1).

---

## 9. Telemetry — extend `lib/lobby/stats.ts`
Add `ghostsRecorded`, `ghostRacesStarted`, `ghostRacesWon` (+ per-game via
existing `byGame`). Surface through existing `GET /api/lobby/stats`. Keeps the
GA4-independent source of truth.

---

## 10. Build phases

**Phase 1 — Capture & store (no user-facing race UI):**
`lib/lobby/ghosts.ts` + collection/indexes; `POST /api/lobby/ghosts`; timed
input capture ref in `LobbyClient`; host writes the **winner's** ghost on
completion (§6a); add the disclosure line + opt-out setting. Verify real
matches populate `ghosts`. Low-risk — does not touch the solo `/puzzles` flow.

**Phase 2 — Race:**
`useGhostPlayback` scheduler (§2); solo ghost-race flow feeding `MatchView`
spectator from a stored timed stream; outcome vs ghost; ghost picker UI on
`/lobby`; "Race another". Per-player "already raced" hiding — see §12.
Recommended internal order: (1) determinism harness — replay a real captured
ghost through its engine, assert it reaches the stored `result`, per game;
(2) `useGhostPlayback` + a dev page racing one ghost; (3) solo race flow +
outcome; (4) picker + "race another" + counters. Ship **Chopping-first**
(most-played, fast/continuous → best ghost feel), then fan out.

**Phase 3 — Flywheel & polish:**
"Save your run" CTA; `timesRaced/Beaten` social proof; ghost telemetry; solo
recording mode (6b).

**Later (separate specs):** Glicko ladder; Discord notifications; server-side
replay verification.

---

## 11. Decisions
1. **Winner-only.** Only the winning player's run is harvested. The **winner
   records their own ghost** (their client has accurately-timed inputs; the
   host would only have the opponent's network-jittered stream). Resolved.
2. **Completed + sane move count.** Harvest only when `result.won === true`
   AND `outcome.reason === 'finished'` (not timeout/forfeit) AND
   `MIN_GHOST_INPUTS ≤ inputs.length ≤ MAX_GHOST_INPUTS`. v1 uses a global
   floor (`MIN_GHOST_INPUTS = 2`, `MAX = 5000`); per-game tuning is a Phase-3
   refinement once we can inspect real harvested ghosts. Resolved.
3. **TTL: 30 days.** Resolved.
4. **Config:** not stored in the doc — the per-game `Spectator` components
   rebuild their default config for replay (match mode always uses defaults).
   Revisit if/when matches support custom configs.
5. **Ghost lifecycle: per-player hiding (Option B).** A ghost is never
   consumed/deleted on race; it stays in the pool for everyone, but an
   individual stops being *offered* a ghost once they've raced it. Reuse for
   the pool (liquidity) + novelty for the individual (engagement). Full design
   in §12. Resolved.
6. Backfill a few seed ghosts per game before Phase 2 launch — open.

---

## 12. Ghost lifecycle — per-player hiding (Option B)

**Principle:** ghosts are reusable content, not a consumable. **Never delete a
ghost on race** — the 30-day TTL (§11.3) is the only retirement mechanism. But
each player should get a *fresh* opponent each time, so we hide ghosts a player
has already raced *from that player only*. (Rejected: "drop globally after one
race" — that drains the pool as fast as people play and re-creates the empty-
lobby problem; the whole point is liquidity.)

**Tracking "have I raced this ghost?" — split by identity:**
- **Logged-in users:** server-side. A lightweight `ghostRaces` record keyed by
  `userId` holding the set of raced ghost IDs (or a small per-user array).
  Durable, cross-device.
- **Guests** (the majority — most matches are `Guest#…`): `localStorage` list
  of raced ghost IDs, filtered client-side. Device-bound and clears with cache,
  which is acceptable — guests are inherently device-bound anyway.

**Where the filter applies:** extend the existing `GET /api/lobby/ghosts`
`exclude` mechanism. Today it excludes the caller's *own* recorder id; add an
`excludeRaced` set (logged-in: resolved server-side from `ghostRaces`; guest:
sent from `localStorage`). The picker only shows ghosts the player hasn't faced.

**Marking a race:** when a race *starts* (or completes), record the ghost id
against the player — server-side for logged-in (`ghostRaces`), `localStorage`
for guests. Mark on start (not just win) so quitting mid-race doesn't resurface
the same ghost immediately.

**Critical fallback — never dead-end.** A heavy player will eventually exhaust
the unraced pool for a game. When `excludeRaced` would leave zero ghosts, the
picker must **fall back to re-showing already-raced ghosts** (e.g. fastest, or
"rematch your closest loss") rather than showing an empty list. Novelty-first,
but never empty. This fallback is mandatory, not optional — without it, the
mode silently breaks for the most engaged users.

**Ordering within the unraced set:** prefer variety — surface less-raced
ghosts (`timesRaced` asc) and/or fastest, with a "random" option. `timesRaced`/
`timesBeaten` also power social proof ("beaten 8 of 23 times").

**Guest→login migration (minor, defer):** a guest who later logs in loses their
`localStorage` raced-history (it won't merge into `ghostRaces`). Acceptable —
worst case they see a few already-raced ghosts again. Not worth solving in v1.
