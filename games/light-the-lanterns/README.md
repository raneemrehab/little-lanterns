# Light the Lanterns

A counting game for **Counting & Numbers → Rote counting (saying numbers in order)**.

| Level | Numbers | Part A | Part B |
| --- | --- | --- | --- |
| 1 | Count to 5 | **Count along:** tap lanterns 1–5 in order | **What comes next?** pick the missing number (2–5) |
| 2 | Count to 10 | **Count on:** lanterns 1–5 already glow; tap 6–10 in order | **What comes next?** pick the missing number (6–10) |

The flow runs on its own: Level 1 Part A → Part B → **Next level** → Level 2 Part A → Part B → back to start.
Each part ends with every lantern counted aloud together and a "You counted to 5!" / "You counted to 10!" card.

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| A tapping part starts | "Tap the lanterns" | The lantern to tap glows, pulses and bounces, with a "tap me!" arrow |
| Correct lantern or number | The number ("three!") and a soft chime | The lantern lights up with sparkles and a speech bubble |
| A guess that isn't next | "Good guess, but try again" | The item wobbles gently, then the right lantern bounces as a hint |

**Design principle:** a guess that isn't right is never marked as wrong. There is no red, no cross, no "wrong" sound,
no buttons taken away and no points lost. Every option stays tappable. In "What comes next?", after a couple of
guesses the voice counts the run-up again to help.

If a browser holds sound back until the first tap, a large yellow **Start** button appears over the lanterns.
Tapping it plays "Tap the lanterns" and the game carries on.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, and the voice clips embedded as base64. Works on its own with no other files. |
| `audio/one.mp3` … `audio/ten.mp3` | The number recordings. |
| `audio/tap-the-lanterns.mp3` | The "Tap the lanterns" instruction. |
| `audio/good-guess-but-try-again.mp3` | The "Good guess, but try again" encouragement. |

The audio files are the originals, kept for reference or re-recording. The game does not load them; it uses the copies embedded in `index.html`.

## Putting it on the website

Upload the folder and embed the game with an iframe:

```html
<iframe src="/games/light-the-lanterns/" title="Light the Lanterns game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

The game scales itself to the box it is given, in landscape or portrait, from phones to desktops.

## Changing things

- **Voice:** in `index.html`, find the `VOICE` section near the bottom. It holds one base64 MP3 string per number (`1` to `10`), plus `tap` and `tryAgain` for the two voice-overs. Replace a string with the base64 of a new recording (`base64 -w0 audio/three.mp3`). If a new clip is longer or shorter, adjust `SPEECH_MS` in the Config section so the counting keeps its rhythm.
- **Levels and wording:** the `LEVELS` and `FLOW` objects in the Config section hold each level's number range, labels, and what the "Next" button does.
