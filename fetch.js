import { defineMicrogame } from 'maxie-sdk';

// FETCH! — tap the bouncing ball before time runs out.
export default defineMicrogame({
  id: 'fetch', name: 'Fetch', prompt: 'FETCH!', author: 'drshaggy',
  goal: 'act', time: 3400, palette: '#1b3a2e',
  build(g) {
    const spd = 60 + g.difficulty * 38;
    const b = {
      x: g.rng.range(40, g.w - 40), y: 36,
      vx: (g.rng.chance(0.5) ? 1 : -1) * spd, vy: spd * 0.65,
      r: 14 - g.difficulty * 1.6,
    };
    return {
      update(dt) {
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < b.r) { b.x = b.r; b.vx *= -1; } if (b.x > g.w - b.r) { b.x = g.w - b.r; b.vx *= -1; }
        if (b.y < b.r) { b.y = b.r; b.vy *= -1; } if (b.y > g.h - 34 - b.r) { b.y = g.h - 34 - b.r; b.vy *= -1; }
        if (g.tapped) { const dx = g.pointer.x - b.x, dy = g.pointer.y - b.y; if (dx * dx + dy * dy < (b.r + 7) ** 2) g.win(); }

        g.maxie(g.w / 2, g.h - 4, 16, 'idle');
        g.circle(b.x, b.y + 2, b.r, 'rgba(0,0,0,.35)');
        g.circle(b.x, b.y, b.r, '#d4ff3f');
        g.line(b.x - b.r * 0.7, b.y - b.r * 0.3, b.x + b.r * 0.7, b.y - b.r * 0.3, '#fff', 1.5);
      },
    };
  },
});
