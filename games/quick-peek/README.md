# Quick Peek

A subitising game for **Counting & Numbers → Subitising (seeing a small amount at a glance, without counting)**, ages 2–3,
with three further levels up to 10 that use groups of five.

| Level | What peeks out | Choices | Peek time |
| --- | --- | --- | --- |
| 1 · Peek cards | 1 to 3 round things: lanterns, oranges, ladybirds or bubbles, in changing layouts | 2 | 2.5 s, down to 1.5 s |
| 2 · Dice | 1 to 5 spots in the standard dice patterns | 3 | 2 s, down to 1.2 s |
| 3 · Fingers | A hand holding up 1 to 5 fingers | 3 | 2 s, down to 1.2 s |
| 4 · Ten frame | 1 to 10 round things in a ten frame: one side of five fills first, then the other | 3 | 3 s, down to 2 s |
| 5 · Two dice | 2 to 10 spots on two dice (any split, bigger die on the left) | 3 | 3 s, down to 2 s |
| 6 · Two hands | 1 to 10 fingers on two hands: a full hand first, then the other (a fist shows zero) | 3 | 3 s, down to 2 s |

Each level has 5 rounds with a mix of amounts (never the same amount twice in a row). Levels 4–6 always have at
least three rounds from 6 to 10. In Levels 1 and 4 every round thing appears at least once. A round has four moments: the card drops in and **flips up** for a short peek while a butter
bar drains, it **flips over** to its lantern back, the child **picks** how many, and the card **comes back lit up**
while the number is spoken. Each first-try answer makes the next peek 0.2 s shorter, down to the level's floor.
**Next level** leads from each level to the next, and from Level 6 back to start. The start screen groups the
levels under **Up to 5** and **Up to 10**.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! A card will peek out for a moment, then hide. Tell me how many you saw! Tap a level to start." | |
| First round of a level | Level intro *(not recorded yet)* | The card drops in face down |
| The card flips up | "Quick look!" *(not recorded yet)* and a soft flip sound | "quick look!" label and a draining butter bar |
| The card flips over | "How many lanterns / oranges / ladybirds / bubbles / spots / fingers did you see?" | Two or three answer buttons, each a numeral with tiny copies of the thing under it |
| No answer for a while | The question again (at most every 12 seconds) | The buttons wiggle |
| Right answer | The number and "You saw it!", then a fanfare | The card flips back lit up, sparkles, the button turns teal, a progress dot fills |
| Any other answer | "Good guess, but try again", "Let's peek again", then a longer peek (1.5×) | The button wiggles; every button stays tappable |
| A second guess that isn't right | Same, then the things are counted aloud with the card face up | Each thing pulses as it is counted |
| Level finished | "You've got super quick eyes!" then "Want to peek again?" | The well done card |

Nothing is ever marked wrong. Answer buttons always include a neighbour of the right amount (for example 2, 3, 4 for
three spots), so the answer depends on what was seen.

## Still to record

| Clip | Line |
| --- | --- |
| `intro1` | "Watch the card. It only peeks for a moment!" |
| `intro2` | "Here comes the dice. How many spots will you see?" |
| `intro3` | "I'm going to hold up my fingers. Quick, have a look!" |
| `intro4` | "Here's a ten frame. Each side holds five. How many can you see?" |
| `intro5` | "Two dice this time! How many spots altogether?" |
| `intro6` | "Now I'm using both hands. How many fingers altogether?" |
| `quickLook` | "Quick look!" |

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork (inline SVG) and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Quick Peek recordings: `welcome`, `how-many-lanterns`, `how-many-oranges`, `how-many-ladybirds`, `how-many-bubbles`, `how-many-spots`, `how-many-fingers`, `peek-again`, `you-saw-it`, `well-done`, `play-again`. |

Reused recordings: the numbers one to ten and "Good guess, but try again" are from Light the Lanterns (`../light-the-lanterns/audio/`).
"Yes! That's right!" (`right`) from Duck Pond is kept as a stand-in in case `youSawIt` is ever removed.

## Putting it on the website

```html
<iframe src="/games/quick-peek/" title="Quick Peek game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object near the bottom of `index.html`: `1` … `10`, `tryAgain`, `right`, the six
`howMany…` questions, `peekAgain`, `youSawIt`, `wellDone` and `playAgain`. Replace a string with the base64 of a new
MP3 (`base64 -w0 audio/peek-again.mp3`), or add a new key for a line that isn't recorded yet: `intro1`–`intro6` or `quickLook`. Timings come from each clip's own length, so nothing else needs adjusting. A missing clip is simply
skipped (and **Hear how to play** hides itself if `welcome` is ever removed).
