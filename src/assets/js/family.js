// Children's profiles and account settings.
(function () {
  'use strict';
  if (!window.LL) return;
  var LL = window.LL;
  var client = LL.client;
  var esc = LL.esc;

  var AGES = { '2-3': '2 to 3 years', '3-4': '3 to 4 years', '4-5': '4 to 5 years', '5-6': '5 to 6 years', '6-7': '6 to 7 years' };
  var LEVELS = { 1: 'Little Sparks', 2: 'Glow', 3: 'Shine', 4: 'Bright' };

  function setStatus(form, text) { form.querySelector('.form-status').textContent = text; }

  LL.ready.then(function (s) {
    if (!s.user) return;
    var user = s.user;

    // ---- Children page ---------------------------------------------------------
    var list = document.querySelector('[data-child-list]');
    var form = document.querySelector('[data-child-form]');
    if (list && form) {
      var children = [];
      var checks = form.querySelector('[data-studio-checks]');
      checks.innerHTML = LL.catalog.studios.map(function (st) {
        return '<label class="check-chip"><input type="checkbox" name="focus" value="' + st.id + '"> ' + esc(st.name) + ' <span class="muted">· ' + esc(st.subtitle) + '</span></label>';
      }).join('');

      function render() {
        var active = LL.activeChild(user.id);
        if (!children.length) {
          list.innerHTML = '<li class="child-empty">No children added yet. Add your first child below.</li>';
          return;
        }
        list.innerHTML = children.map(function (c) {
          var isActive = active && active.id === c.id;
          return '<li class="child-card">' +
            '<span class="child-avatar" aria-hidden="true">' + esc(c.nickname.charAt(0).toUpperCase()) + '</span>' +
            '<div class="child-info"><strong>' + esc(c.nickname) + '</strong>' +
            '<span>' + esc(AGES[c.age_group] || c.age_group) + ' · Level ' + c.learning_level + ' · ' + esc(LEVELS[c.learning_level]) + '</span>' +
            (isActive ? '<span class="pill pill-open"><span class="pill-dot" aria-hidden="true"></span>Playing on this device</span>' : '') +
            '</div><div class="child-actions">' +
            (isActive ? '' : '<button type="button" class="btn btn-soft btn-sm" data-play="' + c.id + '">Set as playing<span class="visually-hidden">: ' + esc(c.nickname) + '</span></button>') +
            '<button type="button" class="btn btn-soft btn-sm" data-edit="' + c.id + '">Edit<span class="visually-hidden"> ' + esc(c.nickname) + '</span></button>' +
            '<button type="button" class="btn btn-soft btn-sm" data-remove="' + c.id + '">Remove<span class="visually-hidden"> ' + esc(c.nickname) + '</span></button>' +
            '</div></li>';
        }).join('');
      }

      function load() {
        return client.from('children').select('*').order('created_at').then(function (r) {
          if (r.error) { list.innerHTML = '<li class="child-empty">' + esc(LL.friendlyError(r.error)) + '</li>'; return; }
          children = r.data;
          var active = LL.activeChild(user.id);
          if (active && !children.some(function (c) { return c.id === active.id; })) LL.activeChild(user.id, null);
          render();
        });
      }

      function resetForm() {
        form.reset();
        form.id.value = '';
        document.querySelector('[data-form-title]').textContent = 'Add a child';
        form.querySelector('[data-submit-label]').textContent = 'Add child';
        form.querySelector('[data-cancel-edit]').hidden = true;
      }

      list.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        var id = b.getAttribute('data-edit') || b.getAttribute('data-remove') || b.getAttribute('data-play');
        var c = children.filter(function (x) { return x.id === id; })[0];
        if (!c) return;
        if (b.hasAttribute('data-play')) { LL.activeChild(user.id, c); render(); return; }
        if (b.hasAttribute('data-edit')) {
          form.id.value = c.id;
          form.nickname.value = c.nickname;
          form.age_group.value = c.age_group;
          form.learning_level.value = String(c.learning_level);
          form.querySelectorAll('[name=focus]').forEach(function (cb) { cb.checked = c.focus_studios.indexOf(cb.value) !== -1; });
          document.querySelector('[data-form-title]').textContent = 'Edit ' + c.nickname;
          form.querySelector('[data-submit-label]').textContent = 'Save changes';
          form.querySelector('[data-cancel-edit]').hidden = false;
          form.nickname.focus();
          return;
        }
        if (b.hasAttribute('data-remove')) {
          if (!window.confirm('Remove ' + c.nickname + '? Their profile and all of their activity will be deleted. This can’t be undone.')) return;
          client.from('children').delete().eq('id', c.id).then(function (r) {
            if (r.error) { window.alert(LL.friendlyError(r.error)); return; }
            if (form.id.value === c.id) resetForm();
            load();
          });
        }
      });

      form.querySelector('[data-cancel-edit]').addEventListener('click', resetForm);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = null;
        ['nickname', 'age_group', 'learning_level'].forEach(function (n) {
          var el = form[n];
          var ok = el.value.trim() !== '';
          el.setAttribute('aria-invalid', String(!ok));
          if (!ok && !bad) bad = el;
        });
        if (bad) { setStatus(form, 'Please fill in the nickname, age group and learning level.'); bad.focus(); return; }
        var row = {
          nickname: form.nickname.value.trim(),
          age_group: form.age_group.value,
          learning_level: Number(form.learning_level.value),
          focus_studios: Array.prototype.map.call(form.querySelectorAll('[name=focus]:checked'), function (cb) { return cb.value; }),
        };
        var id = form.id.value;
        setStatus(form, 'Saving…');
        var q = id ? client.from('children').update(row).eq('id', id) : client.from('children').insert(row);
        q.select().then(function (r) {
          if (r.error) { setStatus(form, LL.friendlyError(r.error)); return; }
          // The first child added becomes the one playing on this device.
          if (!id && !LL.activeChild(user.id) && r.data && r.data[0]) LL.activeChild(user.id, r.data[0]);
          setStatus(form, id ? 'Saved ' + row.nickname + '’s changes.' : 'Added ' + row.nickname + '!');
          resetForm();
          load();
        });
      });

      load();
    }

    // ---- Settings page -----------------------------------------------------------
    var settings = document.querySelector('[data-settings-form]');
    if (settings) {
      settings.name.value = (user.user_metadata && user.user_metadata.full_name) || '';
      var email = document.querySelector('[data-email]');
      if (email) email.textContent = user.email;
      settings.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!settings.name.value.trim()) { setStatus(settings, 'Please fill in your name.'); return; }
        setStatus(settings, 'Saving…');
        client.auth.updateUser({ data: { full_name: settings.name.value.trim() } }).then(function (r) {
          setStatus(settings, r.error ? LL.friendlyError(r.error) : 'Saved.');
        });
      });
      var signOut = document.querySelector('[data-sign-out]');
      if (signOut) signOut.addEventListener('click', function () {
        client.auth.signOut().then(function () { window.location.href = LL.link(''); });
      });
      var del = document.querySelector('[data-delete-form]');
      del.addEventListener('submit', function (e) {
        e.preventDefault();
        if (del.confirm.value.trim() !== 'DELETE') { setStatus(del, 'Please type DELETE in capital letters to confirm.'); del.confirm.focus(); return; }
        setStatus(del, 'Deleting…');
        client.rpc('delete_my_account').then(function (r) {
          if (r.error) { setStatus(del, LL.friendlyError(r.error)); return; }
          try { Object.keys(localStorage).forEach(function (k) { if (/^ll-/.test(k)) localStorage.removeItem(k); }); } catch (x) { /* storage blocked */ }
          client.auth.signOut().then(function () { window.location.href = LL.cloud ? LL.link('') + '?account=deleted' : LL.link('account/'); });
        });
      });
    }
  });
})();
