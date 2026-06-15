import { defineMicrogame } from 'maxie-sdk';

// WAG! — mash (tap/space) to fill Maxie's wag meter before it drains away.
export default defineMicrogame({
  id: 'wag', name: 'Wag', prompt: 'WAG!', author: 'drshaggy',
  goal: 'act', time: 3600, palette: '#143042',
  build(g) {
    let meter = 0;
    const gain = 0.12, drain = 0.32 + g.difficulty * 0.06;
    let wagT = 0;
    return {
      update(dt) {
        meter = Math.max(0, meter - drain * dt);
        if (g.tapped) { meter = Math.min(1, meter + gain); wagT = 0.18; }
        wagT = Math.max(0, wagT - dt);
        if (meter >= 1) return g.win();

        const happy = meter > 0.45;
        g.maxie(g.w / 2, g.h / 2 + 6, 24, happy ? 'happy' : 'idle');
        // wagging tail flick
        const tx = g.w / 2 + 28, ty = g.h / 2 + 12;
        const a = wagT > 0 ? Math.sin(performance.now() / 40) * 0.5 : 0.2;
        g.poly([[tx, ty], [tx + 16 * Math.cos(a), ty - 16 * Math.sin(a) - 6], [tx + 4, ty - 4]], '#16161d');
        // meter
        g.rect(38, g.h - 24, g.w - 76, 12, '#0006');
        g.rect(38, g.h - 24, (g.w - 76) * meter, 12, meter > 0.8 ? '#d4ff3f' : '#ffd23f');
      },
    };
  },
});
