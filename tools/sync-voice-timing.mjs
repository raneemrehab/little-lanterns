// Copies games/shared/voice-timing.js into every game's index.html, between the
// LL-VOICE-TIMING markers, so each game stays one self-contained file.
//   node tools/sync-voice-timing.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shared = readFileSync(join(root, 'games/shared/voice-timing.js'), 'utf8').trim();
const block = `<script>/* LL-VOICE-TIMING:START — copied from games/shared/voice-timing.js by tools/sync-voice-timing.mjs; edit that file, not this one. */\n${shared}\n/* LL-VOICE-TIMING:END */</script>`;
const re = /<script>\/\* LL-VOICE-TIMING:START[\s\S]*?\/\* LL-VOICE-TIMING:END \*\/<\/script>/;

let changed = 0;
for (const dir of readdirSync(join(root, 'games'))) {
  const file = join(root, 'games', dir, 'index.html');
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  if (!re.test(html)) { console.log(`skip  ${dir} (no LL-VOICE-TIMING block)`); continue; }
  const next = html.replace(re, () => block);
  if (next !== html) { writeFileSync(file, next); changed++; console.log(`sync  ${dir}`); }
  else console.log(`ok    ${dir}`);
}
console.log(`${changed} game(s) updated`);
