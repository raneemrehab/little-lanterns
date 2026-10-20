import { accountsEnabled } from '../config.mjs';
import { button } from '../components/layout.mjs';
import { breadcrumbs } from './explore.mjs';
import * as d from '../components/doodles.mjs';

// Parent account pages. Signing up and logging in need the Supabase
// settings in src/config.mjs. Without them, the sign-up and log-in pages
// say accounts are opening soon, and the dashboard, children and settings
// pages work on this device only (assets/js/local-client.js).

const notEnabled = (h) => `
  <div class="auth-card center">
    <div class="auth-art">${d.buildingScene({ label: 'A little lantern in a hard hat, building with blocks' })}</div>
    <h1 id="page-title">Family accounts are opening soon</h1>
    <p class="lead">You don’t need an account to play: every game is free, with no sign-up. You can already follow your child’s progress on this device. Add your child, choose who’s playing on a game page, and see which games they played each day.</p>
    <div class="btn-row" style="justify-content:center">${button(h('account/children/#add'), 'Track progress on this device')}${button(h('account/'), 'See the progress dashboard', { variant: 'secondary' })}${button(h('explore/'), 'Play the games', { variant: 'secondary' })}</div>
    <p class="muted mt-6">When accounts open, you’ll be able to sign up with your email and see progress on any device.</p>
  </div>`;

const noscript = `<noscript><p class="form-fallback"><strong>Family accounts need JavaScript turned on in your browser.</strong></p></noscript>`;

const field = (id, label, input, hint = '') => `
  <div class="field">
    <label for="${id}">${label}</label>
    ${hint ? `<p class="field-hint" id="${id}-hint">${hint}</p>` : ''}
    ${input}
  </div>`;

const passwordField = (id, label, autocomplete, hint = '') =>
  field(
    id,
    label,
    `<div class="password-wrap">
      <input id="${id}" name="password" type="password" autocomplete="${autocomplete}" minlength="8" required${hint ? ` aria-describedby="${id}-hint"` : ''}>
      <button type="button" class="password-toggle" aria-controls="${id}" aria-pressed="false">Show</button>
    </div>`,
    hint,
  );

const authShell = (h, { crumbs, title, intro, form, aside = '', art = d.lantern({ face: true }) }) => `
  <section class="section auth-section" aria-labelledby="page-title">
    <div class="container">
      ${breadcrumbs(h, crumbs)}
      ${
        accountsEnabled
          ? `<div class="auth-card">
              <div class="auth-icon">${art}</div>
              <h1 id="page-title">${title}</h1>
              ${intro ? `<p class="lead">${intro}</p>` : ''}
              ${noscript}
              ${form}
              ${aside ? `<div class="auth-aside">${aside}</div>` : ''}
            </div>`
          : notEnabled(h)
      }
    </div>
  </section>`;

const status = '<p class="form-status" role="status" aria-live="polite"></p>';

// Settings when progress is kept on this device rather than in an account.
const deviceSettings = (h) => `
      <h1 id="page-title" class="dash-title">This device</h1>
      <div class="dash-grid">
        <section class="form-card" aria-labelledby="s-details">
          <h2 id="s-details" class="chart-title">Your name</h2>
          <form class="ll-form" data-settings-form novalidate>
            ${field('st-name', 'Your first name', '<input id="st-name" name="name" type="text" autocomplete="given-name" maxlength="60" required>', 'Used to greet you on the dashboard. It stays on this device.')}
            <button class="btn btn-primary" type="submit">Save</button>
            ${status}
          </form>
          <hr class="soft-rule">
          <p>Want to see progress on more than one device? <a href="${h('account/sign-up/')}">Family accounts are opening soon</a>.</p>
        </section>
        <section class="form-card danger-zone" aria-labelledby="s-delete">
          <h2 id="s-delete" class="chart-title">Clear this device</h2>
          <p>This removes your children’s profiles and all of their progress from this browser. It can’t be undone.</p>
          <form class="ll-form" data-delete-form novalidate>
            ${field('st-confirm', 'Type DELETE to confirm', '<input id="st-confirm" name="confirm" type="text" autocomplete="off" required>')}
            <button class="btn btn-danger" type="submit">Clear all progress</button>
            ${status}
          </form>
        </section>
      </div>`;

