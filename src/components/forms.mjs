import { site } from '../config.mjs';
import { esc } from './layout.mjs';

// Forms only render when a real endpoint is configured in config.mjs.
// Without one, visitors see an honest note (and an email link if a real
// address exists) instead of a form that would go nowhere.

const privacyNote = (h) =>
  `<p class="form-privacy">We’ll only use these details to reply to you about Learning Lanterns. We won’t share them or add you to a mailing list without asking. See our <a href="${h('privacy/')}">Privacy Policy</a>.</p>`;

function fallback({ h, topic }) {
  if (site.contactEmail) {
    const subject = encodeURIComponent(topic);
    return `<div class="form-fallback">
      <p>We’d love to hear from you. Write to us and we’ll reply as soon as we can.</p>
      <a class="btn btn-primary" href="mailto:${esc(site.contactEmail)}?subject=${subject}">Email ${esc(site.contactEmail)}</a>
    </div>`;
  }
  return `<div class="form-fallback">
    <p><strong>Our enquiry inbox is being set up.</strong> A way to get in touch will appear right here very soon.</p>
  </div>`;
}

function shell({ id, h, topic, fields, submit }) {
  if (!site.formEndpoint) return fallback({ h, topic });
  return `
  <form class="ll-form" id="${id}" action="${esc(site.formEndpoint)}" method="post" novalidate data-enhanced-form>
    <input type="hidden" name="topic" value="${esc(topic)}">
    <div class="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
    ${fields}
    ${privacyNote(h)}
    <button class="btn btn-primary" type="submit">${submit}</button>
    <p class="form-status" role="status" aria-live="polite"></p>
  </form>`;
}

const field = (id, label, input, hint = '') => `
  <div class="field">
    <label for="${id}">${label}</label>
    ${hint ? `<p class="field-hint" id="${id}-hint">${hint}</p>` : ''}
    ${input}
  </div>`;

export const toyInterestForm = (h) =>
  shell({
    id: 'toy-interest',
    h,
    topic: 'Hands-on toys interest',
    submit: 'Register my interest',
    fields: `
      <div class="field-row">
        ${field('ti-name', 'Your name', '<input id="ti-name" name="name" type="text" autocomplete="name" required>')}
        ${field('ti-email', 'Email address', '<input id="ti-email" name="email" type="email" autocomplete="email" required>')}
      </div>
      ${field(
        'ti-role',
        'I’m a…',
        `<select id="ti-role" name="role" required>
          <option value="">Please choose</option>
          <option>Parent or carer</option>
          <option>Teacher or educator</option>
          <option>School or nursery</option>
          <option>Other</option>
        </select>`,
      )}`,
  });

export const schoolEnquiryForm = (h) =>
  shell({
    id: 'school-enquiry',
    h,
    topic: 'School partnership enquiry',
    submit: 'Send enquiry',
    fields: `
      <div class="field-row">
        ${field('se-name', 'Your name', '<input id="se-name" name="name" type="text" autocomplete="name" required>')}
        ${field('se-email', 'Work email', '<input id="se-email" name="email" type="email" autocomplete="email" required>')}
      </div>
      <div class="field-row">
        ${field('se-org', 'School or organisation', '<input id="se-org" name="organisation" type="text" autocomplete="organization" required>')}
        ${field(
          'se-role',
          'Your role',
          '<input id="se-role" name="role" type="text" autocomplete="organization-title">',
        )}
      </div>
      ${field('se-msg', 'How could Learning Lanterns help?', '<textarea id="se-msg" name="message" rows="5" required></textarea>')}`,
  });

export const contactForm = (h) =>
  shell({
    id: 'contact-form',
    h,
    topic: 'General enquiry',
    submit: 'Send message',
    fields: `
      <div class="field-row">
        ${field('cf-name', 'Your name', '<input id="cf-name" name="name" type="text" autocomplete="name" required>')}
        ${field('cf-email', 'Email address', '<input id="cf-email" name="email" type="email" autocomplete="email" required>')}
      </div>
      ${field('cf-msg', 'Your message', '<textarea id="cf-msg" name="message" rows="5" required></textarea>')}`,
  });
