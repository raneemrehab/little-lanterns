/* LITTLE LANTERNS · VOICE TIMING (shared by every game)
   ---------------------------------------------------------------------------------------------
   This is the one place to adjust how voiceovers are paced. After editing, run
     node tools/sync-voice-timing.mjs
   to copy it into every game's index.html (each game stays a single self-contained file).

   How it works
   - Voice lines never overlap and never cut each other off: a new line waits for the line
     before it to finish, then waits a pause of real silence. The recordings are never sped up
     or slowed down.
   - The pause depends on what the line before was for (its "kind" below). After a question the
     pause is long, so a hint or a repeat never arrives while a child is still thinking.
   - When the child taps the screen after a line has started, the pause shrinks to
     afterChildActsMs: feedback answers the child promptly, but still never interrupts.
   - Asking for a line that is already playing or waiting to play does nothing, so tapping the
     speaker button (or anything else) repeatedly can't stack up audio.
   - Spoken reminders when a child hasn't touched anything are limited to maxSpokenNudges per
     question; after that only the gentle visual wiggle continues. Any tap resets the count.
   - Changing screen (back, play again, next level, choosing a level) clears any waiting lines. */
window.LL_VOICE_TIMING = {
  // Silence (ms) after a line, by the kind of line it was.
  pauseAfter: {
    count: 550,        // a number in a counting sequence ("one … two … three")
    praise: 900,       // "Yes! That's right!", "Hooray! They're the same!"
    retry: 1300,       // "Good guess, but try again", "Too many!"
    transition: 700,   // a short link between related lines ("Let's play!", "Posted!" → next line)
    instruction: 1600, // "Tap the apples", level intros, demonstrations
    question: 4000,    // "How many ducks?", "Which jar has three?" — thinking time
    closing: 1600,     // "Well done!", "Do you want to play again…?"
    line: 1000,        // anything not listed below
  },
  afterChildActsMs: 250,

  // How long a child can be still before a reminder.
  visualNudgeMs: 8000,      // a gentle wiggle or glow on what to tap
  spokenNudgeMs: 16000,     // the question or hint spoken again, at most this often
  maxSpokenNudges: 2,       // per question, until the child taps something

  // The kind of each voice clip, by the key the games use.
  kinds: {
    praise: ['right', 'youSawIt', 'hooray', 'yum', 'platesSame', 'countedAll', 'noneLeft', 'keepGoing'],
    retry: ['tryAgain', 'more', 'tooMany', 'mineTaller', 'yoursTaller', 'wrongWay', 'already', 'lookClosely'],
    instruction: ['welcome', 'intro1', 'intro2', 'intro3', 'intro4', 'intro5', 'intro6', 'tap', 'tapApples', 'moveApples',
      'tapDucks', 'nextDuck', 'makeTower', 'tapBlock', 'share', 'lineUp', 'noPartner', 'trace', 'copy', 'listen', 'spot',
      'startDot', 'watchMe', 'peekAgain', 'quickLook', 'watchLeft', 'tapCookie', 'zeroHint', 'emptyHint', 'tenMore',
      'hintLook', 'hintLast', 'clue', 'clueSign'],
    question: ['howMany', 'howManyThere', 'howManyLanterns', 'howManyOranges', 'howManyLadybirds', 'howManyBubbles',
      'howManySpots', 'howManyFingers', 'askMore', 'askFewer', 'whichJar', 'findNumber', 'findWord', 'findFlowers',
      'whichPlate', 'pick1', 'pick2', 'pick3', 'pick4', 'pick5', 'pick6', 'pick7', 'pick8', 'pick9', 'pick10',
      'give1', 'give2', 'give3', 'give4', 'give5', 'give6', 'give7', 'give8', 'give9', 'give10'],
    closing: ['wellDone', 'playAgain'],
  },
};

/* The voice queue. Games call LLVoice.turn(key) before starting a clip and get back a function to
   call with the clip's length once it starts (or null if it shouldn't play). */
window.LLVoice = (() => {
  const T = window.LL_VOICE_TIMING;
  const kindOf = {};
  Object.keys(T.kinds).forEach((k) => T.kinds[k].forEach((key) => { kindOf[key] = k; }));
  const kind = (key) => (/^\d+$/.test(key) ? 'count' : kindOf[key] || 'line');
  const now = () => Date.now();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let chain = Promise.resolve(), epoch = 0;
  let lastKey = null, lastKind = 'line', lastStart = 0, lastEnd = 0, lastTouch = 0, nudges = 0;
  const pending = new Set();   // keys waiting or playing

  const pauseAfter = () => {
    const p = T.pauseAfter[lastKind] ?? T.pauseAfter.line;
    return lastTouch > lastStart ? Math.min(p, T.afterChildActsMs) : p;
  };
  const earliest = () => (lastKey === null ? 0 : lastEnd + pauseAfter());

  // kindOverride: the kind of this line when its key alone doesn't say (see pauseAfter).
  function turn(key, kindOverride) {
    key = String(key);
    if (pending.has(key)) return Promise.resolve(null);
    pending.add(key);
    const my = epoch;
    let release;
    const mine = new Promise((r) => { release = r; });
    const before = chain;
    chain = before.then(() => mine);
    const finish = () => { pending.delete(key); release(); };
    return before.then(async () => {
      for (;;) {
        if (my !== epoch) { finish(); return null; }
        const wait = earliest() - now();
        if (wait <= 0) break;
        await sleep(Math.min(wait, 100));
      }
      return (ms) => {
        lastKey = key; lastKind = kindOverride || kind(key); lastStart = now(); lastEnd = lastStart + (ms || 0);
        setTimeout(() => { if (my === epoch) pending.delete(key); }, ms || 0);
        release();
      };
    });
  }

  // Clear anything waiting (used when the screen changes). The caller stops the clip itself.
  function cancel() { epoch++; pending.clear(); lastKey = null; lastEnd = 0; }

  // True while a line is playing or waiting to play.
  const busy = () => pending.size > 0 || now() < lastEnd;

  // Whether an idle reminder may be spoken now; counts it when it may.
  function nudge() {
    if (busy() || nudges >= T.maxSpokenNudges) return false;
    nudges++; return true;
  }

  document.addEventListener('pointerdown', () => { lastTouch = now(); nudges = 0; }, true);
  document.addEventListener('keydown', () => { lastTouch = now(); nudges = 0; }, true);

  return { turn, cancel, busy, nudge, kind, T };
})();
