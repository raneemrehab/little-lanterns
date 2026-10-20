// Learning Lanterns accounts: the shared client, the header link,
// "who's playing" and studio-visit records. With Supabase set in
// src/config.mjs, parents sign up and progress is saved to their account.
// Without it, progress is kept on this device only (local-client.js).
(function () {
  'use strict';

  var html = document.documentElement;
  var url = html.getAttribute('data-sb-url');
  var key = html.getAttribute('data-sb-key');
  var root = html.getAttribute('data-root') || '';
  var fileLinks = html.getAttribute('data-links') === 'file';
  var cloud = Boolean(url && key && window.supabase);
  if (!cloud && !window.LLLocalClient) return;

  var client = cloud
    ? window.supabase.createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
    : window.LLLocalClient;

  function link(path) {
    var parts = path.split('#');
    var p = parts[0];
    if (fileLinks && (p === '' || /\/$/.test(p))) p += 'index.html';
    return root + p + (parts.length > 1 ? '#' + parts[1] : '');
  }

  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null');
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }

  // The child currently using the site on this device, remembered per parent.
  function activeChild(userId, child) {
    var k = 'll-active-child:' + userId;
    if (child === undefined) return store(k);
    store(k, child ? { id: child.id, nickname: child.nickname } : null);
  }

  var ready = client.auth.getSession().then(function (r) {
    return { client: client, session: r.data.session, user: r.data.session ? r.data.session.user : null };
  });

  function updateHeader(user) {
    document.querySelectorAll('[data-account-link]').forEach(function (a) {
      a.href = user ? a.getAttribute('data-href-in') : a.getAttribute('data-href-out');
      var label = a.querySelector('[data-account-label]');
      if (label) label.textContent = !cloud ? 'Progress' : user ? 'My family' : 'Log in';
    });
    // In device mode the "Sign up" link stays, since signing up isn't open yet.
    document.querySelectorAll('[data-signed-out-only]').forEach(function (a) { a.hidden = Boolean(cloud && user); });
  }

  ready.then(function (s) { updateHeader(s.user); });

  // Signed-in pages: send visitors without a session to log in, then back.
  ready.then(function (s) {
    var gate = document.querySelector('[data-needs-session]');
    if (!gate) return;
    if (!s.user) {
      var here = document.body.getAttribute('data-path') || 'account/';
      window.location.replace(link('account/log-in/') + '?next=' + encodeURIComponent(here));
      return;
    }
    gate.querySelector('[data-loading]').hidden = true;
    gate.querySelector('[data-signed-in]').hidden = false;
    document.dispatchEvent(new CustomEvent('ll:signed-in', { detail: s }));
  });
  client.auth.onAuthStateChange(function (event, session) {
    updateHeader(session ? session.user : null);
  });

  // Studio pages carry data-studio on <body>. A visit is recorded at most
  // once a day per studio, and only when a child has been chosen.
  ready.then(function (s) {
    var studio = document.body.getAttribute('data-studio');
    if (!studio || !s.user) return;
    var child = activeChild(s.user.id);
    if (!child) return;
    var day = new Date().toISOString().slice(0, 10);
    var k = 'll-visit:' + child.id + ':' + studio;
    if (store(k) === day) return;
    client.from('activity_events').insert({ child_id: child.id, kind: 'studio_visit', studio: studio })
      .then(function (r) { if (!r.error) store(k, day); });
  });

  window.LL = {
    client: client,
    cloud: cloud,
    ready: ready,
    link: link,
    activeChild: activeChild,
    catalog: window.LL_CATALOG || { studios: [], games: [] },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    // Friendlier wording for the errors parents are most likely to see.
    friendlyError: function (err) {
      var m = (err && err.message) || '';
      if (/invalid login credentials/i.test(m)) return 'That email and password don’t match an account. Please check them and try again.';
      if (/email not confirmed/i.test(m)) return 'Please confirm your email address first. Check your inbox for the link we sent.';
      if (/already registered|already exists/i.test(m)) return 'There’s already an account with this email. Try logging in instead.';
      if (/password should be at least|weak password/i.test(m)) return 'Please choose a password with at least 8 characters.';
      if (/rate limit|too many/i.test(m)) return 'Too many tries in a short time. Please wait a few minutes and try again.';
      if (/failed to fetch|network/i.test(m)) return 'We couldn’t reach the server. Please check your connection and try again.';
      return 'Something went wrong. Please try again in a moment.';
    },
  };
})();
