// A small stand-in for the Supabase client that keeps everything in this
// browser's localStorage. It is used when no Supabase project is set in
// src/config.mjs, so parents can still add children and see the progress
// dashboard without an account. Nothing leaves the device.
//
// It covers only the calls the site makes: from(table) with select, insert,
// update and delete, filtered by eq, sorted by order and cut by limit; the
// auth calls used by the account pages; and rpc('delete_my_account').
(function () {
  'use strict';

  var PREFIX = 'll-local:';
  var MAX_ROWS = 5000;
  var DEVICE_USER_ID = 'this-device';

  function read(table) {
    try { return JSON.parse(localStorage.getItem(PREFIX + table) || '[]'); } catch (e) { return []; }
  }
  function write(table, rows) {
    // Oldest activity goes first if a very busy device fills up.
    if (rows.length > MAX_ROWS) rows = rows.slice(rows.length - MAX_ROWS);
    try { localStorage.setItem(PREFIX + table, JSON.stringify(rows)); return null; } catch (e) {
      return { message: 'This browser isn’t letting us save progress. Private browsing can block it.' };
    }
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 3) | 8).toString(16);
    });
  }

  // Columns the database would fill in by itself.
  var DEFAULTS = {
    children: function (r) { r.created_at = r.created_at || new Date().toISOString(); },
    activity_sessions: function (r) {
      r.active_seconds = r.active_seconds || 0; r.interactions = r.interactions || 0;
      r.levels_started = r.levels_started || 0; r.levels_completed = r.levels_completed || 0;
    },
    activity_events: function (r) { r.occurred_at = r.occurred_at || new Date().toISOString(); },
  };
  // Deleting a child also deletes their activity, like the database does.
  var CASCADE = { children: ['activity_sessions', 'activity_events'] };

  function Query(table) {
    this.table = table; this.op = 'select'; this.filters = []; this.sort = null; this.max = null; this.payload = null;
  }
  Query.prototype.select = function () { return this; };
  Query.prototype.insert = function (rows) { this.op = 'insert'; this.payload = [].concat(rows); return this; };
  Query.prototype.update = function (row) { this.op = 'update'; this.payload = row; return this; };
  Query.prototype.delete = function () { this.op = 'delete'; return this; };
  Query.prototype.eq = function (col, val) { this.filters.push([col, val]); return this; };
  Query.prototype.order = function (col, opts) { this.sort = [col, !opts || opts.ascending !== false]; return this; };
  Query.prototype.limit = function (n) { this.max = n; return this; };
  Query.prototype.run = function () {
    var self = this;
    var rows = read(this.table);
    var hit = function (r) { return self.filters.every(function (f) { return r[f[0]] === f[1]; }); };
    var error = null, data = null;
    if (this.op === 'insert') {
      data = this.payload.map(function (r) {
        var row = Object.assign({ id: uuid() }, r);
        if (DEFAULTS[self.table]) DEFAULTS[self.table](row);
        return row;
      });
      error = write(this.table, rows.concat(data));
    } else if (this.op === 'update') {
      data = [];
      rows.forEach(function (r) { if (hit(r)) { Object.assign(r, self.payload); data.push(r); } });
      error = write(this.table, rows);
    } else if (this.op === 'delete') {
      var gone = rows.filter(hit);
      error = write(this.table, rows.filter(function (r) { return !hit(r); }));
      (CASCADE[this.table] || []).forEach(function (t) {
        var ids = gone.map(function (r) { return r.id; });
        write(t, read(t).filter(function (r) { return ids.indexOf(r.child_id) === -1; }));
      });
      data = gone;
    } else {
      data = rows.filter(hit);
      if (this.sort) {
        var col = this.sort[0], asc = this.sort[1];
        data.sort(function (a, b) { return (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (asc ? 1 : -1); });
      }
      if (this.max != null) data = data.slice(0, this.max);
    }
    return Promise.resolve({ data: error ? null : data, error: error });
  };
  Query.prototype.then = function (ok, fail) { return this.run().then(ok, fail); };

  function profile(v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(PREFIX + 'profile') || '{}');
      localStorage.setItem(PREFIX + 'profile', JSON.stringify(v));
    } catch (e) { return {}; }
  }
  function session() {
    return { access_token: 'local', user: { id: DEVICE_USER_ID, email: null, user_metadata: profile() } };
  }

  window.LLLocalClient = {
    from: function (table) { return new Query(table); },
    rpc: function (name) {
      if (name !== 'delete_my_account') return Promise.resolve({ data: null, error: { message: 'Not available' } });
      try {
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf(PREFIX) === 0) localStorage.removeItem(k); });
      } catch (e) { /* storage blocked */ }
      return Promise.resolve({ data: null, error: null });
    },
    auth: {
      getSession: function () { return Promise.resolve({ data: { session: session() } }); },
      onAuthStateChange: function () { return { data: { subscription: { unsubscribe: function () {} } } }; },
      updateUser: function (attrs) {
        profile(Object.assign(profile(), (attrs && attrs.data) || {}));
        return Promise.resolve({ data: { user: session().user }, error: null });
      },
      signOut: function () { return Promise.resolve({ error: null }); },
    },
  };
})();
