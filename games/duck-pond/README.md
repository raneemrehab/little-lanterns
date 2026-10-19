# Duck Pond

A counting game for **Counting & Numbers → "How many?" (last number = total)**.

| Level | What the child does |
| --- | --- |
| 1 · Count and tell | 2 to 5 ducks. Tap each duck to count it, then answer "How many ducks?". The numbers stay on the ducks and the last one turns big and yellow. |
| 2 · Remember how many | 2 to 5 ducks. Same as Level 1, but the numbers hide before the question, so the child has to remember the last number they said. |
| 3 · Up to 10 ducks | 6 to 10 ducks, numbers visible. |

Each level has 5 ponds with a mix of sizes (never the same size twice in a row). Ducks swim in from the side, bob
gently on the water, and swim away when a pond is finished. **Next level** leads from Level 1 to 2 to 3, then back to start.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! Let's count the ducks in the pond. Tap a level to start." | |
| First pond of a level | Level 1: "Let's count the ducks! Tap each duck one at a time, and say the number with me." Level 2: "This time the numbers will hide. Remember the last number you say!" Level 3: "Wow, lots of ducks! Count slowly, one duck at a time." | One duck glows with a "tap me!" label |
| A duck is tapped | Its number ("three!") and a soft chime | A teal number appears above the duck; a tile is added to the bottom bar |
| A counted duck is tapped again while counting | "We counted that one already! Find a duck with no number." | The next duck to count glows |
| No tap for a while | "Which duck is next? Tap a duck with no number." (at most every 12 seconds) | The next duck glows and hops |
| Every duck counted | "You counted all the ducks!" then "How many ducks are there?" | A dashed ring circles the whole group; three number buttons appear |
| No answer for a while | Levels 1 and 3: "Look at the big yellow number. That's how many!" Level 2: "What was the last number you said?" | The buttons wiggle |
| Right answer | "Yes! That's right!", the number, and a fanfare | The button turns teal, all the ducks hop, a progress dot fills |
| Any other answer | "Good guess, but try again", then the ducks are counted aloud again | The button wiggles; the last number is highlighted; every button stays tappable |
| Level finished | "Well done! You counted all the ducks!" then "Do you want to play again, or try the next level?" | The well done card |

The three answer buttons always include the numbers either side of the total (for example 3, 4, 5 for four ducks),
so the answer really depends on the last number counted. Nothing is ever marked wrong.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork (inline SVG) and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Duck Pond recordings (for reference or re-recording): `tap-the-ducks`, `how-many-ducks`, and the guided voiceovers `welcome`, `intro-level-1` to `intro-level-3`, `which-duck-next`, `counted-that-one`, `counted-all`, `how-many-are-there`, `hint-big-yellow-number`, `hint-last-number`, `thats-right`, `well-done`, `play-again`. |

The numbers and "Good guess, but try again" are the same recordings as in Light the Lanterns (`../light-the-lanterns/audio/`).

## Putting it on the website

```html
<iframe src="/games/duck-pond/" title="Duck Pond game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object near the bottom of `index.html`: `1` … `10`, `tapDucks`, `howMany`,
`tryAgain` and the guided voiceovers (`welcome`, `intro1`–`intro3`, `nextDuck`, `already`, `countedAll`, `howManyThere`,
`hintLook`, `hintLast`, `right`, `wellDone`, `playAgain`). Replace a string with the base64 of a new MP3 (`base64 -w0 audio/how-many-ducks.mp3`) and adjust its
length in `PHRASE_MS` (or `SPEECH_MS` for numbers).