export const signUpPage = {
  path: 'account/sign-up/',
  noindex: true,
  title: 'Create a family account',
  description: 'Create a free Learning Lanterns family account to follow your child’s learning journey.',
  scripts: accountsEnabled ? ['assets/js/auth-pages.js'] : [],
  body: (h) =>
    authShell(h, {
      crumbs: [['Home', ''], ['Create an account', 'account/sign-up/']],
      title: 'Create a family account',
      intro: 'Add your children’s profiles and see what they’ve been exploring. Accounts are for parents and carers. Children don’t need their own.',
      form: `
      <form class="ll-form" data-auth-form="sign-up" novalidate>
        ${field('su-name', 'Your first name', '<input id="su-name" name="name" type="text" autocomplete="given-name" maxlength="60" required>')}
        ${field('su-email', 'Email address', '<input id="su-email" name="email" type="email" autocomplete="email" required>')}
        ${passwordField('su-password', 'Choose a password', 'new-password', 'At least 8 characters.')}
        <div class="field check-field">
          <input id="su-consent" name="consent" type="checkbox" required>
          <label for="su-consent">I’m a parent or carer aged 18 or over, and I’ve read the <a href="${h('privacy/')}">Privacy Policy</a>.</label>
        </div>
        <button class="btn btn-primary" type="submit">Create account</button>
        ${status}
      </form>
      <div class="auth-done" hidden>
        <h2>Check your email</h2>
        <p>We’ve sent a link to <strong data-sent-to></strong>. Open it to confirm your address, then you can log in.</p>
        ${button(h('account/log-in/'), 'Go to log in', { variant: 'secondary' })}
      </div>`,
      aside: `Already have an account? <a href="${h('account/log-in/')}">Log in</a>`,
    }),
};

export const logInPage = {
  path: 'account/log-in/',
  noindex: true,
  title: 'Log in',
  description: 'Log in to your Learning Lanterns family account.',
  scripts: accountsEnabled ? ['assets/js/auth-pages.js'] : [],
  body: (h) =>
    authShell(h, {
      crumbs: [['Home', ''], ['Log in', 'account/log-in/']],
      title: 'Welcome back',
      intro: 'Log in to see your family’s learning journey.',
      form: `
      <form class="ll-form" data-auth-form="log-in" novalidate>
        ${field('li-email', 'Email address', '<input id="li-email" name="email" type="email" autocomplete="email" required>')}
        ${passwordField('li-password', 'Password', 'current-password')}
        <p class="form-inline-link"><a href="${h('account/forgot-password/')}">Forgotten your password?</a></p>
        <button class="btn btn-primary" type="submit">Log in</button>
        ${status}
      </form>`,
      aside: `New to Learning Lanterns? <a href="${h('account/sign-up/')}">Create a family account</a>`,
    }),
};

export const forgotPage = {
  path: 'account/forgot-password/',
  noindex: true,
  title: 'Forgotten password',
  description: 'Reset your Learning Lanterns password.',
  scripts: accountsEnabled ? ['assets/js/auth-pages.js'] : [],
  body: (h) =>
    authShell(h, {
      crumbs: [['Home', ''], ['Log in', 'account/log-in/'], ['Forgotten password', 'account/forgot-password/']],
      title: 'Forgotten your password?',
      intro: 'No problem. Enter your email and we’ll send you a link to choose a new one.',
      art: d.star(),
      form: `
      <form class="ll-form" data-auth-form="forgot" novalidate>
        ${field('fp-email', 'Email address', '<input id="fp-email" name="email" type="email" autocomplete="email" required>')}
        <button class="btn btn-primary" type="submit">Send reset link</button>
        ${status}
      </form>
      <div class="auth-done" hidden>
        <h2>Check your email</h2>
        <p>If there’s an account for <strong data-sent-to></strong>, a reset link is on its way. It may take a minute or two to arrive.</p>
      </div>`,
      aside: `Remembered it? <a href="${h('account/log-in/')}">Log in</a>`,
    }),
};

