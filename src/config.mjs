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
  url: null,

  // Where the site is served from. '/' for a domain root, or '/repo-name/'
  // for a project page on GitHub Pages. Only the 404 page needs this,
  // because it can be shown at any address.
  basePath: '/',

  // A real, monitored contact email address. When set, contact sections
  // show a "write to us" link. Never put a made-up address here.
  contactEmail: null,

  // A form-handling endpoint that accepts a standard POST of form fields
  // (for example a Formspree, Basin or Netlify Forms URL). When set, the
  // toy-interest and school-enquiry forms appear. When null, no form is
  // shown, so visitors never fill in a form that goes nowhere.
  formEndpoint: null,
};
