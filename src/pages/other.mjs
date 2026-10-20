import { site } from '../config.mjs';
import { studios, studioById } from '../data/studios.mjs';
import { games } from '../data/games.mjs';
import { printables, toyConcepts } from '../data/resources.mjs';
import { button, sectionHead, statusPill, esc } from '../components/layout.mjs';
import { printableCard, toyCard, studioIsOpen } from '../components/cards.mjs';
import { toyInterestForm, schoolEnquiryForm, contactForm } from '../components/forms.mjs';
import { breadcrumbs, miniStudios } from './explore.mjs';
import { paperStack } from './home.mjs';
import * as d from '../components/doodles.mjs';

const placeholder = (label, text) => `
  <div class="placeholder" role="note">
    <span class="placeholder-label">To be written · ${label}</span>
    <p>${text}</p>
  </div>`;

const pageHero = (h, { tone = 'butter', crumbs, eyebrow, title, lead, art = '', extra = '' }) => `
  <section class="page-hero tone-${tone}" aria-labelledby="page-title">
    <div class="container page-hero-grid">
      <div>
        ${breadcrumbs(h, crumbs)}
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
        <h1 id="page-title">${title}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ''}
        ${extra}
      </div>
      <div class="page-hero-art">${art}</div>
    </div>
  </section>`;

// ---- Printables -------------------------------------------------------------

export const printablesPage = {
  path: 'printables/',
  title: 'Printables',
  description: 'Thoughtfully designed printable activities for curious little learners from Learning Lanterns.',
  body: (h) => {
    const withFiles = new Set(printables.map((p) => p.studio));
    const library = printables.length
      ? `<section class="section" aria-labelledby="lib-title"><div class="container">
          ${sectionHead({ eyebrow: 'The library', title: '<span id="lib-title">Ready to print</span>', doodle: d.pencil() })}
          ${
            withFiles.size > 1
              ? `<div class="filter-bar" role="group" aria-label="Filter printables by learning studio" data-filter-group="printable-grid">
                  <button type="button" data-filter="all" aria-pressed="true">All studios</button>
                  ${[...withFiles].map((id) => `<button type="button" data-filter="${id}" aria-pressed="false">${studioById(id).name}</button>`).join('')}
                </div>`
              : ''
          }
          <div class="grid grid-3" id="printable-grid">${printables.map((p) => `<div data-tags="${p.studio}">${printableCard(p, h)}</div>`).join('')}</div>
        </div></section>`
      : '';

    return `
    ${pageHero(h, {
      tone: 'sand',
      crumbs: [['Home', ''], ['Printables', 'printables/']],
      eyebrow: 'Printables',
      title: 'Little activities. Big discoveries.',
      lead: 'Thoughtfully designed printables for curious little learners, ready for your next learning moment at the kitchen table or in the classroom.',
      art: paperStack('Printable activity sheet designs in progress'),
      extra: printables.length ? '' : `<p>${statusPill('First collections in the works', 'soon')}</p>`,
    })}
    ${library}
    <section class="section${printables.length ? ' section-alt' : ''}" aria-labelledby="col-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'Collections',
          title: '<span id="col-title">One collection for every studio</span>',
          intro: printables.length
            ? 'Printables are organised by learning studio. Collections still being prepared are marked “In the works”.'
            : 'Our printables are being designed now. Each collection will match one of our six learning studios, so you can find activities by learning area.',
          doodle: d.paperclip(),
        })}</div>
        <div class="grid grid-3">
          ${studios
            .map((s) => {
              const n = printables.filter((p) => p.studio === s.id).length;
              return `<article class="collection-card tone-${s.tone} reveal">
                <span class="clip">${d.paperclip()}</span>
                ${n ? statusPill(`${n} to download`, 'open') : statusPill('In the works', 'soon')}
                <h3>${s.name} collection</h3>
                <p class="sub">${s.subtitle}</p>
                <p>${s.summary}</p>
                <p class="ideas"><strong>Areas we’re designing for:</strong> ${s.focus.slice(0, 3).join(', ').toLowerCase()}.</p>
              </article>`;
            })
            .join('')}
        </div>
      </div>
    </section>
    <section class="section-tight"><div class="container">
      <div class="note tone-butter">${d.sparkle()}<p>Looking for something to try right now? ${
        games.length
          ? `Our maths games are ready to play in the <a href="${h('explore/number-nook/')}">Number Nook</a>.`
          : `Take a look around the <a href="${h('explore/')}">learning studios</a> to see what’s taking shape.`
      }</p></div>
    </div></section>`;
  },
};