export const resetPage = {
  path: 'account/reset-password/',
  noindex: true,
  title: 'Choose a new password',
  description: 'Choose a new password for your Learning Lanterns account.',
  scripts: accountsEnabled ? ['assets/js/auth-pages.js'] : [],
  body: (h) =>
    authShell(h, {
      crumbs: [['Home', ''], ['New password', 'account/reset-password/']],
      title: 'Choose a new password',
      art: d.star(),
      form: `
      <p class="muted" data-reset-waiting>Checking your reset link…</p>
      <div class="form-fallback" data-reset-invalid hidden>
        <p>This reset link has expired or has already been used.</p>
        ${button(h('account/forgot-password/'), 'Send a new link', { variant: 'secondary' })}
      </div>
      <form class="ll-form" data-auth-form="reset" novalidate hidden>
        ${passwordField('rp-password', 'New password', 'new-password', 'At least 8 characters.')}
        <button class="btn btn-primary" type="submit">Save new password</button>
        ${status}
      </form>
      <div class="auth-done" hidden>
        <h2>All set!</h2>
        <p>Your new password is saved.</p>
        ${button(h('account/'), 'Go to my family dashboard')}
      </div>`,
    }),
};

// ---- Signed-in pages --------------------------------------------------------

const accountNav = (h, current) => `
  <nav class="account-nav" aria-label="Family account">
    <a href="${h('account/')}"${current === 'dash' ? ' aria-current="page"' : ''}>Dashboard</a>
    <a href="${h('account/children/')}"${current === 'kids' ? ' aria-current="page"' : ''}>Children</a>
    <a href="${h('account/settings/')}"${current === 'settings' ? ' aria-current="page"' : ''}>${accountsEnabled ? 'Account' : 'This device'}</a>
  </nav>`;

const signedInShell = (h, { current, crumbs, body }) => `
  <section class="section-tight account-section" aria-labelledby="page-title">
    <div class="container">
      ${breadcrumbs(h, crumbs)}
      ${noscript}
      ${
        accountsEnabled
          ? ''
          : `<p class="device-note">${d.sparkle()}<span><strong>Saved on this device only.</strong> No sign-up needed. Progress stays in this browser and isn’t sent to us. <a href="${h('account/sign-up/')}">About family accounts</a></span></p>`
      }
      <div data-needs-session>
        <p class="muted" data-loading>Loading your family’s page…</p>
        <div data-signed-in hidden>${accountNav(h, current)}${body}</div>
      </div>
    </div>
  </section>`;

