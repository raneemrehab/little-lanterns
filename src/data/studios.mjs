// The six learning studios. The creative name is always shown together
// with its plain-language subtitle so nobody has to guess what it means.
//
// A studio counts as "open" when it has at least one game in games.mjs.
// Everything listed under `focus` describes what the studio is about, not
// finished content, and the pages say so.

export const studios = [
  {
    id: 'word-garden',
    name: 'Word Garden',
    subtitle: 'Literacy & Language',
    tone: 'sage',
    doodle: 'wordGarden',
    summary: 'Letters, sounds and first words, grown gently one little step at a time.',
    intro:
      'Word Garden is where early reading and language take root. It will bring together playful ways to meet letters, hear the sounds inside words and enjoy stories and new vocabulary.',
    focus: [
      'Alphabet and letter recognition',
      'Phonics and letter sounds',
      'Beginning sounds',
      'Vocabulary',
      'Blending and early decoding',
      'Listening comprehension',
      'Early reading and language activities',
    ],
    soon: 'New seeds are being planted here. We’re growing gentle ways to explore letters, sounds and stories.',
  },
  {
    id: 'number-nook',
    name: 'Number Nook',
    subtitle: 'Maths & Numeracy',
    tone: 'butter',
    doodle: 'numberNook',
    summary: 'Cosy, hands-on number play that builds confidence with counting and early maths.',
    intro:
      'Number Nook is a cosy corner for early maths. It is home to our interactive maths games, designed to make number practice feel like play.',
    focus: [
      'Number recognition',
      'Counting',
      'Number sense',
      'Patterns',
      'Shapes',
      'Early addition',
      'Mathematical reasoning',
    ],
    focusNote: 'Areas we plan to grow into over time. They are not all covered by games yet.',
    soon: 'Our maths games are being moved into their new home. They’ll appear here as soon as they’re ready to play.',
  },
  {
    id: 'every-way',
    name: 'Every Way',
    subtitle: 'Inclusive Learning',
    tone: 'lavender',
    doodle: 'everyWay',
    summary: 'Adaptable activities that welcome different learners, paces and ways of responding.',
    intro:
      'Every Way is about learning experiences that can adapt to the child, not the other way round. It will offer flexible activities for children with different learning needs and developmental profiles, with clear supports and more than one way to take part.',
    focus: [
      'Attention and engagement',
      'Visual supports',
      'Step-by-step learning',
      'Memory and processing practice',
      'Accessible instructions',
      'Adaptable difficulty',
      'Flexible ways to respond',
    ],
    note:
      'Every Way resources are designed to support learning and accessibility. They are not a diagnosis or a treatment, and they don’t replace individual guidance from the professionals who know your child.',
    soon: 'Something thoughtful is taking shape here. We’re building calm, flexible ways for every child to join in.',
  },
  {
    id: 'brain-sparks',
    name: 'Brain Sparks',
    subtitle: 'Cognitive Skills',
    tone: 'peach',
    doodle: 'brainSparks',
    summary: 'Puzzles and games for noticing, remembering, sequencing and figuring things out.',
    intro:
      'Brain Sparks celebrates the joy of figuring things out. It will offer playful practice in noticing details, remembering, spotting patterns and solving little problems.',
    focus: [
      'Working memory',
      'Attention',
      'Visual discrimination',
      'Pattern recognition',
      'Sequencing',
      'Logic and reasoning',
      'Problem-solving',
      'Processing and recall activities',
    ],
    note:
      'These activities offer enjoyable practice. They aren’t designed to raise intelligence scores or to treat any developmental condition.',
    soon: 'Little sparks are being connected here. We’re building curious puzzles to notice, remember and solve.',
  },
  {
    id: 'little-life-lab',
    name: 'Little Life Lab',
    subtitle: 'Life Skills',
    tone: 'blush',
    doodle: 'lifeLab',
    summary: 'Everyday routines, feelings and small independent steps, practised through play.',
    intro:
      'Little Life Lab turns everyday moments into chances to practise. It will explore familiar routines, feelings and the small, proud steps towards doing things independently.',
    focus: [
      'Everyday routines',
      'Independence',
      'Following instructions',
      'Decision-making',
      'Emotional awareness',
      'Practical problem-solving',
      'Everyday communication',
      'Age-appropriate self-help skills',
    ],
    soon: 'The lab is being set up. We’re creating warm, familiar ways to practise everyday skills.',
  },
  {
    id: 'make-and-wonder',
    name: 'Make & Wonder',
    subtitle: 'Creative Arts & Exploration',
    tone: 'sand',
    doodle: 'makeWonder',
    summary: 'Colour, shape, making and open-ended wondering, with no wrong answers.',
    intro:
      'Make & Wonder is a space for open-ended creativity. It will invite children to draw, colour, build, imagine and look closely at the world around them.',
    focus: [
      'Drawing and creative expression',
      'Colour exploration',
      'Shapes and composition',
      'Imaginative activities',
      'Craft printables',
      'Open-ended creative prompts',
      'Observation and exploration',
    ],
    soon: 'Paints are being mixed here. We’re making open-ended ways to create, imagine and explore.',
  },
];

export const studioById = (id) => studios.find((s) => s.id === id);
