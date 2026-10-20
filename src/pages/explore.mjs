import { studios } from '../data/studios.mjs';
import { accountsEnabled } from '../config.mjs';
import { games, gamesFor, comingSoonFor } from '../data/games.mjs';
import { printables } from '../data/resources.mjs';
import { button, sectionHead, statusPill, esc } from '../components/layout.mjs';
import { studioCard, gameCard, gameMeta, printableCard, comingSoonPanel, studioIsOpen } from '../components/cards.mjs';
import * as d from '../components/doodles.mjs';

export const breadcrumbs = (h, trail) => `
  <nav class="breadcrumbs" aria-label="Breadcrumb"><ol>
    ${trail
      .map(([label, path], i) =>
        i === trail.length - 1 ? `<li><span aria-current="page">${label}</span></li>` : `<li><a href="${h(path)}">${label}</a></li>`,
      )
      .join('')}
  </ol></nav>`;

export const miniStudios = (h, list = studios) => `
  <ul class="mini-studios">
    ${list
      .map(
        (s) => `<li><a class="tone-${s.tone}" href="${h(`explore/${s.id}/`)}">
          <span class="art">${d.studioArt[s.doodle]()}</span>
          <span><strong>${s.name}</strong><small>${s.subtitle}</small>
          ${studioIsOpen(s) ? statusPill('Games to play', 'open') : statusPill('Coming soon', 'soon')}</span>
        </a></li>`,
      )
      .join('')}
  </ul>`;

export const exploreLanding = {
  path: 'explore/',
  title: 'Explore the learning studios',
  description:
    'Explore six Learning Lanterns studios: literacy, maths, inclusive learning, cognitive skills, life skills and creative arts for young children.',
  body: (h) => `
    <section class="page-hero tone-butter" aria-labelledby="page-title">
      <div class="container page-hero-grid">
        <div>
          ${breadcrumbs(h, [['Home', ''], ['Explore', 'explore/']])}
          <p class="eyebrow">Explore</p>
          <h1 id="page-title">Six studios, one bright path</h1>
          <p class="lead">Each learning studio focuses on one area of early learning. Pick the one that fits what your child is curious about, or what they’re ready to practise next.</p>
        </div>
        <div class="page-hero-art">${d.heroScene()}</div>
      </div>
    </section>
    <section class="section" aria-label="Learning studios">
      <div class="container">
        <div class="grid grid-3">${studios.map((s) => `<div class="reveal">${studioCard(s, h, { headingLevel: 2 })}</div>`).join('')}</div>
        <div class="note mt-7 tone-sage reveal">${d.sparkle({ fill: 'var(--sage)' })}
          <p><strong>Where are we now?</strong> Games are ready to play in the Number Nook, Word Garden, Brain Sparks, Little Life Lab and Make &amp; Wonder, with more on the way. Every Way is being designed now, and each studio page shows what it focuses on.</p>
        </div>
      </div>
    </section>`,
};

// Every game in one place, grouped by learning area, with what's coming soon.
export const allGamesPage = {
  path: 'play/',
  title: 'Games by learning area',
  description: `All ${games.length} free Learning Lanterns games, grouped by learning area: maths, literacy, thinking skills, life skills and creative play. No sign-up needed.`,
  body: (h) => `
    <section class="page-hero tone-butter" aria-labelledby="page-title">
      <div class="container page-hero-grid">
        <div>
          ${breadcrumbs(h, [['Home', ''], ['Games', 'play/']])}
          <p class="eyebrow">Games</p>
          <h1 id="page-title">Games for every learning area</h1>
          <p class="lead">${games.length} games to play now, free and with no sign-up. Pick a learning area, or scroll to see them all.</p>
          <ul class="area-jump">${studios
            .map((s) => `<li><a class="tone-${s.tone}" href="#area-${s.id}">${s.name} <span>${gamesFor(s.id).length || 'Soon'}</span></a></li>`)
            .join('')}</ul>
        </div>
        <div class="page-hero-art">${d.heroScene()}</div>
      </div>
    </section>
    ${studios
      .map((s, i) => {
        const list = gamesFor(s.id);
        const soon = comingSoonFor(s.id);
        return `
    <section class="section${i % 2 ? ' section-alt' : ''} tone-${s.tone}" id="area-${s.id}" aria-labelledby="area-${s.id}-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: s.subtitle,
          title: `<span id="area-${s.id}-title">${s.name}</span>`,
          intro: list.length ? `${list.length} game${list.length === 1 ? '' : 's'} to play${soon.length ? `, ${soon.length} coming soon` : ''}.` : 'Games for this area are being designed now.',
          doodle: d.studioArt[s.doodle](),
        })}</div>
        ${
          list.length || soon.length
            ? `<div class="grid grid-3">${[...list, ...soon].map((g) => `<div class="reveal">${gameCard(g, h)}</div>`).join('')}</div>`
            : `<div class="note tone-${s.tone}">${d.sparkle({ fill: 'var(--tone)' })}<p>${statusPill('Coming soon', 'soon')} ${s.soon}</p></div>`
        }
        <div class="btn-row mt-6">${button(h(`explore/${s.id}/`), `Visit the ${s.name}`, { variant: 'secondary' })}</div>
      </div>
    </section>`;
      })
      .join('')}`,
};

