# Learning Lanterns · Literacy games development tracker (28 games)

Statuses: Not started / In development / Awaiting an essential asset / Implemented / Testing / Passed / Blocked.
A game is marked Passed only when automated play (a script driving a real browser and tapping like a child) finished
every level on the wrong path (a wrong answer first, then the right one, so the retry ladder runs) at desktop size,
plus Level 1 at phone size (390×844) with repeated taps (the same thing six times, the speaker six times, random
bursts) and Level 2 at tablet size (820×1180) on the right path, with no voice overlaps, no line starting before its
configured pause, and no page errors. Every voice line was logged with its start time and length to check this.
Passed means the automated checks passed; nobody has listened on a real phone or tablet yet.

Scope note: the source production tracker lists only Games 1–12 as Literacy; 13–27 are its Main curriculum and 28 is
proposed. All 28 are built here as designed in the visual batch (`literacy/src/games.js`), as asked.

Games live in `literacy/play/<nn>-<name>/index.html`; `literacy/play/index.html` is a literacy-only launcher for
testing. Voice pauses are set in one place: `games/shared/voice-timing.js`.

| # | Game | Status | Voiceovers used | Tested | Open issues / missing assets | Next step |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Echo Cave | Passed | G01 VO01–41 (Pip's own lines), word bank | All 8 levels, wrong path; phone with repeated taps; tablet | Echo Cave's own word recordings (ECW/ECB) are not supplied, so the shared word bank (same voice) is used. No 4-beat word is recorded, so beats go up to 3. | Listen on a device; add ECW/ECB words when recorded |
| 2 | Sound Safari | Passed | G02 lines, word bank | All 4 levels, wrong path; phone with repeated taps; tablet | Phoneme recordings (LL-LIT-PH-*) missing: "stretch the sound" replays the whole word instead | Swap in phonemes when recorded |
| 3 | Letter Post Office | Awaiting an essential asset | — | — | Needs the 30 phoneme recordings (hear a sound, find its letter) | Build once phonemes arrive |
| 4 | Robot Talk | Awaiting an essential asset | — | — | Needs phonemes (robot says c… a… t) | Build once phonemes arrive |
| 5 | Potion Spells | Awaiting an essential asset | — | — | Needs phonemes (segmenting and spelling by sound); G05-VO03 flagged "check by ear" | Build once phonemes arrive |
| 6 | Word Train | Passed | G06 lines, word bank | All 4 levels, wrong path; phone with repeated taps; tablet | Sound buttons under words hidden (need phonemes); sentences have no recordings so the child reads them (as designed); G06-VO03 flagged "check by ear" | Add sound buttons when phonemes arrive |
| 7 | Chunk Kitchen | Passed | G07 lines, chunk recordings (CH-*), word bank | All 4 levels, wrong path; phone with repeated taps; tablet | Only recorded words can be read back: wrong onsets make recorded words (rain, hat…) or a clear non-word ("Let's read what we made" + the chunk). Levels 3–4 have 2 orders each (only jump/jumping/jumped and unlock/relock recorded). G07-VO03 flagged "check by ear" | More -ing/-ed and un-/re- words would allow 5 orders |
| 8 | Word Collector | Awaiting an essential asset | — | — | Story sentences recorded for only 2 of 10 words (tiny, enormous); Level 1 word "wet" not recorded; G08-VO03 flagged "check by ear" | Build once story lines are recorded |
| 9 | Puppet Theatre | Awaiting an essential asset | — | — | Script lines for the child to read along with are not recorded | Build once script lines arrive |
| 10 | Story Map Explorer | Awaiting an essential asset | — | — | Story parts (the story itself) not recorded | Build once story parts arrive |
| 11 | Sky Writer | Awaiting an essential asset | — | — | Needs letter-sound recordings; G11-VO03 flagged "check by ear" | Build once phonemes arrive |
| 12 | Postcard Studio | Passed | G12 lines, word bank | All 4 levels, wrong path; phone with repeated taps; tablet | Sentences use recorded words only ("I see a …"). Read-back of a misspelt typed word can't be voiced (the tile glows and "Does that make sense?" plays). Read-back speed is the recording's own speed with an adjustable gap (WORD_GAP_MS) | Listen on a device |
| 13 | Lantern Lookout | Passed | G13 lines | All 4 levels, wrong path; phone with repeated taps; tablet | — | Listen on a device |
| 14 | Night Sounds | Awaiting an essential asset | — | — | Animal and night sound effects not supplied; G14-VO02 flagged "check by ear" | Build once sounds arrive |
| 15 | Firefly Deliveries | Passed | G15 lines | All 4 levels, wrong path; phone with repeated taps; tablet | — | Listen on a device |
| 16 | Moon Rules | Passed | G16 lines | All 4 levels, wrong path; phone with repeated taps; tablet | — | Listen on a device |
| 17 | Sleepy Owl | Passed | G17 lines | All 4 levels; tap test (catches only at catch time, "Shh" on wrong taps, opposite day); phone with repeated taps; tablet | G17-VO02 flagged "check by ear" | Listen on a device |
| 18 | Inspector | Passed | G18 lines | All 4 levels, wrong path; phone with repeated taps; tablet | — | Listen on a device |
| 19 | Festival Strings | Passed | G19 lines | All 4 levels (Level 4 make-your-own on the right path); phone with repeated taps; tablet | Make-your-own now helps after two non-repeating tries; that help path isn't covered by the automated run | Listen on a device |
| 20 | Night Story | Passed | G20 lines | All 4 levels, wrong path; phone with repeated taps; tablet | Fixed: tap-then-tap swapping at Level 4 didn't work | Listen on a device |
| 21 | Shadow Shapes | Passed | G21 lines | All 4 levels, wrong path, with turning; phone with repeated taps; tablet | G21-VO01 flagged "check by ear"; only the house picture has a "You made a…" line | Listen on a device |
| 22 | Lantern Helper | Awaiting an essential asset | — | — | Only 2 instructions recorded (VO03, VO04); a level needs many more | Build once instructions are recorded |
| 23 | Story Lanterns | Awaiting an essential asset | — | — | Story lines and questions not recorded | Build once story lines arrive |
| 24 | Firefly Jars | Passed | G24 lines, numbers from the maths games | All 4 levels, wrong path; phone with repeated taps; tablet | Level 4 (two jars up to 20) takes about 8 minutes on the wrong path | Consider fewer rounds at Level 4 |
| 25 | Flash Jar | Passed | G25 lines, numbers | All 4 levels, wrong path; phone with repeated taps; tablet | — | Listen on a device |
| 26 | Lantern Path | Passed | G26 lines, numbers | All 4 levels, wrong path; phone with repeated taps; tablet | — | Listen on a device |
| 27 | Lantern Builder | Passed | G27 lines | All 4 levels, wrong path; phone with repeated taps; tablet | — | Listen on a device |
| 28 | Split the Jar (proposed) | Passed | G28 lines, numbers | All 4 levels, wrong path; phone with repeated taps; tablet | Repeating a split already found isn't covered by the automated run | Listen on a device |

## Shared items

- Pictures are emoji stand-ins until final art is supplied.
- Nine clips are flagged "check by ear" in `split-report.csv`: G03-VO11, G05-VO03, G06-VO03, G07-VO03, G08-VO03, G11-VO03, G14-VO02, G17-VO02, G21-VO01. Four are in built games (06, 07, 17, 21) and are used as split.
- The shared lines "try again", "that's right" and "play again" reuse the maths recordings; numbers 0–20 are copied from the maths games.
- Maths games' voice-timing retrofit is parked on branch `voice-timing-maths-games` (no PR) per the literacy-only scope.
