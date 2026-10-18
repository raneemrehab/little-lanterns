# Apple Picking

A counting game for **Counting & Numbers → One-to-one counting (one number per object)**, Levels 1–3.

| Level | What the child does |
| --- | --- |
| 1 · Tap and count | Tap each of 3 apples on the tree. Each apple drops into the basket and its number is spoken. |
| 2 · Move and count | Drag each of 5 apples into the basket (tapping also works for children who find dragging hard). |
| 3 · Pick the number | Five rounds: "Pick 1 apple", "Pick 2 apples" … "Pick 5 apples". The tree always has 6 apples, so the child counts out exactly the number asked for. The round ends when the basket holds that many. |

Each apple moves into the basket once it's counted, so it can't be counted twice. That is the point of one-to-one
counting: one number for each object. Tapping an apple already in the basket just says its number again.

The flow: Level 1 → **Next level** → Level 2 → **Next level** → Level 3 → back to start. Levels 1 and 2 end with the
basket apples counted aloud together and a "You counted 3 apples!" / "You counted 5 apples!" card. In Level 3, each
round ends with the basket counted aloud, and after round 5 the card says "You picked them all!".

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Level starts | "Tap the apples" / "Move the apples into the basket" *(not recorded yet; skipped until added)* | One apple glows with a "tap me!" / "drag me!" label |
| Level 3 round starts | "Pick…" *(optional voice-over, not recorded yet)* then the number ("three") | "Pick **3** apples!" with the number in a big yellow box; number tiles 1–3 to fill |
| An apple is counted | The number ("three!") and a soft chime | The apple flies into the basket with sparkles; its number appears on it |
| An apple is dropped outside the basket | Nothing negative | The apple floats gently back to the tree and the basket glows as a hint |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork (inline SVG) and voice clips (base64). Works on its own. |

The number recordings are the same ones used in Light the Lanterns (`../light-the-lanterns/audio/one.mp3` … `five.mp3`).

## Putting it on the website

```html
<iframe src="/games/apple-picking/" title="Apple Picking game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Adding the voice-overs

In `index.html`, add entries to the `VOICE` object near the bottom: `tapApples`, `moveApples` and (optionally)
`pickApples` for Level 3, each a base64 MP3 string (`base64 -w0 tap-the-apples.mp3`). Adjust `PHRASE_MS` in the Config section to match their length.
