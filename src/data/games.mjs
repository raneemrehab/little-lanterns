// The real, playable games. Only add a game here once it exists and works.
//
// Each game's files go in the top-level `games/` folder, which is copied
// into the built site unchanged, so the games keep their own code and
// routes. A game at games/count-the-stars/index.html is served at
// /games/count-the-stars/ and would be registered like this:
//
//   {
//     slug: 'count-the-stars',
//     title: 'Count the Stars',
//     studio: 'number-nook',          // id from studios.mjs
//     description: 'Count the twinkling stars and tap the matching number.',
//     practises: ['Counting to 10', 'Number recognition'],
//     ages: '3–5',                     // only if known, otherwise omit
//     level: null,                     // only if known, otherwise omit
//     curriculumLevels: [1, 3],        // curriculum levels covered, only if the README states them
//     href: 'games/count-the-stars/',  // the game itself (or a full https:// URL)
//     page: 'explore/number-nook/count-the-stars/', // the branded play page
//     preview: 'games/count-the-stars/preview.png', // optional screenshot
//   }
//
// Leave `ages`, `level` and `preview` out when they are not known. The
// cards only show the information that is actually provided.

export const games = [
  {
    slug: 'light-the-lanterns',
    title: 'Light the Lanterns',
    description: 'Tap the lanterns in order to light them up, counting to 5 and then on to 10, then find the number that comes next.',
    practises: ['Counting in order to 10', 'What comes next?'],
    level: '2 levels',
  },
  {
    slug: 'apple-picking',
    title: 'Apple Picking',
    description: 'Count apples into the basket one at a time, then pick just the right number, from 1 all the way to 10.',
    practises: ['One-to-one counting', 'Counting out a set to 10'],
    level: '6 levels',
  },
  {
    slug: 'duck-pond',
    title: 'Duck Pond',
    description: 'Count the ducks on the pond, one tap for each duck, then answer the big question: how many ducks are there?',
    practises: ['Counting to find how many', 'The last number tells the total'],
    level: '3 levels',
  },
  {
    slug: 'quick-peek',
    title: 'Quick Peek',
    description: 'A card peeks out for a moment, then hides. How many did you see, without counting?',
    practises: ['Seeing small amounts at a glance', 'Dice, fingers and ten frames to 10'],
    ages: 'from 2',
    level: '6 levels',
  },
  {
    slug: 'hazels-berries',
    title: 'Hazel’s Berries',
    description: 'Hazel the hedgehog is hungry! Give her just the right number of berries from the pile.',
    practises: ['Counting out a set', 'Numbers 1 to 10'],
    ages: 'from 2',
    level: '6 levels',
  },
  {
    slug: 'firefly-jars',
    title: 'Firefly Jars',
    description: 'Match each number to the jar with that many glowing fireflies, from 0 all the way to 20.',
    practises: ['Recognising numerals 0 to 20', 'Matching numbers to amounts'],
    ages: '3–6',
    level: 'Levels 2–4 · Glow to Bright',
    curriculumLevels: [2, 4],
  },
  {
    slug: 'lily-pad-words',
    title: 'Lily Pad Words',
    description: 'Help Poppy the frog hop across the pond by finding the lily pads with the right number words.',
    practises: ['Number words one to ten', 'Matching words to numbers'],
    ages: '4–6',
    level: 'Levels 3–4 · Shine to Bright',
    curriculumLevels: [3, 4],
  },
  {
    slug: 'snail-trails',
    title: 'Snail Trails',
    description: 'Follow Sunny the snail’s shiny trail to trace numbers, copy them, and then write them all by yourself.',
    practises: ['Writing numerals 0 to 20', 'Spotting backwards numbers'],
    ages: '4–6',
    level: 'Levels 3–4 · Shine to Bright',
    curriculumLevels: [3, 4],
  },
  {
    slug: 'maples-cookies',
    title: 'Maple’s Cookies',
    description: 'Share cookies with Maple the mouse, counting all the way down to an empty plate. That’s zero!',
    practises: ['Understanding zero', 'Counting down', 'How many are left?'],
    ages: '3–5',
    level: 'Levels 2–3 · Glow to Shine',
    curriculumLevels: [2, 3],
  },
  {
    slug: 'clovers-picnic',
    title: 'Clover’s Picnic',
    description: 'Help Clover the bunny find which plate has more, and build towers that are just the same.',
    practises: ['More, fewer and same', 'Comparing amounts to 10', 'Sharing fairly'],
    ages: '2–5',
    level: 'Levels 1–3 · Little Sparks to Shine',
    curriculumLevels: [1, 3],
  },
].map((g) => ({
  studio: 'number-nook',
  href: `games/${g.slug}/`,
  page: `explore/number-nook/${g.slug}/`,
  preview: `assets/img/games/${g.slug}.jpg`,
  ...g,
}));


export const gamesFor = (studioId) => games.filter((g) => g.studio === studioId);
