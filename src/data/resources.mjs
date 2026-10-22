// Printable resources and hands-on toy concepts.
//
// PRINTABLES: add a printable only once the file exists. Put the PDF (and
// an optional preview image) in src/assets/printables/ and register it:
//
//   {
//     title: 'Letter Tracing A–Z',
//     studio: 'word-garden',
//     description: 'Trace every letter with friendly arrows to follow.',
//     file: 'assets/printables/letter-tracing.pdf',
//     preview: 'assets/printables/letter-tracing.png', // optional
//     ages: '3–5',      // only if known
//     pages: 26,        // only if known
//     price: 'free',    // 'free' or a display price, only once selling is set up
//   }

export const printables = [
  {
    title: 'Playdough Mat: Number 1',
    studio: 'number-nook',
    description: 'Roll a playdough snake to make a 1, give the ladybug 1 spot, put 1 ball in the ten frame and trace the word one.',
    file: 'assets/printables/number-1-playdough-mat.pdf',
    preview: 'assets/printables/number-1-playdough-mat.png',
    ages: '3–5',
    pages: 1,
    price: 'free',
  },
  {
    title: 'Feed the Hungry Caterpillar',
    studio: 'number-nook',
    description: 'Trace the numbers 1 to 7 on the caterpillar, colour each day\'s food and say the days of the week. Made to use with our caterpillar video.',
    file: 'assets/printables/hungry-caterpillar-feeding-sheet.pdf',
    preview: 'assets/printables/hungry-caterpillar-feeding-sheet.png',
    ages: '3–5',
    pages: 1,
    price: 'free',
  },
];

// TOYS: these are early ideas the brand is exploring, as described in the
// brief. They are concepts only: no specifications, prices or dates.
// Replace or extend them as real designs are developed, and set `image`
// to a real render or photo when one exists.

export const toyConcepts = [
  {
    title: 'Tactile letters',
    studio: 'word-garden',
    doodle: 'toyLetters',
    tone: 'sage',
    idea:
      'Letter shapes children can trace with their fingers, connecting the feel of each letter with its look and its sound.',
    status: 'Concept',
  },
  {
    title: 'Number formation',
    studio: 'number-nook',
    doodle: 'toyNumbers',
    tone: 'butter',
    idea:
      'Hands-on pieces for exploring how numerals are formed, so the movement of writing a number becomes familiar before pencil meets paper.',
    status: 'Concept',
  },
  {
    title: 'Magnetic puzzles',
    studio: 'brain-sparks',
    doodle: 'toyMagnet',
    tone: 'peach',
    idea:
      'Pieces that click together and come apart again, inviting children to try, notice and rearrange as they solve.',
    status: 'Concept',
  },
];
