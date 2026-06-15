import { defineMicrogame } from 'maxie-sdk';

// LAUNCH! — fling a treat into Maxie's mouth. Drag out from the treat toward
// where you want it to go to set angle + power, release to fire; gravity arcs it
// in. Distinct 'aim/launch' mechanic (no roster game sets a vector and fires).
// Trackpad-kind: you aim by where you release, not by a fast flick. Retry as
// many times as the clock allows.
const GRAV = 330;        // downward accel (stage units/s^2)
const PULL = 3.0;        // drag distance → launch speed
const VMAX = 540;        // speed clamp so a huge drag can't fling off-screen

export default defineMicrogame({
  id: 'launch', name: 'Launch', prompt: 'LAUNCH!', author: 'drshaggy',
  goal: 'act', time: 5200, palette: '#2d2117',
  build(g) {
    const home = { x: 38, y: g.h - 26 };          // where the treat rests / fires from
    const head = { x: g.w - 44, y: 60, s: 16 };    // Maxie, sitting top-right
    const mouth = { x: head.x, y: head.y + head.s * 0.86, r: 17 - g.difficulty * 3 };
    const wind = g.difficulty >= 3 ? g.rng.range(-60, 60) : 0;  // a breeze only at lvl 3
    const tr = 6;                                  // treat radius

    let phase = 'aim';                             // 'aim' → 'fly'
    const t = { x: home.x, y: home.y, vx: 0, vy: 0 };
    let prevDown = false;

    const reset = () => { phase = 'aim'; t.x = home.x; t.y = home.y; t.vx = t.vy = 0; };

    return {
      update(dt) {
        const releasing = prevDown && !g.pointer.down;

        if (phase === 'aim') {
          // launch vector = drag out from the treat toward the pointer, scaled by distance
          const aimX = (g.pointer.x - home.x) * PULL;
          const aimY = (g.pointer.y - home.y) * PULL;
          if (g.pointer.down) {
            // dotted trajectory preview so the player can read the arc
            let px = home.x, py = home.y, pvx = aimX, pvy = aimY;
            for (let i = 0; i < 16; i++) {
              pvx += wind * 0.03; pvy += GRAV * 0.03; px += pvx * 0.03; py += pvy * 0.03;
              if (py > g.h) break;
              g.circle(px, py, 1.6, '#ffffff66');
            }
          }
          if (releasing && (aimX * aimX + aimY * aimY) > 400) {  // ignore a tiny twitch
            let sp = Math.hypot(aimX, aimY);
            const k = sp > VMAX ? VMAX / sp : 1;
            t.vx = aimX * k; t.vy = aimY * k; phase = 'fly';
          }
        } else {
          t.vx += wind * dt; t.vy += GRAV * dt;
          t.x += t.vx * dt; t.y += t.vy * dt;
          // caught it?
          if (Math.hypot(t.x - mouth.x, t.y - mouth.y) < mouth.r + tr) return g.win();
          // off the bottom / sides → missed, set up another shot
          if (t.y > g.h + 10 || t.x < -10 || t.x > g.w + 10) reset();
        }

        // --- ground ---
        g.rect(0, g.h - 10, g.w, 10, '#1c140d');
        // --- Maxie waiting, mouth open ---
        g.maxie(head.x, head.y, head.s, 'happy');
        // target ring on the mouth (pulses so it reads as "aim here")
        const pulse = 1 + Math.sin(performance.now() / 200) * 0.12;
        g.ctx.strokeStyle = '#d4ff3f'; g.ctx.lineWidth = 2;
        g.ctx.beginPath(); g.ctx.arc(mouth.x, mouth.y, mouth.r * pulse, 0, Math.PI * 2); g.ctx.stroke();
        // --- slingshot guide while aiming ---
        if (phase === 'aim' && g.pointer.down) g.line(home.x, home.y, g.pointer.x, g.pointer.y, '#ffffff55', 2);
        // --- the treat (a little bone) ---
        const bx = t.x, by = t.y;
        g.circle(bx - 4, by - 2, 3, '#f0e3c0'); g.circle(bx - 4, by + 2, 3, '#f0e3c0');
        g.circle(bx + 4, by - 2, 3, '#f0e3c0'); g.circle(bx + 4, by + 2, 3, '#f0e3c0');
        g.rect(bx - 4, by - 2, 8, 4, '#f0e3c0');

        if (phase === 'aim') g.text('drag to aim & release', g.w / 2, g.h - 4, { size: 7, color: '#caa', shadow: '#0008' });
        if (wind) g.text(wind < 0 ? '← wind' : 'wind →', g.w / 2, 12, { size: 7, color: '#9cf', shadow: '#0008' });

        prevDown = g.pointer.down;   // track press state so we can detect the release next frame
      },
    };
  },
});
