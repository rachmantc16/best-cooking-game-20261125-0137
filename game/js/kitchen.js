// Dapur Ceria — the kitchen itself: shift clock, grill, assembly plate,
// serving, scoring and combos. Pure state and rules; rendering and input
// live in their own files and only call the actions exported here.
import { INGREDIENT_BY_ID, plateMatchesRecipe } from './recipes.js';
import { createOrder, seededRandom } from './orders.js';

export const SHIFT_SECONDS = 120;
export const MAX_ORDERS = 4;
export const GRILL_SLOTS = 2;
/** Seconds of grace after an item is perfectly cooked before it burns. */
export const BURN_GRACE = 2.5;

export function createKitchen(seed) {
  return {
    screen: 'title', // 'title' | 'playing' | 'over'
    random: seededRandom(seed),
    timeLeft: SHIFT_SECONDS,
    elapsed: 0,
    score: 0,
    coins: 0,
    combo: 0,
    bestCombo: 0,
    served: [],
    missed: 0,
    orders: [],
    spawnIn: 0,
    plate: [],
    grill: Array.from({ length: GRILL_SLOTS }, () => null),
    lastServed: null,
    message: '',
    messageT: 0,
    shake: 0,
    paused: false,
  };
}

export function startShift(kitchen) {
  const seed = Math.floor(Math.random() * 1e9);
  Object.assign(kitchen, createKitchen(seed), { screen: 'playing' });
  kitchen.orders.push(createOrder(kitchen.random, 0), createOrder(kitchen.random, 0));
  kitchen.spawnIn = 5;
}

/** How far into the shift we are, 0 at opening to 1 at closing. */
export function rushLevel(kitchen) {
  return Math.min(1, kitchen.elapsed / SHIFT_SECONDS);
}

function say(kitchen, text, seconds = 1.6) {
  kitchen.message = text;
  kitchen.messageT = seconds;
}

/**
 * Take an ingredient from the shelf. Cookable ingredients land on a free
 * grill slot raw; everything else goes straight onto the assembly plate.
 * Returns 'grill' | 'plate' | 'busy' | 'full'.
 */
export function takeIngredient(kitchen, id) {
  const ingredient = INGREDIENT_BY_ID[id];
  if (!ingredient || kitchen.screen !== 'playing') return 'busy';
  if (ingredient.cook > 0) {
    const slot = kitchen.grill.findIndex((entry) => entry === null);
    if (slot === -1) { say(kitchen, 'Panggangan penuh!'); return 'busy'; }
    kitchen.grill[slot] = { id, t: 0, need: ingredient.cook, state: 'cooking' };
    return 'grill';
  }
  if (kitchen.plate.length >= 6) { say(kitchen, 'Piring penuh!'); return 'full'; }
  kitchen.plate.push(id);
  return 'plate';
}

/**
 * Click a grill slot: a perfectly cooked item moves to the plate, a burnt
 * one goes in the bin. Returns 'plated' | 'binned' | 'wait'.
 */
export function collectGrill(kitchen, slot) {
  const entry = kitchen.grill[slot];
  if (!entry) return 'wait';
  if (entry.state === 'cooking') { say(kitchen, 'Belum matang…'); return 'wait'; }
  kitchen.grill[slot] = null;
  if (entry.state === 'burnt') { say(kitchen, 'Gosong! Dibuang.'); return 'binned'; }
  if (kitchen.plate.length >= 6) { say(kitchen, 'Piring penuh!'); kitchen.grill[slot] = entry; return 'wait'; }
  kitchen.plate.push(entry.id);
  return 'plated';
}

export function clearPlate(kitchen) {
  if (kitchen.plate.length === 0) return;
  kitchen.plate = [];
  kitchen.combo = 0;
  say(kitchen, 'Piring dikosongkan.');
}

/**
 * Serve the plate. It must match one waiting order exactly; a match pays the
 * recipe price plus a patience tip, multiplied by the running combo. A plate
 * nobody ordered breaks the combo.
 */
export function servePlate(kitchen) {
  if (kitchen.plate.length === 0) { say(kitchen, 'Piring masih kosong!'); return 'empty'; }
  const index = kitchen.orders.findIndex((order) => plateMatchesRecipe(kitchen.plate, order.recipe));
  if (index === -1) {
    kitchen.combo = 0;
    kitchen.shake = 0.35;
    say(kitchen, 'Tidak ada pesanan seperti itu!');
    return 'wrong';
  }
  const [order] = kitchen.orders.splice(index, 1);
  const tip = Math.round(10 * (order.patienceLeft / order.patience));
  kitchen.combo += 1;
  kitchen.bestCombo = Math.max(kitchen.bestCombo, kitchen.combo);
  const earned = (order.recipe.price + tip) * (1 + Math.min(4, kitchen.combo - 1) * 0.25);
  const points = Math.round(earned);
  kitchen.score += points;
  kitchen.coins += order.recipe.price + tip;
  kitchen.lastServed = { name: order.recipe.name, items: [...order.recipe.items], points };
  kitchen.served.push(kitchen.lastServed);
  kitchen.plate = [];
  say(kitchen, `+${points} poin — ${order.recipe.name}!`);
  if (kitchen.spawnIn > 2.2) kitchen.spawnIn = 2.2;
  return 'served';
}

/** Stars earned for a finished shift: 1, 2 or 3 by score. */
export function shiftStars(kitchen) {
  if (kitchen.score >= 320) return 3;
  if (kitchen.score >= 190) return 2;
  if (kitchen.score >= 90) return 1;
  return 0;
}

/** Advance the whole kitchen by dt seconds. Returns events for sound cues. */
export function updateKitchen(kitchen, dt) {
  const events = [];
  if (kitchen.screen !== 'playing' || kitchen.paused) return events;
  kitchen.elapsed += dt;
  kitchen.timeLeft = Math.max(0, SHIFT_SECONDS - kitchen.elapsed);
  kitchen.messageT = Math.max(0, kitchen.messageT - dt);
  kitchen.shake = Math.max(0, kitchen.shake - dt);

  for (const slot of kitchen.grill) {
    if (!slot) continue;
    slot.t += dt;
    if (slot.state === 'cooking' && slot.t >= slot.need) { slot.state = 'done'; events.push('ding'); }
    else if (slot.state === 'done' && slot.t >= slot.need + BURN_GRACE) { slot.state = 'burnt'; events.push('burn'); }
  }

  for (const order of kitchen.orders) {
    order.patienceLeft -= dt;
    order.flash = Math.max(0, order.flash - dt);
  }
  const before = kitchen.orders.length;
  kitchen.orders = kitchen.orders.filter((order) => order.patienceLeft > 0);
  if (kitchen.orders.length < before) {
    kitchen.missed += before - kitchen.orders.length;
    kitchen.combo = 0;
    events.push('miss');
    say(kitchen, 'Pelanggan pergi kecewa…');
  }

  kitchen.spawnIn -= dt;
  if (kitchen.spawnIn <= 0 && kitchen.orders.length < MAX_ORDERS) {
    kitchen.orders.push(createOrder(kitchen.random, rushLevel(kitchen)));
    kitchen.spawnIn = Math.max(3.2, 7 - rushLevel(kitchen) * 3.4);
    events.push('bell');
  }

  if (kitchen.timeLeft <= 0) {
    kitchen.screen = 'over';
    events.push('close');
  }
  return events;
}