// ---- Hands-on toys -----------------------------------------------------------

export const toysPage = {
  path: 'hands-on-toys/',
  title: 'Hands-On Toys',
  description: 'Learning Lanterns is developing hands-on educational toys that bring early learning beyond the screen.',
  body: (h) => `
    ${pageHero(h, {
      tone: 'peach',
      crumbs: [['Home', ''], ['Hands-On Toys', 'hands-on-toys/']],
      eyebrow: 'Hands-on toys',
      title: 'Learning you can hold.',
      lead: 'Thoughtfully designed hands-on resources that bring learning beyond the screen. Our toy collection is in development, and these are the first ideas taking shape.',
      art: `<div class="toy-row">${toyConcepts.map((t) => `<div class="toy-chip tone-${t.tone}">${d.toyArt[t.doodle]()}</div>`).join('')}</div>`,
      extra: `<p>${statusPill('In development', 'soon')}</p>`,
    })}

    <section class="section" aria-labelledby="why-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'Why hands-on',
          title: '<span id="why-title">Ideas that fit in little hands</span>',
          intro: 'Young children explore the world by touching, moving and building. Hands-on materials give them another way into an idea: one they can turn over, trace and talk about.',
          doodle: d.leaf(),
        })}</div>
        <div class="grid grid-3 reveal">
          <div class="info-card">${d.sparkle({ fill: 'var(--peach)' })}<h3>Touch and trace</h3><p>Shapes and surfaces that invite fingers to follow the form of a letter or a number.</p></div>
          <div class="info-card">${d.star({ fill: 'var(--sage)' })}<h3>Move and arrange</h3><p>Pieces that can be sorted, joined and rearranged, so trying again is part of the fun.</p></div>
          <div class="info-card">${d.flower({ fill: 'var(--lavender)' })}<h3>Connected to the studios</h3><p>Each idea links to a learning studio, so toys, games and printables can work together.</p></div>
        </div>
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="concepts-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'The concepts',
          title: '<span id="concepts-title">What we’re exploring</span>',
          intro: 'These are early concepts, shown as sketches. They aren’t finished or tested products, and they aren’t available to buy yet.',
          doodle: d.toolbox(),
        })}</div>
        <div class="grid grid-3">${toyConcepts.map((t) => `<div class="reveal">${toyCard(t, h)}</div>`).join('')}</div>
        <div class="note mt-6 tone-peach reveal">${d.hardHat()}
          <p><strong>How we label things.</strong> A <em>concept</em> is an idea we’re designing. When something becomes a working prototype, and later a tested product, we’ll say so clearly on this page.</p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="interest-title" id="interest">
      <div class="container band">
        <div class="band-copy">
          <p class="eyebrow">Stay in the loop</p>
          <h2 id="interest-title">Interested in our toys?</h2>
          ${d.squiggle({ cls: 'title-squiggle' })}
          <p class="lead">Parents, educators and schools can let us know they’d like to hear when the toy collection takes its next step.</p>
        </div>
        <div class="form-card">${toyInterestForm(h)}</div>
      </div>
    </section>`,
};

// ---- For schools ----------------------------------------------------------------

