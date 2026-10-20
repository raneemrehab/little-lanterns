-- Learning Lanterns: parent accounts, child profiles and learning activity.
--
-- Privacy model: every row belongs to exactly one parent account
-- (parent_id = the signed-in user's id). Row Level Security makes the
-- database itself refuse to show or change another family's rows, so a bug
-- in the website cannot leak one family's data to another.
--
-- Children never sign in. A child is a profile inside the parent's account,
-- holding only a nickname, an age group and a learning level.

create extension if not exists pgcrypto;

-- ---- Child profiles ---------------------------------------------------------

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nickname text not null check (char_length(btrim(nickname)) between 1 and 30),
  age_group text not null check (age_group in ('2-3', '3-4', '4-5', '5-6', '6-7')),
  -- The curriculum levels used by the games: 1 Little Sparks, 2 Glow, 3 Shine, 4 Bright.
  learning_level smallint not null check (learning_level between 1 and 4),
  -- Studios the parent would like suggestions to focus on (studio ids).
  focus_studios text[] not null default '{}' check (cardinality(focus_studios) <= 6),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index children_parent_idx on public.children (parent_id);

-- ---- Activity sessions --------------------------------------------------------
-- One row each time a child opens a game. The play page keeps it up to date
-- while the game is open. A session nobody closed properly simply stops at
-- last_active_at.

create table public.activity_sessions (
  id uuid primary key,
  parent_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  activity_type text not null default 'game' check (activity_type in ('game', 'printable')),
  activity_slug text not null check (activity_slug ~ '^[a-z0-9-]{1,60}$'),
  studio text not null check (studio ~ '^[a-z0-9-]{1,40}$'),
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  ended_at timestamptz,
  -- Seconds of real engagement: the page was visible, the game was in play,
  -- and the child had tapped or typed within the last minute. Capped at 4 hours.
  active_seconds integer not null default 0 check (active_seconds between 0 and 14400),
  interactions integer not null default 0 check (interactions between 0 and 100000),
  levels_started integer not null default 0 check (levels_started between 0 and 1000),
  levels_completed integer not null default 0 check (levels_completed between 0 and 1000)
);
create index activity_sessions_child_idx on public.activity_sessions (child_id, started_at desc);

-- ---- Activity events -------------------------------------------------------------
-- Moments worth showing on the timeline.

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  child_id uuid not null references public.children (id) on delete cascade,
  session_id uuid references public.activity_sessions (id) on delete cascade,
  kind text not null check (kind in ('game_opened', 'level_started', 'level_completed', 'studio_visit', 'printable_opened')),
  activity_slug text check (activity_slug ~ '^[a-z0-9-]{1,60}$'),
  studio text check (studio ~ '^[a-z0-9-]{1,40}$'),
  -- Short label taken from the game screen, e.g. 'Level 1 · Count and tell'.
  detail text check (char_length(detail) <= 120),
  occurred_at timestamptz not null default now()
);
create index activity_events_child_idx on public.activity_events (child_id, occurred_at desc);

-- ---- Keep updated_at honest -----------------------------------------------------

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger children_touch before update on public.children
for each row execute function public.touch_updated_at();

-- A parent can't move a row to another account or another family's child.
create function public.lock_ownership() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.parent_id is distinct from old.parent_id then
    raise exception 'parent_id cannot change';
  end if;
  -- Nested so that new.child_id is only read on tables that have it.
  if tg_table_name <> 'children' then
    if new.child_id is distinct from old.child_id then
      raise exception 'child_id cannot change';
    end if;
  end if;
  return new;
end $$;

create trigger children_lock before update on public.children
for each row execute function public.lock_ownership();
create trigger sessions_lock before update on public.activity_sessions
for each row execute function public.lock_ownership();

-- ---- Row Level Security ----------------------------------------------------------

alter table public.children enable row level security;
alter table public.activity_sessions enable row level security;
alter table public.activity_events enable row level security;

-- Supabase grants every table to every API role by default. Start from
-- nothing and allow only what the website needs.
revoke all on public.children, public.activity_sessions, public.activity_events from anon, authenticated;
grant select, insert, update, delete on public.children to authenticated;
grant select, insert, update on public.activity_sessions to authenticated;
grant select, insert on public.activity_events to authenticated;

create policy "Parents see their own children" on public.children
  for select to authenticated using (parent_id = (select auth.uid()));
create policy "Parents add their own children" on public.children
  for insert to authenticated with check (parent_id = (select auth.uid()));
create policy "Parents edit their own children" on public.children
  for update to authenticated using (parent_id = (select auth.uid())) with check (parent_id = (select auth.uid()));
create policy "Parents remove their own children" on public.children
  for delete to authenticated using (parent_id = (select auth.uid()));

create policy "Parents see their own sessions" on public.activity_sessions
  for select to authenticated using (parent_id = (select auth.uid()));
create policy "Parents record sessions for their own children" on public.activity_sessions
  for insert to authenticated with check (
    parent_id = (select auth.uid())
    and exists (select 1 from public.children c where c.id = child_id and c.parent_id = (select auth.uid()))
  );
create policy "Parents update their own sessions" on public.activity_sessions
  for update to authenticated using (parent_id = (select auth.uid())) with check (parent_id = (select auth.uid()));

create policy "Parents see their own events" on public.activity_events
  for select to authenticated using (parent_id = (select auth.uid()));
create policy "Parents record events for their own children" on public.activity_events
  for insert to authenticated with check (
    parent_id = (select auth.uid())
    and exists (select 1 from public.children c where c.id = child_id and c.parent_id = (select auth.uid()))
    and (session_id is null or exists (
      select 1 from public.activity_sessions s where s.id = session_id and s.parent_id = (select auth.uid()) and s.child_id = activity_events.child_id
    ))
  );

-- ---- Deleting an account -----------------------------------------------------------
-- Lets a signed-in parent delete their own account. Children, sessions and
-- events go with it through the cascades above.

create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
