// Dapur Ceria — bootstrap: wire canvas, input, sound and the frame loop.
// With ?shot=start|play|end&seed=N the game opens on a deterministic staged
// scene (used for the entry screenshots); otherwise it opens on the title.
import { createKitchen, updateKitchen } from './kitchen.js';
import { render } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';
import { sfx } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const seed = Number(params.get('seed') ?? '1') || 1;

const kitchen = shot ? stageShot(shot, seed) : createKitchen(seed);
attachInput(canvas, kitchen);

let last = performance.now();
let announced = '';
function frame(nowMs) {
  const dt = Math.min(0.05, (nowMs - last) / 1000);
  last = nowMs;
  const events = updateKitchen(kitchen, dt);
  for (const event of events) {
    if (event === 'ding') sfx.ding();
    else if (event === 'bell') sfx.bell();
    else if (event === 'miss') sfx.miss();
    else if (event === 'burn') sfx.burn();
  }
  render(ctx, kitchen, nowMs / 1000);
  const line = kitchen.screen === 'playing'
    ? `Skor ${kitchen.score}, ${kitchen.orders.length} pesanan menunggu, sisa waktu ${Math.ceil(kitchen.timeLeft)} detik`
    : kitchen.screen === 'over' ? `Giliran selesai, skor ${kitchen.score}` : 'Dapur Ceria, tekan Mulai Masak';
  if (line !== announced) { announced = line; status.textContent = line; }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
