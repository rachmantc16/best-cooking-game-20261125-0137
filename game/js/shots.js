// Dapur Ceria — deterministic screenshot scenes behind ?shot=start|play|end.
// Each scene builds a real kitchen from the seed and plays the actual rules
// into place, so the frame is a genuine moment of the game, identical for
// the same seed every time.
import { createKitchen } from './kitchen.js';
import { createOrder } from './orders.js';
import { RECIPE_BY_ID } from './recipes.js';

/** Stage the named scene into a fresh kitchen and return it. */
export function stageShot(name, seed) {
  const kitchen = createKitchen(seed);
  if (name === 'play') {
    kitchen.screen = 'playing';
    kitchen.elapsed = 46;
    kitchen.timeLeft = 74;
    kitchen.score = 86;
    kitchen.coins = 61;
    kitchen.combo = 3;
    kitchen.bestCombo = 3;
    kitchen.orders = [
      { serial: 4, recipe: RECIPE_BY_ID['burger-ceria'], patience: 40, patienceLeft: 27, flash: 0 },
      { serial: 5, recipe: RECIPE_BY_ID['mie-ayam'], patience: 44, patienceLeft: 35, flash: 0 },
      { serial: 6, recipe: RECIPE_BY_ID['nasi-telur'], patience: 38, patienceLeft: 12, flash: 0 },
    ];
    // A Burger Ceria mid-assembly: bun down, patty cooked, cheese on top.
    kitchen.plate = ['bun', 'patty', 'cheese'];
    // An egg two-thirds cooked on the left grill; the right grill is free.
    kitchen.grill[0] = { id: 'egg', t: 2, need: 3, state: 'cooking' };
    const earlier = { name: 'Burger Telur Keju', items: [...RECIPE_BY_ID['burger-telur'].items], points: 49 };
    kitchen.lastServed = earlier;
    kitchen.served = [earlier];
    kitchen.message = 'Burger Ceria sedang dirakit…';
    kitchen.messageT = 999;
    kitchen.spawnIn = 4;
    return kitchen;
  }
  if (name === 'end') {
    kitchen.screen = 'over';
    kitchen.elapsed = 120;
    kitchen.timeLeft = 0;
    kitchen.score = 342;
    kitchen.coins = 238;
    kitchen.combo = 0;
    kitchen.bestCombo = 6;
    kitchen.missed = 1;
    const names = ['burger-ceria', 'mie-ayam', 'nasi-telur', 'burger-telur', 'nasi-geprek', 'sandwich-segar'];
    const points = [52, 61, 44, 49, 58, 78];
    kitchen.served = names.map((id, i) => ({
      name: RECIPE_BY_ID[id].name,
      items: [...RECIPE_BY_ID[id].items],
      points: points[i],
    }));
    kitchen.lastServed = kitchen.served[kitchen.served.length - 1];
    return kitchen;
  }
  // start: the title screen over a stocked, empty kitchen with one order up.
  kitchen.orders = [createOrder(kitchen.random, 0)];
  return kitchen;
}
