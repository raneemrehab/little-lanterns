// Site-wide settings. Everything here is safe to edit.
//
// Leave a value as null until you have the real thing. The site hides
// anything that depends on a missing value instead of showing a dead link
// or a form that goes nowhere.

export const site = {
  name: 'Learning Lanterns',
  tagline: 'Little steps. Bright discoveries.',
  description:
    'Thoughtfully designed games, printables and hands-on learning experiences that help little minds grow.',

  // The full public URL once the site is live, e.g. 'https://learninglanterns.com'.
  // Used for canonical links and social previews. Leave null until known.
  url: 'https://littlelanternsme.netlify.app',

  // The verification code from Google Search Console ("HTML tag" method):
  // only the content="…" value. Leave null until you have it.
  googleSiteVerification: process.env.LL_GOOGLE_SITE_VERIFICATION || null,

  // Where the site is served from. '/' for a domain root, or '/repo-name/'
  // for a project page on GitHub Pages. Only the 404 page needs this,
  // because it can be shown at any address.
  basePath: '/',

  // A real, monitored contact email address. When set, contact sections
  // show a "write to us" link. Never put a made-up address here.
  contactEmail: null,

  // Where the help-centre chat box and the enquiry forms send messages.
  // '/api/message' is the function in netlify/functions/message.mjs, which
  // forwards each message to the owner's WhatsApp. The number itself is set
  // as an environment variable on the host (see docs/LAUNCH.md), so it never
  // appears in the page or in this repository. Set to null to hide the chat
  // box and the forms, for example on a host without functions.
  messageEndpoint: process.env.LL_MESSAGE_ENDPOINT ?? '/api/message',

  // A form-handling endpoint for the contact, toy-interest and school-enquiry
  // forms. By default they go to the same place as the chat box. When null,
  // no form is shown, so visitors never fill in a form that goes nowhere.
  formEndpoint: process.env.LL_FORM_ENDPOINT ?? null,

  // Parent accounts and progress tracking run on Supabase (supabase.com).
  // Paste your project's URL and its public "anon" key here, after running
  // the SQL in supabase/migrations/ (see docs/ACCOUNTS.md). The anon key is
  // meant to be public: the database's own rules keep each family's data
  // private. Leave both null and the account features stay switched off.
  // LL_SUPABASE_URL / LL_SUPABASE_ANON_KEY environment variables override
  // these at build time.
  supabaseUrl: process.env.LL_SUPABASE_URL || null,
  supabaseAnonKey: process.env.LL_SUPABASE_ANON_KEY || null,
};

site.formEndpoint ??= site.messageEndpoint;

export const accountsEnabled = Boolean(site.supabaseUrl && site.supabaseAnonKey);
