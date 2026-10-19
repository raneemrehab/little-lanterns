# Clover's Picnic

A more, fewer, same game for **Counting & Numbers → More, fewer, same** ("Which plate has more strawberries? Make both
towers the same"), curriculum **Levels 1–3** (ages 2–5). Clover the bunny is having a picnic.

| Curriculum level | Game | Numbers | What the child does |
| --- | --- | --- | --- |
| Level 1 · Little Sparks | Which has more? | 1 to 5 | Two plates, always at least 2 apart, so "more" can be seen at a glance. Tap the plate with more. |
| Level 1 · Little Sparks | Same tower | 1 to 3 blocks | Build a tower like Clover's. Dashed outlines show where the blocks go. Tap the basket to add a block, tap the top block to take it off. |
| Level 2 · Glow | More or fewer? | 1 to 6 | Two plates only 1 or 2 apart. The question asks for more or for fewer; the **Same** button is always there, and one round has the same on both plates. |
| Level 2 · Glow | Make them match | 2 to 6 blocks | Your tower starts shorter (three rounds) or taller (two rounds) than Clover's. Add blocks or take some off. No outlines. |
| Level 3 · Shine | Don't be tricked! | up to 10 | More, fewer or same. In three rounds the plate with fewer has big strawberries spread out on a big plate, and the plate with more has small ones packed close. One plain round and one round with the same (big against packed). After each right answer, the plates are counted and the strawberries line up in pairs to show why. |
| Level 3 · Shine | Share the blocks | up to 10 blocks | Two towers 2, 4 or 6 apart. Tap a top block to move it to the other tower until both are the same (7 and 3 become 5 and 5). Each tower shows its number. |

Each game has 5 rounds. Every time a game is played (including **Play again**) the rounds come in a new order: never the
same order as last time and never starting on the same round. The plate with more is on the left or the right at
random, and in Glow and Shine "more" and "fewer" questions are mixed.

**Next** leads through all six games: Little Sparks, then Glow, then Shine, then back to start.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! I'm Clover the bunny, and I'm having a picnic! Can you help me find which plate has more, and make my towers the same? Tap a level to start." | |
| Plates round starts | "Which plate has more strawberries?" or "Which plate has fewer strawberries?" | Two plates rise up; the word *more* or *fewer* is in a yellow box |
| Right plate | "Yes! That's right!" (and "They're the same! Both plates have the same." when Same is the answer), then a fanfare | The plate glows and hops, Clover hops, sparkles; Glow and Shine show each plate's number |
| Right plate in Shine | Also the two numbers ("four… seven"), then the line-up and "Look! These ones have no partner. That plate has more." | Both plates' strawberries line up in two rows; the extra ones glow |
| A guess that isn't right | "Good guess, but try again" | The plate or Same button wiggles; everything stays tappable |
| Second guess that isn't right | Glow and Shine: both plates counted aloud. Then "Let's line them up and look." and "Look! These ones have no partner. That plate has more." (or "They're the same!…") | The line-up stays on screen until the round ends |
| Towers round starts | "Make your tower the same as Clover's." (Same tower, first round: also "Tap a block to add it. Tap the top block to take it off.") Share: "Share the blocks so both towers are the same." | |
| A block goes on or off | A wooden clack and the number of blocks in your tower ("three!") | The block flies from the basket, or back to it |
| Your tower gets taller than Clover's | "Yours is taller! Can you take some off?" (once, until it's short again) | Clover's speech bubble |
| Towers are the same | The number for each tower (not in Same tower), then "Hooray! They're the same!" and a fanfare | A dashed line joins the tops, both towers hop |
| No tap for a while | The question again (at most every 12 seconds). Make them match: "Mine is taller. Can you add some more?" or "Yours is taller! Can you take some off?" | Plates wiggle; the basket or a top block glows |
| Game finished | "Yummy! Thank you for helping with my picnic!" then "Do you want to play again, or try the next level?" | The well done card |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork (inline SVG) and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Clover's Picnic recordings: `welcome`, `which-has-more`, `which-has-fewer`, `line-them-up`, `no-partner`, `plates-the-same`, `make-your-tower`, `tap-a-block`, `mine-is-taller`, `yours-is-taller`, `share-the-blocks`, `hooray-the-same`, `well-done`. |

Reused recordings: one to ten and "Good guess, but try again" are from Light the Lanterns (`../light-the-lanterns/audio/`);
"Yes! That's right!" (`right`) and "Do you want to play again, or try the next level?" (`playAgain`) are from Duck Pond
(`../duck-pond/audio/`). The clacks, ticks and fanfare are made in the game.

## Putting it on the website

```html
<iframe src="/games/clovers-picnic/" title="Clover's Picnic game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object in the first `<script>` of `index.html`: `1` … `10`, `tryAgain`, `right`,
`playAgain`, `welcome`, `askMore`, `askFewer`, `lineUp`, `noPartner`, `platesSame`, `makeTower`, `tapBlock`,
`mineTaller`, `yoursTaller`, `share`, `hooray` and `wellDone`. Replace a string with the base64 of a new MP3
(`base64 -w0 audio/well-done.mp3`). Timings come from each clip's own length, so nothing else needs adjusting. A missing
clip is simply skipped.