export const schoolsPage = {
  path: 'for-schools/',
  title: 'For Schools and Educators',
  description:
    'Learning Lanterns is developing interactive games, printables and hands-on materials for preschools, nurseries, schools and educators.',
  body: (h) => `
    ${pageHero(h, {
      tone: 'sage',
      crumbs: [['Home', ''], ['For Schools', 'for-schools/']],
      eyebrow: 'For schools, nurseries and educators',
      title: 'Meaningful learning, made engaging.',
      lead: 'Learning Lanterns is developing early-learning resources that bring together interactive games, printable materials and hands-on toys, organised by learning area so they’re easy to bring into everyday practice.',
      art: `<div class="collage" role="img" aria-label="Illustrations of the six learning studios">${studios.map((x) => `<span class="tone-${x.tone}">${d.studioArt[x.doodle]()}</span>`).join('')}</div>`,
      extra: `<div class="btn-row">${button(h('for-schools/#enquire'), 'Start a conversation')}${button(h('explore/'), 'Explore the studios', { variant: 'secondary' })}</div>`,
    })}

    <section class="section" aria-labelledby="formats-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'What we’re building',
          title: '<span id="formats-title">Three formats, one learning journey</span>',
          intro: 'Each format is designed to work on its own or alongside the others, so children can meet the same idea on screen, on paper and in their hands.',
        })}</div>
        <div class="grid grid-2 reveal">
          <div class="info-card">${d.star()}<h3>Interactive games</h3><p>Browser-based games that turn practice into play, with no app to install.</p>${statusPill(games.length ? 'Maths games available' : 'First maths games on the way', games.length ? 'open' : 'soon')}</div>
          <div class="info-card">${d.pencil()}<h3>Printable resources</h3><p>Activity sheets designed for the classroom, small groups or home learning.</p>${statusPill(printables.length ? 'Available' : 'In development', printables.length ? 'open' : 'soon')}</div>
          <div class="info-card">${d.toolbox()}<h3>Hands-on materials</h3><p>Tactile learning tools that bring ideas off the screen and into little hands.</p>${statusPill('In development', 'soon')}</div>
          <div class="info-card">${d.leaf()}<h3>Organised by learning area</h3><p>Everything is grouped into six learning studios, from literacy and maths to life skills and creative arts.</p></div>
        </div>
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="principles-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'How we design',
          title: '<span id="principles-title">Our design principles</span>',
          doodle: d.sparkle(),
        })}</div>
        <ol class="principles reveal">
          <li><h3>Developmentally considerate</h3><p>Activities are shaped around early learning and developmental skills, starting small and building gradually.</p></li>
          <li><h3>Clear and calm</h3><p>Simple instructions, gentle colours and uncluttered screens help children focus on the task.</p></li>
          <li><h3>Accessible by design</h3><p>We aim for readable text, keyboard and touch support, and more than one way to take part.</p></li>
          <li><h3>Easy to use in class</h3><p>Resources are organised by learning area, so they’re quick to find and fit into existing routines.</p></li>
        </ol>
      </div>
    </section>

    <section class="section" aria-labelledby="preview-title">
      <div class="container">
        <div class="reveal">${sectionHead({
          eyebrow: 'The six learning studios',
          title: '<span id="preview-title">Organised around early learning</span>',
          intro: 'Each studio focuses on one area. The Number Nook is first, and the others are being designed now.',
        })}</div>
        <div class="reveal">${miniStudios(h)}</div>
      </div>
    </section>

    <section class="section section-paper" aria-labelledby="enquire-title" id="enquire">
      <div class="container band">
        <div class="band-copy">
          <p class="eyebrow">Partnerships</p>
          <h2 id="enquire-title">Let’s talk about your learners</h2>
          ${d.squiggle({ cls: 'title-squiggle' })}
          <p class="lead">We’re at an early and exciting stage. If you work with young children and would like to explore how Learning Lanterns resources could fit your setting, we’d love to hear from you.</p>
        </div>
        <div class="form-card">${schoolEnquiryForm(h)}</div>
      </div>
    </section>`,
};

// ---- About --------------------------------------------------------------------------

export const aboutPage = {
  path: 'about/',
  title: 'About',
  description: 'Learning Lanterns creates thoughtful, engaging and accessible early-learning resources: digital games, printables and hands-on toys.',
  body: (h) => `
    ${pageHero(h, {
      tone: 'lavender',
      crumbs: [['Home', ''], ['About', 'about/']],
      eyebrow: 'About Learning Lanterns',
      title: 'Lighting the next little step',
      lead: 'Every child learns differently. Learning Lanterns exists to help illuminate the next step in each child’s learning journey, with resources that are thoughtful, engaging and accessible.',
      art: `<div class="hero-icon">${d.lantern({ face: true, label: 'The Learning Lanterns lantern, smiling' })}</div>`,
    })}
    <section class="section" aria-label="Our story">
      <div class="container prose">
        <h2>Our mission</h2>
        <p>We create early-learning resources in three formats: digital games children can play in the browser, printable activities for home and the classroom, and hands-on toys that bring learning into little hands.</p>
        <p>Everything we make is organised into six learning studios, so parents and educators can always see what an activity is for.</p>

        <h2>What we believe</h2>
        <ul>
          <li><strong>Children develop at different rates.</strong> There’s no single right pace, so we design with many starting points in mind.</li>
          <li><strong>Learning should be engaging and purposeful.</strong> Play is wonderful, and it works best when it’s built around something worth practising.</li>
          <li><strong>Small steps matter.</strong> Gentle progress, and the confidence it brings, is worth celebrating.</li>
          <li><strong>Good design is part of good learning.</strong> Calm, clear and carefully made resources help children focus on what matters.</li>
        </ul>

        <h2>Where we are today</h2>
        <p>Learning Lanterns is a young brand. Our first maths games ${games.length ? 'are ready to play' : 'are being added'} in the <a href="${h('explore/number-nook/')}">Number Nook</a>, and our printables, hands-on toys and five more learning studios are being designed now.</p>

        <h2>The people behind Learning Lanterns</h2>
        ${placeholder('Founder story', 'Who started Learning Lanterns, and why? A few warm sentences in your own words will go here.')}
        ${placeholder('Team & background', 'Add any relevant experience or the people involved here, once you’re ready to share it. Leave this out entirely if you’d prefer.')}

        <div class="btn-row mt-7">${button(h('explore/'), 'Explore Learning')}${button(h('contact/'), 'Get in touch', { variant: 'secondary' })}</div>
      </div>
    </section>`,
};

