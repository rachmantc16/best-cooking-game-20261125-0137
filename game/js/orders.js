// Dapur Ceria — the order board: who wants what, and how patient they are.
// Orders are generated from a seeded random source so screenshot scenes and
// replays are deterministic for a given seed.
import { RECIPES } from './recipes.js';

/** mulberry32: a tiny deterministic PRNG, good enough for order shuffling. */
export function seededRandom(seed) {
  let state = (seed >>> 0) || 1;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let orderSerial = 0;

/**
 * A fresh customer order. `rush` (0..1, rises as the shift goes on) shortens
 * patience and favours the longer recipes, so late service is harder.
 */
export function createOrder(random, rush) {
  const pool = rush > 0.55 ? RECIPES : RECIPES.slice(0, 5);
  const recipe = pool[Math.floor(random() * pool.length)];
  const patience = Math.max(26, 46 - rush * 16 - random() * 6);
  orderSerial += 1;
  return {
    serial: orderSerial,
    recipe,
    patience,
    patienceLeft: patience,
    flash: 0,
  };
}

/** Patience fraction left, 1 (just arrived) down to 0 (about to walk out). */
export function patienceFraction(order) {
  return Math.max(0, order.patienceLeft / order.patience);
}
