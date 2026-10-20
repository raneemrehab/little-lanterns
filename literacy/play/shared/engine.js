/* Learning Lanterns literacy games: shared engine.
   Needs (loaded first by each game page): ../../../games/shared/voice-timing.js (pauses and the voice queue),
   ../audio/manifest.js (clip keys and their exact words) and ./critters.js (the guide characters).

   A game calls LL.game({...}) with its levels and a round() function. The engine draws the start screen,
   play screen and completion screen, runs five rounds, and gives round() a context `c` with:
     c.say(key, kind)  play one recorded line (and show its words in the bubble), wait for it to finish.
                       Keys: 'VO05' (this game's line), 'SH-VO01' (shared), 'WD-hat', 'CH-ain', 'NUM-3'.
     c.ask(...keys)    say a question; the speaker button repeats it.
     c.tap(els)        wait for the child to tap one of els (only these are live while waiting).
     c.choice(opts)    a multiple choice with the supportive retry ladder.
     c.place(opts)     drag a piece onto a target, or tap the piece and then the target.
     c.wait(ms)        a pause that stops if the child leaves the screen.
   Everything stops cleanly (and no more lines play) when the child presses home, rest, play again or next. */
(() => {
  'use strict';
  const T = window.LL_VOICE_TIMING, Q = window.LLVoice, LINES = window.LL_LINES || {};
  const AUDIO = '../audio/';
  const CANCEL = { cancelled: true };
  const $ = (s, r = document) => r.querySelector(s);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem('ll-lit-' + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('ll-lit-' + k, JSON.stringify(v)); } catch (e) {} },
  };

  /* ================= Audio ================= */
  const Audio_ = (() => {
    let ctx = null, current = null;
    const cache = {};
    function unlock() {
      if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) { try { ctx = new AC(); } catch (e) { ctx = null; } } }
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    }
    const running = () => !ctx || ctx.state === 'running';
    function load(file) {
      if (cache[file]) return cache[file];
      cache[file] = fetch(AUDIO + file + '.mp3')
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then((buf) => (ctx ? new Promise((res, rej) => { const p = ctx.decodeAudioData(buf, res, rej); if (p && p.then) p.then(res, rej); }) : null))
        .catch((e) => { console.warn('Voice clip not available:', file); return undefined; });
      return cache[file];
    }
    function stopClip() { if (!current) return; try { current.stop ? current.stop() : current.pause(); } catch (e) {} current = null; }
    // Plays one file when the voice queue allows. Resolves with its length in ms (0 if skipped).
    async function play(file, kind) {
      unlock();
      const buf = await load(file);
      if (buf === undefined) return 0;
      const started = await Q.turn(file, kind);
      if (!started) return 0;
      let ms = 0;
      if (ctx && buf) {
        const src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination); src.start();
        src.onended = () => { if (current === src) current = null; }; current = src;
        ms = buf.duration * 1000 + 80;
      } else {
        try { const a = new Audio(AUDIO + file + '.mp3'); current = a; await a.play(); ms = (a.duration || 2) * 1000 + 80; } catch (e) { ms = 0; }
      }
      started(ms);
      return ms;
    }
    function stop() { Q.cancel(); stopClip(); }
    function tone(freq, at, dur, vol, type = 'sine') {
      if (!ctx) return;
      const t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
    }
    const sfx = {
      chime: () => { tone(1046.5, 0, 0.6, 0.07); tone(1568, 0.05, 0.45, 0.035); },
      pop: () => { tone(520, 0, 0.1, 0.05); tone(780, 0.04, 0.12, 0.04); },
      soft: () => tone(330, 0, 0.18, 0.04, 'triangle'),
      tick: (i = 0) => tone(660 * Math.pow(1.06, i % 12), 0, 0.12, 0.03),
      drum: () => { tone(110, 0, 0.25, 0.18, 'triangle'); tone(70, 0.01, 0.3, 0.12); },
      whoosh: () => { tone(300, 0, 0.18, 0.03); tone(200, 0.06, 0.22, 0.025); },
      fanfare: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.13, 0.6, 0.08)),
      tone,
    };
    return { unlock, running, load, play, stop, sfx };
  })();

  /* ================= Game ================= */
  function game(G) {
    const code = G.code;
    const fileOf = (key) => {
      const k = /^VO\d+$/.test(key) ? code + '-' + key : key;
      return LINES[k] ? LINES[k] : null;
    };
    const has = (key) => !!fileOf(key);
    const S = { token: 0, level: 0, round: 0, prompt: null, busy: false, clue: null, lastTouch: Date.now() };
    const levelDone = store.get(code + '-levels') || [];

    // ---------- page ----------
    document.title = G.name + ' · Learning Lanterns';
    const stage = document.createElement('main');
    stage.className = 'stage' + (G.dark ? ' dark' : '');
    stage.style.setProperty('--acc', G.accent || '#7d6cc0');
    stage.innerHTML = `
      <div class="s-bg" style="background:${G.bg}"></div>
      <section class="s-start" id="start">
        <div class="big">${window.critter(G.guide)}</div>
        <div class="tx">
          <h1>${esc(G.name)}</h1>
          <div class="lvls" id="levels" role="group" aria-label="Levels"></div>
          <button class="btn hear" id="hear" type="button">🔊 Hear how to play</button>
        </div>
      </section>
      <section id="play" hidden>
        <div class="s-top">
          <button class="sb" id="home" type="button" aria-label="Back to the start">⌂</button>
          <span class="s-title">${esc(G.name)}</span>
          <span class="s-dots" id="dots" aria-label="Progress"></span>
          <button class="sb" id="clue" type="button" aria-label="Clue" hidden>💡</button>
          <button class="sb" id="again" type="button" aria-label="Hear it again">🔊</button>
          <button class="sb" id="rest" type="button" aria-label="Take a rest">☾</button>
        </div>
        <div class="s-guide" id="guide">${window.critter(G.guide)}</div>
        <div class="bubble empty" id="bubble" aria-hidden="true"><span class="spk">🔊</span><span id="cap"></span></div>
        <div class="s-play" id="area"></div>
        <div class="s-fb" id="fb"><i id="fbi">★</i><span id="fbt"></span></div>
      </section>
      <section class="s-done" id="done" hidden>
        <div class="rw" aria-hidden="true">${G.reward.icon}</div>
        <h2 id="doneLine"></h2>
        <div class="five" aria-hidden="true">${'<i></i>'.repeat(5)}</div>
        <div class="btns">
          <button class="btn main" id="replay" type="button">Play again</button>
          <button class="btn go" id="next" type="button">Next level</button>
          <button class="btn" id="toStart" type="button">⌂ Start</button>
        </div>
        <div class="crit">${window.critter(G.guide)}</div>
      </section>
      <section class="s-rest" id="restScreen" hidden>
        <div style="font-size:14cqmin" aria-hidden="true">☾</div>
        <h2>Rest time</h2>
        <div class="btns"><button class="btn main" id="back" type="button">I'm ready!</button></div>
      </section>
      <div class="unlock" id="unlock" hidden><button class="btn main" id="unlockBtn" type="button">▶ Tap to start</button></div>
      <div class="sr-only" aria-live="polite" id="sr"></div>`;
    document.body.appendChild(stage);
    const area = $('#area', stage), cap = $('#cap', stage), bubble = $('#bubble', stage), guide = $('#guide', stage);

    function fit() {
      const w = innerWidth, h = innerHeight, port = w / h < 0.9;
      stage.classList.toggle('port', port);
      const r = port ? 10 / 17.5 : 16 / 10;
      let sw = w, sh = w / r;
      if (sh > h) { sh = h; sw = h * r; }
      stage.style.width = Math.floor(sw) + 'px'; stage.style.height = Math.floor(sh) + 'px';
    }
    addEventListener('resize', fit); fit();

    // ---------- helpers ----------
    const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
    const restart = (e, cls) => { if (!e) return; e.classList.remove(cls); void e.offsetWidth; e.classList.add(cls); };
    function sparkle(target) {
      const sr = stage.getBoundingClientRect(), r = target.getBoundingClientRect();
      for (let i = 0; i < 10; i++) {
        const s = document.createElement('i'); s.className = 'spark';
        s.style.left = (r.left - sr.left + r.width / 2) + 'px'; s.style.top = (r.top - sr.top + r.height / 2) + 'px';
        const a = (i / 10) * Math.PI * 2; s.style.setProperty('--dx', Math.cos(a) * 60 + 'px'); s.style.setProperty('--dy', Math.sin(a) * 60 + 'px');
        stage.appendChild(s); setTimeout(() => s.remove(), 850);
      }
    }
    const roundsOf = () => (typeof G.rounds === 'function' ? G.rounds(S.level) : G.rounds || 5);
    function setDots(n) { $('#dots', stage).innerHTML = Array.from({ length: roundsOf() }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join(''); }
    let fbTimer = 0;
    function banner(text, retry, ms = 2600) {
      $('#fbt', stage).textContent = text; $('#fbi', stage).textContent = retry ? '👂' : '★';
      const f = $('#fb', stage); f.classList.toggle('retry', !!retry); f.classList.add('show');
      clearTimeout(fbTimer); fbTimer = setTimeout(() => f.classList.remove('show'), ms);
    }

    // ---------- context given to rounds ----------
    function context(tok) {
      const alive = () => tok === S.token;
      const check = () => { if (!alive()) throw CANCEL; };
      const c = {
        G, area, stage, el, shuffle, pick, esc, sparkle, restart, banner, sfx: Audio_.sfx, store, has,
        get level() { return S.level; }, get L() { return G.levels[S.level]; }, get round() { return S.round; },
        alive, check,
        firstTime: (what) => { const k = code + '-seen-' + what; if (store.get(k)) return false; store.set(k, 1); return true; },
        async wait(ms) { await sleep(ms); check(); },
        // Play one line. kind (optional) sets the pause after it; see games/shared/voice-timing.js.
        async say(key, kind, opts = {}) {
          check();
          const f = fileOf(key);
          if (!f) { console.warn('No recording for', key); return 0; }
          // Words, chunks, numbers and sounds are heard, not written, so the bubble keeps its last line.
          if (!opts.silentCaption && !/^(WD|CH|NUM|PH)-/.test(key)) { cap.textContent = opts.caption || f[1]; bubble.classList.remove('empty'); $('#sr', stage).textContent = f[1]; }
          const ms = await Audio_.play(f[0], kind);
          check();
          if (ms) { guide.classList.add('talk'); await sleep(ms); guide.classList.remove('talk'); check(); }
          return ms;
        },
        // A question or instruction the speaker button can repeat. Pass keys, or a function that says them.
        async ask(...keys) {
          const fn = typeof keys[0] === 'function' ? keys[0] : async () => { for (const k of keys) await c.say(k, k === keys[keys.length - 1] ? 'question' : 'transition'); };
          S.prompt = fn;
          await fn();
        },
        setPrompt(fn) { S.prompt = fn; },
        // Shared accessibility tips, each said once per device per game.
        async hearAgainTip() { if (c.firstTime('tip-hear')) await c.say('SH-VO05', 'instruction'); },
        async dragTip() { if (c.firstTime('tip-drag')) await c.say('SH-VO10', 'instruction'); },
        setClue(fn) { S.clue = fn; $('#clue', stage).hidden = !fn; },
        // Wait for a tap on one of els. Only these respond while waiting. Idle reminders follow
        // LL_VOICE_TIMING: a wiggle after visualNudgeMs, the idle line after spokenNudgeMs (limited).
        tap(els, opts = {}) {
          check();
          els = [...els].filter(Boolean);
          return new Promise((resolve, reject) => {
            let done = false, lastSpoken = Date.now();
            S.lastTouch = Date.now();
            const handlers = els.map((e) => {
              const h = (ev) => {
                if (done || S.busy) return;
                ev.preventDefault();
                finish(); resolve(e);
              };
              e.classList.add('ready'); e.addEventListener('click', h);
              return [e, h];
            });
            const timer = setInterval(async () => {
              if (!alive()) { finish(); reject(CANCEL); return; }
              if (S.busy || Q.busy()) { S.lastTouch = Math.max(S.lastTouch, Date.now() - T.visualNudgeMs + 1500); return; }
              const idle = Date.now() - S.lastTouch;
              if (idle > T.visualNudgeMs) { S.lastTouch = Date.now(); (opts.nudge || els).forEach((e, i) => setTimeout(() => restart(e, 'wiggle'), i * 120)); }
              if (Date.now() - lastSpoken > T.spokenNudgeMs && opts.idle !== false && Q.nudge()) {
                lastSpoken = Date.now();
                const line = opts.idle || G.idle;
                try { if (line) await c.say(line, 'question'); else if (S.prompt) await S.prompt(); } catch (e) {}
              }
            }, 500);
            const finish = () => { done = true; clearInterval(timer); handlers.forEach(([e, h]) => { e.classList.remove('ready'); e.removeEventListener('click', h); }); };
          });
        },
        /* Multiple choice with the supportive retry ladder.
           opts.items: [{el, ok}], opts.miss1 / miss2 / miss3: line keys (defaults: shared try again, make it easier,
           let's do it together), opts.onMiss(n, item): extra help after a miss (e.g. replay), opts.reduce: remove
           one choice after the second miss (default true). Resolves with the number of misses once the right one is tapped. */
        async choice(opts) {
          let misses = 0;
          const items = opts.items.slice();
          items.forEach((it) => { it.el.dataset.ok = it.ok ? '1' : '0'; });   // used by the automated tests
          for (;;) {
            const live = items.filter((it) => !it.gone);
            const tapped = await c.tap(live.map((it) => it.el), opts);
            const it = items.find((x) => x.el === tapped);
            if (opts.onTap) await opts.onTap(it);
            if (it.ok) { S.busy = true; try { tapped.classList.add('ans'); sparkle(tapped); c.sfx.chime(); } finally { S.busy = false; } return misses; }
            misses++;
            S.busy = true;
            try {
              restart(tapped, 'wiggle'); c.sfx.soft();
              const run = async (l, kind) => { if (!l) return; if (typeof l === 'function') return l(); const f = fileOf(l); if (f) banner(f[1], true); await c.say(l, kind); };
              if (misses === 1) await run(opts.miss1 === undefined ? 'SH-VO01' : opts.miss1, 'retry');
              else if (misses === 2) {
                const canReduce = opts.reduce !== false && live.length > 2;
                await run(opts.miss2 === undefined ? (canReduce ? 'SH-VO06' : null) : opts.miss2, 'retry');
                if (canReduce) { const w = shuffle(live.filter((x) => !x.ok))[0]; w.gone = true; w.el.classList.add('gone'); }
              } else if (misses === 3) {
                await run(opts.miss3 === undefined ? 'SH-VO07' : opts.miss3, 'instruction');
                items.find((x) => x.ok).el.classList.add('glow');
              } else restart(items.find((x) => x.ok).el, 'bounce');   // the answer already glows; no line is repeated
              if (opts.onMiss) await opts.onMiss(misses, it);
            } finally { S.busy = false; }
            check();
          }
        },
        /* Drag a piece onto a target, or tap a piece and then a target. Resolves {piece, target}.
           Pieces that are dropped somewhere else float back. */
        place(opts) {
          check();
          const pieces = [...opts.pieces], targets = [...opts.targets];
          return new Promise((resolve, reject) => {
            let sel = null, done = false, drag = null;
            const clear = () => { pieces.forEach((p) => p.classList.remove('sel')); targets.forEach((t) => t.classList.remove('hint', 'over')); };
            const finish = (res) => {
              done = true; clearInterval(timer); clear();
              pieces.forEach((p) => { p.classList.remove('ready'); p.removeEventListener('pointerdown', down); });
              targets.forEach((t) => { t.classList.remove('ready'); t.removeEventListener('click', tapT); });
              removeEventListener('pointermove', move); removeEventListener('pointerup', up);
              if (res) resolve(res);
            };
            const targetAt = (x, y) => targets.find((t) => { const r = t.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });
            function down(ev) {
              if (done || S.busy) return;
              const p = ev.currentTarget; S.lastTouch = Date.now();
              drag = { p, x: ev.clientX, y: ev.clientY, moved: false };
              ev.preventDefault();
            }
            function move(ev) {
              if (!drag) return;
              const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
              if (!drag.moved && Math.hypot(dx, dy) < 8) return;
              drag.moved = true; drag.p.classList.add('dragging'); drag.p.style.transform = `translate(${dx}px,${dy}px)`;
              targets.forEach((t) => t.classList.toggle('over', t === targetAt(ev.clientX, ev.clientY)));
            }
            function up(ev) {
              if (!drag) return;
              const d = drag; drag = null;
              d.p.classList.remove('dragging'); d.p.style.transform = '';
              if (!d.moved) { // a tap: select this piece
                // A piece sitting in a target (swap layouts) counts as tapping that target once another piece is chosen.
                const holder = sel && sel !== d.p && targets.find((t) => t !== d.p && t.contains(d.p));
                if (holder) { finish({ piece: sel, target: holder }); return; }
                clear(); sel = d.p; sel.classList.add('sel'); targets.forEach((t) => t.classList.add('hint'));
                if (opts.onSelect) opts.onSelect(sel);
                return;
              }
              const t = targetAt(ev.clientX, ev.clientY);
              targets.forEach((x) => x.classList.remove('over'));
              if (t) finish({ piece: d.p, target: t });
            }
            function tapT(ev) { if (done || S.busy || !sel || ev.currentTarget.contains(sel)) return; S.lastTouch = Date.now(); finish({ piece: sel, target: ev.currentTarget }); }
            pieces.forEach((p) => { p.classList.add('ready'); p.addEventListener('pointerdown', down); });
            targets.forEach((t) => { t.classList.add('ready'); t.addEventListener('click', tapT); });
            addEventListener('pointermove', move); addEventListener('pointerup', up);
            let lastSpoken = Date.now();
            const timer = setInterval(async () => {
              if (!alive()) { finish(); reject(CANCEL); return; }
              if (S.busy || Q.busy() || drag) return;
              if (Date.now() - S.lastTouch > T.visualNudgeMs) { S.lastTouch = Date.now(); (opts.nudge || pieces).forEach((e, i) => setTimeout(() => restart(e, 'wiggle'), i * 120)); }
              if (Date.now() - lastSpoken > T.spokenNudgeMs && opts.idle !== false && Q.nudge()) {
                lastSpoken = Date.now(); const line = opts.idle || G.idle;
                try { if (line) await c.say(line, 'question'); else if (S.prompt) await S.prompt(); } catch (e) {}
              }
            }, 500);
          });
        },
        // Run something without the child's taps getting in the way (feedback sequences).
        async busy(fn) { S.busy = true; try { return await fn(); } finally { S.busy = false; } },
        hop() { restart(guide, 'hop'); },
      };
      return c;
    }

    // ---------- flow ----------
    function cancel() { S.token++; S.busy = false; S.prompt = null; Audio_.stop(); cap.textContent = ''; bubble.classList.add('empty'); $('#fb', stage).classList.remove('show'); }
    function show(id) { ['start', 'play', 'done', 'restScreen'].forEach((s) => { $('#' + s, stage).hidden = s !== id; }); }

    function drawLevels() {
      const box = $('#levels', stage); box.innerHTML = '';
      G.levels.forEach((lv, i) => {
        const b = el(`<button class="btn${levelDone.includes(i) ? ' done' : ''}" type="button">${esc(lv.label)}</button>`);
        b.addEventListener('click', () => { Audio_.unlock(); startLevel(i); });
        box.appendChild(b);
      });
    }
    async function intro() {
      const tok = S.token, c = context(tok);
      try { for (const k of G.intro || ['VO01']) await c.say(k, 'instruction'); if (G.tapLevel !== false && has('SH-VO04')) await c.say('SH-VO04', 'instruction'); } catch (e) { if (e !== CANCEL) throw e; }
    }
    function goStart() { cancel(); show('start'); drawLevels(); }

    async function ensureAudio(tok) {
      Audio_.unlock(); await sleep(200);
      if (Audio_.running() || tok !== S.token) return;
      $('#unlock', stage).hidden = false;
      await new Promise((r) => { $('#unlockBtn', stage).onclick = () => { Audio_.unlock(); r(); }; });
      $('#unlock', stage).hidden = true;
    }

    async function startLevel(i, keepRound) {
      cancel();
      S.level = i; if (!keepRound) S.round = 0;
      const tok = S.token, c = context(tok);
      show('play'); setDots(S.round); area.innerHTML = ''; c.setClue(null);
      if (G.preload) G.preload(i).forEach((k) => { const f = fileOf(k); if (f) Audio_.load(f[0]); });
      try {
        await ensureAudio(tok); c.check();
        if (G.levelStart && !keepRound) await G.levelStart(c);
        while (S.round < roundsOf()) {
          c.check(); S.prompt = null; c.setClue(null);
          await G.round(c, S.round);
          c.check();
          S.round++; setDots(S.round);
          if (S.round < roundsOf() && G.between) await G.between(c, S.round);
          await c.wait(500);
        }
        if (!levelDone.includes(i)) { levelDone.push(i); store.set(code + '-levels', levelDone); }
        await finish(c);
      } catch (e) { if (e !== CANCEL) { console.error(e); } }
    }

    async function finish(c) {
      show('done');
      $('#doneLine', stage).textContent = G.doneLine;
      $('#next', stage).hidden = S.level >= G.levels.length - 1;
      c.sfx.fanfare();
      await c.wait(600);
      for (const k of G.complete || []) await c.say(k, 'closing', { silentCaption: true });
    }

    // ---------- controls ----------
    $('#hear', stage).addEventListener('click', () => { Audio_.unlock(); if (!Q.busy()) intro(); });
    let welcomed = false;
    $('#start', stage).addEventListener('pointerdown', (e) => {
      if (welcomed || e.target.closest('button')) return;
      welcomed = true; Audio_.unlock(); intro();
    });
    $('#home', stage).addEventListener('click', async () => {
      cancel(); show('start'); drawLevels();
      if (G.goodbye) { const tok = S.token; try { await context(tok).say(G.goodbye, 'closing'); } catch (e) {} }
    });
    $('#again', stage).addEventListener('click', async () => {
      if (S.busy || !S.prompt || Q.busy()) return;
      const tok = S.token; S.busy = true;
      try { await S.prompt(); } catch (e) {} finally { if (tok === S.token) S.busy = false; }
    });
    $('#clue', stage).addEventListener('click', async () => {
      if (S.busy || !S.clue || Q.busy()) return;
      const tok = S.token; S.busy = true;
      try { await S.clue(); } catch (e) {} finally { if (tok === S.token) S.busy = false; }
    });
    $('#rest', stage).addEventListener('click', async () => {
      cancel(); show('restScreen');
      const tok = S.token; try { await context(tok).say(G.restLine || 'SH-VO08', 'instruction', { silentCaption: true }); } catch (e) {}
    });
    $('#back', stage).addEventListener('click', async () => {
      cancel(); show('play'); area.innerHTML = '';
      const tok = S.token;
      try { await context(tok).say(G.backLine || 'SH-VO09', 'transition'); } catch (e) { return; }
      if (tok === S.token) startLevel(S.level, true);
    });
    $('#replay', stage).addEventListener('click', () => startLevel(S.level));
    $('#next', stage).addEventListener('click', () => startLevel(Math.min(S.level + 1, G.levels.length - 1)));
    $('#toStart', stage).addEventListener('click', goStart);

    $('#hear', stage).hidden = !has(G.intro ? G.intro[0] : 'VO01');
    goStart();
    return { startLevel, S };
  }

  window.LL = { game, shuffle, pick, esc, sleep, has: (k) => !!LINES[k], CANCEL };
})();
