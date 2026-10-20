// Learning activity tracking for the game play pages.
//
// The games themselves are never changed. They are served from the same
// site, so this page can watch the embedded game from outside:
//   - the game's "play" screen appearing      -> a level has started
//   - the game's "well done" card appearing   -> a level has been finished
//   - taps, clicks and key presses            -> the child is actively playing
// Time only counts while the page is visible, a level is on screen, and the
// child has interacted within the last minute. Nothing is recorded unless a
// parent has chosen which child is playing. With accounts switched on it is
// saved to the parent's account; otherwise it stays on this device.
(function () {
  'use strict';
  if (!window.LL) return;
  var LL = window.LL;
  var client = LL.client;
  var esc = LL.esc;

  var frameBox = document.querySelector('[data-track-game]');
  var bar = document.querySelector('[data-player-bar]');
  if (!frameBox || !bar) return;
  var iframe = frameBox.querySelector('iframe');
  var slug = frameBox.getAttribute('data-track-game');
  var studio = frameBox.getAttribute('data-studio');
  var html = document.documentElement;
  var restUrl = LL.cloud ? html.getAttribute('data-sb-url').replace(/\/$/, '') + '/rest/v1' : null;
  var apiKey = html.getAttribute('data-sb-key');

  var IDLE_MS = 60 * 1000;
  var FLUSH_MS = 15 * 1000;
  var MAX_SECONDS = 4 * 60 * 60;

  var token = null;
  var session = null; // the row being recorded
  var dirty = false;
  var lastInput = 0;

  client.auth.onAuthStateChange(function (event, s) { token = s ? s.access_token : null; });

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15);
      return (c === 'x' ? r : (r & 3) | 8).toString(16);
    });
  }

  function event(kind, detail) {
    if (!session) return;
    client.from('activity_events').insert({
      child_id: session.child_id, session_id: session.id, kind: kind,
      activity_slug: slug, studio: studio, detail: detail ? String(detail).slice(0, 120) : null,
    }).then(function (r) { if (r.error) console.warn('Could not save activity:', r.error.message); });
  }

  // keepalive lets the last update reach the server even as the page closes.
  function flush(ending) {
    if (!session || !token || (!dirty && !ending)) return;
    var body = {
      active_seconds: Math.min(MAX_SECONDS, Math.round(session.active_seconds)),
      interactions: session.interactions,
      levels_started: session.levels_started,
      levels_completed: session.levels_completed,
      last_active_at: new Date(session.last_active || session.started).toISOString(),
    };
    if (ending) body.ended_at = new Date().toISOString();
    dirty = false;
    if (!LL.cloud) {
      client.from('activity_sessions').update(body).eq('id', session.id).then(function (r) { if (r.error) dirty = true; });
      return;
    }
    try {
      fetch(restUrl + '/activity_sessions?id=eq.' + session.id, {
        method: 'PATCH',
        keepalive: true,
        headers: { apikey: apiKey, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(body),
      }).catch(function () { dirty = true; });
    } catch (e) { dirty = true; }
  }

  function start(child) {
    stop();
    var now = Date.now();
    session = {
      id: uuid(), child_id: child.id, started: now, last_active: 0,
      active_seconds: 0, interactions: 0, levels_started: 0, levels_completed: 0,
    };
    var s = session;
    return client.from('activity_sessions').insert({
      id: s.id, child_id: child.id, activity_type: 'game', activity_slug: slug, studio: studio,
      started_at: new Date(now).toISOString(), last_active_at: new Date(now).toISOString(),
    }).then(function (r) {
      if (r.error) { console.warn('Could not start saving activity:', r.error.message); if (session === s) session = null; return; }
      event('game_opened');
      // A level already on screen when the child was chosen counts as started.
      var doc = gameDoc();
      if (doc && isShown(doc.getElementById('play'))) levelStarted(doc);
    });
  }

  function stop() {
    if (!session) return;
    flush(true);
    session = null;
  }

  // ---- Watching the game ------------------------------------------------------

  function gameDoc() {
    try { return iframe.contentDocument; } catch (e) { return null; }
  }
  function isShown(el) {
    if (!el || el.hidden) return false;
    var cs = el.ownerDocument.defaultView.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }
  function label(doc) {
    var eb = doc.getElementById('eyebrow');
    var t = eb ? eb.textContent.replace(/\s+/g, ' ').trim() : '';
    // Some games write their label in capitals: store it in sentence case.
    if (t && t === t.toUpperCase()) t = t.charAt(0) + t.slice(1).toLowerCase();
    return t;
  }
  var lastStart = 0;
  function levelStarted(doc) {
    if (!session) return;
    // The screen and its label often change together: count that once.
    if (Date.now() - lastStart < 1500) return;
    lastStart = Date.now();
    session.levels_started++;
    dirty = true;
    setTimeout(function () { event('level_started', label(doc)); }, 400);
  }
  function levelFinished(doc) {
    if (!session) return;
    session.levels_completed++;
    dirty = true;
    event('level_completed', label(doc));
    flush();
  }

  function attach() {
    var doc = gameDoc();
    if (!doc || doc.__llWatched) return;
    // The game may still be loading (or be the blank page before it). Wait
    // until its screens exist, then attach exactly once.
    if (doc.readyState === 'loading' || !doc.getElementById('play')) {
      if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', attach);
      return;
    }
    doc.__llWatched = true;
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (type) {
      doc.addEventListener(type, function () {
        lastInput = Date.now();
        if (session) { session.interactions++; dirty = true; }
      }, { capture: true, passive: true });
    });
    var play = doc.getElementById('play');
    var done = doc.getElementById('done');
    var playWas = isShown(play);
    var doneWas = isShown(done);
    // Use the game window's own MutationObserver so it watches its own document.
    var MO = doc.defaultView.MutationObserver;
    var mo = new MO(function () {
      var p = isShown(play), d = isShown(done);
      if (p && !playWas) levelStarted(doc);
      if (d && !doneWas) levelFinished(doc);
      playWas = p; doneWas = d;
    });
    [play, done].forEach(function (el) { if (el) mo.observe(el, { attributes: true, attributeFilter: ['hidden', 'class', 'style'] }); });
    // "Next level" and "Play again" can swap levels without leaving the play
    // screen, so a change of level label also counts as a new level.
    var eb = doc.getElementById('eyebrow');
    var lastLabel = label(doc);
    if (eb) new MO(function () {
      var now = label(doc);
      if (now && now !== lastLabel && isShown(play) && !isShown(done) && playWas) {
        lastLabel = now;
        levelStarted(doc);
      } else lastLabel = now;
    }).observe(eb, { childList: true, characterData: true, subtree: true });
  }

  iframe.addEventListener('load', attach);
  attach();

  setInterval(function () {
    if (!session) return;
    var doc = gameDoc();
    if (!doc) return;
    var playing = isShown(doc.getElementById('play')) && !isShown(doc.getElementById('done'));
    var now = Date.now();
    if (document.visibilityState === 'visible' && playing && now - lastInput < IDLE_MS) {
      session.active_seconds += 1;
      session.last_active = now;
      dirty = true;
    }
  }, 1000);
  setInterval(function () { flush(false); }, FLUSH_MS);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(false); });
  window.addEventListener('pagehide', function () { stop(); });

  // ---- Who's playing? -------------------------------------------------------------

  function renderBar(user, children) {
    if (!user) {
      bar.innerHTML = '<p>Want to keep track of progress? <a href="' + LL.link('account/log-in/') + '?next=' + encodeURIComponent(document.body.getAttribute('data-path')) + '">Log in</a> or <a href="' + LL.link('account/sign-up/') + '">create a free family account</a>.</p>';
      return;
    }
    if (!children.length) {
      bar.innerHTML = LL.cloud
        ? '<p>Add a child to your family account to save their progress. <a href="' + LL.link('account/children/') + '#add">Add a child</a></p>'
        : '<p>No sign-up needed to play. Want to see what your child plays each day? <a href="' + LL.link('account/children/') + '#add">Add your child</a> to track progress on this device.</p>';
      return;
    }
    var saved = LL.activeChild(user.id);
    // Use the current profile, in case the nickname was edited since.
    var active = saved ? children.filter(function (c) { return c.id === saved.id; })[0] || null : null;
    if (saved && !active) LL.activeChild(user.id, null);
    var opts = '<option value="">Just looking (not saved)</option>' + children.map(function (c) {
      return '<option value="' + c.id + '"' + (active && active.id === c.id ? ' selected' : '') + '>' + esc(c.nickname) + '</option>';
    }).join('');
    bar.innerHTML = '<label for="who-plays"><strong>Who’s playing?</strong></label> <select id="who-plays">' + opts + '</select>' +
      '<span class="player-state" aria-live="polite">' + (active ? 'Saving ' + esc(active.nickname) + '’s progress' : 'Progress isn’t being saved') + '</span>';
    var sel = bar.querySelector('select');
    sel.addEventListener('change', function () {
      var c = children.filter(function (x) { return x.id === sel.value; })[0] || null;
      LL.activeChild(user.id, c);
      bar.querySelector('.player-state').textContent = c ? 'Saving ' + c.nickname + '’s progress' : 'Progress isn’t being saved';
      if (c) start(c); else stop();
    });
    if (active) start(active);
  }

  LL.ready.then(function (s) {
    token = s.session ? s.session.access_token : null;
    bar.hidden = false;
    if (!s.user) return renderBar(null, []);
    client.from('children').select('id, nickname').order('created_at').then(function (r) {
      renderBar(s.user, r.error ? [] : r.data);
    });
  });
})();
