import { studios, studioById } from '../data/studios.mjs';
import { games } from '../data/games.mjs';
import { printables, toyConcepts } from '../data/resources.mjs';
import { button, sectionHead, statusPill } from '../components/layout.mjs';
import { studioCard, gameCard, comingSoonPanel } from '../components/cards.mjs';
import * as d from '../components/doodles.mjs';

export function paperStack(label = 'A fanned stack of printable activity sheets') {
  const wg = studioById('word-garden');
  const nn = studioById('number-nook');
  const mw = studioById('make-and-wonder');
  return `
  <div class="paper-stack" role="img" aria-label="${label}">
    <div class="sheet sheet-1 tone-${wg.tone}">${d.studioArt.wordGarden()}<div class="lines"></div></div>
    <div class="sheet sheet-2 tone-${nn.tone}">${d.studioArt.numberNook()}<div class="lines"></div></div>
    <div class="sheet sheet-3 tone-${mw.tone}">${d.studioArt.makeWonder()}<div class="lines"></div></div>
    <span class="clip">${d.paperclip()}</span>
    <span class="pencil-doodle">${d.pencil()}</span>
  </div>`;
}

export const home = {
  path: '',
  title: null,
  description:
    'Learning Lanterns creates thoughtfully designed browser games, printables and hands-on learning experiences that help young children grow.',
  body: (h) => {
    const playSection = games.length
      ? `<div class="grid grid-3">${games.slice(0, 6).map((g) => `<div class="reveal">${gameCard(g, h)}</div>`).join('')}</div>
         <div class="btn-row mt-6">${button(h('explore/number-nook/'), `See all ${games.length} maths games`, { variant: 'secondary' })}</div>`
      : comingSoonPanel({
          title: 'Our maths games are moving in',
          message:
            'The first Learning Lanterns maths games are being settled into their new home in the Number Nook. They’ll be ready to play right here very soon.',
          children: `<div class="btn-row">${button(h('explore/number-nook/'), 'Visit the Number Nook', { variant: 'secondary' })}</div>`,
        });

    return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero-grid">
        <div class="hero-copy reveal">
          <p class="eyebrow">Games · Printables · Hands-on learning</p>
          <h1 id="hero-title">Little steps. <span class="accent">Bright discoveries.</span></h1>
          <p class="lead">Thoughtfully designed games, printables and hands-on learning experiences that help little minds grow.</p>
          <div class="btn-row">
            ${button(h('explore/'), 'Explore Learning')}
            ${button(h('printables/'), 'Browse Printables', { variant: 'secondary' })}
          </div>
          <p class="hero-note">${d.sparkle()} Made for curious children, and the grown-ups learning alongside them.</p>
        </div>
        <div class="hero-art">${d.heroScene({ label: 'A smiling lantern glowing above a winding dotted path, with leaves, a flower, a stack of books and a little sun' })}</div>
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="studios-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'Six learning studios',
          title: '<span id="studios-title">Find the right little next step</span>',
          intro: 'Every child learns differently. Our studios group activities by learning area, so it’s easy to find something that fits.',
          doodle: d.lantern({ face: true }),
        })}</div>
        <div class="grid grid-3">${studios.map((s) => `<div class="reveal">${studioCard(s, h)}</div>`).join('')}</div>
      </div>
    </section>

    <section class="section" aria-labelledby="play-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'Play and learn',
          title: `<span id="play-title">${games.length ? 'Maths games to play today' : 'Maths games for the Number Nook'}</span>`,
          intro: 'Our first interactive games live in the Number Nook. Friendly voices guide children through counting, comparing, recognising and writing numbers.',
          doodle: d.star(),
        })}</div>
        ${playSection}
      </div>
    </section>

    <section class="section section-paper" aria-labelledby="printables-title">
      <div class="container band">
        <div class="band-art reveal">${paperStack()}</div>
        <div class="band-copy reveal">
          <p class="eyebrow">Printables</p>
          <h2 id="printables-title">Little activities. Big discoveries.</h2>
          ${d.squiggle({ cls: 'title-squiggle' })}
          <p class="lead">Thoughtfully designed printables for curious little learners, ready for your next learning moment.</p>
          ${printables.length ? '' : `<p>${statusPill('First collections in the works', 'soon')}</p>`}
          <div class="btn-row">${button(h('printables/'), 'Explore Printables')}</div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="toys-title">
      <div class="container band flip">
        <div class="band-art reveal">
          <div class="toy-row">
            ${toyConcepts
              .map((t) => `<div class="toy-chip tone-${t.tone}">${d.toyArt[t.doodle]()}${t.title}</div>`)
              .join('')}
          </div>
          <p class="muted center" style="margin-top:.75rem;font-size:.85rem;font-weight:700">Concept sketches · not final products</p>
        </div>
        <div class="band-copy reveal">
          <p class="eyebrow">Hands-on toys</p>
          <h2 id="toys-title">Learning you can hold.</h2>
          ${d.squiggle({ cls: 'title-squiggle' })}
          <p class="lead">Thoughtfully designed hands-on resources that bring learning beyond the screen.</p>
          <p>${statusPill('In development', 'soon')}</p>
          <div class="btn-row">${button(h('hands-on-toys/'), 'Discover Our Toys')}</div>
        </div>
      </div>
    </section>

    <section class="section-tight" aria-labelledby="schools-title">
      <div class="container">
        <div class="schools-band reveal">
          <span class="band-doodle">${d.book()}</span>
          <p class="eyebrow">For schools and educators</p>
          <h2 id="schools-title">Thoughtfully made for little learners. Designed with educators in mind.</h2>
          <p class="lead">Discover learning resources designed to make meaningful practice engaging, accessible and easy to bring into everyday learning.</p>
          <ul class="format-list">
            <li>${d.star({ fill: 'var(--butter)' })}Interactive learning games</li>
            <li>${d.pencil()}Printable educational resources</li>
            <li>${d.leaf()}Hands-on learning materials</li>
            <li>${d.sparkle({ fill: 'var(--lavender)' })}Resources shaped around early learning and developmental skills</li>
          </ul>
          ${button(h('for-schools/'), 'Explore School Partnerships')}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="approach-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'Our approach',
          title: '<span id="approach-title">Small steps matter</span>',
          intro: 'A few simple beliefs guide everything we make.',
          doodle: d.leaf(),
        })}</div>
        <ol class="principles reveal">
          <li><h3>Every child has their own pace</h3><p>Children develop at different rates, so our resources make room for many starting points.</p></li>
          <li><h3>Play with a purpose</h3><p>Play can open the door to meaningful practice. We design each activity around something worth learning.</p></li>
          <li><h3>One small step at a time</h3><p>Little wins add up. Activities build gently, so children can feel proud as they go.</p></li>
          <li><h3>Made with care</h3><p>Calm colours, clear instructions and thoughtful details help children focus on the learning.</p></li>
        </ol>
        <p class="mt-6">${button(h('about/'), 'More about Learning Lanterns', { variant: 'soft' })}</p>
      </div>
    </section>`;
  },
};
