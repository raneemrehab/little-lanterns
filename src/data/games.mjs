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

// Games from the literacy and thinking-skills set, built in literacy/play/.
// Names, ages and skills come from the game production tracker
// (literacy/src/games.js). `folder` is the game's folder in literacy/play/.
const playable = [
  {
    slug: 'echo-cave', folder: '01-echo-cave', studio: 'word-garden', title: 'Echo Cave', ages: '2–5',
    description: 'Pip the bat listens for rhymes in a glowing cave. Find the word that rhymes, then tap the drum for every beat.',
    practises: ['Hearing rhymes', 'Clapping syllables'],
  },
  {
    slug: 'sound-safari', folder: '02-sound-safari', studio: 'word-garden', title: 'Sound Safari', ages: '3–5',
    description: 'Ziggy the zebra goes on a safari for sounds. Listen to the first sound in a word and find another that starts the same way.',
    practises: ['First sounds in words', 'Same or different sounds'],
  },
  {
    slug: 'word-train', folder: '06-word-train', studio: 'word-garden', title: 'Word Train', ages: '5–7',
    description: 'Read short words and silly sentences to Otto the otter, then check that what you read makes sense.',
    practises: ['Reading words and sentences', 'Checking it makes sense'],
  },
  {
    slug: 'chunk-kitchen', folder: '07-chunk-kitchen', studio: 'word-garden', title: 'Chunk Kitchen', ages: '6–9',
    description: 'Cook up new words with Bea the bear by mixing word chunks like -ain, -ight, un- and -ing.',
    practises: ['Word families', 'Prefixes and suffixes'],
  },
  {
    slug: 'postcard-studio', folder: '12-postcard-studio', studio: 'word-garden', title: 'Postcard Studio', ages: '5–9',
    description: 'Build a sentence to match the picture on a postcard, with a capital letter, spaces and a full stop, then read it back.',
    practises: ['Writing sentences', 'Capital letters and full stops'],
  },
  {
    slug: 'lantern-lookout', folder: '13-lantern-lookout', studio: 'brain-sparks', title: 'Lantern Lookout', ages: '3–9',
    description: 'Luna the owl needs sharp eyes. Search a busy night scene for every lantern that matches, and ignore the look-alikes.',
    practises: ['Looking carefully', 'Spotting small differences'],
  },
  {
    slug: 'firefly-deliveries', folder: '15-firefly-deliveries', studio: 'brain-sparks', title: 'Firefly Deliveries', ages: '3–9',
    description: 'Watch Flick the firefly’s route around the village, then remember it and deliver the light in the same order.',
    practises: ['Remembering a sequence', 'Planning a route'],
  },
  {
    slug: 'moon-rules', folder: '16-moon-rules', studio: 'brain-sparks', title: 'Moon Rules', ages: '3–9',
    description: 'Sort the cards by Nova the cat’s rule, and be ready to switch when the moon shows a new one.',
    practises: ['Following a rule', 'Switching rules'],
  },
  {
    slug: 'sleepy-owl', folder: '17-sleepy-owl', studio: 'brain-sparks', title: 'Sleepy Owl', ages: '2–7',
    description: 'Tap when Ollie the owl is awake, and stay still when he’s asleep. Shh!',
    practises: ['Stop and think', 'Waiting before acting'],
  },
  {
    slug: 'inspector', folder: '18-inspector', studio: 'brain-sparks', title: 'Inspector', ages: '4–9',
    description: 'Rory the raccoon has finished some work, but there’s one slip. Check carefully, find it and fix it.',
    practises: ['Checking work', 'Spotting a mismatch'],
  },
  {
    slug: 'festival-strings', folder: '19-festival-strings', studio: 'brain-sparks', title: 'Festival Strings', ages: '3–9',
    description: 'Spot the pattern in a string of festival lanterns and help Poppy the panda carry it on.',
    practises: ['Patterns', 'Finding the missing piece'],
  },
  {
    slug: 'shadow-shapes', folder: '21-shadow-shapes', studio: 'brain-sparks', title: 'Shadow Shapes', ages: '2–9',
    description: 'Fit the shapes into the shadow outline, turning them round until they slot in.',
    practises: ['Spatial puzzles', 'Turning shapes'],
  },
  {
    slug: 'night-story', folder: '20-night-story', studio: 'little-life-lab', title: 'Night Story', ages: '3–7',
    description: 'Help Bao the bear cub get ready for bed by putting the steps of the routine in the right order.',
    practises: ['Everyday routines', 'First, next and last'],
  },
  {
    slug: 'lantern-builder', folder: '27-lantern-builder', studio: 'make-and-wonder', title: 'Lantern Builder', ages: '4–9',
    description: 'Look closely at Hazel the hedgehog’s lantern design and copy it onto the grid, matching every colour and shape.',
    practises: ['Copying designs', 'Shapes and positions'],
  },
].map((g) => ({
  level: '4 levels',
  href: `literacy/play/${g.folder}/`,
  page: `explore/${g.studio}/${g.slug}/`,
  preview: `assets/img/games/${g.slug}.jpg`,
  ...g,
}));