export const dashboardPage = {
  path: 'account/',
  noindex: true,
  title: 'Family dashboard',
  description: 'See what your child has been exploring on Learning Lanterns.',
  scripts: ['assets/js/charts.js', 'assets/js/dashboard.js'],
  body: (h) =>
    signedInShell(h, {
      current: 'dash',
      crumbs: [['Home', ''], ['Family dashboard', 'account/']],
      body: `
      <div class="dash-head">
        <div>
          <p class="eyebrow" data-greeting>Hello!</p>
          <h1 id="page-title" class="dash-title">Learning journey</h1>
        </div>
        <div class="child-tabs" role="group" aria-label="Choose a child" data-child-tabs></div>
      </div>

      <div data-no-children hidden>
        <div class="soon-panel">
          <div class="soon-art">${d.lantern({ face: true })}</div>
          <div class="soon-copy">
            <h2 class="soon-title">Let’s add your first child</h2>
            <p>Add a profile with a nickname, age group and learning level. Then choose who’s playing before a game, and their journey will appear here.</p>
            <div class="btn-row">${button(h('account/children/#add'), 'Add a child')}</div>
          </div>
        </div>
      </div>

      <div data-dashboard hidden>
        <div class="filter-row" role="group" aria-label="Filter the dashboard">
          <div class="field compact">
            <label for="f-period">Show</label>
            <select id="f-period" data-filter="period">
              <option value="week">Last 7 days</option>
              <option value="month">Last 4 weeks</option>
              <option value="all">Everything so far</option>
            </select>
          </div>
          <div class="field compact">
            <label for="f-studio">Learning studio</label>
            <select id="f-studio" data-filter="studio"><option value="">All studios</option></select>
          </div>
          <div class="field compact">
            <label for="f-skill">Skill</label>
            <select id="f-skill" data-filter="skill"><option value="">All skills</option></select>
          </div>
        </div>

        <div data-empty hidden>
          <div class="soon-panel">
            <div class="soon-art">${d.heroScene()}</div>
            <div class="soon-copy">
              <h2 class="soon-title" data-empty-title>A bright journey starts here</h2>
              <p data-empty-text>Nothing to show yet. Progress will appear here as your child explores Learning Lanterns. Before a game starts, choose who’s playing at the top of the game page.</p>
              <div class="btn-row">${button(h('explore/'), 'Find a game to play')}</div>
            </div>
          </div>
        </div>

        <div data-has-data hidden>
          <div class="insight-card" data-insights aria-live="polite"></div>

          <ul class="stat-tiles" data-tiles></ul>
          <p class="measure-note">${d.sparkle()}<span><strong>How to read this.</strong> <em>Time spent</em> counts only the minutes your child was actively tapping or playing. <em>Levels finished</em> means they worked through a level to the end. Our games encourage children to keep trying, so finishing a level shows practice and persistence. It isn’t a test score, and time spent doesn’t mean a skill is mastered.</span></p>

          <div class="dash-grid">
            <section class="chart-card" aria-labelledby="c-week">
              <h2 id="c-week" class="chart-title">Time spent each day</h2>
              <p class="chart-sub" data-week-sub>Minutes of active play, by learning studio</p>
              <div class="chart" data-chart="week"></div>
              <details class="table-view"><summary>Show as a table</summary><div data-table="week"></div></details>
            </section>
            <section class="chart-card" aria-labelledby="c-studios">
              <h2 id="c-studios" class="chart-title">Where they explore most</h2>
              <p class="chart-sub">Minutes of active play and visits for each studio</p>
              <div class="chart" data-chart="studios"></div>
              <details class="table-view"><summary>Show as a table</summary><div data-table="studios"></div></details>
            </section>
          </div>

          <section class="chart-card" aria-labelledby="c-skills">
            <h2 id="c-skills" class="chart-title">Skills practised</h2>
            <p class="chart-sub">Levels finished in games that practise each skill. Only skills our games actually practise are shown.</p>
            <div data-skills></div>
          </section>

          <section class="chart-card" aria-labelledby="c-diary">
            <h2 id="c-diary" class="chart-title">Play diary</h2>
            <p class="chart-sub">Which games were played on which days</p>
            <div data-diary></div>
          </section>

          <section class="chart-card" aria-labelledby="c-games">
            <h2 id="c-games" class="chart-title">Games played</h2>
            <div class="table-scroll" data-games></div>
          </section>

          <div class="dash-grid">
            <section class="chart-card" aria-labelledby="c-timeline">
              <h2 id="c-timeline" class="chart-title">Recent moments</h2>
              <ol class="timeline" data-timeline></ol>
            </section>
            <section class="chart-card" aria-labelledby="c-next">
              <h2 id="c-next" class="chart-title">Ideas for next time</h2>
              <ul class="suggestions" data-suggestions></ul>
            </section>
          </div>
        </div>
      </div>`,
    }),
};

const ageOptions = [['2-3', '2 to 3 years'], ['3-4', '3 to 4 years'], ['4-5', '4 to 5 years'], ['5-6', '5 to 6 years'], ['6-7', '6 to 7 years']];
const levelOptions = [
  [1, 'Little Sparks · just starting out'],
  [2, 'Glow · getting going'],
  [3, 'Shine · growing in confidence'],
  [4, 'Bright · ready for a challenge'],
];

