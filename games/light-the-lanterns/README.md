# Light the Lanterns

A counting game for **Counting & Numbers → Rote counting (saying numbers in order)**, Levels 1–2.

- **Level 1, Count along:** tap the five lanterns in order. Each one lights up and the voice says its number.
- **Level 2, What comes next?:** the game counts the lit lanterns aloud, then the child picks the next number from three choices.

Both levels end with all five lanterns counted together and a "You counted to 5!" screen.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, and the voice clips embedded as base64. Works on its own with no other files. |
| `audio/one.mp3` … `audio/five.mp3` | The original voice recordings, kept for reference or re-recording. The game does not load these; it uses the copies embedded in `index.html`. |

## Putting it on the website

Upload the folder and embed the game with an iframe:

```html
<iframe src="/games/light-the-lanterns/" title="Light the Lanterns game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

The game scales itself to the box it is given, in landscape or portrait, from phones to desktops.

## Changing the voice

In `index.html`, find the `VOICE` section near the bottom. It holds one base64 MP3 string per number (`1` to `5`). Replace a string with the base64 of a new recording, for example:

```bash
base64 -w0 audio/three.mp3
```

If a new clip is longer or shorter, adjust `SPEECH_MS` in the Config section so the counting keeps its rhythm.
