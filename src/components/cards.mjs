import { studioArt, toyArt, buildingScene, star } from './doodles.mjs';
import { gamesFor } from '../data/games.mjs';
import { studioById } from '../data/studios.mjs';
import { esc, statusPill } from './layout.mjs';

export const studioIsOpen = (s) => gamesFor(s.id).length > 0;

export function studioCard(s, h, { headingLevel = 3 } = {}) {
  const open = studioIsOpen(s);
  const n = gamesFor(s.id).length;
  const status = open
    ? statusPill(`${n} game${n === 1 ? '' : 's'} to play`, 'open')
    : s.id === 'number-nook'
      ? statusPill('Games on the way', 'soon')
      : statusPill('Coming soon', 'soon');
  return `
  <article class="studio-card tone-${s.tone}">
    <div class="studio-card-art">${studioArt[s.doodle]()}</div>
    <div class="studio-card-body">
      ${status}
      <h${headingLevel} class="studio-card-title">
        <a class="stretched" href="${h(`explore/${s.id}/`)}">${s.name}</a>
      </h${headingLevel}>
      <p class="studio-card-sub">${s.subtitle}</p>
      <p class="studio-card-text">${s.summary}</p>
      <span class="card-action" aria-hidden="true">${open ? 'Explore studio' : 'Take a peek'} <span class="arrow">→</span></span>
    </div>
  </article>`;
}

export function gameMeta(g) {
  return [g.ages && `Ages ${esc(g.ages)}`, g.level && esc(g.level)].filter(Boolean);
}

export function gameCard(g, h, { headingLevel = 3 } = {}) {
  const studio = studioById(g.studio);
  const meta = gameMeta(g);
  const target = g.page || g.href;
  return `
  <article class="game-card tone-${studio?.tone || 'butter'}">
    <div class="game-card-preview">
      ${g.preview ? `<img src="${h(g.preview)}" alt="The ${esc(g.title)} start screen" loading="lazy" width="960" height="600">` : studioArt[studio?.doodle || 'numberNook']()}
    </div>
    <div class="game-card-body">
      ${meta.length ? `<p class="game-meta">${meta.join(' · ')}</p>` : ''}
      <h${headingLevel} class="game-card-title">${esc(g.title)}</h${headingLevel}>
      <p>${esc(g.description)}</p>
      ${
        g.practises?.length
          ? `<div class="practises"><span class="practises-label">Practises</span><ul>${g.practises.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`
          : ''
      }
      <a class="btn btn-primary btn-sm" href="${h(target)}">Play game<span class="visually-hidden">: ${esc(g.title)}</span> <span aria-hidden="true">▸</span></a>
    </div>
  </article>`;
}

export function toyCard(t, h) {
  const studio = studioById(t.studio);
  return `
  <article class="toy-card tone-${t.tone}">
    <figure class="toy-card-art">
      ${t.image ? `<img src="${h(t.image)}" alt="${esc(t.imageAlt || t.title)}" loading="lazy">` : toyArt[t.doodle]()}
      <figcaption>${t.image ? 'Concept render' : 'Concept sketch'}</figcaption>
    </figure>
    <div class="toy-card-body">
      ${statusPill(t.status === 'Concept' ? 'Concept · in development' : esc(t.status), 'soon')}
      <h3>${esc(t.title)}</h3>
      ${studio ? `<p class="toy-card-studio">Connects with ${studio.name} · ${studio.subtitle}</p>` : ''}
      <p>${esc(t.idea)}</p>
    </div>
  </article>`;
}

export function printableCard(p, h) {
  const studio = studioById(p.studio);
  const meta = [p.ages && `Ages ${esc(p.ages)}`, p.pages && `${p.pages} pages`].filter(Boolean);
  return `
  <article class="paper-card">
    <div class="paper-card-sheet">${p.preview ? `<img src="${h(p.preview)}" alt="Preview of ${esc(p.title)}" loading="lazy">` : ''}</div>
    <div class="paper-card-body">
      ${p.price ? statusPill(p.price === 'free' ? 'Free' : esc(p.price), p.price === 'free' ? 'open' : 'soon') : ''}
      <h3>${esc(p.title)}</h3>
      ${studio ? `<p class="toy-card-studio">${studio.name} · ${studio.subtitle}</p>` : ''}
      <p>${esc(p.description)}</p>
      ${meta.length ? `<p class="game-meta">${meta.join(' · ')}</p>` : ''}
      <a class="btn btn-secondary" href="${h(p.file)}" download>Download PDF<span class="visually-hidden">: ${esc(p.title)}</span></a>
    </div>
  </article>`;
}

// A polished "in the works" panel used by every unopened studio and
// collection. `title` and `message` can be tailored per place.
export function comingSoonPanel({ title = 'In the works', message, children = '', level = 3, label = 'A little lantern in a hard hat, building with blocks and a toolbox' }) {
  return `
  <div class="soon-panel">
    <div class="soon-art">${buildingScene({ label })}</div>
    <div class="soon-copy">
      ${statusPill('In the works', 'soon')}
      <h${level} class="soon-title">${title}</h${level}>
      <p>${message}</p>
      ${children}
    </div>
  </div>`;
}
