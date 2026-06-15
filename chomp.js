import { defineMicrogame } from 'maxie-sdk';

// CHOMP! — the bowl's full of treats. Tap every one before time runs out.
export default defineMicrogame({
  id: 'chomp', name: 'Chomp', prompt: 'CHOMP!', author: 'drshaggy',
  goal: 'act', time: 4000, palette: '#3a2418',
  build(g) {
    const need = 2 + g.difficulty * 2;          // 4 / 6 / 8 treats laid out at once
    const r = Math.max(11, 17 - g.difficulty);
    const treats = [];
    // scatter them without heavy overlap (rejection-sample a few tries each)
    for (let n = 0; n < need; n++) {
      let t;
      for (let tries = 0; tries < 20; tries++) {
        t = { x: g.rng.range(28, g.w - 28), y: g.rng.range(40, g.h - 44), r, eaten: false };
        if (treats.every((o) => (o.x - t.x) ** 2 + (o.y - t.y) ** 2 > (r * 2.4) ** 2)) break;
      }
      treats.push(t);
    }
    let got = 0;
    return {
      update() {
        if (g.tapped) {
          for (const t of treats) {
            if (t.eaten) continue;
            const dx = g.pointer.x - t.x, dy = g.pointer.y - t.y;
            if (dx * dx + dy * dy < (t.r + 12) ** 2) { t.eaten = true; if (++got >= need) return g.win(); break; }
          }
        }

        g.maxie(26, g.h - 6, 13, 'happy');
        for (const t of treats) {
          if (t.eaten) continue;
          const { x, y, r } = t;            // bone treat
          g.circle(x - r * 0.6, y - r * 0.45, r * 0.55, '#efe2bd'); g.circle(x - r * 0.6, y + r * 0.45, r * 0.55, '#efe2bd');
          g.circle(x + r * 0.6, y - r * 0.45, r * 0.55, '#efe2bd'); g.circle(x + r * 0.6, y + r * 0.45, r * 0.55, '#efe2bd');
          g.rect(x - r * 0.6, y - r * 0.4, r * 1.2, r * 0.8, '#efe2bd');
        }
        g.text((need - got) + ' LEFT', g.w - 8, 12, { align: 'right', size: 8, color: '#fff', shadow: '#0008' });
      },
    };
  },
});
