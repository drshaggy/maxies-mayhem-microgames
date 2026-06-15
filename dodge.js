import { defineMicrogame } from 'maxie-sdk';

// DODGE! — move Maxie (←/→ or drag) to survive the falling junk until time's up.
export default defineMicrogame({
  id: 'dodge', name: 'Dodge', prompt: 'DODGE!', author: 'drshaggy',
  goal: 'survive', time: 4200, palette: '#2a1838',
  build(g) {
    const me = { x: g.w / 2 };
    const junk = [];
    let spawn = 0;
    const rate = Math.max(0.22, 0.6 - g.difficulty * 0.12);
    const fall = 70 + g.difficulty * 45;
    return {
      update(dt) {
        if (g.held.left) me.x -= 130 * dt;
        if (g.held.right) me.x += 130 * dt;
        if (g.pointer.down) {
          const d = g.pointer.x - me.x; me.x += Math.sign(d) * Math.min(Math.abs(d), 170 * dt);
        }
        me.x = Math.max(15, Math.min(g.w - 15, me.x));

        spawn -= dt;
        if (spawn <= 0) { spawn = rate * g.rng.range(0.7, 1.2); junk.push({ x: g.rng.range(12, g.w - 12), y: -10, r: 9, vy: fall * g.rng.range(0.85, 1.3), s: g.rng.int(0, 1) }); }

        const my = g.h - 22;
        for (const h of junk) {
          h.y += h.vy * dt;
          if (Math.abs(h.x - me.x) < 15 && Math.abs(h.y - my) < 13) g.lose();
        }
        for (let i = junk.length - 1; i >= 0; i--) if (junk[i].y > g.h + 12) junk.splice(i, 1);

        g.maxie(me.x, g.h - 8, 14, 'wow');
        for (const h of junk) {
          if (h.s === 0) { g.rect(h.x - h.r, h.y - h.r * 0.6, h.r * 2, h.r * 1.2, '#6b4a2a'); g.rect(h.x - h.r, h.y + h.r * 0.4, h.r * 1.4, h.r * 0.5, '#3f2a17'); }
          else { g.circle(h.x, h.y, h.r, '#8a8f99'); g.circle(h.x - 3, h.y - 3, h.r * 0.3, '#c2c7cf'); }
        }
      },
    };
  },
});
