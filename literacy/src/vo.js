/* Builds the flat voiceover master list from games.js. Used by the gallery page and by build.mjs. */
const pad2 = n => String(n).padStart(2, "0");
const LANG = "English (UK)";

function voRows(GAMES, SHARED_VO, PHONEMES) {
  const rows = [];
  const usedBy = (key, field) => GAMES.filter(g => (g[field] || []).includes(key)).map(g => "G" + pad2(g.n)).join(", ");
  GAMES.forEach(g => {
    g.vo.forEach(([slug, text, trigger, ess, note], i) => {
      const id = `LL-LIT-G${pad2(g.n)}-VO${pad2(i + 1)}-${slug}`;
      const ec = (trigger.match(/\((EC-\d+)\)/) || [])[1];
      rows.push({ group: `G${pad2(g.n)}`, game: `${g.n}. ${g.name}`, id, text, trigger: trigger.replace(/ \(EC-\d+\)/, ""), voice: g.guide.name,
        lang: LANG, note: [note, ec ? `Already scripted as ${ec}` : ""].filter(Boolean).join(". "), essential: ess ? "Essential" : "Optional",
        file: id + ".mp3", status: ec ? "Scripted; recording pending" : "Recording pending" });
    });
  });
  SHARED_VO.forEach(([slug, text, trigger, ess, note, existing], i) => {
    const id = `LL-LIT-SH-VO${pad2(i + 1)}-${slug}`;
    rows.push({ group: "Shared", game: "Shared · used by " + usedBy(slug, "shared"), id, text, trigger, voice: "Narrator (same voice as the maths games)",
      lang: LANG, note: [note, existing ? "Reuse: " + existing : ""].filter(Boolean).join(". "), essential: ess ? "Essential" : "Optional",
      file: id + ".mp3", status: existing ? "Recorded already" : "Recording pending" });
  });
  PHONEMES.forEach(([key, ipa, note]) => {
    const id = `LL-LIT-PH-${key}`;
    rows.push({ group: "Phonemes", game: "Phoneme · used by " + usedBy(key, "phon"), id, text: ipa, trigger: "Letter and sound prompts; played in sequence for blending", voice: "Narrator",
      lang: LANG, note, essential: "Essential", file: id + ".mp3", status: "Recording pending" });
  });
  const words = [...new Set(GAMES.flatMap(g => g.words || []))].sort();
  words.forEach(w => {
    const id = `LL-LIT-WD-${w.toLowerCase()}`;
    rows.push({ group: "Words", game: "Word · used by " + usedBy(w, "words"), id, text: w, trigger: "Picture name on tap; said after a right answer", voice: "Narrator",
      lang: LANG, note: "Say the word plainly once, no stretching", essential: "Essential", file: id + ".mp3", status: "Recording pending" });
  });
  GAMES.filter(g => g.chunks).forEach(g => g.chunks.forEach(c => {
    const id = `LL-LIT-CH-${c}`;
    rows.push({ group: "Chunks", game: `${g.n}. ${g.name}`, id, text: c, trigger: "Chunk said when tapped or joined", voice: "Narrator",
      lang: LANG, note: "Say the chunk as it sounds in a word (ain as in rain, ight as in light, un as in undo)", essential: "Essential", file: id + ".mp3", status: "Recording pending" });
  }));
  return rows;
}

if (typeof module !== "undefined") module.exports = { voRows, pad2 };
