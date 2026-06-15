import { defineMicrogame } from 'maxie-sdk';

// SLICE! — swipe across the tossed fruit to slice them before they fall back.
export default defineMicrogame({
  id: 'slice', name: 'Slice', prompt: 'SLICE!', author: 'drshaggy',
  goal: 'act', time: 4200, palette: '#2c1530',
  build(g) {
    const need = 2 + g.difficulty;
    let got = 0, px = g.pointer.x, py = g.pointer.y;
    const fruit = [];
    let spawn = 0;
    const colors = ['#e8413c', '#ffd23f', '#7ad13f', '#ff8d3f'];
    const launch = () => fruit.push({
      x: g.rng.range(40, g.w - 40), y: g.h + 10,
      vx: g.rng.range(-30, 30), vy: -g.rng.range(150, 205),
      r: 11, c: g.rng.pick(colors), sliced: false,
    });
    return {
      update(dt) {
        spawn -= dt;
        if (spawn <= 0 && fruit.length < 4) { spawn = g.rng.range(0.35, 0.7); launch(); }

        const moving = g.pointer.down && (Math.abs(g.pointer.x - px) + Math.abs(g.pointer.y - py) > 1.5);
        for (let i = fruit.length - 1; i >= 0; i--) {
          const o = fruit[i];
          o.vy += 240 * dt; o.x += o.vx * dt; o.y += o.vy * dt;
          if (!o.sliced && moving) {
            const dx = g.pointer.x - o.x, dy = g.pointer.y - o.y;
            if (dx * dx + dy * dy < (o.r + 5) ** 2) { o.sliced = true; if (++got >= need) return g.win(); }
          }
          if (o.y > g.h + 16) fruit.splice(i, 1);
        }

        for (const o of fruit) {
          if (o.sliced) { g.circle(o.x - 4, o.y, o.r * 0.7, o.c); g.circle(o.x + 4, o.y, o.r * 0.7, o.c); }
          else { g.circle(o.x, o.y, o.r, o.c); g.circle(o.x - 3, o.y - 3, o.r * 0.3, '#fff6'); }
        }
        if (g.pointer.down) g.line(px, py, g.pointer.x, g.pointer.y, '#fff', 2);
        px = g.pointer.x; py = g.pointer.y;
        g.text(got + '/' + need, g.w - 8, 12, { align: 'right', size: 8, color: '#fff', shadow: '#0008' });
      },
    };
  },
});
