# Firefly Jars

A numeral recognition game for **Counting & Numbers → Numeral recognition** ("0–5, then 0–10, then 11–20; match
numeral to dots"), curriculum **Levels 2–4** (ages 3–6). The "dots" are round glowing fireflies in glass jars.

| Curriculum level | Numbers | Games | Fireflies shown as |
| --- | --- | --- | --- |
| Level 2 · Glow | 0 to 5 | Find the jar, Find the number | Dice patterns; 0 is an empty jar |
| Level 3 · Shine | 0 to 10 | Find the jar, Find the number | Dice patterns up to 5, then a ten frame (the left column of five fills first) |
| Level 4 · Bright | 11 to 20 | Find the jar, Find the number | A full ten frame plus a second frame ("ten and four more") |

- **Find the jar:** a number glows on a hanging lantern. The child taps the jar with that many fireflies.
- **Find the number:** one jar of fireflies. The child taps the matching number.

Each game has 5 rounds and 3 choices, always including a next-door number (for example 3, 4 and 6 for four), so the
answer depends on reading the number. Glow always asks for 0 once; Shine has at least three rounds from 6 to 10 and two
from 0 to 5; Bright uses five different numbers from 11 to 20. Every time a game is played (including **Play again**)
the numbers come in a new order: never the same order as last time, never starting on the same number, and never
simply counting up or down.

The game's own stages are never called "Level 5" and so on, so they can't be confused with the curriculum levels.
**Next** leads through all six games: Glow (Find the jar, Find the number), then Shine, then Bright, then back to start.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! The fireflies are hiding in jars. Can you match each number to the jar with that many fireflies? Tap a level to start." | |
| Find the jar round starts | "Which jar matches the number?" (the number itself is never said first) | The lantern drops in with the number; three jars rise up |
| Find the number round starts | "How many fireflies? Find the number." | One big jar; three round number buttons |
| Right answer | The number ("fourteen!"), then "Yes! That's right!" and a fanfare | The jar lights up and hops, its fireflies twinkle in turn, sparkles; a progress dot fills |
| A guess that isn't right | "Good guess, but try again" | The jar or button wiggles; everything stays tappable |
| First guess when the answer is 0 | Also "Zero means none at all. Can you find the empty jar?" | |
| First guess for 11–20 | Also "Look! A full ten, and some more." | |
| Second guess that isn't right | The fireflies are counted aloud: in Find the jar, the jar the child chose; in Find the number, the big jar. For 11–20: "ten!" over the full frame, then counting on | Each firefly pulses as it is counted |
| No tap for a while | The question again (at most every 12 seconds) | The jars or buttons wiggle |
| Game finished | "You matched all the numbers!" then "Do you want to play again, or try the next level?" | The well done card |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Firefly Jars recordings: `zero`, `eleven` … `twenty`, `welcome`, `which-jar-matches`, `find-the-number`, `zero-means-none`, `a-full-ten`, `well-done`. |

Reused recordings: one to ten and "Good guess, but try again" are from Light the Lanterns (`../light-the-lanterns/audio/`);
"Yes! That's right!" (`right`) and "Do you want to play again, or try the next level?" (`playAgain`) are from Duck Pond
(`../duck-pond/audio/`).

## Putting it on the website

```html
<iframe src="/games/firefly-jars/" title="Firefly Jars game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object in the first `<script>` of `index.html`: `0` … `20`,
`tryAgain`, `right`, `playAgain`, `welcome`, `whichJar`, `findNumber`, `zeroHint`, `tenMore` and `wellDone`. Replace a
string with the base64 of a new MP3 (`base64 -w0 audio/well-done.mp3`). Timings come from each clip's own length, so
nothing else needs adjusting. A missing clip is simply skipped.
