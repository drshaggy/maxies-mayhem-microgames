// ============================================================================
// Maxie's Mayhem — Microgame SDK
// Author a microgame by default-exporting defineMicrogame({...}). The engine
// calls build(g) once per play and drives the returned instance. See SDK.md.
// ============================================================================
import { drawMaxie } from './maxie.js';

export const VW = 256;   // virtual stage width  (everything is drawn in these
export const VH = 192;   // virtual stage height  coords; engine upscales crisp)

export function defineMicrogame(def) {
  if (!def || !def.id) throw new Error('microgame needs an id');
  return {
    goal: 'act',          // 'act' = must call g.win() before time runs out
    time: 4000,           // base time in ms at difficulty 1 (engine speeds it up)
    author: 'anon',
    palette: '#1b1430',   // background colour for this microgame
    ...def,
  };
}

// A small drawing toolkit handed to microgames as part of `g`.
export function makePainter(ctx) {
  const f = (size, weight = 700) =>
    `${weight} ${size}px "Press Start 2P", ui-monospace, monospace`;
  return {
    ctx,
    clear(color) { ctx.fillStyle = color; ctx.fillRect(0, 0, VW, VH); },
    rect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); },
    rrect(x, y, w, h, r, color) {
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
    },
    circle(x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); },
    line(x1, y1, x2, y2, color, w = 2) {
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    },
    poly(pts, color) {
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fill();
    },
    text(str, x, y, { color = '#fff', size = 10, align = 'center', baseline = 'middle', weight = 700, shadow } = {}) {
      ctx.font = f(size, weight); ctx.textAlign = align; ctx.textBaseline = baseline;
      if (shadow) { ctx.fillStyle = shadow; ctx.fillText(str, x + 1, y + 1); }
      ctx.fillStyle = color; ctx.fillText(str, x, y);
    },
    // draw Maxie at head-centre (x,y); s = head radius; pose: idle|happy|sad|wow|boss
    maxie(x, y, s, pose) { drawMaxie(ctx, x, y, s, pose); },
  };
}

// deterministic RNG so a given microgame plays fair (seedable for replays)
export function seededRng(seed = (Math.random() * 1e9) | 0) {
  let a = seed >>> 0;
  const rng = () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; };
  rng.range = (lo, hi) => lo + rng() * (hi - lo);
  rng.int = (lo, hi) => Math.floor(rng.range(lo, hi + 1));
  rng.pick = (arr) => arr[Math.floor(rng() * arr.length)];
  rng.chance = (p) => rng() < p;
  return rng;
}

export { drawMaxie };
