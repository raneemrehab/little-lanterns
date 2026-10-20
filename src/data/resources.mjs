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

export const printables = [];

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
