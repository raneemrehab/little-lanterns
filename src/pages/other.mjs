import { site, accountsEnabled } from '../config.mjs';
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
          ? `Maths games are ready in the <a href="${h('explore/number-nook/')}">Number Nook</a>, and literacy games in the <a href="${h('explore/word-garden/')}">Word Garden</a>.`
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
          <div class="info-card">${d.star()}<h3>Interactive games</h3><p>Browser-based games that turn practice into play, with no app to install.</p>${statusPill(games.length ? `${games.length} games to play` : 'First games on the way', games.length ? 'open' : 'soon')}</div>
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
        <p>Learning Lanterns is a young brand. Our first games are ready to play in the <a href="${h('explore/number-nook/')}">Number Nook</a>, <a href="${h('explore/word-garden/')}">Word Garden</a>, <a href="${h('explore/brain-sparks/')}">Brain Sparks</a> and more, and our printables, hands-on toys and more games are being designed now.</p>

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

// ---- Help centre -----------------------------------------------------------------------

const faqs = (h) => [
  ['Do we need to sign up to play?', `<p>No. Every game is free to play straight away, with no account and nothing to download. Just pick a game in any <a href="${h('explore/')}">learning studio</a> and press play.</p>`],
  ['How can I see what my child has been playing?', `<p>Open <a href="${h('account/')}">Progress</a> and add your child with a nickname. Then, at the top of any game page, choose who’s playing. The progress page shows a chart of time spent each day, a play diary of which games were played on which days, the skills practised and the levels finished.</p>`],
  [
    'Is progress saved on all our devices?',
    accountsEnabled
      ? `<p>Yes, when you’re logged in to your free family account. Progress is saved to your account, so you can check it on any phone, tablet or computer.</p>`
      : `<p>For now, progress is saved in the browser on the device your child plays on, and it isn’t sent to us. Free family accounts, which let you see progress on any device, are opening soon.</p>`,
  ],
  ['Which devices can we use?', '<p>Phones, tablets and computers, in any up-to-date web browser such as Safari, Chrome or Edge. Tablets give little fingers the most room.</p>'],
  ['There’s no sound. What can I do?', '<p>Check the volume, and on an iPhone or iPad make sure the silent switch is off. Some browsers only play sound after the first tap, so tap “Hear how to play” or start a level. The speaker button in each game repeats the instructions.</p>'],
  ['What does “Coming soon” mean?', '<p>Those games are designed and being finished now, most of them while their voice recordings are made. They’ll open on their studio page as soon as they’re ready to play.</p>'],
  ['What ages are the games for?', '<p>Our games are for children from about 2 to 9. Each game card shows its ages, and most games have levels from Little Sparks to Bright so children can grow with them.</p>'],
  ['Is it safe for my child?', `<p>Children never type in personal details, there are no adverts, and nothing is ever marked wrong. You can read more in our <a href="${h('privacy/')}">Privacy Policy</a>.</p>`],
  ['Can schools and nurseries use Learning Lanterns?', `<p>Yes. Have a look at <a href="${h('for-schools/')}">For Schools</a>, and send us an enquiry there.</p>`],
];

export const helpPage = {
  path: 'help/',
  title: 'Help centre',
  description: 'Answers to common questions about Learning Lanterns games, progress tracking and accounts, and a quick way to ask us anything.',
  body: (h) => `
    ${pageHero(h, {
      tone: 'sage',
      crumbs: [['Home', ''], ['Help centre', 'help/']],
      eyebrow: 'Help centre',
      title: 'How can we help?',
      lead: 'Quick answers to the questions families ask most. Can’t find what you need? Send us a message and our team will get back to you.',
      art: `<div class="hero-icon">${d.lantern({ face: true })}</div>`,
      extra: site.messageEndpoint ? `<div class="btn-row"><button class="btn btn-primary" type="button" data-open-chat>Ask us a question</button></div>` : '',
    })}
    <section class="section" aria-labelledby="faq-title">
      <div class="container">
        ${sectionHead({ eyebrow: 'Common questions', title: '<span id="faq-title">Frequently asked questions</span>', doodle: d.sparkle() })}
        <div class="faq">${faqs(h).map(([q, a]) => `<details><summary>${q}</summary>${a}</details>`).join('')}</div>
        <div class="note mt-7 tone-butter">${d.sun()}<p><strong>Still have a question?</strong> ${
          site.messageEndpoint
            ? `<a href="${h('contact/')}" data-open-chat>Chat with us</a> using the Questions button in the corner of any page, or <a href="${h('contact/')}">send us a message</a>.`
            : `<a href="${h('contact/')}">Get in touch</a> and we’ll help.`
        }</p></div>
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
      ${placeholder('Legal review needed', 'This page needs a full privacy policy reviewed by a qualified adviser for the places you operate, for example UK GDPR and the Children’s Code, GDPR in the EU, or COPPA in the US, before real families sign up.')}
      <h2>In plain words, for now</h2>
      ${
        accountsEnabled
          ? `<h3>Family accounts</h3>
      <p>Family accounts are for parents and carers aged 18 or over. Children never create their own account, sign in, or type anything that is saved.</p>
      <p>When you create an account, we keep:</p>
      <ul>
        <li><strong>About you:</strong> your first name, your email address and your password, which is stored scrambled so nobody can read it.</li>
        <li><strong>About each child you add:</strong> a nickname or first name, an age group, a learning level and, if you choose, the learning studios you’d like suggested.</li>
        <li><strong>Learning activity:</strong> while a child you’ve chosen is playing, which games they open, when, how long they spend actively playing, how many taps they make, and which levels they start and finish. We also note which learning studio pages they visit. We don’t record what they type, their voice or their image, and we don’t record individual answers.</li>
      </ul>
      <p>Nothing is recorded unless you’re signed in and have chosen who’s playing. Anyone can play every game without an account.</p>
      <h3>Who can see it</h3>
      <p>Only you. The database itself only lets a signed-in parent see and change their own family’s information. We don’t sell it, share it with advertisers, or use it for advertising. Activity is only used to show you your child’s dashboard and suggest activities.</p>
      <p>The website never labels or diagnoses children. The dashboard shows what a child has played, not what they can or can’t do.</p>
      <h3>Where it is stored</h3>
      <p>Accounts and activity are stored with our database provider, Supabase, which processes the data on our behalf.</p>
      ${placeholder('Owner to confirm', 'Add the Supabase region your project uses (for example London or Frankfurt), how long data is kept, and your contact details for privacy requests.')}
      <h3>Your choices</h3>
      <ul>
        <li>You can edit or remove any child’s profile at any time. Removing a child deletes all of their activity.</li>
        <li>You can delete your whole account from the Account page. This permanently deletes you, your children’s profiles and all of their activity.</li>
      </ul>
      <p>The site also saves a few small preferences in your browser, such as which child is playing on this device. They stay on your device.</p>`
          : `<h3>Progress on this device</h3>
      <p>If you add a child on the Progress page, their nickname, age group and learning level, and which games they play, when and for how long, are saved in this browser only. They aren’t sent to us. You can clear them at any time from the Progress page.</p>`
      }
      ${
        site.formEndpoint || site.messageEndpoint
          ? `<h3>Messages</h3>
      <p>When you send us a message in the chat box or a form, we receive what you type, including any name, email address or phone number you add, so we can reply. Messages are passed to our team through WhatsApp. We don’t sell your details or use them for advertising.</p>`
          : ''
      }
      <p>Our games are designed for children and do not ask children for personal information.</p>
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
