// Dapur Ceria — the pantry and the recipe book.
// Every ingredient the kitchen stocks, and every dish customers can order.
// Ingredients with `cook` seconds must spend that long on the grill before
// they may go on a plate; everything else goes straight from shelf to plate.

export const INGREDIENTS = [
  { id: 'bun',     name: 'Roti',    key: '1', cook: 0, color: '#e8a94e' },
  { id: 'patty',   name: 'Daging',  key: '2', cook: 4, color: '#8a4b2a' },
  { id: 'cheese',  name: 'Keju',    key: '3', cook: 0, color: '#ffc93c' },
  { id: 'lettuce', name: 'Selada',  key: '4', cook: 0, color: '#5dbb4f' },
  { id: 'tomato',  name: 'Tomat',   key: '5', cook: 0, color: '#e8452c' },
  { id: 'egg',     name: 'Telur',   key: '6', cook: 3, color: '#fff3d6' },
  { id: 'noodle',  name: 'Mie',     key: '7', cook: 5, color: '#f2d06b' },
  { id: 'rice',    name: 'Nasi',    key: '8', cook: 0, color: '#f7f4ec' },
  { id: 'chicken', name: 'Ayam',    key: '9', cook: 5, color: '#d98e4a' },
  { id: 'sauce',   name: 'Saus',    key: '0', cook: 0, color: '#c22f2f' },
];

export const INGREDIENT_BY_ID = Object.fromEntries(INGREDIENTS.map((item) => [item.id, item]));

export const RECIPES = [
  { id: 'burger-ceria',   name: 'Burger Ceria',      items: ['bun', 'patty', 'cheese', 'lettuce', 'tomato'], price: 18 },
  { id: 'burger-telur',   name: 'Burger Telur Keju', items: ['bun', 'patty', 'egg', 'cheese'],               price: 16 },
  { id: 'mie-ayam',       name: 'Mie Ayam Komplit',  items: ['noodle', 'chicken', 'lettuce', 'sauce'],       price: 17 },
  { id: 'nasi-telur',     name: 'Nasi Telur Spesial', items: ['rice', 'egg', 'tomato', 'sauce'],             price: 14 },
  { id: 'sandwich-segar', name: 'Sandwich Segar',    items: ['bun', 'lettuce', 'tomato', 'cheese', 'egg'],   price: 15 },
  { id: 'nasi-geprek',    name: 'Nasi Ayam Geprek',  items: ['rice', 'chicken', 'sauce', 'lettuce'],         price: 16 },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((recipe) => [recipe.id, recipe]));

/** True when the plate holds exactly the recipe's ingredients, in any order. */
export function plateMatchesRecipe(plate, recipe) {
  if (plate.length !== recipe.items.length) return false;
  const needed = [...recipe.items].sort();
  const held = [...plate].sort();
  return needed.every((id, index) => id === held[index]);
}
