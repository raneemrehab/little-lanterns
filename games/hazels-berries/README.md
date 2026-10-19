# Hazel's Berries

A counting game for **Counting & Numbers → Counting out a set** ("Give Hazel 3 berries" from a bigger pile), ages 2–3,
with three further levels up to 10.

| Level | What the child does |
| --- | --- |
| 1 · Fill the spots | Give Hazel 1 to 3 berries from a pile of 5. Dashed spots on her plate show how many, and the voice counts each berry as it goes on. |
| 2 · Count with me | Give 1 to 5 berries from a pile of 7. No spots; the voice counts each berry as it goes on. |
| 3 · By yourself | Give 1 to 5 berries from a pile of 7. No counting voice and no numbers while giving. |
| 4 · Count to 10 | Give 6 to 10 berries from a pile of 12; the voice counts each berry as it goes on. |
| 5 · To 10 by yourself | Give 6 to 10 berries from a pile of 12, silently. |
| 6 · Mixed 1 to 10 | Give 1 to 10 berries from a pile of 12, silently: three rounds from 6 to 10 and two from 1 to 5, shuffled. |

Each level has 5 rounds, never the same number twice in a row. Level 1 asks for each of 1, 2 and 3 at least once; Levels 2–5
ask for each number in their range once, in a shuffled order. In Levels 4–6 Hazel's plate holds two rows of five, like
a ten frame: berries 1–5 fill the back row and 6–10 the front row. Tapping a berry hops it onto Hazel's log-slice plate; tapping a
berry on the plate puts it back on the pile, so the child can fix their answer. When they press **Check**, the plate is
counted aloud ("one, two, three…") with a number over each berry. If it matches, Hazel eats the berries one by one. If
not, Hazel asks for more or for some back, and the berries stay where they are.

**Next level** leads from each level to the next, and from Level 6 back to start. The start screen groups the levels
under **Up to 5** and **Up to 10**.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Start screen, first touch or **Hear how to play** | "Hello! I'm Hazel the hedgehog, and I'm hungry! Tap the berries to give me just the right number. Tap a level to start." | |
| First round of a level | Level 1: "Tap a berry to put it on Hazel's plate. Fill the spots!" Level 2: "Let's count the berries together, one at a time." Level 3: "This time, count the berries by yourself. Then tap Check." Levels 4–6: *(not recorded yet)* | One berry glows with a "tap me!" label |
| A round starts | "Can you give Hazel one berry?" *(two to ten not recorded yet)* | "Give Hazel **3** berries!" with the number in a big yellow box |
| A berry is given (Levels 1, 2 and 4) | The number ("three!") and a soft chime | The berry hops onto the plate with its number above it; in Level 1 a dashed spot fills |
| A berry is given (Levels 3, 5 and 6) | A soft "plop" only | The berry hops onto the plate; no number |
| Check | The plate counted aloud, one berry at a time | Each berry's number appears as it is counted |
| Too few | "Mmm! Can I have some more?" | Hazel's speech bubble; the number box wiggles |
| Too many | "Oh! That's too many. Can you take some back?" | Hazel's speech bubble; the number box wiggles |
| Just right | "Yes! That's right!", then "Yum! Thank you!" and a fanfare | Hazel munches the berries one by one, hops, sparkles; a progress dot fills |
| No tap for a while | The question again (at most every 12 seconds) | The number box wiggles; in Levels 1, 2 and 4 a pile berry glows if more are needed |
| Level finished | "Well done! Hazel's tummy is full!" then "Do you want to play again, or try the next level?" | The well done card |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Still to record

| Clip | Line |
| --- | --- |
| `give2` … `give10` | "Can you give Hazel two berries?" … "Can you give Hazel ten berries?" |
| `intro4` | "Now let's count all the way to ten! I'll count with you." |
| `intro5` | "Can you count up to ten by yourself? Then tap Check." |
| `intro6` | "Big numbers and small numbers! Count them by yourself." |

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork (inline SVG) and voice clips (base64). Works on its own. |
| `audio/*.mp3` | Original Hazel's Berries recordings: `welcome`, `intro-level-1` to `intro-level-3`, `can-you-give-hazel-one-berry`, `can-i-have-some-more`, `too-many`, `yum-thank-you`, `well-done`. |

Reused recordings: the numbers one to ten are from Light the Lanterns (`../light-the-lanterns/audio/`); "Yes! That's right!"
(`right`) and "Do you want to play again, or try the next level?" (`playAgain`) are from Duck Pond (`../duck-pond/audio/`).

## Putting it on the website

```html
<iframe src="/games/hazels-berries/" title="Hazel's Berries game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Changing a recording

Every voice clip is in the `VOICE` object near the bottom of `index.html`: `1` … `10`, `right`, `playAgain`, `welcome`, `intro1`–`intro3`,
`give1`, `more`, `tooMany`, `yum` and `wellDone`. Replace a string with the base64 of a new MP3
(`base64 -w0 audio/too-many.mp3`), or add a new key for a line that isn't recorded yet: `give2`–`give10` or `intro4`–`intro6`.
Timings come from each clip's own length, so nothing else needs adjusting. A missing clip is simply skipped.
