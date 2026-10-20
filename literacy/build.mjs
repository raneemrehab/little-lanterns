// Builds the review gallery and the text deliverables from src/games.js.
// Run: node literacy/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { GAMES, STRANDS, SHARED_VO, PHONEMES, COMMON } = require("./src/games.js");
const { voRows, pad2 } = require("./src/vo.js");
const src = f => readFileSync(join(here, "src", f), "utf8");
const out = (f, s) => writeFileSync(join(here, f), s);

// 1. Gallery page (one self-contained file)
out("index.html", src("template.html").replace("/*GAMES_JS*/", () => src("games.js")).replace("/*VO_JS*/", () => src("vo.js")));

// 2. Voiceover master list
const rows = voRows(GAMES, SHARED_VO, PHONEMES);
const csvCell = v => /[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : v;
const cols = [["game", "Game"], ["id", "Voiceover ID"], ["text", "Text to record"], ["trigger", "Trigger or purpose"], ["voice", "Voice"], ["lang", "Language and accent"], ["note", "Pronunciation and notes"], ["essential", "Essential or optional"], ["status", "Status"], ["file", "Suggested filename"]];
out("voiceover-master-list.csv", [cols.map(c => c[1]).join(","), ...rows.map(r => cols.map(([k]) => csvCell(r[k] ?? "")).join(","))].join("\n") + "\n");

const mdEsc = s => String(s ?? "").replace(/\|/g, "\\|");
const groups = [...GAMES.map(g => ["G" + pad2(g.n), `Game ${g.n} · ${g.name}`, g]), ["Shared", "Shared narrator lines"], ["Phonemes", "Phonemes"], ["Words", "Words"], ["Chunks", "Chunks"]];
let md = `# Learning Lanterns · Voiceover master list (all 28 games)\n\n${rows.length} recordings. Language: English (UK), assumed from the site's en-GB setting. Nothing has been generated; you provide every recording.\n\n` +
  `- IDs: \`LL-LIT-G01-VO01-introduction\` per game; \`SH\` shared narrator lines, \`PH\` phonemes, \`WD\` words, \`CH\` chunks.\n- Files: one per line, mono MP3 (or WAV), about half a second of silence before and after.\n- Phonemes: pure sounds with no added vowel ("sss", not "suh"). Robot Talk plays them in sequence, so segmented words need no separate recordings.\n- Reuse: three shared lines and all number words are already recorded in the maths games (marked below).\n\n`;
for (const [k, title, g] of groups) {
  const rs = rows.filter(r => r.group === k);
  if (!rs.length) continue;
  md += `## ${title} (${rs.length})\n\n`;
  if (g) {
    if (g.existingScript) md += `${g.existingScript}. Word lists for this game stay as listed in the production tracker.\n\n`;
    if (g.shared.length) md += `Also uses shared lines: ${g.shared.join(", ")}.\n\n`;
    if (g.numbersNote) md += `${g.numbersNote}\n\n`;
    if (g.sfx) md += `${g.sfx}\n\n`;
  }
  md += `| ID | Text to record | Trigger | Voice | Notes | Essential | File |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
  md += rs.map(r => `| \`${r.id}\` | ${mdEsc(r.text)} | ${mdEsc(r.trigger)} | ${mdEsc(r.voice)} | ${mdEsc(r.note)} | ${r.essential} | \`${r.file}\` |`).join("\n") + "\n\n";
}
out("voiceover-master-list.md", md);

// 3. Tracker
const trow = g => {
  const one = g.n === 1, prop = g.n === 28;
  return [g.n, g.name, g.age, g.objective, g.cog, "None in source", one ? "Complete (approved earlier)" : "Complete", `literacy/index.html#g${pad2(g.n)}`,
    one ? "Script ready (110 recordings); recordings pending" : "Required list prepared; recordings pending",
    one ? "Approved" : prop ? "Awaiting your yes (proposed game)" : "Awaiting your review", one ? "Done" : "Not started", one ? "Done" : "Not started", one ? "Waiting for voiceovers" : "Not complete"];
};
out("tracker.md", `# Learning Lanterns · Master tracker (28 games)\n\nUpdated after the visual-design batch. Visual design is complete for all 28 and awaiting review. No game in this batch has been built or tested; Game 1 keeps its earlier status from the production tracker.\n\n` +
  `| # | Game | Age / level | Primary objective | Cognitive skills | Research references | Visual status | Preview | Voiceover status | Visual approval | Game development | Testing | Final completion |\n|${" --- |".repeat(13)}\n` +
  GAMES.map(g => "| " + trow(g).map(mdEsc).join(" | ") + " |").join("\n") + "\n");

// 4. Research map and design notes
let rm = `# Learning Lanterns · Research-to-design map and design notes\n\n**The source tracker contains no research references.** No citations were added from memory. "Design rationale" below is reasoning, not evidence. These games give practice; none is claimed to produce measurable improvement.\n\n## Shared design system\n\n- Feedback: ${COMMON.feedback}\n- Layouts: ${COMMON.layouts}\n- Accessibility in every game:\n${COMMON.a11y.map(a => `  - ${a}`).join("\n")}\n\n`;
for (const g of GAMES) {
  rm += `## ${g.n}. ${g.name}\n\n${g.area} · ${g.age} · Guide: ${g.guide.name}${g.visualNote ? `\n\n> ${g.visualNote}` : ""}\n\n` +
    `- **Primary objective:** ${g.objective}\n- **Supporting skills:** ${g.supporting.join("; ")}\n- **Cognitive skills (source):** ${g.cog}\n` +
    `- **1. What the child does:** ${g.does}\n- **2. What it practises:** ${g.practises}\n- **3. How difficulty grows:**\n${g.levels.map(l => `  - ${l[0]}: ${l[1]}`).join("\n")}\n` +
    `- **4. How feedback teaches:** ${g.feedback}\n- **5. Research:** none in the source. Design rationale: ${g.rationale}\n- **6. Beyond the game:** ${g.transfer}\n` +
    `- **Visual elements:** ${g.visuals.join("; ")}\n- **Accessibility:** ${g.a11y.join("; ")}\n\n`;
}
out("research-mapping.md", rm);
console.log(`Built index.html, ${rows.length} voiceover rows, tracker, research map.`);
