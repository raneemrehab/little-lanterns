// Learning Lanterns: small progressive enhancements. Every page works
// without this file; it adds the menus, search, reveal and form feedback.
(function () {
  'use strict';

  var root = document.documentElement.getAttribute('data-root') || '';
  var fileLinks = document.documentElement.getAttribute('data-links') === 'file';

  function link(path) {
    if (/^https?:/.test(path)) return path;
    var parts = path.split('#');
    var p = parts[0];
    if (fileLinks && (p === '' || /\/$/.test(p))) p += 'index.html';
    return (root + p || './') + (parts.length > 1 ? '#' + parts[1] : '');
  }

  // ---- Header shadow on scroll ----------------------------------------------
  var header = document.querySelector('.site-header');
  function onScroll() { header && header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile navigation ------------------------------------------------------
  var burger = document.querySelector('.nav-burger');
  var nav = document.getElementById('primary-nav');
  function setNav(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    burger.querySelector('.visually-hidden').textContent = open ? 'Close menu' : 'Menu';
  }
  if (burger) {
    burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
    window.matchMedia('(min-width: 1341px)').addEventListener('change', function (e) { if (e.matches) setNav(false); });
  }

  // ---- Studio sub-menu ---------------------------------------------------------
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('studio-menu');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && window.matchMedia('(min-width: 1341px)').matches) setMenu(false);
    });
    menu.addEventListener('focusout', function (e) {
      var parent = toggle.parentElement;
      if (window.matchMedia('(min-width: 1341px)').matches && !parent.contains(e.relatedTarget)) setMenu(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    else if (burger && burger.getAttribute('aria-expanded') === 'true') { setNav(false); burger.focus(); }
  });

  // ---- Search -------------------------------------------------------------------
  var dialog = document.getElementById('search-dialog');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  var opener = document.querySelector('.search-open');
  var index = window.LL_SEARCH || [];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function highlight(text, terms) {
    var out = escapeHtml(text);
    terms.forEach(function (t) {
      if (t.length < 2) return;
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }
  function render(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      status.textContent = 'Try a learning area, a skill or a page name.';
      results.innerHTML = index
        .filter(function (i) { return i.featured; })
        .map(function (i) { return '<li><a href="' + link(i.url) + '"><strong>' + escapeHtml(i.title) + '</strong><span>' + escapeHtml(i.kind) + '</span></a></li>'; })
        .join('');
      return;
    }
    var scored = index
      .map(function (item) {
        var hay = (item.title + ' ' + item.text + ' ' + item.keywords).toLowerCase();
        var title = item.title.toLowerCase();
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          if (hay.indexOf(terms[i]) === -1) return null;
          score += title.indexOf(terms[i]) !== -1 ? 5 : 1;
        }
        return { item: item, score: score };
      })
      .filter(Boolean)
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 12);
    status.textContent = scored.length
      ? scored.length + (scored.length === 1 ? ' result' : ' results')
      : 'Nothing found for “' + q + '” yet. Try “counting”, “phonics” or “schools”.';
    results.innerHTML = scored
      .map(function (r) {
        return '<li><a href="' + link(r.item.url) + '"><strong>' + highlight(r.item.title, terms) + '</strong><span>' + escapeHtml(r.item.kind) + ' · ' + highlight(r.item.text, terms) + '</span></a></li>';
      })
      .join('');
  }

  function openSearch() {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    setNav(false);
    dialog.showModal();
    input.value = '';
    render('');
    input.focus();
  }
  if (opener && dialog) {
    opener.addEventListener('click', openSearch);
    input.addEventListener('input', function () { render(input.value.trim()); });
    dialog.querySelector('.search-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () { opener.focus(); });
    dialog.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var first = results.querySelector('a');
      if (first) window.location.href = first.href;
    });
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (e.key === '/' && !dialog.open && tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
        e.preventDefault();
        openSearch();
      }
    });
  }

  // ---- Gentle reveal -------------------------------------------------------------
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealables = document.querySelectorAll('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Filters (only rendered when real metadata exists) ---------------------------
  document.querySelectorAll('[data-filter-group]').forEach(function (bar) {
    var target = document.getElementById(bar.getAttribute('data-filter-group'));
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var value = btn.getAttribute('data-filter');
      bar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      target.querySelectorAll('[data-tags]').forEach(function (card) {
        card.hidden = value !== 'all' && card.getAttribute('data-tags').split(' ').indexOf(value) === -1;
      });
    });
  });

  // ---- Forms (only rendered when a real endpoint is configured) ---------------------
  document.querySelectorAll('form[data-enhanced-form]').forEach(function (form) {
    var out = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      form.querySelectorAll('[required]').forEach(function (el) {
        var ok = el.checkValidity();
        el.setAttribute('aria-invalid', String(!ok));
        var err = el.parentElement.querySelector('.field-error');
        if (!ok && !err) {
          err = document.createElement('p');
          err.className = 'field-error';
          err.id = el.id + '-error';
          el.setAttribute('aria-describedby', err.id);
          el.parentElement.appendChild(err);
        }
        if (err) err.textContent = ok ? '' : (el.type === 'email' && el.value ? 'Please check this email address.' : 'Please fill this in.');
        if (!ok && !firstBad) firstBad = el;
      });
      if (firstBad) { firstBad.focus(); return; }
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      out.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('bad');
          form.reset();
          out.textContent = 'Thank you! Your message is on its way, and we’ll be in touch.';
        })
        .catch(function () {
          out.textContent = 'Sorry, that didn’t send. Please try again in a moment.';
        })
        .then(function () { btn.disabled = false; });
    });
  });
})();
