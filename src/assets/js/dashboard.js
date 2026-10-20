// The family dashboard. Everything shown is calculated from the child's
// real, saved activity. With no activity, the page says so.
(function () {
  'use strict';
  if (!window.LL || !window.LLCharts) return;
  var LL = window.LL, C = window.LLCharts, esc = LL.esc;
  var client = LL.client;
  var cat = LL.catalog;
  var studioById = {}; cat.studios.forEach(function (s) { studioById[s.id] = s; });
  var gameBySlug = {}; cat.games.forEach(function (g) { gameBySlug[g.slug] = g; });
  var LEVELS = { 1: 'Little Sparks', 2: 'Glow', 3: 'Shine', 4: 'Bright' };
  var DAY = 86400000;

  var $ = function (sel) { return document.querySelector(sel); };
  var state = { user: null, children: [], child: null, sessions: [], events: [], period: 'week', studio: '', skill: '' };

  function minutes(sec) { return sec / 60; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many || one + 's'); }
  function timeText(sec) {
    var m = Math.round(sec / 60);
    if (sec > 0 && m === 0) return 'under a minute';
    if (m < 60) return plural(m, 'minute');
    var h = Math.floor(m / 60), r = m % 60;
    return plural(h, 'hour') + (r ? ' ' + plural(r, 'minute') : '');
  }
  function dayKey(d) { var x = new Date(d); return x.getFullYear() + '-' + (x.getMonth() + 1) + '-' + x.getDate(); }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); }
  function niceDate(d) { return new Date(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }); }
  function shortDate(d) { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); }

  function parseAges(s) {
    if (!s) return null;
    var m = s.match(/(\d+)\s*[–-]\s*(\d+)/);
    if (m) return [Number(m[1]), Number(m[2])];
    m = s.match(/from\s+(\d+)/i);
    return m ? [Number(m[1]), 99] : null;
  }

  // ---- Filtering ---------------------------------------------------------------

  function periodStart() {
    var today = startOfDay(Date.now());
    if (state.period === 'week') return today - 6 * DAY;
    if (state.period === 'month') return today - 27 * DAY;
    return 0;
  }
  function matches(slug, studio) {
    var g = slug ? gameBySlug[slug] : null;
    if (state.studio && (g ? g.studio : studio) !== state.studio) return false;
    if (state.skill && (!g || g.practises.indexOf(state.skill) === -1)) return false;
    return true;
  }
  function filtered() {
    var from = periodStart();
    return {
      sessions: state.sessions.filter(function (s) { return new Date(s.started_at).getTime() >= from && matches(s.activity_slug, s.studio); }),
      events: state.events.filter(function (e) {
        if (new Date(e.occurred_at).getTime() < from) return false;
        // Studio visits have no game, so a skill filter leaves them out.
        if (e.kind === 'studio_visit') return !state.skill && (!state.studio || e.studio === state.studio);
        return matches(e.activity_slug, e.studio);
      }),
    };
  }

  // ---- Rendering ------------------------------------------------------------------

  function tiles(f) {
    var secs = f.sessions.reduce(function (a, s) { return a + s.active_seconds; }, 0);
    var played = {}; f.sessions.forEach(function (s) { played[s.activity_slug] = 1; });
    var levels = f.sessions.reduce(function (a, s) { return a + s.levels_completed; }, 0);
    var days = {};
    f.sessions.forEach(function (s) { days[dayKey(s.started_at)] = 1; });
    f.events.forEach(function (e) { days[dayKey(e.occurred_at)] = 1; });
    var items = [
      ['Time spent', timeText(secs), 'actively playing'],
      ['Games played', String(Object.keys(played).length), 'different games'],
      ['Levels finished', String(levels), 'worked through to the end'],
      ['Days active', String(Object.keys(days).length), state.period === 'week' ? 'of the last 7' : state.period === 'month' ? 'of the last 28' : 'so far'],
    ];
    $('[data-tiles]').innerHTML = items.map(function (t) {
      return '<li class="stat-tile"><span class="stat-label">' + t[0] + '</span><span class="stat-value">' + esc(t[1]) + '</span><span class="stat-sub">' + t[2] + '</span></li>';
    }).join('');
    return { secs: secs, played: Object.keys(played), levels: levels };
  }

  function weekChart(f) {
    var cats = [], bucket;
    var today = startOfDay(Date.now());
    if (state.period === 'week') {
      for (var i = 6; i >= 0; i--) {
        var d = today - i * DAY;
        cats.push({ start: d, end: d + DAY, label: new Date(d).toLocaleDateString(undefined, { weekday: 'short' }), full: niceDate(d) });
      }
      $('[data-week-sub]').textContent = 'Minutes of active play each day, by learning studio';
    } else {
      var weeks = 4;
      if (state.period === 'all') {
        var first = state.sessions.reduce(function (a, s) { return Math.min(a, new Date(s.started_at).getTime()); }, Date.now());
        weeks = Math.max(1, Math.min(12, Math.ceil((today + DAY - startOfDay(first)) / (7 * DAY))));
      }
      for (var w = weeks - 1; w >= 0; w--) {
        var end = today + DAY - w * 7 * DAY, start = end - 7 * DAY;
        cats.push({ start: start, end: end, label: shortDate(start), full: 'Week of ' + shortDate(start) });
      }
      $('[data-week-sub]').textContent = 'Minutes of active play each week, by learning studio' + (state.period === 'all' && weeks === 12 ? ' (last 12 weeks)' : '');
    }
    bucket = function (t) { for (var k = 0; k < cats.length; k++) if (t >= cats[k].start && t < cats[k].end) return k; return -1; };
    var series = cat.studios.map(function (st) {
      var vals = cats.map(function () { return 0; });
      f.sessions.forEach(function (s) {
        if (s.studio !== st.id) return;
        var k = bucket(new Date(s.started_at).getTime());
        if (k >= 0) vals[k] += minutes(s.active_seconds);
      });
      return { name: st.name, color: st.color, values: vals };
    });
    C.columns($('[data-chart="week"]'), { categories: cats, series: series, unit: 'minutes' });
    var used = series.filter(function (s) { return s.values.some(function (v) { return v > 0; }); });
    C.table($('[data-table="week"]'), ['When'].concat(used.map(function (s) { return s.name + ' (min)'; })).concat(used.length ? [] : ['Minutes']),
      cats.map(function (c, i) { return [c.full].concat(used.length ? used.map(function (s) { return C.fmt(s.values[i]); }) : ['0']); }));
  }

  function studioChart(f) {
    var rows = cat.studios.map(function (st) {
      var secs = 0, visits = 0;
      f.sessions.forEach(function (s) { if (s.studio === st.id) secs += s.active_seconds; });
      f.events.forEach(function (e) { if (e.kind === 'studio_visit' && e.studio === st.id) visits++; });
      return { st: st, secs: secs, visits: visits };
    }).filter(function (r) { return r.st.open || r.visits > 0; });
    C.bars($('[data-chart="studios"]'), rows.map(function (r) {
      return {
        label: r.st.name, sub: r.st.subtitle + (r.st.open ? '' : ' · coming soon'), value: minutes(r.secs), color: r.st.color,
        text: timeText(r.secs) + ' · ' + plural(r.visits, 'visit'),
      };
    }));
    var soon = cat.studios.filter(function (s) { return !s.open; }).length;
    if (soon) $('[data-chart="studios"]').insertAdjacentHTML('beforeend', '<p class="chart-foot">' + soon + ' more studios are being built. They’ll appear here once they have activities.</p>');
    C.table($('[data-table="studios"]'), ['Studio', 'Active time', 'Visits'], rows.map(function (r) { return [r.st.name, timeText(r.secs), String(r.visits)]; }));
  }

  function skills(f) {
    var bySkill = {};
    f.sessions.forEach(function (s) {
      var g = gameBySlug[s.activity_slug];
      if (!g || !s.levels_completed) return;
      g.practises.forEach(function (p) {
        if (state.skill && p !== state.skill) return;
        bySkill[p] = bySkill[p] || { levels: 0, games: {} };
        bySkill[p].levels += s.levels_completed;
        bySkill[p].games[g.title] = 1;
      });
    });
    var rows = Object.keys(bySkill).map(function (k) { return { skill: k, levels: bySkill[k].levels, games: Object.keys(bySkill[k].games) }; })
      .sort(function (a, b) { return b.levels - a.levels; });
    var el = $('[data-skills]');
    if (!rows.length) {
      el.innerHTML = '<p class="muted">When your child finishes a level, the skills that game practises will show up here.</p>';
      return;
    }
    C.bars(el, rows.map(function (r) {
      return { label: r.skill, sub: r.games.join(', '), value: r.levels, color: 'var(--accent)', text: plural(r.levels, 'level') + ' finished' };
    }));
  }

  function gamesTable(f) {
    var by = {};
    f.sessions.forEach(function (s) {
      var r = by[s.activity_slug] = by[s.activity_slug] || { opened: 0, secs: 0, started: 0, done: 0, last: 0 };
      r.opened++; r.secs += s.active_seconds; r.started += s.levels_started; r.done += s.levels_completed;
      r.last = Math.max(r.last, new Date(s.last_active_at).getTime());
    });
    var slugs = Object.keys(by).sort(function (a, b) { return by[b].last - by[a].last; });
    var el = $('[data-games]');
    if (!slugs.length) { el.innerHTML = '<p class="muted">No games played in this period.</p>'; return; }
    el.innerHTML = '<table class="data-table"><thead><tr><th scope="col">Game</th><th scope="col">Times opened</th><th scope="col">Active time</th><th scope="col">Levels started</th><th scope="col">Levels finished</th><th scope="col">Last played</th></tr></thead><tbody>' +
      slugs.map(function (slug) {
        var g = gameBySlug[slug], r = by[slug];
        var name = g ? '<a href="' + LL.link(g.page) + '">' + esc(g.title) + '</a>' : esc(slug);
        return '<tr><th scope="row">' + name + '</th><td>' + r.opened + '</td><td>' + esc(timeText(r.secs)) + '</td><td>' + r.started + '</td><td>' + r.done + '</td><td>' + esc(niceDate(r.last)) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function timeline(f) {
    // A "first" is the first time ever (not just in this period).
    var firstDone = {};
    state.events.slice().sort(function (a, b) { return new Date(a.occurred_at) - new Date(b.occurred_at); })
      .forEach(function (e) { if (e.kind === 'level_completed' && !firstDone[e.activity_slug]) firstDone[e.activity_slug] = e.id; });
    var shown = f.events.filter(function (e) { return e.kind !== 'level_started'; }).slice(0, 25);
    var el = $('[data-timeline]');
    if (!shown.length) { el.innerHTML = '<li class="muted">Nothing here for this period yet.</li>'; return; }
    var lastDay = '';
    el.innerHTML = shown.map(function (e) {
      var g = gameBySlug[e.activity_slug], st = studioById[e.studio];
      var text, icon = 'dot';
      if (e.kind === 'level_completed') {
        var first = firstDone[e.activity_slug] === e.id;
        text = (first ? '<strong>Milestone:</strong> finished a first level in ' : 'Finished ') + esc(g ? g.title : e.activity_slug) + (e.detail ? ' <span class="muted">(' + esc(e.detail) + ')</span>' : '');
        icon = first ? 'star' : 'check';
      } else if (e.kind === 'game_opened') text = 'Opened ' + esc(g ? g.title : e.activity_slug);
      else if (e.kind === 'studio_visit') text = 'Visited ' + esc(st ? st.name : e.studio);
      else text = esc(e.kind.replace(/_/g, ' '));
      var day = niceDate(e.occurred_at);
      var head = day !== lastDay ? '<span class="tl-day">' + esc(day) + '</span>' : '';
      lastDay = day;
      var time = new Date(e.occurred_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      return '<li class="tl-' + icon + '">' + head + '<span class="tl-text">' + text + '</span><span class="tl-time">' + esc(time) + '</span></li>';
    }).join('');
  }

  function insightsAndSuggestions(f, t) {
    var child = state.child;
    var name = esc(child.nickname);
    var periodText = state.period === 'week' ? 'In the last 7 days' : state.period === 'month' ? 'In the last 4 weeks' : 'So far';
    var bySlug = {};
    f.sessions.forEach(function (s) { bySlug[s.activity_slug] = (bySlug[s.activity_slug] || 0) + s.active_seconds; });
    var top = Object.keys(bySlug).sort(function (a, b) { return bySlug[b] - bySlug[a]; })[0];
    var lines = [];
    if (f.sessions.length) {
      lines.push(periodText + ', ' + name + ' played ' + plural(t.played.length, 'game') + ' for ' + esc(timeText(t.secs)) +
        (top && gameBySlug[top] ? ', and spent the most time with <strong>' + esc(gameBySlug[top].title) + '</strong>' : '') + '.');
    } else {
      lines.push(periodText + ', ' + name + ' explored the learning studios but hasn’t played a game yet.');
    }
    // Most practised skill, counting games played at all (not mastery).
    var skillCount = {};
    f.sessions.forEach(function (s) { var g = gameBySlug[s.activity_slug]; if (g) g.practises.forEach(function (p) { skillCount[p] = (skillCount[p] || 0) + s.active_seconds; }); });
    var topSkill = Object.keys(skillCount).sort(function (a, b) { return skillCount[b] - skillCount[a]; })[0];
    if (topSkill && skillCount[topSkill] > 0) lines.push('The skill they’ve practised most is <strong>' + esc(topSkill.toLowerCase()) + '</strong>.');
    if (t.levels) lines.push('They worked all the way through ' + plural(t.levels, 'level') + '. Lovely persistence!');
    var everPlayed = {}; state.sessions.forEach(function (s) { everPlayed[s.activity_slug] = 1; });
    var unplayed = cat.games.filter(function (g) { return !everPlayed[g.slug]; });
    if (unplayed.length) lines.push(plural(unplayed.length, 'maths game') + ' still waiting to be discovered.');
    $('[data-insights]').innerHTML = '<h2 class="chart-title">What ' + name + ' has been exploring</h2><ul>' + lines.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>';

    // Suggestions: real games, matched to the child's level and age where the
    // game says which levels and ages it suits.
    var ages = child.age_group.split('-').map(Number);
    function fits(g) {
      var lv = g.levels ? (child.learning_level >= g.levels[0] && child.learning_level <= g.levels[1]) : null;
      var ag = parseAges(g.ages);
      var age = ag ? (ages[1] > ag[0] && ages[0] <= ag[1]) : null;
      if (lv === false || age === false) return 0;
      return (lv ? 2 : 0) + (age ? 1 : 0) + 1;
    }
    var picks = unplayed.map(function (g) { return { g: g, score: fits(g) }; })
      .filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score; }).slice(0, 3)
      .map(function (x) {
        var why = x.g.levels && child.learning_level >= x.g.levels[0] && child.learning_level <= x.g.levels[1]
          ? 'Made for ' + LEVELS[child.learning_level] + ' level, where ' + name + ' is now.'
          : 'A new game to try. It practises ' + esc((x.g.practises[0] || 'maths').toLowerCase()) + '.';
        return { g: x.g, why: why };
      });
    if (top && gameBySlug[top] && picks.length < 3) {
      picks.push({ g: gameBySlug[top], why: 'A favourite! Try the next level when they’re ready.' });
    }
    var focusSoon = (child.focus_studios || []).filter(function (id) { return studioById[id] && !studioById[id].open; });
    var html = picks.map(function (p) {
      return '<li><a class="suggestion" href="' + LL.link(p.g.page) + '">' + (p.g.preview ? '<img src="' + LL.link(p.g.preview) + '" alt="" loading="lazy">' : '') +
        '<span><strong>' + esc(p.g.title) + '</strong><span>' + p.why + '</span></span></a></li>';
    }).join('');
    if (!html) html = '<li class="muted">' + name + ' has tried every maths game we have. Revisiting favourites at a new level is a great next step.</li>';
    if (focusSoon.length) {
      html += '<li class="muted">' + esc(focusSoon.map(function (id) { return studioById[id].name; }).join(' and ')) + (focusSoon.length > 1 ? ' are' : ' is') + ' coming soon. We’ll suggest activities there as soon as they’re ready.</li>';
    }
    $('[data-suggestions]').innerHTML = html;
  }

  function render() {
    var anyEver = state.sessions.length || state.events.length;
    var f = filtered();
    var anyNow = f.sessions.length || f.events.length;
    $('[data-empty]').hidden = !!anyNow;
    $('[data-has-data]').hidden = !anyNow;
    if (!anyNow) {
      $('[data-empty-title]').textContent = anyEver ? 'Nothing for this view yet' : 'A bright journey starts here';
      $('[data-empty-text]').textContent = anyEver
        ? 'There’s no activity for these filters. Try a longer time period or a different studio or skill.'
        : 'Nothing to show yet for ' + state.child.nickname + '. Progress will appear here as they explore Learning Lanterns. Before a game starts, choose who’s playing at the top of the game page.';
      return;
    }
    var t = tiles(f);
    weekChart(f);
    studioChart(f);
    skills(f);
    gamesTable(f);
    timeline(f);
    insightsAndSuggestions(f, t);
  }

  function loadChild(child) {
    state.child = child;
    try { localStorage.setItem('ll-dash-child:' + state.user.id, child.id); } catch (e) { /* storage blocked */ }
    document.querySelectorAll('[data-child-tabs] button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-id') === child.id)); });
    $('[data-dashboard]').hidden = false;
    $('[data-has-data]').hidden = true;
    $('[data-empty]').hidden = true;
    return Promise.all([
      client.from('activity_sessions').select('*').eq('child_id', child.id).order('started_at', { ascending: false }).limit(5000),
      client.from('activity_events').select('*').eq('child_id', child.id).order('occurred_at', { ascending: false }).limit(5000),
    ]).then(function (res) {
      if (res[0].error || res[1].error) {
        $('[data-empty]').hidden = false;
        $('[data-empty-title]').textContent = 'We couldn’t load the dashboard';
        $('[data-empty-text]').textContent = LL.friendlyError(res[0].error || res[1].error);
        return;
      }
      if (state.child !== child) return;
      state.sessions = res[0].data;
      state.events = res[1].data;
      render();
    });
  }

  function setupFilters() {
    var studioSel = $('[data-filter="studio"]'), skillSel = $('[data-filter="skill"]');
    studioSel.insertAdjacentHTML('beforeend', cat.studios.filter(function (s) { return s.open; }).map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join(''));
    var skills = {}; cat.games.forEach(function (g) { g.practises.forEach(function (p) { skills[p] = 1; }); });
    skillSel.insertAdjacentHTML('beforeend', Object.keys(skills).sort().map(function (p) { return '<option>' + esc(p) + '</option>'; }).join(''));
    document.querySelectorAll('[data-filter]').forEach(function (sel) {
      sel.addEventListener('change', function () { state[sel.getAttribute('data-filter')] = sel.value; render(); });
    });
  }

  LL.ready.then(function (s) {
    if (!s.user) return;
    state.user = s.user;
    var first = (s.user.user_metadata && s.user.user_metadata.full_name) || '';
    $('[data-greeting]').textContent = first ? 'Hello, ' + first + '!' : 'Hello!';
    setupFilters();
    client.from('children').select('*').order('created_at').then(function (r) {
      if (r.error) { $('[data-no-children]').hidden = false; return; }
      state.children = r.data;
      if (!r.data.length) { $('[data-no-children]').hidden = false; return; }
      var tabs = $('[data-child-tabs]');
      tabs.innerHTML = r.data.map(function (c) {
        return '<button type="button" class="child-tab" data-id="' + c.id + '" aria-pressed="false"><span class="child-avatar" aria-hidden="true">' + esc(c.nickname.charAt(0).toUpperCase()) + '</span>' + esc(c.nickname) + '</button>';
      }).join('');
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var c = state.children.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0];
        if (c) loadChild(c);
      });
      var saved = null;
      try { saved = localStorage.getItem('ll-dash-child:' + s.user.id); } catch (e) { /* storage blocked */ }
      var active = LL.activeChild(s.user.id);
      var pick = r.data.filter(function (c) { return c.id === saved; })[0] || r.data.filter(function (c) { return active && c.id === active.id; })[0] || r.data[0];
      loadChild(pick);
    });
  });
})();
