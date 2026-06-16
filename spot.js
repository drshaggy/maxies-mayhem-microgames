import { defineMicrogame } from 'maxie-sdk';

// SPOT! — a litter of Maxies all pulling the same face… except one. Tap the pup
// with the odd expression before time runs out (a wrong tap fails). Difficulty
// adds pups AND picks a subtler expression difference (happy/sad → happy/wow).
export default defineMicrogame({
  id: 'spot', name: 'Spot', prompt: 'SPOT!', author: 'drshaggy',
  goal: 'act', time: 4400, palette: '#14121f',
  build(g) {
    // pose pairs [everyone, oddOneOut], ordered most→least obvious by difficulty
    const PAIRS = {
      1: [['happy', 'sad'], ['sad', 'happy'], ['idle', 'sad'], ['wow', 'sad']],
      2: [['idle', 'wow'], ['idle', 'happy'], ['happy', 'idle'], ['sad', 'wow']],
      3: [['happy', 'wow'], ['wow', 'happy']],
    };
    const cols = [0, 2, 3, 3][g.difficulty];
    const rows = [0, 2, 2, 3][g.difficulty];
    const n = cols * rows;
    const [base, oddPose] = g.rng.pick(PAIRS[g.difficulty]);
    const odd = g.rng.int(0, n - 1);

    const top = 26, bottom = g.h - 4;
    const cellW = g.w / cols, cellH = (bottom - top) / rows;
    const s = Math.min(cellW * 0.42, cellH * 0.22);
    const cellOf = (px, py) => {
      const c = Math.floor(px / cellW), r = Math.floor((py - top) / cellH);
      if (c < 0 || c >= cols || r < 0 || r >= rows || py < top) return -1;
      return r * cols + c;
    };
    let done = false;

    return {
      update() {
        if (!done && g.tapped) {
          const i = cellOf(g.pointer.x, g.pointer.y);
          if (i >= 0) { done = true; (i === odd) ? g.win() : g.lose(); }
        }

        for (let i = 0; i < n; i++) {
          const c = i % cols, r = (i / cols) | 0;
          const cx = c * cellW + cellW / 2;
          const cy = top + r * cellH + cellH * 0.44;
          g.maxie(cx, cy, s, i === odd ? oddPose : base);
        }
      },
    };
  },
});