// Facts shared by every game, taken from the game READMEs.
const grownUps = () => `
  <div class="grownups mt-7">
    <div class="note tone-butter">${d.sun()}<p><strong>Sound on, please.</strong> A friendly voice explains each step, so children can play before they can read.</p></div>
    <div class="note tone-sage">${d.leaf()}<p><strong>Nothing is ever marked wrong.</strong> A guess that isn’t right gets a gentle “try again” and a helpful hint, never a red cross.</p></div>
    <div class="note tone-lavender">${d.sparkle({ fill: 'var(--lavender)' })}<p><strong>No downloads, no sign-up needed.</strong> Every game runs in the browser on phones, tablets and computers. A free family account is optional, for keeping track of progress.</p></div>
  </div>`;

export const studioPages = studios.map((s) => ({
  path: `explore/${s.id}/`,
  title: `${s.name}: ${s.subtitle}`,
  studio: s.id,
  description: `${s.name} is the Learning Lanterns studio for ${s.subtitle.toLowerCase()}. ${s.summary}`,
  body: (h) => {
    const list = gamesFor(s.id);
    const open = list.length > 0;
    const others = studios.filter((o) => o.id !== s.id);
    const studioPrintables = printables.filter((p) => p.studio === s.id);

    const soonList = comingSoonFor(s.id);
    const soonGames = soonList.length
      ? `<div class="reveal mt-7">${sectionHead({ eyebrow: 'On the way', title: 'Coming soon', intro: 'These games are designed and being finished now. They’ll open here as soon as they’re ready to play.', doodle: d.sparkle() })}</div>
         <div class="grid grid-3">${soonList.map((g) => `<div class="reveal">${gameCard(g, h)}</div>`).join('')}</div>`
      : '';
    const games = open
      ? `<div class="reveal">${sectionHead({ eyebrow: 'Play and learn', title: 'Games to play', doodle: d.star() })}</div>
         
         <div class="grid grid-3" id="games-${s.id}">
           ${list.map((g) => `<div class="reveal">${gameCard(g, h)}</div>`).join('')}
         </div>
         ${grownUps()}
         ${soonGames}`
      : comingSoonPanel({
          title: s.id === 'number-nook' ? 'Our maths games are moving in' : `${s.name} is in the works`,
          message: s.soon,
          level: 2,
          children: `<div class="btn-row">${
            s.id === 'number-nook'
              ? button(h('explore/'), 'See all studios', { variant: 'secondary' })
              : button(h('explore/number-nook/'), 'Visit the Number Nook') + button(h('explore/'), 'See all studios', { variant: 'secondary' })
          }</div>`,
        }) + soonGames;

    return `
    <section class="page-hero tone-${s.tone}" aria-labelledby="page-title">
      <div class="container page-hero-grid">
        <div>
          ${breadcrumbs(h, [['Home', ''], ['Explore', 'explore/'], [s.name, `explore/${s.id}/`]])}
          <h1 id="page-title">${s.name}</h1>
          <p class="studio-subtitle">${s.subtitle}</p>
          <p class="lead">${s.intro}</p>
          <p>${open ? statusPill(`${list.length} game${list.length === 1 ? '' : 's'} to play`, 'open') : statusPill(s.id === 'number-nook' ? 'Games on the way' : 'Coming soon', 'soon')}</p>
        </div>
        <div class="page-hero-art">${d.studioArt[s.doodle]({ label: `${s.name} illustration` })}</div>
      </div>
    </section>

    <section class="section-tight" aria-label="${open ? 'Games' : 'Status'}">
      <div class="container">${games}</div>
    </section>

    <section class="section section-alt tone-${s.tone}" aria-labelledby="focus-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: open ? 'What we focus on' : 'What to look forward to',
          title: `<span id="focus-title">Skills at the heart of ${s.name}</span>`,
          intro: s.focusNote || (open ? null : 'These are the areas this studio is being designed around. Activities will arrive step by step.'),
          doodle: d.leaf({ fill: 'var(--tone)' }),
        })}</div>
        <ul class="focus-grid reveal">${s.focus.map((f) => `<li>${d.sparkle({ fill: 'var(--tone)' })}${f}</li>`).join('')}</ul>
        ${s.note ? `<div class="note mt-6 reveal">${d.leaf({ fill: 'var(--tone)' })}<p>${s.note}</p></div>` : ''}
      </div>
    </section>

    ${
      studioPrintables.length
        ? `<section class="section" aria-labelledby="sp-title"><div class="container">
            ${sectionHead({ eyebrow: 'Printables', title: `<span id="sp-title">${s.name} printables</span>`, doodle: d.pencil() })}
            <div class="grid grid-3">${studioPrintables.map((p) => printableCard(p, h)).join('')}</div>
          </div></section>`
        : ''
    }

    <section class="section" aria-labelledby="more-title">
      <div class="container">
        <div class="reveal">${sectionHead({ eyebrow: 'Keep exploring', title: '<span id="more-title">More learning studios</span>' })}</div>
        <div class="reveal">${miniStudios(h, others)}</div>
      </div>
    </section>`;
  },
}));

