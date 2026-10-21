# Little Lanterns

Early years learning resources for nurseries, teachers and families (ages 2–6).

## What's here

| Folder | What it holds |
| --- | --- |
| `games/` | Interactive learning games. Each game is a self-contained web page that can be embedded in the website. |

### Games

| Game | Learning area | Skill | Level |
| --- | --- | --- | --- |
| [Light the Lanterns](games/light-the-lanterns/) | Counting & Numbers | Rote counting 1–5 (Level 1), 5–10 (Level 2) | 1–2 |
| [Apple Picking](games/apple-picking/) | Counting & Numbers | One-to-one counting (3 apples, then 5); counting out a set (pick 1–10, in order then mixed) | 1–6 |
| [Duck Pond](games/duck-pond/) | Counting & Numbers | "How many?": the last number counted tells the total (2–5, then up to 10) | 1–3 |
| [Quick Peek](games/quick-peek/) | Counting & Numbers | Subitising: 1–3 round things, dice and fingers up to 5, then ten frame, two dice and two hands up to 10 | 1–6 |
| [Hazel's Berries](games/hazels-berries/) | Counting & Numbers | Counting out a set: give Hazel the hedgehog 1–3 berries (spots to fill), then 1–5 and 6–10 (counted aloud, then by yourself), then mixed 1–10 | 1–6 |
| [Firefly Jars](games/firefly-jars/) | Counting & Numbers | Numeral recognition: match numbers to jars of fireflies, 0–5 (Level 2 · Glow), 0–10 (Level 3 · Shine), 11–20 (Level 4 · Bright) | 2–4 |
| [Lily Pad Words](games/lily-pad-words/) | Counting & Numbers | Number names and words: match a number to its word, 1–5 then 1–10 (Level 3 · Shine); read a word and find its number or that many flowers, 1–10 (Level 4 · Bright) | 3–4 |
| Snail Trails (not on the site; tracing is offered as printables instead) | Counting & Numbers | Writing numerals: trace 0–9 and copy from Sunny's sign (Level 3 · Shine); write 0–9 from memory and spot the backwards number, then all four games with 11–20 (Level 4 · Bright) | 3–4 |
| [Maple's Cookies](games/maples-cookies/) | Counting & Numbers | Zero: count down to an empty plate ("No cookies left! That's zero.") and count plates of 0–5 (Level 2 · Glow); match 0–10 to a plate and say how many are left after Maple eats (Level 3 · Shine) | 2–3 |
| [Clover's Picnic](games/clovers-picnic/) | Counting & Numbers | More, fewer, same: which plate has more (Level 1 · Little Sparks), more, fewer or same and match a tower (Level 2 · Glow), don't be tricked by big strawberries and share blocks fairly (Level 3 · Shine) | 1–3 |

## Brand basics

- **Fonts:** Bricolage Grotesque (headings, numbers), Nunito Sans (body)
- **Core colours:** cream `#FBF6EC`, paper `#FFFDF8`, ink `#263238`, teal `#3E8A86` (maths), deep teal `#2C6B68`
- **Accents:** coral `#E7836C`, butter `#F5D57A`, sage `#93B795`, sky `#86BDE3`, lavender `#AE9FD8`

## The website

The Learning Lanterns website lives alongside the games. It is a static site with no dependencies, built with Node 18 or newer.

```sh
npm run build     # builds the site into dist/
npm run serve     # builds, then serves dist/ at http://localhost:4321 (with the 404 page)
npm run preview   # builds preview/, whose links work when opened straight from disk
```

**To launch, see [docs/LAUNCH.md](docs/LAUNCH.md)** (Netlify, the WhatsApp help chat and optional family accounts).

Upload the contents of `dist/` to any static host. The games are copied into `dist/games/` unchanged, so every
game keeps its own address (`/games/duck-pond/` and so on). Each game also gets a branded play page in the
Number Nook (`/explore/number-nook/duck-pond/`) that embeds it with an iframe, as the game READMEs recommend.
`dist/404.html` is the custom "page not found" page; most static hosts (GitHub Pages, Netlify, Cloudflare Pages)
use it automatically.

| Where | What to edit |
| --- | --- |
| `src/config.mjs` | Site URL, base path, a real contact email, and a form endpoint. Forms and email links stay hidden until these are set. |
| `src/data/games.mjs` | The list of games shown on the site: the maths games in `games/`, the literacy and thinking games in `literacy/play/`, and the designed games shown as "Coming soon". |
| `netlify/functions/message.mjs` | Sends help-chat messages and forms to WhatsApp. The number is an environment variable, never in the code. |
| `src/data/studios.mjs` | The six learning studios and their wording. |
| `src/data/resources.mjs` | Printables (none yet) and hands-on toy concepts. |
| `src/pages/` | Page content. `src/components/` holds the shared header, footer, cards, forms and SVG doodles. |
| `src/assets/` | Styles, scripts and images. `src/assets/img/games/` holds real screenshots of each game's start screen. |
| `supabase/`, `docs/ACCOUNTS.md` | Family accounts, child profiles, the progress dashboard and activity tracking. These stay switched off until a Supabase project is connected: see [docs/ACCOUNTS.md](docs/ACCOUNTS.md). |
