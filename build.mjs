// Builds the static site into dist/ (or preview/ with --preview).
// No dependencies: `node build.mjs`.
//
//   dist/     clean URLs (/explore/) for a real web host
//   preview/  links point at index.html files, for opening straight from disk

import { mkdir, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { page } from './src/components/layout.mjs';
import { lantern } from './src/components/doodles.mjs';
import { home } from './src/pages/home.mjs';
import { exploreLanding, studioPages, gamePages } from './src/pages/explore.mjs';
import {
  printablesPage, toysPage, schoolsPage, aboutPage, contactPage, privacyPage, termsPage, notFoundPage,
} from './src/pages/other.mjs';
import { studios } from './src/data/studios.mjs';
import { games } from './src/data/games.mjs';
import { printables, toyConcepts } from './src/data/resources.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const preview = process.argv.includes('--preview');
const out = join(here, preview ? 'preview' : 'dist');

const pages = [
  home, exploreLanding, ...studioPages, ...gamePages, printablesPage, toysPage, schoolsPage,
  aboutPage, contactPage, privacyPage, termsPage, notFoundPage,
];

function searchIndex() {
  const items = [
    { url: '', title: 'Home', kind: 'Page', text: 'Games, printables and hands-on learning for young children.', featured: false },
    { url: 'explore/', title: 'Explore the learning studios', kind: 'Page', text: 'All six learning studios in one place.', keywords: 'categories areas subjects', featured: true },
    { url: 'printables/', title: 'Printables', kind: 'Page', text: 'Printable activities for curious little learners.', keywords: 'worksheets download pdf print activity sheets', featured: true },
    { url: 'hands-on-toys/', title: 'Hands-On Toys', kind: 'Page', text: 'Hands-on learning toys in development.', keywords: 'toys tactile magnetic physical products', featured: true },
    { url: 'for-schools/', title: 'For Schools and Educators', kind: 'Page', text: 'Resources and partnerships for schools, nurseries and educators.', keywords: 'teachers preschool kindergarten nursery classroom partnership', featured: true },
    { url: 'about/', title: 'About Learning Lanterns', kind: 'Page', text: 'Our mission and what we believe.', keywords: 'mission philosophy approach' },
    { url: 'contact/', title: 'Contact', kind: 'Page', text: 'Get in touch with Learning Lanterns.', keywords: 'email message hello' },
    { url: 'privacy/', title: 'Privacy Policy', kind: 'Page', text: 'How we handle personal information.' },
    { url: 'terms/', title: 'Terms of Use', kind: 'Page', text: 'Terms for using the website.' },
    ...studios.map((s) => ({
      url: `explore/${s.id}/`,
      title: `${s.name}`,
      kind: `Studio · ${s.subtitle}`,
      text: s.summary,
      keywords: `${s.subtitle} ${s.focus.join(' ')}`,
      featured: true,
    })),
    ...games.map((g) => ({
      url: g.page || g.href,
      title: g.title,
      kind: 'Game',
      text: g.description,
      keywords: `${(g.practises || []).join(' ')} play game`,
      featured: true,
    })),
    ...printables.map((p) => ({ url: p.file, title: p.title, kind: 'Printable', text: p.description, keywords: 'printable pdf' })),
    ...toyConcepts.map((t) => ({ url: 'hands-on-toys/', title: t.title, kind: 'Toy concept', text: t.idea, keywords: 'toy concept' })),
  ];
  return items.map((i) => ({ keywords: '', featured: false, ...i }));
}

const favicon = lantern()
  .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  .replace(/var\(--ink\)/g, '#463A32')
  .replace(/var\(--butter\)/g, '#F8E7A2')
  .replace(/var\(--olive\)/g, '#747C60')
  .replace(/var\(--paper\)/g, '#FFFFFF');

async function build() {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });

  for (const p of pages) {
    const ctx = { path: p.absolute ? '' : p.path, absolute: !!p.absolute, fileLinks: preview, noindex: p.noindex };
    const html = page(ctx, p);
    const file = p.path.endsWith('.html') ? join(out, p.path) : join(out, p.path, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }

  await cp(join(here, 'src/assets'), join(out, 'assets'), { recursive: true });
  await writeFile(join(out, 'assets/img/favicon.svg'), favicon);
  await writeFile(join(out, 'assets/js/search-index.js'), `window.LL_SEARCH = ${JSON.stringify(searchIndex())};\n`);

  // Games keep their own files and routes, copied as-is.
  const gamesDir = join(here, 'games');
  if (existsSync(gamesDir)) {
    const entries = (await readdir(gamesDir)).filter((f) => f !== 'README.md');
    if (entries.length) await cp(gamesDir, join(out, 'games'), { recursive: true, filter: (src) => !src.endsWith('games/README.md') });
  }

  console.log(`Built ${pages.length} pages into ${out}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
