// ============================================================================
// Maxie — the star. A pixel-art black Schipperke: erect pointed ears, fox face,
// fluffy ruff, red collar. Drawn on a low-res canvas (crisp when upscaled).
// drawMaxie(ctx, cx, cy, s, pose) — cx,cy = head centre; s = head radius (px).
// poses: 'idle' | 'happy' | 'sad' | 'wow' | 'boss'
// ============================================================================
const C = {
  fur:   '#16161d',
  furLo: '#0c0c11',
  edge:  '#34343f',   // rim light so black reads on dark
  ear:   '#3a2630',   // inner ear
  nose:  '#050507',
  eye:   '#f4f4fa',
  pupil: '#111118',
  tongue:'#ff6f8c',
  mouth: '#241a20',
  collar:'#d6322f',
  buckle:'#f0b450',
};

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill; ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
}
function tri(ctx, ax, ay, bx, by, cx2, cy2, fill) {
  ctx.fillStyle = fill; ctx.beginPath();
  ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx2, cy2); ctx.closePath(); ctx.fill();
}

// Drawn straight into the engine's low-res frame; the engine upscales the whole
// frame nearest-neighbour, so Maxie comes out crisp along with everything else.
export function drawMaxie(ctx, cx, cy, s, pose = 'idle') {
  const blink = pose === 'happy';
  const earBack = pose === 'sad';
  ctx.save();
  ctx.lineJoin = 'round';

  // --- ears: tall, erect, pointed (drawn behind the head) ---
  const dx = earBack ? s * 0.14 : 0, dy = earBack ? s * 0.16 : 0;
  for (const sgn of [-1, 1]) {
    tri(ctx, cx + sgn * (s * 0.64 + dx), cy - s * 0.48, cx + sgn * (s * 0.32), cy - s * 1.66 + dy, cx + sgn * (s * 0.02), cy - s * 0.52, C.edge);
    tri(ctx, cx + sgn * (s * 0.58 + dx), cy - s * 0.50, cx + sgn * (s * 0.32), cy - s * 1.52 + dy, cx + sgn * (s * 0.07), cy - s * 0.52, C.fur);
    tri(ctx, cx + sgn * (s * 0.45 + dx), cy - s * 0.56, cx + sgn * (s * 0.31), cy - s * 1.28 + dy, cx + sgn * (s * 0.19), cy - s * 0.58, C.ear);
  }

  // --- ruff / chest: slim and tapered (lean, not a round belly) ---
  const chest = (w, col) => {
    ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(cx - s * 0.66 * w, cy + s * 0.42);
    ctx.quadraticCurveTo(cx - s * 0.92 * w, cy + s * 1.7, cx - s * 0.4 * w, cy + s * 1.98);
    ctx.quadraticCurveTo(cx, cy + s * 2.14, cx + s * 0.4 * w, cy + s * 1.98);
    ctx.quadraticCurveTo(cx + s * 0.92 * w, cy + s * 1.7, cx + s * 0.66 * w, cy + s * 0.42);
    ctx.closePath(); ctx.fill();
  };
  chest(1.06, C.edge); chest(1.0, C.fur);

  // --- head (slightly oval) ---
  ellipse(ctx, cx, cy, s * 0.96, s * 0.99, C.edge);
  ellipse(ctx, cx, cy, s * 0.90, s * 0.93, C.fur);

  // --- muzzle: pointed fox snout ---
  ctx.fillStyle = C.furLo;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.36, cy + s * 0.12);
  ctx.quadraticCurveTo(cx - s * 0.26, cy + s * 0.84, cx, cy + s * 0.94);
  ctx.quadraticCurveTo(cx + s * 0.26, cy + s * 0.84, cx + s * 0.36, cy + s * 0.12);
  ctx.closePath(); ctx.fill();

  // --- nose ---
  ellipse(ctx, cx, cy + s * 0.66, s * 0.15, s * 0.12, C.nose);
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  ctx.fillRect(cx - s * 0.05, cy + s * 0.6, s * 0.05, s * 0.035);

  // --- mouth / tongue per pose ---
  ctx.strokeStyle = C.mouth; ctx.lineWidth = Math.max(1, s * 0.06); ctx.lineCap = 'round';
  if (pose === 'happy' || pose === 'wow') {
    ctx.fillStyle = C.mouth; ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.88, s * 0.22, s * 0.19, 0, 0, Math.PI); ctx.fill();
    ellipse(ctx, cx, cy + s * 0.96, s * 0.13, s * 0.1, C.tongue);
  } else if (pose === 'sad') {
    ctx.beginPath(); ctx.moveTo(cx - s * 0.15, cy + s * 0.94);
    ctx.quadraticCurveTo(cx, cy + s * 0.84, cx + s * 0.15, cy + s * 0.94); ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.78); ctx.lineTo(cx, cy + s * 0.9);
    ctx.moveTo(cx - s * 0.14, cy + s * 0.92); ctx.quadraticCurveTo(cx, cy + s * 1.0, cx, cy + s * 0.92);
    ctx.moveTo(cx + s * 0.14, cy + s * 0.92); ctx.quadraticCurveTo(cx, cy + s * 1.0, cx, cy + s * 0.92);
    ctx.stroke();
  }

  // --- eyes (foxy, set fairly close) ---
  const ex = s * 0.40, eyy = cy - s * 0.08, er = s * 0.17;
  if (blink) {
    ctx.strokeStyle = C.eye; ctx.lineWidth = Math.max(1, s * 0.07);
    for (const sgn of [-1, 1]) { ctx.beginPath();
      ctx.moveTo(cx + sgn * ex - er, eyy); ctx.quadraticCurveTo(cx + sgn * ex, eyy - er, cx + sgn * ex + er, eyy); ctx.stroke(); }
  } else {
    const droop = pose === 'sad' ? s * 0.04 : 0;
    for (const sgn of [-1, 1]) {
      ellipse(ctx, cx + sgn * ex, eyy + droop, er, er * (pose === 'wow' ? 1.3 : 1.08), C.eye);
      ellipse(ctx, cx + sgn * ex, eyy + droop + s * 0.02, er * 0.6, er * 0.72, C.pupil);
      ellipse(ctx, cx + sgn * ex + s * 0.05, eyy + droop - s * 0.04, er * 0.22, er * 0.22, C.eye);
    }
  }
  if (pose === 'sad') ellipse(ctx, cx + s * 0.72, cy - s * 0.5, s * 0.09, s * 0.14, '#8fd0ff');

  // --- red collar (on the neck, below the chin) ---
  ctx.fillStyle = C.collar;
  ctx.fillRect(cx - s * 0.72, cy + s * 1.04, s * 1.44, s * 0.2);
  ellipse(ctx, cx, cy + s * 1.14, s * 0.09, s * 0.09, C.buckle);

  ctx.restore();
}

export const MAXIE_PALETTE = C;
