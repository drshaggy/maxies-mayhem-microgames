# AGENTS.md

Instructions for anyone — human or AI agent — adding a microgame to this repo. Read this **before** writing code. The full API is in [SDK.md](SDK.md); this file is about building the *right* game correctly and not duplicating what exists.

## What you're building

One **microgame**: a single tiny challenge with a one-word command and ~4 seconds to clear it (WarioWare style). It's a self-contained ES module that default-exports `defineMicrogame({...})`. It runs inside [Maxie's Mayhem](https://drshaggy.vercel.app/maxies-mayhem/).

## Step 1 — don't build a duplicate

A new game must be a **mechanic that isn't already here**. Reskinning an existing mechanic with new art is a duplicate — it will be rejected. Here's the current roster and the exact mechanic each one owns:

| id | prompt | core mechanic | input | goal |
|------|--------|---------------------------------------------|-----------------|---------|
| fetch | FETCH! | tap one ball bouncing around the screen | tap a moving target | act |
| chomp | CHOMP! | clear a board of several stationary treats | tap many static | act |
| dodge | DODGE! | move to avoid falling junk | move (avoid) | survive |
| catch | CATCH! | slide a basket to catch falling items | move (collect) | act |
| wag | WAG! | mash to fill a meter before it drains | mash | act |
| stop | STOP! | tap when a sweeping marker is in the zone | timing (one tap) | act |
| jump | JUMP! | endless-runner: hop over obstacles | press to jump | survive |
| slice | SLICE! | swipe across tossed objects to slice them | drag/swipe | act |

**Before writing anything**, state which of these your idea is closest to and why yours is meaningfully different. If you can't, pick a different idea. Good untaken directions: **aim/launch** (set an angle/power and fire), **trace/draw** a path, **match/sort** items to targets, **memory/sequence** (repeat a flash), **balance** (keep something centred), **rhythm** (tap on the beat), **steer** along a track, **count/pick** the right one.

## Step 2 — build it correctly

- **Import the SDK from the bare specifier**: `import { defineMicrogame } from 'maxie-sdk';` — never a relative `../sdk.js` path. An import map resolves it both here and on the live site.
- **Stage is 256×192** (`g.w`, `g.h`). Draw in those coords; the engine upscales crisply.
- **One file**, kebab-case `id`, default export. Put it in the repo root.
- **`goal: 'act'`** → you must call `g.win()` before time runs out. **`goal: 'survive'`** → you win if time runs out without `g.lose()`.
- **Difficulty `1`/`2`/`3`** (`g.difficulty`): make `1` gentle and `3` frantic — but **always winnable at `3`**. Test both.
- **Trackpad-kind**: no targets that teleport or need a fast flick-and-click. Smooth-moving or stationary targets only. (This is why `chomp` was rebuilt — see its history.)
- **Self-contained**: no network, no external assets, no globals, no timers outside `update(dt)`. Everything comes from `g`. Use `g.rng`, never `Math.random`, so plays are seedable.
- **Don't draw** the prompt word or timer bar — the engine does. Don't clear the background — the engine fills it with your `palette`.
- **Maxie is optional**: `g.maxie(x,y,s,pose)` exists, but your game does **not** have to feature the dog.

## Step 3 — test it

```bash
npx serve .
```

Open `/dev/`, pick your game, and play it on **mouse, touch, and keyboard**, at **difficulty 1 and 3**. Confirm: the prompt reads in under a second, it's winnable at 3, and it's fair on a trackpad. A game that hasn't been played in the playground is not done.

## Step 4 — register + PR

1. Add your file in the repo root.
2. Register it in `index.js` (import it, add it to the `MICROGAMES` array).
3. Open a PR. `main` is protected — **merges happen only via PR**, never direct push.

### PR checklist
- [ ] Mechanic is distinct from every row in the table above (you said which and why).
- [ ] Imports `'maxie-sdk'` (not a relative path).
- [ ] Registered in `index.js`.
- [ ] Winnable at difficulty 1 **and** 3; fair on a trackpad.
- [ ] No network / assets / globals / `Math.random`.
- [ ] Played it in `/dev/` on pointer **and** keyboard.

## Conventions

- Keep modules small and readable; match the terse style of the existing games.
- `author` field: your GitHub handle.
- One game per PR.