// One branded play page per game. The game itself is embedded from its own
// folder, unchanged, exactly as the game READMEs recommend.
export const gamePages = games.map((g) => {
  const s = studios.find((x) => x.id === g.studio);
  let others = gamesFor(g.studio).filter((o) => o.slug !== g.slug).slice(0, 3);
  const sameStudio = others.length > 0;
  if (!sameStudio) others = ['echo-cave', 'quick-peek', 'sleepy-owl'].map((slug) => games.find((o) => o.slug === slug)).filter(Boolean);
  const meta = gameMeta(g);
  return {
    path: g.page,
    title: `${g.title} · ${s.name} game`,
    studio: s.id,
    scripts: ['assets/js/track.js'],
    chat: false,
    description: `${g.description} A free Learning Lanterns ${s.subtitle.toLowerCase()} game in the ${s.name}.`,
    body: (h) => `
    <section class="play-hero tone-${s.tone}" aria-labelledby="page-title">
      <div class="container">
        ${breadcrumbs(h, [['Home', ''], ['Explore', 'explore/'], [s.name, `explore/${s.id}/`], [g.title, g.page]])}
        <div class="play-head">
          <div>
            ${meta.length ? `<p class="game-meta">${meta.join(' · ')}</p>` : ''}
            <h1 id="page-title">${esc(g.title)}</h1>
            <p class="lead">${esc(g.description)}</p>
          </div>
        </div>
        <div class="player-bar" data-player-bar hidden></div>
        <div class="game-frame" data-track-game="${g.slug}" data-studio="${s.id}">
          <iframe src="${h(g.href)}" title="${esc(g.title)} game" allow="autoplay; fullscreen" loading="eager"></iframe>
        </div>
        <div class="play-tools">
          ${button(h(g.href), 'Play full screen', { variant: 'soft', cls: 'btn-sm' })}
          ${button(h(`explore/${s.id}/`), `All ${s.name} games`, { variant: 'soft', cls: 'btn-sm' })}
          <span class="muted">Turn the sound on: a friendly voice guides every step.</span>
        </div>
      </div>
    </section>
    <section class="section-tight" aria-labelledby="gu-title">
      <div class="container">
        <h2 id="gu-title" class="section-title" style="font-size:var(--step-3)">For grown-ups</h2>
        ${d.squiggle({ cls: 'title-squiggle' })}
        <div class="grid grid-2">
          <div class="info-card">
            ${d.star()}
            <h3>What your child practises</h3>
            <div class="practises tone-${s.tone}"><ul>${g.practises.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
          </div>
          <div class="info-card">
            ${d.leaf()}
            <h3>Playing together</h3>
            <p>${s.id === 'number-nook' ? 'Sit alongside and count out loud together.' : 'Sit alongside and talk about what you see and hear.'} A guess that isn’t right is never marked wrong: the game offers a gentle hint and lets your child try again.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-alt" aria-labelledby="more-games">
      <div class="container">
        <div class="reveal">${sectionHead({ eyebrow: s.name, title: `<span id="more-games">${sameStudio ? `More ${s.name} games` : 'More games to try'}</span>`, doodle: d.star() })}</div>
        ${others.length ? `<div class="grid grid-3">${others.map((o) => `<div class="reveal">${gameCard(o, h)}</div>`).join('')}</div>` : ''}
        <div class="btn-row mt-6">${button(h(`explore/${s.id}/`), `Visit the ${s.name}`, { variant: 'secondary' })}</div>
      </div>
    </section>`,
  };
});
