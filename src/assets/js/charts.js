// Small, dependency-free charts for the family dashboard. Built from HTML so
// they reflow naturally on phones. Every mark is focusable and has a hover
// or focus tooltip, every chart with more than one series has a legend, and
// each chart also has a table view on the page.
(function () {
  'use strict';
  var esc = function (s) { return window.LL ? window.LL.esc(s) : String(s); };

  function niceMax(v) {
    if (v <= 0) return 5;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / p;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
  }
  function fmt(v) { return v >= 10 ? String(Math.round(v)) : String(Math.round(v * 10) / 10); }

  function tooltip(el) {
    var tip = el.querySelector('.chart-tip');
    if (!tip) { tip = document.createElement('div'); tip.className = 'chart-tip'; tip.setAttribute('role', 'presentation'); el.appendChild(tip); }
    function show(target) {
      tip.innerHTML = target.getAttribute('data-tip');
      tip.hidden = false;
      var box = el.getBoundingClientRect(), r = target.getBoundingClientRect();
      var left = r.left - box.left + r.width / 2;
      tip.style.left = Math.max(8, Math.min(box.width - tip.offsetWidth - 8, left - tip.offsetWidth / 2)) + 'px';
      tip.style.top = Math.max(0, r.top - box.top - tip.offsetHeight - 8) + 'px';
    }
    function hide() { tip.hidden = true; }
    hide();
    el.addEventListener('mouseover', function (e) { var t = e.target.closest('[data-tip]'); if (t) show(t); });
    el.addEventListener('mouseout', function (e) { if (e.target.closest('[data-tip]')) hide(); });
    el.addEventListener('focusin', function (e) { var t = e.target.closest('[data-tip]'); if (t) show(t); });
    el.addEventListener('focusout', hide);
  }

  // Vertical columns, optionally stacked by series.
  // opts: { categories: ['Mon', …], series: [{ name, color, values: [] }], unit }
  function columns(el, opts) {
    var cats = opts.categories, series = opts.series.filter(function (s) { return s.values.some(function (v) { return v > 0; }); });
    var totals = cats.map(function (_, i) { return series.reduce(function (a, s) { return a + (s.values[i] || 0); }, 0); });
    var max = niceMax(Math.max.apply(null, totals.concat([0])));
    var ticks = [0, max / 2, max];
    var html = '<div class="cols" style="--cols:' + cats.length + '">' +
      '<div class="cols-axis" aria-hidden="true">' + ticks.slice().reverse().map(function (t) { return '<span>' + fmt(t) + '</span>'; }).join('') + '</div>' +
      '<div class="cols-plot"><div class="cols-grid" aria-hidden="true">' + ticks.map(function (t) { return '<span class="grid" style="bottom:' + (t / max * 100) + '%"></span>'; }).join('') + '</div>' +
      cats.map(function (c, i) {
        var segs = series.map(function (s) {
          var v = s.values[i] || 0;
          return v > 0 ? '<span class="seg" style="height:' + (v / max * 100) + '%;background:' + s.color + '"></span>' : '';
        }).join('');
        var detail = series.filter(function (s) { return s.values[i] > 0; })
          .map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + esc(s.name) + ': ' + fmt(s.values[i]) + ' ' + opts.unit + '</span>'; }).join('');
        var label = c.full || c.label;
        return '<div class="col" tabindex="0" data-tip="' + esc('<strong>' + esc(label) + '</strong>' + (detail || '<span>No active play</span>')) + '" aria-label="' + esc(label + ': ' + fmt(totals[i]) + ' ' + opts.unit) + '">' +
          '<span class="stack">' + segs + '</span><span class="col-label" aria-hidden="true">' + esc(c.label) + '</span></div>';
      }).join('') + '</div></div>' +
      '<p class="axis-note" aria-hidden="true">' + esc(opts.unit) + '</p>';
    if (series.length > 1) {
      html += '<ul class="legend">' + series.map(function (s) { return '<li><i style="background:' + s.color + '"></i>' + esc(s.name) + '</li>'; }).join('') + '</ul>';
    }
    el.innerHTML = html;
    tooltip(el);
  }

  // Horizontal bars, one row per item. rows: [{ label, value, color, text }]
  function bars(el, rows, opts) {
    var max = niceMax(Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([0])));
    el.innerHTML = '<ul class="hbars">' + rows.map(function (r) {
      return '<li tabindex="0" data-tip="' + esc('<strong>' + esc(r.label) + '</strong><span>' + esc(r.text) + '</span>') + '">' +
        '<span class="hbar-label">' + esc(r.label) + (r.sub ? '<small>' + esc(r.sub) + '</small>' : '') + '</span>' +
        '<span class="hbar-track"><span class="hbar" style="width:' + (r.value / max * 100) + '%;background:' + (r.color || 'var(--accent)') + '"></span></span>' +
        '<span class="hbar-value">' + esc(r.text) + '</span></li>';
    }).join('') + '</ul>';
    tooltip(el);
  }

  function table(el, head, rows) {
    el.innerHTML = '<div class="table-scroll"><table class="data-table"><thead><tr>' + head.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return i === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>';
  }

  window.LLCharts = { columns: columns, bars: bars, table: table, fmt: fmt };
})();
