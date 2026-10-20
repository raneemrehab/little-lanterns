import { site, accountsEnabled } from '../config.mjs';
import { studios } from '../data/studios.mjs';
import { lantern, squiggle } from './doodles.mjs';

// ---- Links -----------------------------------------------------------------
//
// Pages are written against site-root paths ('explore/word-garden/'). Links
// are rendered relative to the current page so the site works from any
// folder, a GitHub Pages subpath, or opened straight from disk. The 404
// page can appear at any address, so it uses absolute links from basePath.

export function makeHref(ctx) {
  const depth = ctx.path.split('/').filter(Boolean).length;
  const prefix = ctx.absolute ? site.basePath : '../'.repeat(depth);
  const h = (target = '') => {
    if (/^(https?:|mailto:|#)/.test(target)) return target;
    let [p, hash] = target.split('#');
    if (ctx.fileLinks && (p === '' || p.endsWith('/'))) p += 'index.html';
    const out = (prefix + p) || './';
    return hash !== undefined ? `${out}#${hash}` : out;
  };
  h.prefix = prefix;
  return h;
}

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---- Building blocks ---------------------------------------------------------

export const button = (href, label, { variant = 'primary', cls = '', attrs = '' } = {}) =>
  `<a class="btn btn-${variant} ${cls}" href="${href}" ${attrs}>${label}</a>`;

export const eyebrow = (text) => `<p class="eyebrow">${text}</p>`;

export const sectionHead = ({ eyebrow: eb, title, intro, doodle = '', center = false, level = 2 }) => `
  <div class="section-head${center ? ' center' : ''}">
    ${eb ? eyebrow(eb) : ''}
    <h${level} class="section-title">${doodle ? `<span class="title-doodle">${doodle}</span>` : ''}${title}</h${level}>
    ${squiggle({ cls: 'title-squiggle' })}
    ${intro ? `<p class="lead">${intro}</p>` : ''}
  </div>`;

export const statusPill = (text, kind = 'soon') =>
  `<span class="pill pill-${kind}"><span class="pill-dot" aria-hidden="true"></span>${text}</span>`;

// ---- Header ------------------------------------------------------------------

const navItems = [
  { label: 'Home', path: '' },
  { label: 'Explore', path: 'explore/', menu: true },
  { label: 'Games', path: 'play/' },
  { label: 'Printables', path: 'printables/' },
  { label: 'Hands-On Toys', path: 'hands-on-toys/' },
  { label: 'For Schools', path: 'for-schools/' },
  { label: 'About', path: 'about/' },
];

function isCurrent(ctx, path) {
  if (path === '') return ctx.path === '';
  return ctx.path.startsWith(path);
}

// With accounts switched on, the header offers "Log in". Without them,
// progress is kept on the device, so it links straight to the dashboard.
const accountOut = accountsEnabled ? 'account/log-in/' : 'account/';
const accountLabel = accountsEnabled ? 'Log in' : 'Progress';

function header(ctx, h) {
  const links = navItems
    .map((item) => {
      const cur = isCurrent(ctx, item.path);
      const aria = cur ? (ctx.path === item.path ? ' aria-current="page"' : ' aria-current="true"') : '';
      if (!item.menu) {
        return `<li><a class="nav-link" href="${h(item.path)}"${aria}>${item.label}</a></li>`;
      }
      const sub = studios
        .map(
          (s) => `<li><a href="${h(`explore/${s.id}/`)}"${ctx.path === `explore/${s.id}/` ? ' aria-current="page"' : ''}>
              <span class="swatch tone-${s.tone}" aria-hidden="true"></span>
              <span><strong>${s.name}</strong><small>${s.subtitle}</small></span></a></li>`,
        )
        .join('');
      return `<li class="has-menu">
          <a class="nav-link" href="${h(item.path)}"${aria}>${item.label}</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="studio-menu">
            <span class="visually-hidden">Show the six learning studios</span>
            <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="studio-menu" id="studio-menu">
            <ul>${sub}</ul>
            <a class="studio-menu-all" href="${h('explore/')}">See all learning studios <span aria-hidden="true">→</span></a>
          </div>
        </li>`;
    })
    .join('');

  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="${h('')}" aria-label="Learning Lanterns home">
        ${lantern({ cls: 'brand-mark' })}
        <span class="brand-word">Learning <em>Lanterns</em></span>
      </a>
      <nav class="primary-nav" id="primary-nav" aria-label="Main">
        <ul class="nav-list">${links}<li class="nav-account"><a class="nav-link" href="${h(accountOut)}" data-account-link data-href-in="${h('account/')}" data-href-out="${h(accountOut)}"><span data-account-label>${accountLabel}</span></a></li><li class="nav-account"><a class="nav-link" href="${h('account/sign-up/')}" data-signed-out-only>Sign up free</a></li></ul>
      </nav>
      <div class="header-actions">
        <a class="account-link" href="${h(accountOut)}" data-account-link data-href-in="${h('account/')}" data-href-out="${h(accountOut)}">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8.5" r="3.8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4.5 20c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span class="account-label" data-account-label>${accountLabel}</span>
        </a>

        <button class="icon-btn search-open" type="button" aria-haspopup="dialog" aria-controls="search-dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5L20 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
          <span class="visually-hidden">Search the site</span>
        </button>
        <a class="btn btn-primary btn-sm header-signup" href="${h('account/sign-up/')}" data-signed-out-only>Sign up free</a>
        <button class="icon-btn nav-burger" type="button" aria-expanded="false" aria-controls="primary-nav">
          <span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="visually-hidden">Menu</span>
        </button>
      </div>
    </div>
  </header>`;
}

function searchDialog() {
  return `
  <dialog class="search-dialog" id="search-dialog" aria-labelledby="search-title">
    <form class="search-box" role="search" method="dialog">
      <h2 id="search-title" class="visually-hidden">Search Learning Lanterns</h2>
      <label class="visually-hidden" for="search-input">Search pages, studios and games</label>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5L20 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      <input id="search-input" type="search" autocomplete="off" placeholder="Search for counting, phonics, schools…" aria-describedby="search-status">
      <button class="search-close" type="button" aria-label="Close search">Esc</button>
    </form>
    <p id="search-status" class="search-status" role="status" aria-live="polite"></p>
    <ul class="search-results" id="search-results"></ul>
  </dialog>`;
}

// ---- Footer ------------------------------------------------------------------

function footer(h) {
  const studioLinks = studios
    .map((s) => `<li><a href="${h(`explore/${s.id}/`)}">${s.name} <span>· ${s.subtitle}</span></a></li>`)
    .join('');
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${h('')}" aria-label="Learning Lanterns home">
          ${lantern({ cls: 'brand-mark' })}
          <span class="brand-word">Learning <em>Lanterns</em></span>
        </a>
        <p>Thoughtfully designed games, printables and hands-on learning experiences for curious young children, and the grown-ups who learn alongside them.</p>
      </div>
      <nav aria-label="Learning studios">
        <h2 class="footer-heading">Explore</h2>
        <ul>${studioLinks}<li><a href="${h('explore/')}">All learning studios</a></li></ul>
      </nav>
      <nav aria-label="Learning Lanterns">
        <h2 class="footer-heading">Learning Lanterns</h2>
        <ul>
          <li><a href="${h('play/')}">All games</a></li>
          <li><a href="${h('printables/')}">Printables</a></li>
          <li><a href="${h('hands-on-toys/')}">Hands-On Toys</a></li>
          <li><a href="${h('for-schools/')}">For Schools</a></li>
          <li><a href="${h('about/')}">About</a></li>
          <li><a href="${h('help/')}">Help centre</a></li>
          <li><a href="${h('contact/')}">Contact</a></li>
        </ul>
      </nav>
      <nav aria-label="Legal">
        <h2 class="footer-heading">The small print</h2>
        <ul>
          <li><a href="${h('privacy/')}">Privacy Policy</a></li>
          <li><a href="${h('terms/')}">Terms of Use</a></li>
        </ul>
      </nav>
    </div>
    <div class="container footer-base">
      <p>© ${new Date().getFullYear()} Learning Lanterns</p>
      <p class="footer-note">Made with care for little learners.</p>
    </div>
  </footer>`;
}

// ---- Help chat -------------------------------------------------------------------
//
// A small "Questions?" box on every page except the game play pages, where it
// could cover a child's buttons. Messages go to site.messageEndpoint, which
// forwards them to WhatsApp without the number ever reaching the browser.

function helpChat(h) {
  if (!site.messageEndpoint) return '';
  return `
  <div class="help-chat" data-help-chat data-endpoint="${esc(site.messageEndpoint)}">
    <button class="help-chat-toggle" type="button" aria-expanded="false" aria-controls="help-chat-panel">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17.5h-1A1.5 1.5 0 0 1 3 16V7a1.5 1.5 0 0 1 1.5-1.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="8.5" cy="11.5" r="1.1" fill="currentColor"/><circle cx="12" cy="11.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="11.5" r="1.1" fill="currentColor"/></svg>
      <span class="help-chat-label">Questions?</span>
    </button>
    <section class="help-chat-panel" id="help-chat-panel" aria-labelledby="help-chat-title" hidden>
      <div class="help-chat-head">
        ${lantern({ cls: 'help-chat-mark' })}
        <div><h2 id="help-chat-title">Ask us anything</h2><p>We usually reply within a day.</p></div>
        <button class="help-chat-close" type="button" aria-label="Close the chat">×</button>
      </div>
      <div class="help-chat-log" aria-live="polite">
        <p class="bubble bubble-us">Hello! Send us your question and it goes straight to our team. You might also find the answer in our <a href="${h('help/')}">Help centre</a>.</p>
      </div>
      <form class="help-chat-form" novalidate>
        <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
        <label class="visually-hidden" for="hc-message">Your question</label>
        <textarea id="hc-message" name="message" rows="3" maxlength="2000" required placeholder="Type your question…"></textarea>
        <div class="help-chat-row">
          <div><label for="hc-name">Your name <span class="muted">(optional)</span></label><input id="hc-name" name="name" type="text" autocomplete="name" maxlength="80"></div>
          <div><label for="hc-contact">Email or phone, so we can reply</label><input id="hc-contact" name="contact" type="text" autocomplete="email" maxlength="120"></div>
        </div>
        <button class="btn btn-primary btn-sm" type="submit">Send</button>
        <p class="help-chat-privacy">Only used to answer you. <a href="${h('privacy/')}">Privacy</a></p>
      </form>
    </section>
  </div>`;
}

// ---- Document ----------------------------------------------------------------

export function page(ctx, { title, description = site.description, body, bodyClass = '', scripts = [], studio = null, chat = true }) {
  const h = makeHref(ctx);
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
  const canonical = site.url && !ctx.absolute ? `${site.url.replace(/\/$/, '')}/${ctx.path}` : null;
  return `<!doctype html>
<html lang="en-GB" data-root="${h.prefix}" data-links="${ctx.fileLinks ? 'file' : 'pretty'}"${accountsEnabled ? ` data-sb-url="${esc(site.supabaseUrl)}" data-sb-key="${esc(site.supabaseAnonKey)}"` : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
  ${ctx.noindex ? '<meta name="robots" content="noindex">' : ''}
  ${site.googleSiteVerification && ctx.path === '' ? `<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}">` : ''}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta name="theme-color" content="#FFF8EF">
  <link rel="icon" href="${h('assets/img/favicon.svg')}" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,500..700,50..100&family=Nunito:wght@400;600;700;800&display=swap">
  <link rel="stylesheet" href="${h('assets/css/styles.css')}">
  <script defer src="${h('assets/js/search-index.js')}"></script>
  <script defer src="${h('assets/js/main.js')}"></script>
  ${chat && site.messageEndpoint ? `<script defer src="${h('assets/js/help-chat.js')}"></script>` : ''}
  ${accountsEnabled ? `<script defer src="${h('assets/vendor/supabase.js')}"></script>` : `<script defer src="${h('assets/js/local-client.js')}"></script>`}
  <script defer src="${h('assets/js/catalog.js')}"></script>
  <script defer src="${h('assets/js/accounts.js')}"></script>
  ${scripts.map((src) => `<script defer src="${h(src)}"></script>`).join('\n  ')}
</head>
<body class="${bodyClass}" data-path="${ctx.absolute ? '' : ctx.path}"${studio ? ` data-studio="${studio}"` : ''}>
  ${header(ctx, h)}
  <main id="main" tabindex="-1">
${body(h)}
  </main>
  ${footer(h)}
  ${searchDialog()}
  ${chat ? helpChat(h) : ''}
</body>
</html>
`;
}
