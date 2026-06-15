import { defineMicrogame } from 'maxie-sdk';

// JUMP! — hop Maxie over the cacti (tap / Space). Survive till time's up.
export default defineMicrogame({
  id: 'jump', name: 'Jump', prompt: 'JUMP!', author: 'drshaggy',
  goal: 'survive', time: 4200, palette: '#2a2140',
  build(g) {
    const groundY = g.h - 28, runX = 52, S = 11, FEET = 24;
    const G = 1100, JUMP = 360;
    let h = 0, vy = 0, onGround = true;
    const obst = [];
    let spawn = 0.5;
    const spd = 130 + g.difficulty * 55;
    return {
      update(dt) {
        if ((g.pressed.action || g.tapped) && onGround) { vy = JUMP; onGround = false; }
        vy -= G * dt; h += vy * dt;
        if (h <= 0) { h = 0; vy = 0; onGround = true; }

        spawn -= dt;
        if (spawn <= 0) { spawn = g.rng.range(0.85, 1.35) - g.difficulty * 0.1; obst.push({ x: g.w + 12, w: g.rng.int(8, 12), oh: g.rng.int(14, 24) }); }
        for (const o of obst) o.x -= spd * dt;
        while (obst.length && obst[0].x < -20) obst.shift();

        for (const o of obst) if (o.x < runX + 9 && o.x + o.w > runX - 9 && h < o.oh - 2) g.lose();

        g.rect(0, groundY, g.w, g.h - groundY, '#1a1530');
        g.line(0, groundY, g.w, groundY, '#5a4f7b', 2);
        for (const o of obst) { g.rrect(o.x, groundY - o.oh, o.w, o.oh, 2, '#3fa35a'); g.rect(o.x - 3, groundY - o.oh * 0.6, 3, 4, '#3fa35a'); }
        g.maxie(runX, groundY - FEET - h, S, onGround ? 'idle' : 'wow');
      },
    };
  },
});
