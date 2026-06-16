import { defineMicrogame } from 'maxie-sdk';

// BARK! — paw-prints march toward the beat line. Tap each one the moment it lands
// in the green zone. Hit them all to win; a missed print OR a mistimed/stray tap
// fails (so you can't just mash). Beats are spaced over the clock as fractions,
// so it scales with however fast the engine runs. More, tighter beats as
// difficulty rises.
export default defineMicrogame({
  id: 'bark', name: 'Bark', prompt: 'BARK!', author: 'drshaggy',
  goal: 'act', time: 4600, palette: '#1a1430',
  build(g) {
    const n = 2 + g.difficulty;                 // 3 / 4 / 5 beats
    const HITX = 58, laneY = g.h / 2 + 6;
    const APPROACH = 0.40;                       // clock-fraction a print is visible before its beat
    const SPAN = (g.w - HITX) / APPROACH;        // px per unit progress
    const BANDX = 26 - g.difficulty * 4;         // hit-zone half-width: 22 / 18 / 14 px
    const hitWin = BANDX / SPAN;                 // same, in progress units
    const first = 0.36, last = 0.88;
    const beats = Array.from({ length: n }, (_, i) => first + (last - first) * i / (n - 1));
    const hit = beats.map(() => false);
    let done = false, hits = 0, flash = 0;

    const paw = (x, y, col) => {
      g.circle(x, y + 2, 6, col);
      g.circle(x - 4, y - 5, 2.4, col); g.circle(x, y - 6, 2.4, col); g.circle(x + 4, y - 5, 2.4, col);
    };

    const inst = {
      update(dt) {
        const prog = 1 - g.timeLeft;
        flash = Math.max(0, flash - dt * 4);

        if (!done) {
          for (let i = 0; i < n; i++)                       // a print slid past unhit → miss
            if (!hit[i] && prog > beats[i] + hitWin) { done = true; g.lose(); break; }

          if (!done && g.tapped) {
            let best = -1, bd = 1e9;
            for (let i = 0; i < n; i++) { if (hit[i]) continue; const d = Math.abs(prog - beats[i]); if (d < bd) { bd = d; best = i; } }
            if (best >= 0 && bd <= hitWin) { hit[best] = true; flash = 1; if (++hits >= n) { done = true; g.win(); } }
            else { done = true; g.lose(); }                 // mistimed / mashed
          }
        }

        // ---- draw ----
        g.rect(0, laneY - 15, g.w, 30, '#ffffff0e');                       // lane
        g.rect(HITX - BANDX, laneY - 17, BANDX * 2, 34, flash > 0 ? '#62f59a55' : '#62f59a22'); // zone
        g.rect(HITX - 1, laneY - 19, 2, 38, '#62f59a');                    // beat line

        for (let i = 0; i < n; i++) {
          if (hit[i]) continue;
          const x = HITX + (beats[i] - prog) * SPAN;
          if (x < -12 || x > g.w + 12) continue;
          paw(x, laneY, Math.abs(prog - beats[i]) <= hitWin ? '#ffd23f' : '#cdd6e6');
        }

        g.maxie(22, g.h - 6, 11, done && hits >= n ? 'happy' : hits > 0 ? 'wow' : 'idle');
        for (let i = 0; i < n; i++) g.circle(g.w - 10 - i * 9, 12, 3, hit[i] ? '#62f59a' : '#ffffff33');
      },
    };
    inst._debug = { beats, hitWin, SPAN, HITX };           // for headless tests; engine ignores it
    return inst;
  },
});
