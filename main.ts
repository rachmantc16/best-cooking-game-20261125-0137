// Dapur Ceria — make.fun entry program.
// The game is the static site in game/ (game/index.html plus its ES modules,
// stylesheet and no network requests). This program hands it in: it copies
// game/ and screenshots/ into the output directory and writes dossier.json
// there with the vendored make.fun library, byte-identical to what the
// scorer rebuilds. Run it with `node main.ts`; outside the grader,
// MAKEFUN_OUTPUT_DIR points at the output directory instead of /output.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate's own caps, passed through so this program refuses exactly what
// the scorer would refuse (too many or too large screenshots or game files).
const GATE_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
};

function copyTree(name) {
  const from = join(repoRoot, name);
  if (!existsSync(from)) throw new Error(`missing ${name}/ next to main.ts`);
  cpSync(from, join(outputDir, name), { recursive: true });
  return readdirSync(join(outputDir, name)).length;
}

mkdirSync(outputDir, { recursive: true });
const gameEntries = copyTree('game');
const shotEntries = copyTree('screenshots');
const dossier = buildDossier(outputDir, GATE_CAPS);
writeFileSync(join(outputDir, 'dossier.json'), dossier);

console.log(`Dapur Ceria handed in: ${gameEntries} game entries, ${shotEntries} screenshots, dossier ${dossier.length} bytes -> ${outputDir}`);
