# Maple's Cookies

A zero game for **Counting & Numbers → Zero** ("No cookies left" = 0; empty plate counting), curriculum
**Levels 2–3** (ages 3–5). Maple the mouse eats cookies at the kitchen table.

| Curriculum level | Game | Numbers | What the child does |
| --- | --- | --- | --- |
| Level 2 · Glow | All gone! | 5 down to 0 | Tap cookies to give them to Maple. After each one the voice says how many are left, until the plate is empty: "zero! No cookies left! That's zero." |
| Level 2 · Glow | How many? | 0 to 5 | Count the cookies on one plate and tap the number. Two of the five plates are empty. |
| Level 3 · Shine | Find the plate | 0 to 10 | Maple holds up a number; tap the plate with that many cookies. 0 is asked twice, and an empty plate is often one of the choices when it isn't the answer. |
| Level 3 · Shine | How many left? | 0 to 10 | The voice says how many cookies are on the plate, Maple eats some or all of them, and the child taps how many are left. Two of the five rounds leave nothing. |

Each game has 5 rounds. Zero is always one of the number buttons. All gone! starts once from each of 1 to 5 cookies;
How many? uses 0 twice and three different numbers from 1 to 5; Find the plate uses 0 twice, one number from 1 to 5 and
two from 6 to 10; How many left? leaves 0 twice and three different numbers from 1 to 5 (Maple eats 1 to 5, or 3 to 8
when she eats them all). Zero never comes twice in a row. Every time a game is played (including **Play again**) the
numbers come in a new order: never the same order as last time, never starting on the same number, and never simply
counting up or down.

Plates show dice patterns up to 5 and two rows of five from 6 to 10 (the back row fills first), like Hazel's plate. In
How many left?, each eaten cookie leaves a dashed outline, so the child can see where the cookies were.

**Next** leads through all four games: Glow (All gone!, How many?), then Shine (Find the plate, How many left?), then
back to start.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! I'm Maple the mouse, and I love cookies! Can you help me count them, all the way down to zero? Tap a level to start." | |
| All gone! first round | "Tap a cookie to give it to Maple." | The plate slides in; a number track counts down to a big yellow 0 |
| A cookie is given | A crunch, then the number left ("two!") | The cookie flies to Maple, who munches it; crumbs stay on the plate |
| Last cookie | "zero!", then "No cookies left! That's zero." and a fanfare | The plate glows, a big 0 sign pops up, Maple hops |
| How many? round starts | "How many cookies are on the plate?" | One plate; three round number buttons |
| Find the plate round starts | "Which plate matches the number?" | Maple drops in with her number sign; three plates rise up |
| How many left? round starts | The starting number ("seven!"), then "Watch Maple. How many cookies are left?" | Maple eats the cookies one by one; the buttons appear when she's done |
| Right answer | The number, then "Yes! That's right!" (and "No cookies left! That's zero." when it's 0), then a fanfare | The plate glows and hops, sparkles; a progress dot fills |
| A guess that isn't right | "Good guess, but try again" | The plate or button wiggles; everything stays tappable |
| First guess when the answer is 0 | Also "Look! The plate is empty. There are no cookies." (Find the plate: "Zero means none at all. Can you find the empty plate?") | |
| Second guess that isn't right | Find the plate: the chosen plate counted aloud. How many? and How many left?: the plate counted aloud, or "zero!" when it's empty | Each cookie pulses as it is counted; for 0, the 0 button glows |
| No tap for a while | The question again (at most every 12 seconds) | All gone!: a cookie glows. Otherwise the plates or buttons wiggle |
| Game finished | "Yum! Thank you for sharing your cookies!" then "Do you want to play again, or try the next level?" | The well done card |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Maple's Cookies recordings: `welcome`, `tap-a-cookie`, `no-cookies-left`, `how-many-cookies`, `which-plate-matches`, `watch-maple`, `the-plate-is-empty`, `zero-means-none`, `well-done`. |

Reused recordings: zero is from Firefly Jars (`../firefly-jars/audio/`); one to ten and "Good guess, but try again" are
from Light the Lanterns (`../light-the-lanterns/audio/`); "Yes! That's right!" (`right`) and "Do you want to play
again, or try the next level?" (`playAgain`) are from Duck Pond (`../duck-pond/audio/`). The crunch is made in the game.

## Putting it on the website

```html
<iframe src="/games/maples-cookies/" title="Maple's Cookies game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object in the first `<script>` of `index.html`: `0` … `10`, `tryAgain`, `right`,
`playAgain`, `welcome`, `tapCookie`, `noneLeft`, `howMany`, `whichPlate`, `watchLeft`, `emptyHint`, `zeroHint` and
`wellDone`. Replace a string with the base64 of a new MP3 (`base64 -w0 audio/well-done.mp3`). Timings come from each
clip's own length, so nothing else needs adjusting. A missing clip is simply skipped.
