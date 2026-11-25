// Dapur Ceria — mouse and keyboard control. Click regions come from the
// same LAYOUT the renderer draws, so what you see is what you click.
import { INGREDIENTS } from './recipes.js';
import { LAYOUT } from './render.js';
import { clearPlate, collectGrill, servePlate, startShift, takeIngredient } from './kitchen.js';
import { sfx } from './audio.js';

function inside(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function cue(result, servedResult) {
  if (servedResult === 'served') sfx.served();
  else if (servedResult) sfx.wrong();
  else if (result === 'grill') sfx.pick();
  else if (result === 'plated') sfx.plated();
  else if (result === 'plate') sfx.pick();
  else if (result === 'binned') sfx.burn();
}

/** Handle a click at canvas coordinates (x, y). */
export function handleClick(kitchen, x, y) {
  if (kitchen.screen === 'title') {
    if (inside(x, y, LAYOUT.startRect)) { startShift(kitchen); sfx.bell(); }
    return;
  }
  if (kitchen.screen === 'over') {
    if (inside(x, y, LAYOUT.restartRect)) { startShift(kitchen); sfx.bell(); }
    return;
  }
  if (kitchen.screen !== 'playing') return;
  for (let i = 0; i < INGREDIENTS.length; i += 1) {
    if (inside(x, y, LAYOUT.shelfRect(i))) { cue(takeIngredient(kitchen, INGREDIENTS[i].id)); return; }
  }
  for (let i = 0; i < kitchen.grill.length; i += 1) {
    if (inside(x, y, LAYOUT.grillRect(i))) { cue(collectGrill(kitchen, i)); return; }
  }
  if (inside(x, y, LAYOUT.serveRect)) { cue(null, servePlate(kitchen)); return; }
  if (inside(x, y, LAYOUT.trashRect)) { clearPlate(kitchen); sfx.wrong(); }
}

/** Handle a key press. Digits pick ingredients, Q/W collect the grill. */
export function handleKey(kitchen, key) {
  if (kitchen.screen !== 'playing') {
    if ((key === 'Enter' || key === ' ') && kitchen.screen !== 'playing') startShift(kitchen);
    return;
  }
  const ingredient = INGREDIENTS.find((item) => item.key === key);
  if (ingredient) { cue(takeIngredient(kitchen, ingredient.id)); return; }
  switch (key.toLowerCase()) {
    case 'q': cue(collectGrill(kitchen, 0)); break;
    case 'w': cue(collectGrill(kitchen, 1)); break;
    case ' ':
    case 'enter': cue(null, servePlate(kitchen)); break;
    case 'backspace': clearPlate(kitchen); break;
    case 'p': kitchen.paused = !kitchen.paused; break;
    default: break;
  }
}

/** Attach mouse + keyboard listeners to the canvas/window. */
export function attachInput(canvas, kitchen) {
  canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    handleClick(kitchen, x, y);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Backspace') event.preventDefault();
    if (!event.repeat) handleKey(kitchen, event.key === 'Enter' ? 'enter' : event.key);
  });
}
