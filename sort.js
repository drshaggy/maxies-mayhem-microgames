import { defineMicrogame } from 'maxie-sdk';

// SORT! — drag each treat into its bin: bones go in the bowl, balls in the toy
// box. Drop it wrong (or miss) and it snaps back to try again, so the pressure is
// the clock, not precision. Win when everything's sorted. More items as difficulty
// rises. Pointer/drag game (mouse or touch).
export default defineMicrogame({
  id: 'sort', name: 'Sort', prompt: 'SORT!', author: 'drshaggy',
  goal: 'act', time: 5000, palette: '#1a1626',
  build(g) {
    const need = 1 + g.difficulty;                 // 2 / 3 / 4 treats
    const R = 13;
    const binW = 82, binH = 46, binY = g.h - binH - 6;
    const bins = {
      bone: { x: 6, y: binY, w: binW, h: binH, col: '#9a6b3f' },
      ball: { x: g.w - binW - 6, y: binY, w: binW, h: binH, col: '#5a4a8a' },
    };

    const items = [];
    for (let k = 0; k < need; k++) {
      const type = k === 0 ? 'bone' : k === 1 ? 'ball' : (g.rng.chance(0.5) ? 'bone' : 'ball');
      let x, y;
      for (let tries = 0; tries < 24; tries++) {
        x = g.rng.range(28, g.w - 28); y = g.rng.range(34, binY - 22);
        if (items.every(o => (o.hx - x) ** 2 + (o.hy - y) ** 2 > (R * 3) ** 2)) break;
      }
      items.push({ x, y, hx: x, hy: y, type, sorted: false });
    }

    const inBin = (b, px, py) => px >= b.x && px <= b.x + b.w && py >= b.y - 8 && py <= b.y + b.h;
    let grab = -1, prevDown = false, sortedN = 0;

    const drawBone = (x, y, r, c) => {
      g.circle(x - r * 0.6, y - r * 0.45, r * 0.5, c); g.circle(x - r * 0.6, y + r * 0.45, r * 0.5, c);
      g.circle(x + r * 0.6, y - r * 0.45, r * 0.5, c); g.circle(x + r * 0.6, y + r * 0.45, r * 0.5, c);
      g.rect(x - r * 0.6, y - r * 0.38, r * 1.2, r * 0.76, c);
    };
    const drawBall = (x, y, r, c) => { g.circle(x, y, r, c); g.circle(x - r * 0.32, y - r * 0.32, r * 0.28, '#ffffffcc'); };
    const drawItem = (it, r) => it.type === 'bone' ? drawBone(it.x, it.y, r, '#efe2bd') : drawBall(it.x, it.y, r, '#ff9d3f');

    const inst = {
      update() {
        const down = g.pointer.down;
        if (down && !prevDown && grab === -1) {                 // pick up
          for (let i = items.length - 1; i >= 0; i--) {
            const it = items[i];
            if (it.sorted) continue;
            if ((g.pointer.x - it.x) ** 2 + (g.pointer.y - it.y) ** 2 < (R + 7) ** 2) { grab = i; break; }
          }
        }
        if (down && grab >= 0) {
          items[grab].x = Math.max(R, Math.min(g.w - R, g.pointer.x));
          items[grab].y = Math.max(R, Math.min(g.h - R, g.pointer.y));
        }
        if (!down && prevDown && grab >= 0) {                   // release
          const it = items[grab], b = bins[it.type];
          if (inBin(b, g.pointer.x, g.pointer.y)) { it.sorted = true; if (++sortedN >= need) g.win(); }
          else { it.x = it.hx; it.y = it.hy; }                  // snap home
          grab = -1;
        }
        prevDown = down;

        // ---- draw bins (with the icon of what belongs there) ----
        for (const t of ['bone', 'ball']) {
          const b = bins[t];
          const hot = grab >= 0;                                // highlight both bins while dragging (no answer given away)
          g.rrect(b.x, b.y, b.w, b.h, 8, b.col);
          g.rrect(b.x, b.y, b.w, 6, 8, '#ffffff22');
          if (hot) { g.rrect(b.x - 2, b.y - 2, b.w + 4, b.h + 4, 10, '#62f59a'); g.rrect(b.x, b.y, b.w, b.h, 8, b.col); }
          (t === 'bone' ? drawBone : drawBall)(b.x + b.w / 2, b.y + b.h / 2, 9, '#ffffff66');
        }

        // ---- draw items (held one last, a touch bigger) ----
        for (let i = 0; i < items.length; i++) if (!items[i].sorted && i !== grab) drawItem(items[i], R);
        if (grab >= 0) drawItem(items[grab], R + 2);

        g.text((need - sortedN) + ' LEFT', g.w / 2, 14, { size: 8, color: '#fff', shadow: '#0008' });
      },
    };
    inst._debug = { items, bins, need };                        // for headless tests; engine ignores it
    return inst;
  },
});