export const childrenPage = {
  path: 'account/children/',
  noindex: true,
  title: 'Your children',
  description: 'Add and edit your children’s profiles.',
  scripts: ['assets/js/family.js'],
  body: (h) =>
    signedInShell(h, {
      current: 'kids',
      crumbs: [['Home', ''], ['Family dashboard', 'account/'], ['Children', 'account/children/']],
      body: `
      <h1 id="page-title" class="dash-title">Your children</h1>
      <p class="lead">Each child gets their own learning journey. We only ask for what helps us suggest the right activities.</p>
      <ul class="child-list" data-child-list></ul>

      <section class="form-card mt-6" id="add" aria-labelledby="child-form-title">
        <h2 id="child-form-title" class="chart-title" data-form-title>Add a child</h2>
        <form class="ll-form" data-child-form novalidate>
          <input type="hidden" name="id">
          ${field('ch-name', 'Nickname or first name', '<input id="ch-name" name="nickname" type="text" maxlength="30" autocomplete="off" required aria-describedby="ch-name-hint">', 'Just what you call them at home. Please don’t add a surname.')}
          <div class="field-row">
            ${field('ch-age', 'Age group', `<select id="ch-age" name="age_group" required><option value="">Please choose</option>${ageOptions.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>`)}
            ${field('ch-level', 'Learning level', `<select id="ch-level" name="learning_level" required aria-describedby="ch-level-hint"><option value="">Please choose</option>${levelOptions.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select>`, 'The same levels our games use. You can change it any time.')}
          </div>
          <fieldset class="field check-group">
            <legend>Studios to suggest more often <span class="muted">(optional)</span></legend>
            <div data-studio-checks></div>
          </fieldset>
          <div class="btn-row">
            <button class="btn btn-primary" type="submit" data-submit-label>Add child</button>
            <button class="btn btn-soft" type="button" data-cancel-edit hidden>Cancel</button>
          </div>
          ${status}
        </form>
      </section>`,
    }),
};

export const settingsPage = {
  path: 'account/settings/',
  noindex: true,
  title: 'Account settings',
  description: 'Manage your Learning Lanterns family account.',
  scripts: ['assets/js/family.js'],
  body: (h) =>
    signedInShell(h, {
      current: 'settings',
      crumbs: [['Home', ''], ['Family dashboard', 'account/'], [accountsEnabled ? 'Account' : 'This device', 'account/settings/']],
      body: accountsEnabled ? `
      <h1 id="page-title" class="dash-title">Your account</h1>
      <div class="dash-grid">
        <section class="form-card" aria-labelledby="s-details">
          <h2 id="s-details" class="chart-title">Your details</h2>
          <form class="ll-form" data-settings-form novalidate>
            ${field('st-name', 'Your first name', '<input id="st-name" name="name" type="text" autocomplete="given-name" maxlength="60" required>')}
            <div class="field"><span class="label-like">Email address</span><p data-email class="muted"></p></div>
            <button class="btn btn-primary" type="submit">Save</button>
            ${status}
          </form>
          <hr class="soft-rule">
          <p>Need a new password? <a href="${h('account/forgot-password/')}">Send yourself a reset link</a>.</p>
          <button class="btn btn-secondary" type="button" data-sign-out>Log out</button>
        </section>
        <section class="form-card danger-zone" aria-labelledby="s-delete">
          <h2 id="s-delete" class="chart-title">Delete your account</h2>
          <p>This permanently deletes your account, your children’s profiles and all of their activity. It can’t be undone.</p>
          <form class="ll-form" data-delete-form novalidate>
            ${field('st-confirm', 'Type DELETE to confirm', '<input id="st-confirm" name="confirm" type="text" autocomplete="off" required>')}
            <button class="btn btn-danger" type="submit">Delete my account and data</button>
            ${status}
          </form>
        </section>
      </div>` : deviceSettings(h),
    }),
};

export const accountPages = [signUpPage, logInPage, forgotPage, resetPage, dashboardPage, childrenPage, settingsPage];
