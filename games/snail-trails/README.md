# Snail Trails

A writing numerals game for **Counting & Numbers → Writing numerals** ("Trace, then copy, then write 0–9 from memory;
spot backwards numbers"), curriculum **Levels 3–4** (ages 4–6). Sunny the snail draws numbers with a shiny golden trail
that follows the child's finger on a big round garden stone. Everything is painted in a soft watercolour style.

| Curriculum level | Game | What the child does |
| --- | --- | --- |
| Level 3 · Shine | Trace | Follows the dots from the green start dot. The trail only grows along the dots, so the number always comes out the right way round. 4 and 5 have a second, numbered start dot. |
| Level 3 · Shine | Copy | Writes the number on Sunny's sign onto the empty stone. |
| Level 4 · Bright | Write it yourself | Hears a number and writes it from memory. |
| Level 4 · Bright | Spot the backwards one | Taps the pebble whose number is facing the wrong way. It flips round the right way. |
| Level 4 · Bright · 11 to 20 | Trace, Copy, Write it yourself, Spot the backwards one | The same four games with 11 to 20, written as two digits side by side on a wider stone. Copy and Write it yourself show two soft spaces, one for each digit. In Spot, one digit is mirrored (the ones digit of 12 to 19, or the 2 of 20). |

Each game has 5 rounds with five different numbers from 0 to 9 (or 11 to 20). At least three are numbers children often
write backwards (2, 3, 5, 6, 7, 9, or 12, 13, 15, 16, 17, 19). Spot the backwards one only ever flips 2, 3, 4, 5, 6, 7 or 9 (0, 1 and 8 look the same
either way), and puts a look-alike beside it (6 and 9, 2 and 5). Every time a game is played (including **Play again**)
the numbers come in a new order: never the same order as last time, never starting on the same number, and never simply
counting up or down.

**Checking free writing.** In Copy and Write it yourself the game waits until the finger has rested for a moment (so
two-stroke numbers like 4 and 5 aren't checked too early), then compares the shape with every number, written forwards
and backwards, using a point-cloud shape matcher that doesn't mind stroke order, direction, size or a wobbly hand. It
is kind on purpose: a shape counts as right when the right number is as close as any other. For 11 to 20 it tries
every way of splitting the strokes into a left and a right digit, so a cramped or uneven gap still counts.

The game's own stages are never called "Level 5" and so on, so they can't be confused with the curriculum levels.
**Next** leads through all eight games (0 to 9, then 11 to 20), then back to start.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! Sunny the snail draws numbers with a shiny trail. Can you help trace them, copy them and write them all by yourself? Tap a level to start." | |
| Trace round starts | The number ("seven"), then "Start at the green dot and follow the dots." | Dotted number with a pulsing green start dot and an arrow |
| Copy round starts | "Look at the number. Can you write one just like it?" | Sunny's sign drops in with the number |
| Write it yourself round starts | "Listen, then write the number all by yourself." then the number | An empty stone |
| Spot round starts | "One number is facing the wrong way. Can you find it?" | Three pebbles roll in |
| Tracing starts away from the dot | "Start at the green dot." | The green dot pulses |
| Finger lifts or slips off halfway | "Keep going! Follow the dots." | The trail stays where it got to |
| Two slips while tracing | "Watch Sunny draw it first." | The trail draws itself along the dots, then the child has a go |
| Free writing that's backwards | "Oops! That one is facing the wrong way." | The stone wobbles and the trail fades |
| Free writing that's another shape, or a tap on a right-way pebble | "Good guess, but try again" | The stone or pebble wobbles |
| Two tries in Copy | "Watch Sunny draw it first." | The round turns into tracing |
| Two tries in Write it yourself | "Here's a clue. Look at Sunny's sign." (not recorded yet) | Sunny's sign shows the number to copy; two more tries turn it into tracing |
| Two tries in Spot | "Here's a clue. Look at Sunny's sign." (not recorded yet) | Sunny's sign shows the number the right way round |
| Right answer | The number ("five!"), then "Yes! That's right!" and a fanfare | The stone or pebble turns golden and sparkles; a progress dot fills |
| No touch for a while | The question again (at most every 12 seconds) | The stone or pebbles wobble |
| Game finished | "You wrote all the numbers!" (not recorded yet) then "Do you want to play again, or try the next level?" | The well done card with the five numbers glowing |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Snail Trails recordings: `welcome`, `start-at-the-green-dot-and-follow`, `look-at-the-number`, `listen-then-write`, `facing-the-wrong-way-find-it`, `start-at-the-green-dot`, `keep-going`, `oops-wrong-way`, `watch-sunny`. |

Reused recordings: zero and eleven to twenty are from Firefly Jars (`../firefly-jars/audio/`); one to nine and "Good guess, but try again"
are from Light the Lanterns (`../light-the-lanterns/audio/`); "Yes! That's right!" (`right`) and "Do you want to play
again, or try the next level?" (`playAgain`) are from Duck Pond (`../duck-pond/audio/`).

## Putting it on the website

```html
<iframe src="/games/snail-trails/" title="Snail Trails game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object in the first `<script>` of `index.html`: `0` … `9`, `11` … `20`, `tryAgain`, `right`,
`playAgain`, `welcome`, `trace`, `copy`, `listen`, `spot`, `startDot`, `keepGoing`, `wrongWay` and `watchMe`. Two lines
are still to record and can be added under these keys: `clueSign` ("Here's a clue. Look at Sunny's sign.") and
`wellDone` ("You wrote all the numbers!"). Add or replace a string with the base64 of an MP3
(`base64 -w0 audio/welcome.mp3`). Timings come from each clip's own length, so nothing else needs adjusting. A missing
clip is simply skipped.

## Number shapes

The dotted numbers and the shapes the checker compares against are in `DIGITS` (how each number is taught, stroke by
stroke, in a 200×260 box) and `VARIANTS` (other ways children write them, such as a 1 with a flag or an open 4) near
the top of the game's script. `layoutOf` places the two digits of 11 to 20 side by side.
