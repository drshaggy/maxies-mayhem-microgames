import { defineMicrogame } from 'maxie-sdk';

// BALANCE! — a ball wobbles on Maxie's head. Move Maxie left/right (drag, or
// ←/→) to stay under it and keep it from rolling off. Goal:'survive' until the
// buzzer. The ball rolls away from Maxie's centre (and random gusts shove it),
// but because moving Maxie repositions him right under it, you can always
// recover — verified headless that chasing the ball survives every difficulty.
export default defineMicrogame({
  id: 'balance', name: 'Balance', prompt: 'BALANCE!', author: 'drshaggy',
  goal: 'survive', time: 4400, palette: '#101a2c',
  build(g) {
    const ROLL = 5 + g.difficulty * 1.6;        // how fast it rolls off-centre: 6.6/8.2/9.8
    const BDAMP = 1.6;                          // ball velocity damping
    const gMag = 26 + g.difficulty * 16;        // gust strength: 42 / 58 / 74
    const gEvery = () => g.rng.range(0.55, 1.0) / (0.7 + g.difficulty * 0.2);
    const CATCH = 30, headY = g.h - 30, SPD = 360, margin = 16;

    let maxieX = g.w / 2;
    let ballX = maxieX + g.rng.range(-5, 5), vBall = 0, gust = gEvery();

    return {
      update(dt) {
        // move Maxie toward your input (drag, or arrow keys)
        let target = maxieX;
        if (g.pointer.down) target = g.pointer.x;
        if (g.held.left)  target = maxieX - SPD * dt * 6;
        if (g.held.right) target = maxieX + SPD * dt * 6;
        target = Math.max(margin, Math.min(g.w - margin, target));
        maxieX += (target - maxieX) * Math.min(1, 14 * dt);

        // ball rolls away from Maxie's head-centre, nudged by gusts
        const e = ballX - maxieX;
        gust -= dt;
        if (gust <= 0) { gust = gEvery(); vBall += g.rng.range(-gMag, gMag); }
        vBall += ROLL * e * dt;
        vBall -= vBall * BDAMP * dt;
        ballX += vBall * dt;

        if (Math.abs(e) > CATCH) { g.lose(); }

        // ---- draw ----
        const danger = Math.abs(e) > CATCH * 0.78 ? '#ff5b6e' : Math.abs(e) > CATCH * 0.5 ? '#ffd23f' : '#62f59a';
        const by = headY - 14 + Math.abs(e) * 0.18;             // sinks as it rolls off
        g.rect(0, g.h - 6, g.w, 6, '#0006');                    // ground
        // catch zone on the head, so the goal reads at a glance
        g.line(maxieX - CATCH, headY - 2, maxieX + CATCH, headY - 2, '#ffffff22', 3);
        g.maxie(maxieX, g.h - 8, 14, Math.abs(e) > CATCH * 0.78 ? 'sad' : 'happy');
        g.circle(ballX, by, 9, '#f4f4fa'); g.circle(ballX - 3, by - 3, 3, '#fff');
        g.circle(ballX, by, 9.5, danger);                       // thin danger ring
        g.circle(ballX, by, 7, '#f4f4fa');
      },
    };
  },
});
