import { defineMicrogame } from 'maxie-sdk';

// REPEAT! — Maxie flashes a sequence of paw-pads; tap them back in the same order.
// Memory game: the first ~45% of the clock plays the sequence (input ignored),
// the rest is yours to repeat it. Phases are driven off g.timeLeft (a fraction),
// so they scale correctly however fast the engine runs the clock.
export default defineMicrogame({
  id: 'repeat', name: 'Repeat', prompt: 'REPEAT!', author: 'drshaggy',
  goal: 'act', time: 5000, palette: '#161226',
  build(g) {
    const PLAYBACK = 0.45;                      // fraction of the clock spent showing
    const len = 2 + g.difficulty;               // 3 / 4 / 5 steps
    const seq = Array.from({ length: len }, () => g.rng.int(0, 3));

    const P = 54, GAP = 12, cx = g.w / 2, cy = g.h / 2 + 8;
    const pads = [
      { x: cx - GAP / 2 - P, y: cy - GAP / 2 - P, dim: '#5a2730', lit: '#ff5b6e' },
      { x: cx + GAP / 2,     y: cy - GAP / 2 - P, dim: '#1f4452', lit: '#49dcff' },
      { x: cx - GAP / 2 - P, y: cy + GAP / 2,     dim: '#22503a', lit: '#62f59a' },
      { x: cx + GAP / 2,     y: cy + GAP / 2,     dim: '#5a4a18', lit: '#ffd23f' },
    ];
    const padAt = (px, py) => pads.findIndex(p => px >= p.x && px <= p.x + P && py >= p.y && py <= p.y + P);

    let idx = 0, done = false;
    return {
      update() {
        const playing = g.timeLeft > 1 - PLAYBACK;
        let showLit = -1;

        if (playing) {
          // walk the playback window: each step lit for the first 68% of its slot
          const prog = (1 - g.timeLeft) / PLAYBACK;     // 0 → 1 across the show
          const step = Math.min(len - 1, Math.floor(prog * len));
          const sub = prog * len - step;
          if (sub < 0.68) showLit = seq[step];
        } else if (!done && g.tapped) {
          const hit = padAt(g.pointer.x, g.pointer.y);
          if (hit >= 0) {
            if (hit === seq[idx]) { if (++idx >= len) { done = true; g.win(); } }
            else { done = true; g.lose(); }
          }
        }

        // light the pad the player is currently pressing, as input feedback
        if (!playing && !done && g.pointer.down) {
          const h = padAt(g.pointer.x, g.pointer.y);
          if (h >= 0) showLit = h;
        }

        pads.forEach((p, i) => {
          g.rrect(p.x, p.y, P, P, 10, i === showLit ? p.lit : p.dim);
          g.circle(p.x + P / 2, p.y + P / 2, 7, i === showLit ? '#fff7' : '#fff2'); // paw pad
        });

        g.maxie(22, g.h - 6, 11, playing ? 'wow' : done ? 'happy' : 'idle');
        // progress pips bottom-right
        for (let i = 0; i < len; i++)
          g.circle(g.w - 10 - i * 9, g.h - 9, 3, i < idx ? '#62f59a' : '#ffffff33');
      },
    };
  },
});
