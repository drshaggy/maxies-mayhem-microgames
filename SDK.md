# Maxie's Mayhem — Microgame SDK

Make a microgame, open a PR, and (once merged + pulled in) it goes into the rotation at **[drshaggy.vercel.app/maxies-mayhem](https://drshaggy.vercel.app/maxies-mayhem/)**. A microgame is one tiny challenge with **a one-word command and ~4 seconds** to clear it — WarioWare style.

## The shape of a microgame

Create `your-game.js` in the repo root:

```js
import { defineMicrogame } from 'maxie-sdk';

export default defineMicrogame({
  id: 'your-game',          // unique, kebab-case
  name: 'Your Game',
  prompt: 'DO IT!',         // the command shown to the player (keep it 1 word-ish)
  author: 'your-name',
  goal: 'act',              // 'act' = player must call g.win() before time; 'survive' = win if time runs out
  time: 4000,               // base milliseconds at difficulty 1 (engine speeds it up at higher levels)
  palette: '#1b1430',       // background colour

  build(g) {
    // build() runs once per play. Set up state here, return an instance.
    let x = g.w / 2;
    return {
      update(dt) {           // called every frame; dt = seconds since last frame. Do logic AND draw here.
        if (g.held.left) x -= 100 * dt;
        if (g.held.right) x += 100 * dt;
        if (g.tapped) g.win();          // tapped this frame? you win
        g.circle(x, g.h / 2, 12, '#d4ff3f');
      },
      teardown() {},          // optional, called when the microgame ends
    };
  },
});
```

> **Import note:** import the SDK from the bare specifier `'maxie-sdk'` — *not* a relative path. The host site (and the local dev harness) resolve it via an import map, so your file works unchanged whether it's run here or in the game.

Then register it in `index.js`:

```js
import yourGame from './your-game.js';
export const MICROGAMES = [ /* …existing…, */ yourGame ];
```

Open a PR with those two changes. That's it.

## Test it locally

```bash
npx serve .
```

Open the printed URL at **`/dev/`** — a playground that lists every registered game and lets you actually play yours (mouse, touch, and keyboard all wired). Confirm it's winnable at difficulty 1 *and* 3 before you PR.

## The game context `g`

Everything you need is on `g`. The stage is a fixed **256 × 192** virtual canvas (`g.w`, `g.h`); the engine upscales it crisply, so just draw in those coordinates.

**Lifecycle**
- `g.win()` — clear the microgame (call it the moment the player succeeds).
- `g.lose()` — fail it. For `goal: 'survive'` games, *not* losing before time runs out is a win.
- `g.timeLeft` — `1 → 0` fraction of time remaining.
- `g.difficulty` — `1`, `2`, or `3`. Make it harder as this rises (more/faster stuff).

**Input** (works for touch, mouse, and keyboard)
- `g.pointer` — `{ x, y, down }` in stage coords.
- `g.tapped` — `true` on the frame a tap/click/Space happens.
- `g.held` — `{ left, right, up, down, action }` booleans (arrows/WASD; `action` = Space/Enter or pointer held).
- `g.pressed` — same keys, but only `true` on the frame they were pressed.

**Randomness** — `g.rng()` `[0,1)`, plus `g.rng.range(lo,hi)`, `g.rng.int(lo,hi)`, `g.rng.pick(arr)`, `g.rng.chance(p)`. Use these instead of `Math.random` so plays are fair/seedable.

**Drawing** — `g.clear(color)`, `g.rect(x,y,w,h,color)`, `g.rrect(x,y,w,h,r,color)`, `g.circle(x,y,r,color)`, `g.line(x1,y1,x2,y2,color,width)`, `g.poly([[x,y]…],color)`, `g.text(str,x,y,{color,size,align,shadow})`, and `g.ctx` for raw canvas. The engine clears the background to your `palette` each frame, then draws the command word and timer bar over your game — you don't handle those.

**Maxie** — `g.maxie(x, y, s, pose)` draws the star at head-centre `(x,y)`, head radius `s`, with `pose` one of `idle | happy | sad | wow | boss`. (Optional — your game doesn't have to feature Maxie.)

## Rules of thumb

- One clear idea the player gets in **under a second** (the prompt is all the instruction they get).
- Make difficulty `1` gentle and `3` frantic — but *always winnable*, even at `3`.
- Be kind on a **trackpad**: avoid targets that teleport or demand fast flick-and-click. Smooth-moving or stationary targets play fairly with any pointer.
- Keep it self-contained — no network, no external assets, no globals. Just `g`.