// ---- Contact -------------------------------------------------------------------------

export const contactPage = {
  path: 'contact/',
  title: 'Contact',
  description: 'Get in touch with Learning Lanterns.',
  body: (h) => `
    ${pageHero(h, {
      tone: 'blush',
      crumbs: [['Home', ''], ['Contact', 'contact/']],
      eyebrow: 'Contact',
      title: 'Say hello',
      lead: 'Questions, ideas or kind words? We’d love to hear from parents, educators and anyone who cares about early learning.',
      art: `<div class="hero-icon">${d.sun({ label: 'A smiling sun' })}</div>`,
    })}
    <section class="section" aria-label="Contact form">
      <div class="container band">
        <div class="band-copy">
          <h2>Write to us</h2>
          <p class="lead">Schools and nurseries can also use our <a href="${h('for-schools/#enquire')}">partnership enquiry</a>.</p>
        </div>
        <div class="form-card">${contactForm(h)}</div>
      </div>
    </section>`,
};

// ---- Legal -----------------------------------------------------------------------------

export const privacyPage = {
  path: 'privacy/',
  title: 'Privacy Policy',
  description: 'How Learning Lanterns handles personal information.',
  body: (h) => `
    ${pageHero(h, { tone: 'sand', crumbs: [['Home', ''], ['Privacy Policy', 'privacy/']], title: 'Privacy Policy' })}
    <section class="section" aria-label="Policy"><div class="container prose">
      ${placeholder('Legal review needed', 'This page needs a full privacy policy, reviewed for the places you operate (for example UK GDPR and children’s privacy rules), before the site collects any personal information.')}
      <h2>In plain words, for now</h2>
      ${
        site.formEndpoint
          ? `<p>When you send us a message or register your interest, we receive the details you type into the form so we can reply. We don’t sell your details or use them for advertising.</p>`
          : `<p>This website does not currently ask for or store any personal information. There are no accounts and no sign-up forms.</p>`
      }
      <p>Our games are designed for children and should not ask children for personal information.</p>
      <p>The site loads its fonts from Google Fonts, which means your browser connects to Google’s servers to download them.</p>
    </div></section>`,
};

export const termsPage = {
  path: 'terms/',
  title: 'Terms of Use',
  description: 'Terms for using the Learning Lanterns website and resources.',
  body: (h) => `
    ${pageHero(h, { tone: 'sand', crumbs: [['Home', ''], ['Terms of Use', 'terms/']], title: 'Terms of Use' })}
    <section class="section" aria-label="Terms"><div class="container prose">
      ${placeholder('Legal review needed', 'Your terms of use will go here: how games and printables may be used at home and in classrooms, copyright, and any terms for future purchases. Please have these written or checked by a qualified adviser.')}
      <p>Questions in the meantime? Visit our <a href="${h('contact/')}">contact page</a>.</p>
    </div></section>`,
};

// ---- 404 --------------------------------------------------------------------------------

export const notFoundPage = {
  path: '404.html',
  absolute: true,
  noindex: true,
  title: 'Page not found',
  description: 'This page could not be found.',
  body: (h) => `
    <section class="lost" aria-labelledby="page-title">
      <div class="container">
        ${d.lostScene({ label: 'A little lantern wandering along a dotted path, past a sign pointing home, with stray letters and stars' })}
        <h1 id="page-title">Oops! This little page wandered off.</h1>
        <p class="lead">We couldn’t find what you were looking for, but there’s still plenty to discover.</p>
        <div class="btn-row">
          ${button(h(''), 'Back to Home')}
          ${button(h('explore/'), 'Explore Learning', { variant: 'secondary' })}
        </div>
        <p class="lost-links">Or try <a href="${h('printables/')}">Printables</a> · <a href="${h('hands-on-toys/')}">Hands-On Toys</a> · <a href="${h('for-schools/')}">For Schools</a></p>
      </div>
    </section>`,
};
