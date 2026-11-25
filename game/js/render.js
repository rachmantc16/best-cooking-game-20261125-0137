// Dapur Ceria — all drawing. One canvas, warm hand-drawn look, no images:
// every ingredient is a little canvas illustration drawn by drawFood().
// Layout rectangles are exported so input.js clicks the same places.
import { INGREDIENTS, INGREDIENT_BY_ID } from './recipes.js';
import { patienceFraction } from './orders.js';
import { SHIFT_SECONDS, shiftStars } from './kitchen.js';

export const VIEW = { width: 1280, height: 800 };

export const LAYOUT = {
  shelfRect(i) { return { x: 19 + i * 125, y: 664, w: 117, h: 112 }; },
  grillRect(i) { return { x: 56 + i * 178, y: 292, w: 160, h: 168 }; },
  serveRect: { x: 1004, y: 296, w: 224, h: 66 },
  trashRect: { x: 1004, y: 378, w: 224, h: 54 },
  startRect: { x: 480, y: 528, w: 320, h: 72 },
  restartRect: { x: 480, y: 652, w: 320, h: 62 },
  orderRect(i) { return { x: 20 + i * 308, y: 70, w: 298, h: 152 }; },
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function text(ctx, value, x, y, size, color, align = 'center', weight = '700') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

/** Draw one ingredient inside a w×h box centred on (cx, cy). */
export function drawFood(ctx, id, cx, cy, w, h) {
  ctx.save();
  ctx.translate(cx, cy);
  const u = Math.min(w, h) / 40; // unit: icons are designed on a 40px grid
  ctx.scale(u, u);
  switch (id) {
    case 'bun':
      ctx.fillStyle = '#e8a94e';
      ctx.beginPath(); ctx.ellipse(0, -4, 17, 11, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#f7cf8b';
      for (const [sx, sy] of [[-8, -10], [2, -13], [9, -8]]) { ctx.beginPath(); ctx.ellipse(sx, sy, 2.4, 1.4, 0.4, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#d98e35';
      roundRect(ctx, -17, 4, 34, 7, 3); ctx.fill();
      break;
    case 'patty':
      ctx.fillStyle = '#8a4b2a';
      roundRect(ctx, -17, -8, 34, 16, 8); ctx.fill();
      ctx.fillStyle = '#6e3a1f';
      for (const [sx, sy] of [[-9, -2], [0, 3], [9, -3], [4, -5]]) { ctx.beginPath(); ctx.arc(sx, sy, 1.8, 0, 7); ctx.fill(); }
      break;
    case 'cheese':
      ctx.fillStyle = '#ffc93c';
      ctx.beginPath();
      ctx.moveTo(-16, -10); ctx.lineTo(16, -10); ctx.lineTo(16, 4); ctx.lineTo(6, 4); ctx.lineTo(2, 12); ctx.lineTo(-3, 4); ctx.lineTo(-16, 4);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f0ad1e';
      ctx.beginPath(); ctx.arc(-7, -3, 3, 0, 7); ctx.arc(9, -5, 2.2, 0, 7); ctx.fill();
      break;
    case 'lettuce':
      ctx.fillStyle = '#5dbb4f';
      ctx.beginPath();
      for (let i = 0; i < 7; i += 1) {
        const a = (i / 7) * Math.PI * 2;
        ctx.arc(Math.cos(a) * 9, Math.sin(a) * 7, 7.5, 0, 7);
      }
      ctx.fill();
      ctx.fillStyle = '#83d177';
      ctx.beginPath(); ctx.ellipse(0, 0, 8, 6, 0, 0, 7); ctx.fill();
      break;
    case 'tomato':
      ctx.fillStyle = '#e8452c';
      ctx.beginPath(); ctx.arc(0, 2, 15, 0, 7); ctx.fill();
      ctx.fillStyle = '#ff7a5c';
      ctx.beginPath(); ctx.ellipse(-5, -3, 5, 3.4, -0.6, 0, 7); ctx.fill();
      ctx.fillStyle = '#3f9e3f';
      ctx.beginPath();
      ctx.moveTo(0, -12); ctx.lineTo(4, -6); ctx.lineTo(10, -9); ctx.lineTo(5, -3); ctx.lineTo(0, -7); ctx.lineTo(-6, -3); ctx.lineTo(-10, -9); ctx.lineTo(-4, -6);
      ctx.closePath(); ctx.fill();
      break;
    case 'egg':
      ctx.fillStyle = '#fffaf0';
      ctx.beginPath();
      ctx.ellipse(0, 1, 17, 12, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = '#e8ddc8'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.fillStyle = '#ffb703';
      ctx.beginPath(); ctx.arc(1, 1, 7, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffd34d';
      ctx.beginPath(); ctx.arc(-1.5, -1.5, 2.6, 0, 7); ctx.fill();
      break;
    case 'noodle':
      ctx.strokeStyle = '#f2d06b'; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
      for (let row = -1; row <= 1; row += 1) {
        ctx.beginPath();
        for (let x = -16; x <= 16; x += 2) {
          const y = row * 6 + Math.sin(x * 0.55 + row * 2) * 3;
          if (x === -16) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      break;
    case 'rice':
      ctx.fillStyle = '#f7f4ec';
      ctx.beginPath(); ctx.ellipse(0, 3, 17, 10, 0, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = '#ddd5c2'; ctx.lineWidth = 1.3;
      for (const [sx, sy] of [[-9, -2], [-2, -5], [6, -3], [11, 0], [-13, 1]]) {
        ctx.beginPath(); ctx.ellipse(sx, sy, 2.6, 1.2, 0.5, 0, 7); ctx.stroke();
      }
      break;
    case 'chicken':
      ctx.fillStyle = '#d98e4a';
      ctx.beginPath(); ctx.ellipse(-3, -2, 13, 10, -0.5, 0, 7); ctx.fill();
      ctx.fillStyle = '#b96f2e';
      ctx.beginPath(); ctx.ellipse(-6, -5, 6, 4, -0.5, 0, 7); ctx.fill();
      ctx.strokeStyle = '#f3ead9'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(7, 5); ctx.lineTo(14, 11); ctx.stroke();
      ctx.fillStyle = '#f3ead9';
      ctx.beginPath(); ctx.arc(15, 12, 3.4, 0, 7); ctx.arc(11, 14, 3, 0, 7); ctx.fill();
      break;
    case 'sauce':
      ctx.fillStyle = '#c22f2f';
      ctx.beginPath();
      ctx.moveTo(0, -13);
      ctx.bezierCurveTo(10, -4, 13, 2, 9, 6);
      ctx.bezierCurveTo(14, 10, 6, 14, 0, 11);
      ctx.bezierCurveTo(-7, 14, -14, 9, -9, 5);
      ctx.bezierCurveTo(-13, 0, -9, -5, 0, -13);
      ctx.fill();
      ctx.fillStyle = '#e05252';
      ctx.beginPath(); ctx.ellipse(-3, -3, 3.4, 2.2, -0.5, 0, 7); ctx.fill();
      break;
    default:
      ctx.fillStyle = INGREDIENT_BY_ID[id]?.color ?? '#ccc';
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill();
  }
  ctx.restore();
}

function drawOrderCard(ctx, order, i, now) {
  const r = LAYOUT.orderRect(i);
  const frac = patienceFraction(order);
  ctx.fillStyle = '#fff8ea';
  roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fill();
  ctx.strokeStyle = frac < 0.3 ? '#e8452c' : '#d9c9a8';
  ctx.lineWidth = frac < 0.3 ? 3.4 : 2;
  roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.stroke();
  text(ctx, `#${order.serial}  ${order.recipe.name}`, r.x + r.w / 2, r.y + 22, 19, '#4a2c14');
  // ingredient chips, in recipe order
  const items = order.recipe.items;
  const chipW = 48;
  const totalW = items.length * chipW;
  items.forEach((id, j) => {
    const cx = r.x + r.w / 2 - totalW / 2 + chipW / 2 + j * chipW;
    ctx.fillStyle = '#f3e7cd';
    roundRect(ctx, cx - 22, r.y + 42, 44, 52, 9); ctx.fill();
    drawFood(ctx, id, cx, r.y + 62, 34, 30);
    text(ctx, INGREDIENT_BY_ID[id].name, cx, r.y + 86, 10.5, '#7a5a34', 'center', '600');
  });
  text(ctx, `${order.recipe.price} koin`, r.x + r.w / 2, r.y + 112, 13.5, '#a8741a');
  // patience bar
  ctx.fillStyle = '#e7dcc4';
  roundRect(ctx, r.x + 14, r.y + r.h - 20, r.w - 28, 10, 5); ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#5dbb4f' : frac > 0.28 ? '#ffb703' : '#e8452c';
  const pulse = frac < 0.3 ? 0.75 + 0.25 * Math.sin(now * 10) : 1;
  roundRect(ctx, r.x + 14, r.y + r.h - 20, Math.max(8, (r.w - 28) * frac * pulse), 10, 5); ctx.fill();
}

function drawGrill(ctx, kitchen, now) {
  text(ctx, 'PANGGANGAN', 224, 262, 17, '#ffe9c9');
  kitchen.grill.forEach((slot, i) => {
    const r = LAYOUT.grillRect(i);
    ctx.fillStyle = '#3a3f46';
    roundRect(ctx, r.x, r.y, r.w, r.h, 14); ctx.fill();
    ctx.fillStyle = '#22262b';
    ctx.beginPath(); ctx.ellipse(r.x + r.w / 2, r.y + 74, 62, 48, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#4c545e'; ctx.lineWidth = 3; ctx.stroke();
    if (!slot) {
      text(ctx, 'kosong', r.x + r.w / 2, r.y + 74, 14, '#8b95a1', 'center', '600');
      return;
    }
    const bob = slot.state === 'cooking' ? Math.sin(now * 9 + i * 2) * 2 : 0;
    if (slot.state === 'burnt') {
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = '#191919';
      ctx.beginPath(); ctx.ellipse(r.x + r.w / 2, r.y + 74 + bob, 40, 26, 0, 0, 7); ctx.fill();
      ctx.restore();
      text(ctx, 'GOSONG!', r.x + r.w / 2, r.y + 138, 16, '#ff6b4a');
    } else {
      drawFood(ctx, slot.id, r.x + r.w / 2, r.y + 74 + bob, 76, 56);
      if (slot.state === 'done') {
        ctx.strokeStyle = '#7ee081'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(r.x + r.w / 2, r.y + 74, 56, 0, 7); ctx.stroke();
        text(ctx, 'SIAP! klik ambil', r.x + r.w / 2, r.y + 142, 15, '#7ee081');
      } else {
        const p = Math.min(1, slot.t / slot.need);
        ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(r.x + r.w / 2, r.y + 74, 56, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); ctx.stroke();
        text(ctx, 'memasak…', r.x + r.w / 2, r.y + 142, 14, '#ffd98a', 'center', '600');
      }
    }
  });
}

function drawPlate(ctx, kitchen) {
  text(ctx, 'PIRING RAKITAN', 640, 262, 17, '#ffe9c9');
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(640, 452, 168, 30, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#fdfdf8';
  ctx.beginPath(); ctx.ellipse(640, 428, 168, 52, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#cfd4d8'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(640, 428, 118, 34, 0, 0, 7); ctx.stroke();
  if (kitchen.plate.length === 0) {
    text(ctx, 'klik bahan di rak bawah', 640, 428, 16, '#9aa3ab', 'center', '600');
    return;
  }
  kitchen.plate.forEach((id, i) => {
    drawFood(ctx, id, 640, 424 - i * 17, 190, 44);
  });
  text(ctx, kitchen.plate.map((id) => INGREDIENT_BY_ID[id].name).join(' · '), 640, 502, 14.5, '#ffe9c9', 'center', '600');
}

function drawServingPass(ctx, kitchen) {
  text(ctx, 'MEJA SAJI', 1116, 262, 17, '#ffe9c9');
  ctx.fillStyle = '#5d3a1e';
  roundRect(ctx, 986, 470, 260, 116, 12); ctx.fill();
  if (kitchen.lastServed) {
    ctx.fillStyle = '#fdfdf8';
    ctx.beginPath(); ctx.ellipse(1116, 512, 74, 24, 0, 0, 7); ctx.fill();
    kitchen.lastServed.items.slice(0, 5).forEach((id, i) => {
      drawFood(ctx, id, 1116, 508 - i * 8, 96, 26);
    });
    text(ctx, kitchen.lastServed.name, 1116, 552, 15, '#ffe9c9');
    text(ctx, `+${kitchen.lastServed.points} poin`, 1116, 572, 13.5, '#ffd34d', 'center', '600');
  } else {
    text(ctx, 'piring siap saji', 1116, 516, 15, '#d8c49a', 'center', '600');
  }
  const s = LAYOUT.serveRect;
  ctx.fillStyle = '#3f9e3f';
  roundRect(ctx, s.x, s.y, s.w, s.h, 12); ctx.fill();
  text(ctx, 'SAJIKAN  [Spasi]', s.x + s.w / 2, s.y + s.h / 2, 21, '#ffffff');
  const t = LAYOUT.trashRect;
  ctx.fillStyle = '#8a4b2a';
  roundRect(ctx, t.x, t.y, t.w, t.h, 12); ctx.fill();
  text(ctx, 'Buang piring  [⌫]', t.x + t.w / 2, t.y + t.h / 2, 16.5, '#ffe9c9');
}

function drawShelf(ctx) {
  INGREDIENTS.forEach((ingredient, i) => {
    const r = LAYOUT.shelfRect(i);
    ctx.fillStyle = '#fff3d9';
    roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fill();
    ctx.strokeStyle = '#d9b878'; ctx.lineWidth = 2; ctx.stroke();
    drawFood(ctx, ingredient.id, r.x + r.w / 2, r.y + 42, 56, 46);
    text(ctx, ingredient.name, r.x + r.w / 2, r.y + 78, 15.5, '#4a2c14');
    const hint = ingredient.cook > 0 ? `[${ingredient.key}] panggang ${ingredient.cook}d` : `[${ingredient.key}] langsung`;
    text(ctx, hint, r.x + r.w / 2, r.y + 98, 11, '#a07c46', 'center', '600');
  });
}

function drawScene(ctx, kitchen, now) {
  // wall, tiles and counter
  const wall = ctx.createLinearGradient(0, 0, 0, 800);
  wall.addColorStop(0, '#7a4a26');
  wall.addColorStop(0.62, '#96602f');
  wall.addColorStop(0.621, '#6e4520');
  wall.addColorStop(1, '#54331a');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, 1280, 800);
  ctx.strokeStyle = 'rgba(255,235,200,0.10)'; ctx.lineWidth = 2;
  for (let x = 0; x <= 1280; x += 80) { ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, 240); ctx.stroke(); }
  for (let y = 60; y <= 240; y += 45) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1280, y); ctx.stroke(); }
  ctx.fillStyle = '#a4713a';
  ctx.fillRect(0, 636, 1280, 14);

  // HUD
  ctx.fillStyle = '#33200f';
  ctx.fillRect(0, 0, 1280, 56);
  text(ctx, 'DAPUR CERIA', 118, 29, 24, '#ffd34d', 'center', '800');
  const frac = Math.max(0, kitchen.timeLeft / SHIFT_SECONDS);
  ctx.fillStyle = '#57432a';
  roundRect(ctx, 300, 17, 300, 22, 11); ctx.fill();
  ctx.fillStyle = frac > 0.3 ? '#5dbb4f' : '#e8452c';
  roundRect(ctx, 300, 17, Math.max(12, 300 * frac), 22, 11); ctx.fill();
  text(ctx, `Sisa waktu ${Math.ceil(kitchen.timeLeft)} dtk`, 450, 30, 15, '#ffffff');
  text(ctx, `Skor ${kitchen.score}`, 700, 29, 21, '#ffffff', 'center', '800');
  text(ctx, `Koin ${kitchen.coins}`, 836, 29, 18, '#ffd34d');
  text(ctx, kitchen.combo > 1 ? `Kombo x${kitchen.combo} 🔥` : 'Kombo —', 1010, 29, 18, '#ff9d5c');
  text(ctx, `Terjual ${kitchen.served.length}`, 1180, 29, 17, '#ffe9c9', 'center', '600');

  if (kitchen.orders.length === 0 && kitchen.screen === 'playing') {
    text(ctx, 'PAPAN PESANAN — menunggu pelanggan…', 640, 146, 20, '#ffe9c9', 'center', '600');
  }
  kitchen.orders.forEach((order, i) => drawOrderCard(ctx, order, i, now));

  drawGrill(ctx, kitchen, now);
  drawPlate(ctx, kitchen);
  drawServingPass(ctx, kitchen);
  drawShelf(ctx);

  if (kitchen.messageT > 0 && kitchen.message) {
    ctx.fillStyle = 'rgba(30,18,8,0.88)';
    const w = Math.max(280, kitchen.message.length * 11 + 48);
    roundRect(ctx, 640 - w / 2, 566, w, 44, 22); ctx.fill();
    text(ctx, kitchen.message, 640, 589, 19, '#ffe9c9');
  }
  if (kitchen.paused) text(ctx, 'JEDA — tekan P untuk lanjut', 640, 330, 30, '#ffffff', 'center', '800');
}

function overlay(ctx) {
  ctx.fillStyle = 'rgba(24,12,4,0.72)';
  ctx.fillRect(0, 0, 1280, 800);
}

function drawTitle(ctx) {
  overlay(ctx);
  text(ctx, 'DAPUR CERIA', 640, 150, 64, '#ffd34d', 'center', '800');
  text(ctx, 'Game memasak: rakit pesanan, panggang tepat waktu, sajikan sebelum pelanggan pergi!', 640, 205, 20, '#ffe9c9', 'center', '600');
  ctx.fillStyle = 'rgba(255,248,234,0.96)';
  roundRect(ctx, 330, 248, 620, 248, 16); ctx.fill();
  const lines = [
    '🖱️ / ⌨️  Klik bahan di rak — atau tekan tombol 1–0.',
    '🔥 Daging, telur, mie & ayam harus dipanggang dulu.',
    '⏱️  Ambil dari panggangan saat SIAP — terlalu lama jadi GOSONG!',
    '🍽️  Susun piring persis seperti kartu pesanan, lalu SAJIKAN (Spasi).',
    '⭐ Makin cepat & beruntun, makin besar tip dan kombo poinmu.',
    '🕑  Satu giliran = 120 detik. Kumpulkan skor setinggi-tingginya!',
  ];
  lines.forEach((line, i) => text(ctx, line, 640, 284 + i * 36, 18.5, '#4a2c14', 'center', '600'));
  const r = LAYOUT.startRect;
  ctx.fillStyle = '#3f9e3f';
  roundRect(ctx, r.x, r.y, r.w, r.h, 14); ctx.fill();
  text(ctx, 'MULAI MASAK!', r.x + r.w / 2, r.y + r.h / 2, 26, '#ffffff', 'center', '800');
}

function drawOver(ctx, kitchen) {
  overlay(ctx);
  text(ctx, 'GILIRAN SELESAI!', 640, 108, 52, '#ffd34d', 'center', '800');
  const stars = shiftStars(kitchen);
  text(ctx, '★'.repeat(stars) + '☆'.repeat(3 - stars), 640, 168, 54, '#ffc93c', 'center', '800');
  text(ctx, `Skor akhir ${kitchen.score}   ·   Koin ${kitchen.coins}`, 640, 224, 28, '#ffffff', 'center', '800');
  text(ctx, `Hidangan terjual ${kitchen.served.length} · Kombo terbaik x${Math.max(1, kitchen.bestCombo)} · Pelanggan pergi ${kitchen.missed}`, 640, 262, 19, '#ffe9c9', 'center', '600');
  ctx.fillStyle = 'rgba(255,248,234,0.96)';
  roundRect(ctx, 290, 292, 700, 330, 16); ctx.fill();
  text(ctx, 'PIRING SIAP SAJI HARI INI', 640, 326, 20, '#4a2c14', 'center', '800');
  if (kitchen.served.length === 0) {
    text(ctx, 'Belum ada hidangan yang terjual.', 640, 380, 18, '#7a5a34', 'center', '600');
  }
  kitchen.served.slice(0, 8).forEach((dish, i) => {
    const colX = i < 4 ? 350 : 720;
    const y = 366 + (i % 4) * 62;
    ctx.fillStyle = '#fdfdf8';
    ctx.beginPath(); ctx.ellipse(colX + 26, y, 30, 13, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#cfd4d8'; ctx.lineWidth = 1.6; ctx.stroke();
    dish.items.slice(0, 4).forEach((id, j) => drawFood(ctx, id, colX + 26, y - 2 - j * 3, 40, 13));
    text(ctx, dish.name, colX + 66, y - 8, 16.5, '#4a2c14', 'left', '700');
    text(ctx, `+${dish.points} poin`, colX + 66, y + 14, 13.5, '#a8741a', 'left', '600');
  });
  const r = LAYOUT.restartRect;
  ctx.fillStyle = '#3f9e3f';
  roundRect(ctx, r.x, r.y, r.w, r.h, 14); ctx.fill();
  text(ctx, 'MAIN LAGI', r.x + r.w / 2, r.y + r.h / 2, 24, '#ffffff', 'center', '800');
}

/** Draw the whole game for the current kitchen state. */
export function render(ctx, kitchen, now) {
  ctx.save();
  if (kitchen.shake > 0) {
    const m = kitchen.shake * 14;
    ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
  }
  drawScene(ctx, kitchen, now);
  ctx.restore();
  if (kitchen.screen === 'title') drawTitle(ctx);
  if (kitchen.screen === 'over') drawOver(ctx, kitchen);
}
