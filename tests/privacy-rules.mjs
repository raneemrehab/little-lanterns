// Checks that the database keeps every family's data private.
//
//   SUPABASE_URL=... SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... npm run test:privacy
//
// Run it against a test or staging project. It creates two throwaway
// parent accounts, tries to read and change each other's data, and then
// deletes both accounts. The service role key is only used to create and
// remove the test accounts; never put it in the website.
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL: url, SUPABASE_ANON_KEY: anon, SUPABASE_SERVICE_ROLE_KEY: service } = process.env;
if (!url || !anon || !service) {
  console.error('Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY first.');
  process.exit(2);
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, service, opts);
let failures = 0;
const check = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) failures++; };

async function parent(tag) {
  const email = `privacy-test-${tag}-${Date.now()}@example.com`;
  const password = `test-${crypto.randomUUID()}`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw error;
  const client = createClient(url, anon, opts);
  const r = await client.auth.signInWithPassword({ email, password });
  if (r.error) throw r.error;
  return { client, id: data.user.id };
}

const A = await parent('a');
const B = await parent('b');
try {
  const anonClient = createClient(url, anon, opts);
  check((await anonClient.from('children').select()).error || (await anonClient.from('children').select()).data.length === 0, 'signed-out visitors see no children');

  const { data: kid, error } = await A.client.from('children').insert({ nickname: 'Test', age_group: '3-4', learning_level: 2 }).select().single();
  check(!error && kid, 'a parent can add a child');
  check((await A.client.from('children').update({ nickname: 'Test 2' }).eq('id', kid.id).select()).data?.length === 1, 'a parent can edit their own child');
  check((await B.client.from('children').select()).data.length === 0, 'another parent cannot see that child');
  check((await B.client.from('children').update({ nickname: 'X' }).eq('id', kid.id).select()).data?.length === 0, 'another parent cannot edit that child');
  check((await B.client.from('children').delete().eq('id', kid.id).select()).data?.length === 0, 'another parent cannot delete that child');

  const sid = crypto.randomUUID();
  check(!!(await B.client.from('activity_sessions').insert({ id: sid, child_id: kid.id, activity_slug: 'duck-pond', studio: 'number-nook' })).error, 'another parent cannot record activity for that child');
  check(!(await A.client.from('activity_sessions').insert({ id: sid, child_id: kid.id, activity_slug: 'duck-pond', studio: 'number-nook' })).error, 'a parent can record activity for their child');
  check(!(await A.client.from('activity_sessions').update({ active_seconds: 30, levels_completed: 1 }).eq('id', sid)).error, 'a parent can update their child\'s session');
  check((await B.client.from('activity_sessions').select()).data.length === 0, 'another parent cannot see that activity');
  check(!!(await B.client.from('activity_events').insert({ child_id: kid.id, session_id: sid, kind: 'level_completed' })).error, 'another parent cannot add events for that child');
  check(!!(await A.client.from('children').update({ parent_id: B.id }).eq('id', kid.id)).error, 'a child cannot be moved to another account');
  check(!!(await A.client.from('activity_sessions').update({ active_seconds: 99999 }).eq('id', sid)).error, 'impossible time values are refused');
  check(!(await A.client.rpc('delete_my_account')).error, 'a parent can delete their own account');
  check((await admin.from('children').select('id').eq('parent_id', A.id)).data.length === 0, 'deleting an account deletes the children');
  check((await admin.from('activity_sessions').select('id').eq('parent_id', A.id)).data.length === 0, 'deleting an account deletes the activity');
} finally {
  await admin.auth.admin.deleteUser(A.id).catch(() => {});
  await admin.auth.admin.deleteUser(B.id).catch(() => {});
}
console.log(failures ? `\n${failures} check(s) failed` : '\nAll privacy checks passed');
process.exit(failures ? 1 : 0);
