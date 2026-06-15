import { defineMicrogame } from 'maxie-sdk';

// STOP! — tap the moment the sweeping marker is inside the green zone.
export default defineMicrogame({
  id: 'stop', name: 'Stop', prompt: 'STOP!', author: 'drshaggy',
  goal: 'act', time: 4000, palette: '#22203a',
  build(g) {
    const trackY = g.h / 2, x0 = 28, x1 = g.w - 28, span = x1 - x0;
    const zoneW = Math.max(22, 64 - g.difficulty * 13);
    const zoneX = g.rng.range(x0 + zoneW, x1 - zoneW);
    const spd = 0.9 + g.difficulty * 0.45;          // sweeps per second
    let t = 0, done = false;
    return {
      update(dt) {
        if (!done) t += spd * dt;
        const phase = (Math.sin(t * Math.PI - Math.PI / 2) + 1) / 2;  // 0..1 ping-pong
        const mx = x0 + phase * span;
        if (g.tapped && !done) {
          done = true;
          (Math.abs(mx - zoneX) <= zoneW / 2) ? g.win() : g.lose();
        }
        g.rect(x0, trackY - 7, span, 14, '#0006');
        g.rect(zoneX - zoneW / 2, trackY - 7, zoneW, 14, '#2f6b35');
        g.rect(zoneX - 1, trackY - 7, 2, 14, '#d4ff3f');
        g.rect(mx - 3, trackY - 13, 6, 26, done ? '#888' : '#ffd23f');
      },
    };
  },
});
