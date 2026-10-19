# Lily Pad Words

A number names and words game for **Counting & Numbers → Number names and words** ("Match 3 to "three"; read number
words 1–10"), curriculum **Levels 3–4** (ages 4–6). Poppy the frog wants to hop across the pond, but she can only land
on the right lily pad. Everything is painted in a soft watercolour style.

| Curriculum level | Game | Numbers | Poppy's sign → the lily pads |
| --- | --- | --- | --- |
| Level 3 · Shine | Find the word | 1 to 5 | A number → three words |
| Level 3 · Shine | Find the word | 1 to 10 | A number → three words |
| Level 4 · Bright | Find the number | 1 to 10 | A word → three numbers |
| Level 4 · Bright | Find the flowers | 1 to 10 | A word → three pads of flowers (dice patterns to 5, then a five-and-five frame) |

Each game has 5 rounds and 3 lily pads: the right one, a next-door number and, when there is one, a **look-alike** word
that starts with the same letter (two, three, ten; four, five; six, seven), so the first letter alone isn't enough.
1 to 5 uses all five numbers; 1 to 10 has three rounds from 6 to 10 and two from 1 to 5. Every time a game is played
(including **Play again**) the numbers come in a new order: never the same order as last time, never starting on the
same number, and never simply counting up or down.

The game's own stages are never called "Level 5" and so on, so they can't be confused with the curriculum levels.
**Next** leads through all four games, then back to start.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! Poppy the frog wants to hop across the pond. Can you help her find the lily pads with the right number words? Tap a level to start." | |
| Find the word round starts | "Can you find the word for this number?" (the number itself is never said first) | Poppy's sign drops in with the number; three pads float up |
| Find the number round starts | "Read the word. Which number is it?" | The sign shows the word; the pads show numbers |
| Find the flowers round starts | "Read the word. Which lily pad has that many flowers?" | The sign shows the word; the pads carry flowers |
| Right answer | The number ("seven!"), then "Yes! That's right!" and a fanfare | Poppy hops onto the pad with a splash, it turns golden and glows, a progress dot fills |
| A guess that isn't right | "Good guess, but try again" | The pad wobbles; every pad stays tappable |
| The guess was a look-alike word | Also "Look closely at all the letters." | |
| Second guess that isn't right | Find the word and Find the number: "Here's a clue. Count the dots." Find the flowers: the chosen pad's flowers are counted aloud | Dots appear under every word (or under the sign's word); each flower pulses as it is counted |
| No tap for a while | The question again (at most every 12 seconds) | The pads wobble |
| Game finished | "You helped Poppy hop all the way across!" then "Do you want to play again, or try the next level?" | The well done card with Poppy |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Lily Pad Words recordings: `welcome`, `well-done`. Still to record: `find-the-word`, `find-the-number`, `find-the-flowers`, `look-closely`, `heres-a-clue`. |

Reused recordings: one to ten and "Good guess, but try again" are from Light the Lanterns (`../light-the-lanterns/audio/`);
"Yes! That's right!" (`right`) and "Do you want to play again, or try the next level?" (`playAgain`) are from Duck Pond
(`../duck-pond/audio/`).

## Putting it on the website

```html
<iframe src="/games/lily-pad-words/" title="Lily Pad Words game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object in the first `<script>` of `index.html`: `1` … `10`, `tryAgain`, `right`,
`playAgain`, `welcome`, `findWord`, `findNumber`, `findFlowers`, `lookClosely`, `clue` and `wellDone`. Add or replace a
string with the base64 of an MP3 (`base64 -w0 audio/find-the-word.mp3`). Timings come from each clip's own length, so
nothing else needs adjusting. A missing clip is simply skipped.
