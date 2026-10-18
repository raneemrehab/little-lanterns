# Apple Picking

A counting game for **Counting & Numbers → One-to-one counting (one number per object)**, Levels 1–4.

| Level | What the child does |
| --- | --- |
| 1 · Tap and count | Tap each of 3 apples on the tree. Each apple drops into the basket and its number is spoken. |
| 2 · Move and count | Drag each of 5 apples into the basket (tapping also works for children who find dragging hard). |
| 3 · Pick the number | Five rounds: "Pick 1 apple", "Pick 2 apples" … "Pick 5 apples". The tree always has 6 apples. The child picks **silently**, counting by themselves, then presses **Check**. The voice counts the basket aloud so the child can hear whether it matches. |
| 4 · Mixed numbers | The same five rounds as Level 3, but 1–5 come in a shuffled order (for example 3, 1, 5, 2, 4). The order changes every time and is never 1, 2, 3, 4, 5. |

Each apple moves into the basket once it's counted, so it can't be counted twice. That is the point of one-to-one
counting: one number for each object. In Levels 1–2, tapping an apple already in the basket says its number again.

**Levels 3–4 are self-checking.** While picking there is no counting voice, no numbers on the apples and no tiles
filling in. Tapping an apple in the basket puts it back on the tree, so the child can fix their answer. When they
press **Check**, each apple's number appears as the voice counts the basket ("one, two, three…"). If it matches the
number asked for, the round is celebrated and the next one starts. If not, "Good guess, but try again" plays, the
apples stay where they are, and the child adds or removes apples and checks again.

The flow: Level 1 → **Next level** → Level 2 → **Next level** → Level 3 → **Next level** → Level 4 → back to start. Levels 1 and 2 end with the
basket apples counted aloud together and a "You counted 3 apples!" / "You counted 5 apples!" card. In Levels 3 and 4,
each round ends when a Check matches, and after round 5 the card says "You picked them all!".

## Voice and feedback

| Moment | What the child hears | What they see |
| --- | --- | --- |
| Level starts | "Tap the apples" / "Move the apples into the basket" *(not recorded yet; skipped until added)* | One apple glows with a "tap me!" / "drag me!" label |
| Level 3–4 round starts | "Can you pick three apples?" (one recording per number, 1–5) | "Pick **3** apples!" with the number in a big yellow box; number tiles 1–3 to fill |
| An apple is counted (Levels 1–2) | The number ("three!") and a soft chime | The apple flies into the basket with sparkles; its number appears on it |
| An apple is picked (Levels 3–4) | A soft "plop" only | The apple drops into the basket; no number |
| Check (Levels 3–4) | The basket counted aloud, one apple at a time | Each apple's number appears as it is counted |
| Check doesn't match (Levels 3–4) | "Good guess, but try again" | The number box bounces; the apples stay, ready to adjust |
| An apple is dropped outside the basket | Nothing negative | The apple floats gently back to the tree and the basket glows as a hint |

Nothing is ever marked wrong, in line with all Little Lanterns games.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole game: HTML, CSS, JavaScript, artwork (inline SVG) and voice clips (base64). Works on its own. |
| `audio/can-you-pick-*.mp3` | The "Can you pick … apple(s)?" recordings for 1–5, kept for reference or re-recording. The game uses the copies embedded in `index.html`. |

"Good guess, but try again" is the same recording as in Light the Lanterns (`../light-the-lanterns/audio/good-guess-but-try-again.mp3`).

The number recordings are the same ones used in Light the Lanterns (`../light-the-lanterns/audio/one.mp3` … `five.mp3`).

## Putting it on the website

```html
<iframe src="/games/apple-picking/" title="Apple Picking game"
        style="width:100%; aspect-ratio:16/10; border:0; border-radius:24px"></iframe>
```

## Adding the voice-overs

In `index.html`, add entries to the `VOICE` object near the bottom: `tapApples` (Level 1) and `moveApples` (Level 2),
each a base64 MP3 string. The Level 3–4 questions are already in as `pick1` … `pick5` (`base64 -w0 tap-the-apples.mp3`). Adjust `PHRASE_MS` in the Config section to match their length.
