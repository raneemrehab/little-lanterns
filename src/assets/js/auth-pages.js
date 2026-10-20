// Sign up, log in, forgotten password and reset password.
(function () {
  'use strict';
  if (!window.LL) return;
  var LL = window.LL;
  var client = LL.client;

  function absolute(path) { return new URL(LL.link(path), window.location.href).href; }

  // Show / hide password buttons.
  document.querySelectorAll('.password-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('aria-controls'));
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
      btn.setAttribute('aria-pressed', String(show));
    });
  });

  function validate(form) {
    var first = null;
    form.querySelectorAll('[required]').forEach(function (el) {
      var ok = el.type === 'checkbox' ? el.checked : el.checkValidity() && el.value.trim() !== '';
      el.setAttribute('aria-invalid', String(!ok));
      var holder = el.closest('.field');
      var err = holder.querySelector('.field-error');
      if (!ok && !err) {
        err = document.createElement('p');
        err.className = 'field-error';
        err.id = el.id + '-error';
        holder.appendChild(err);
        el.setAttribute('aria-describedby', ((el.getAttribute('aria-describedby') || '') + ' ' + err.id).trim());
      }
      if (err) {
        err.textContent = ok ? '' :
          el.type === 'checkbox' ? 'Please tick this box to continue.' :
          el.type === 'email' && el.value ? 'Please check this email address.' :
          el.name === 'password' && el.value ? 'Please use at least 8 characters.' :
          'Please fill this in.';
      }
      if (!ok && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }

  function busy(form, on, text) {
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = on;
    form.querySelector('.form-status').textContent = text || '';
  }

  function done(form, email) {
    var box = form.parentElement.querySelector('.auth-done');
    form.hidden = true;
    if (email) box.querySelector('[data-sent-to]').textContent = email;
    box.hidden = false;
    var h = box.querySelector('h2');
    h.setAttribute('tabindex', '-1');
    h.focus();
  }

  function nextPage() {
    var next = new URLSearchParams(window.location.search).get('next') || '';
    // Only follow local account and site paths.
    return next && /^[a-z0-9\-\/]*$/i.test(next) && next.indexOf('//') === -1 ? next : 'account/';
  }

  var handlers = {
    'sign-up': function (form) {
      var email = form.email.value.trim();
      return client.auth.signUp({
        email: email,
        password: form.password.value,
        options: { data: { full_name: form.name.value.trim() }, emailRedirectTo: absolute('account/') },
      }).then(function (r) {
        if (r.error) throw r.error;
        // With email confirmation on, Supabase returns no session. A user
        // with no identities means the address was already registered.
        if (r.data.user && r.data.user.identities && r.data.user.identities.length === 0) {
          throw new Error('already registered');
        }
        if (r.data.session) { window.location.href = LL.link('account/'); return; }
        done(form, email);
      });
    },
    'log-in': function (form) {
      return client.auth.signInWithPassword({ email: form.email.value.trim(), password: form.password.value })
        .then(function (r) {
          if (r.error) throw r.error;
          window.location.href = LL.link(nextPage());
        });
    },
    forgot: function (form) {
      var email = form.email.value.trim();
      return client.auth.resetPasswordForEmail(email, { redirectTo: absolute('account/reset-password/') })
        .then(function (r) {
          // Same message either way, so the page never reveals who has an account.
          if (r.error && !/rate limit/i.test(r.error.message)) console.warn(r.error.message);
          if (r.error && /rate limit/i.test(r.error.message)) throw r.error;
          done(form, email);
        });
    },
    reset: function (form) {
      return client.auth.updateUser({ password: form.password.value }).then(function (r) {
        if (r.error) throw r.error;
        done(form);
      });
    },
  };

  document.querySelectorAll('[data-auth-form]').forEach(function (form) {
    var kind = form.getAttribute('data-auth-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      busy(form, true, 'One moment…');
      handlers[kind](form)
        .catch(function (err) { busy(form, false, LL.friendlyError(err)); })
        .then(function () { var b = form.querySelector('button[type=submit]'); if (b) b.disabled = false; });
    });
  });

  // Already signed in? The log-in and sign-up pages step aside.
  LL.ready.then(function (s) {
    var form = document.querySelector('[data-auth-form="log-in"], [data-auth-form="sign-up"]');
    if (s.user && form) window.location.replace(LL.link(nextPage()));
  });

  // The reset page needs the session that the emailed link creates.
  var resetForm = document.querySelector('[data-auth-form="reset"]');
  if (resetForm) {
    var waiting = document.querySelector('[data-reset-waiting]');
    var invalid = document.querySelector('[data-reset-invalid]');
    var shown = false;
    function show() { if (shown) return; shown = true; waiting.hidden = true; resetForm.hidden = false; resetForm.password.focus(); }
    client.auth.onAuthStateChange(function (event, session) {
      if (event === 'PASSWORD_RECOVERY' || (session && /type=recovery/.test(window.location.hash))) show();
    });
    LL.ready.then(function (s) {
      if (s.session) return show();
      setTimeout(function () { if (!shown) { waiting.hidden = true; invalid.hidden = false; } }, 2500);
    });
  }
})();
