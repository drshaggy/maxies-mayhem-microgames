import { defineMicrogame } from 'maxie-sdk';

// CLIMB! — Maxie auto-bounces up vertical platforms (steer ←/→ or drag).
// Screen wraps like Doodle Jump. Reach the top before the buzzer; fall off and you lose.
export default defineMicrogame({
  id: 'climb', name: 'Climb', prompt: 'CLIMB!', author: 'drshaggy',
  goal: 'act', time: 4000, palette: '#191a3a',
  build(g) {
    // constants
    const W = g.w, G = 900, BV = 300, SPD = 160, PH = 6, MS = 10;
    const BASE_Y = g.h - 24, LOCK = g.h * 0.45;
    const D = g.difficulty;
    const gap = [0, 28, 36, 42][D], pw = [0, 48, 38, 30][D];
    const reach = [0, 64, 56, 48][D], landings = [0, 3, 4, 5][D];
    const goal = landings * gap;                 // 84 / 144 / 210
    const wrap = (v) => (v % W + W) % W;
    const sy = (a, cam) => BASE_Y - a + cam;

    // procedural platform column (structurally reachable)
    const N = landings + 3;
    const plat = [{ x: W / 2, alt: 0 }];
    for (let k = 1; k < N; k++)
      plat.push({ x: wrap(plat[k-1].x + g.rng.range(-reach, +reach)), alt: k * gap });

    // Maxie state
    let x = W / 2, alt = 0, vy = BV;             // start mid-air, just bounced off plat[0]
    let cam = 0, prevAlt = 0, phase = 0;         // phase = cosmetic shimmer accumulator

    return {
      update(dt) {
        // steer: keyboard (held) is primary; pointer steers toward touch x
        let dx = 0;
        if (g.held.left)  dx -= SPD * dt;
        if (g.held.right) dx += SPD * dt;
        if (g.pointer.down) {                    // wrap-aware shortest direction toward pointer
          let d = ((g.pointer.x - x + 128 + W) % W) - 128;
          dx += Math.sign(d) * Math.min(Math.abs(d), SPD * dt);
        }
        x = wrap(x + dx);

        // vertical integrate
        prevAlt = alt;
        vy -= G * dt;
        alt += vy * dt;

        // one-way landing (only while falling, crossed-band test)
        if (vy < 0) {
          for (const p of plat) {
            if (p.alt > prevAlt) break;
            if (p.alt <= alt) continue;
            const ddx = ((x - p.x + 128 + W) % W) - 128;
            if (Math.abs(ddx) <= pw / 2) { alt = p.alt; vy = BV; break; }
          }
        }

        // win / lose
        if (alt >= goal) return g.win();
        cam = Math.max(cam, alt - (BASE_Y - LOCK));
        if (sy(alt, cam) > g.h + MS) return g.lose();

        // ===================== DRAW (camera offset applied to everything) =====================
        // goal beacon at the top of the climb
        phase += dt;
        const gy = sy(goal, cam);
        if (gy > -8) {                            // only while on/near screen
          g.rect(0, gy - 1, W, 2, '#d4ff3f');     // lime goal line
          for (let i = 0; i < W; i += 10)         // shimmer ticks
            g.rect(i + ((phase * 30) % 10), gy - 1, 4, 2, '#ffffff55');
        }
        // platforms (draw triple for seamless wrap; canvas clips off-canvas copies)
        for (const p of plat) {
          const py = sy(p.alt, cam);
          if (py < -PH || py > g.h + PH) continue;
          for (const off of [-W, 0, W]) g.rrect(p.x + off - pw/2, py, pw, PH, 2, '#5bbf6a');
        }
        // Maxie (airborne = wow; brief happy flash on bounce is optional)
        const mx = x, my = sy(alt, cam);
        g.maxie(mx, my, MS, vy > 0 ? 'wow' : 'happy');
        if (mx < MS*2)        g.maxie(mx + W, my, MS, vy > 0 ? 'wow' : 'happy');   // wrap ghost
        else if (mx > W-MS*2) g.maxie(mx - W, my, MS, vy > 0 ? 'wow' : 'happy');
      },
      teardown() {},
    };
  },
});
