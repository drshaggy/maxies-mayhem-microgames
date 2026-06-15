import { defineMicrogame } from 'maxie-sdk';

// CATCH! — slide the basket (←/→ or drag) to catch the falling apples.
export default defineMicrogame({
  id: 'catch', name: 'Catch', prompt: 'CATCH!', author: 'drshaggy',
  goal: 'act', time: 4400, palette: '#26331f',
  build(g) {
    const need = 2 + g.difficulty, bw = 30, by = g.h - 22;
    let bx = g.w / 2, got = 0;
    const drops = [];
    let spawn = 0;
    const fall = 75 + g.difficulty * 40;
    return {
      update(dt) {
        if (g.held.left) bx -= 150 * dt;
        if (g.held.right) bx += 150 * dt;
        if (g.pointer.down) { const d = g.pointer.x - bx; bx += Math.sign(d) * Math.min(Math.abs(d), 200 * dt); }
        bx = Math.max(bw / 2, Math.min(g.w - bw / 2, bx));

        spawn -= dt;
        if (spawn <= 0) { spawn = g.rng.range(0.5, 0.9); drops.push({ x: g.rng.range(16, g.w - 16), y: -8, vy: fall * g.rng.range(0.9, 1.2) }); }
        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i]; d.y += d.vy * dt;
          if (d.y > by - 8 && d.y < by + 6 && Math.abs(d.x - bx) < bw / 2 + 4) { drops.splice(i, 1); if (++got >= need) return g.win(); continue; }
          if (d.y > g.h + 10) drops.splice(i, 1);
        }

        for (const d of drops) { g.circle(d.x, d.y, 7, '#e8413c'); g.rect(d.x - 1, d.y - 9, 2, 4, '#5a3a1a'); }
        g.rrect(bx - bw / 2, by, bw, 13, 3, '#a9712f');
        g.rect(bx - bw / 2, by, bw, 4, '#c98a3e');
        g.text(got + '/' + need, g.w - 8, 12, { align: 'right', size: 8, color: '#fff', shadow: '#0008' });
      },
    };
  },
});
