// The "Questions?" chat box. It posts the message to the site's message
// endpoint, which forwards it to the team on WhatsApp. The phone number is
// held on the server, so it never appears here.
(function () {
  'use strict';
  var box = document.querySelector('[data-help-chat]');
  if (!box) return;
  var toggle = box.querySelector('.help-chat-toggle');
  var panel = box.querySelector('.help-chat-panel');
  var form = box.querySelector('form');
  var log = box.querySelector('.help-chat-log');
  var endpoint = box.getAttribute('data-endpoint');

  function open(on) {
    panel.hidden = !on;
    toggle.setAttribute('aria-expanded', String(on));
    box.classList.toggle('is-open', on);
    if (on) form.message.focus(); else toggle.focus();
  }
  toggle.addEventListener('click', function () { open(panel.hidden); });
  box.querySelector('.help-chat-close').addEventListener('click', function () { open(false); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
  document.querySelectorAll('[data-open-chat]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); open(true); });
  });

  function bubble(text, who) {
    var p = document.createElement('p');
    p.className = 'bubble bubble-' + who;
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var message = form.message.value.trim();
    if (!message) { form.message.setAttribute('aria-invalid', 'true'); form.message.focus(); return; }
    form.message.removeAttribute('aria-invalid');
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    bubble(message, 'you');
    var data = {
      message: message, name: form.name.value.trim(), contact: form.contact.value.trim(),
      topic: 'Help centre chat', page: document.title, _gotcha: form._gotcha.value,
    };
    var backup = function () { return window.LLInbox ? window.LLInbox(data) : false; };
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      // WhatsApp couldn't take it: keep the message in the backup inbox instead.
      .then(function (res) { return res.ok || backup(); }, backup)
      .then(function (sent) {
        if (!sent) { bubble('Sorry, that didn’t send. Please check your connection and try again.', 'us'); return; }
        form.message.value = '';
        bubble(data.contact
          ? 'Thank you! Your message is with our team, and we’ll reply to ' + data.contact + ' soon.'
          : 'Thank you! Your message is with our team. If you’d like a reply, add your email or phone number and send another message.', 'us');
      })
      .then(function () { btn.disabled = false; });
  });
})();