games.push(...playable);

// Designed games that can't be played yet (most are waiting for their voice
// recordings). They show on their studio page with a "Coming soon" sign and
// no play button. Move a game up into `playable` once it is built and tested.
export const comingSoon = [
  { slug: 'number-tracing-printables', studio: 'number-nook', title: 'Number Tracing Printables', ages: '3–6', description: 'Print-and-trace sheets for writing numbers 0 to 20, with Sunny the snail’s shiny trail to follow.', practises: ['Writing numerals 0 to 20'] },
  { slug: 'letter-post-office', studio: 'word-garden', title: 'Letter Post Office', ages: '3–5', description: 'Post each letter into the box that makes its sound, with Penny the pigeon.', practises: ['Letters and their sounds'] },
  { slug: 'robot-talk', studio: 'word-garden', title: 'Robot Talk', ages: '4–6', description: 'Bolt the robot talks in sounds: c… a… t. Blend them together to work out the word.', practises: ['Blending sounds'] },
  { slug: 'potion-spells', studio: 'word-garden', title: 'Potion Spells', ages: '4–6', description: 'Split a word into its sounds and spell it, one sound in each bubble, with Fenn the fox.', practises: ['Splitting words into sounds', 'Spelling'] },
  { slug: 'word-collector', studio: 'word-garden', title: 'Word Collector', ages: '3–9', description: 'Collect wonderful story words like enormous and soggy with Rosie the robin.', practises: ['New words'] },
  { slug: 'puppet-theatre', studio: 'word-garden', title: 'Puppet Theatre', ages: '6–9', description: 'Read a puppet show script smoothly and with expression, with Mabel the mouse.', practises: ['Reading smoothly'] },
  { slug: 'story-map-explorer', studio: 'word-garden', title: 'Story Map Explorer', ages: '3–9', description: 'Follow a story with Scout the squirrel: who, where, what happened first, next and last.', practises: ['Understanding stories'] },
  { slug: 'sky-writer', studio: 'word-garden', title: 'Sky Writer', ages: '4–7', description: 'Write letters in the sky with Juniper the swallow, starting in the right place.', practises: ['Forming letters'] },
  { slug: 'story-lanterns', studio: 'word-garden', title: 'Story Lanterns', ages: '3–9', description: 'Listen to a story told with lanterns and answer questions about it, with Wren the wren.', practises: ['Listening to stories'] },
  { slug: 'night-sounds', studio: 'brain-sparks', title: 'Night Sounds', ages: '3–9', description: 'Listen through the night with Bramble the badger and tap only for the sound you’re waiting for.', practises: ['Careful listening'] },
  { slug: 'lantern-helper', studio: 'little-life-lab', title: 'Lantern Helper', ages: '3–9', description: 'Listen to Grandpa Tully the tortoise’s instructions and do each step in order.', practises: ['Following instructions'] },
].map((g) => ({ soon: true, ...g }));

export const gamesFor = (studioId) => games.filter((g) => g.studio === studioId);
export const comingSoonFor = (studioId) => comingSoon.filter((g) => g.studio === studioId);
