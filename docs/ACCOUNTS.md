# Family accounts: setup

Parent accounts, child profiles, the family dashboard and activity tracking run on
[Supabase](https://supabase.com). It handles sign-up, log-in, password-reset emails
and the database. Until it is connected, the website keeps these features switched
off: the account pages say "Family accounts are coming soon", the header shows no
log-in link, and nothing is recorded.

## What you need to do (about 15 minutes)

1. **Create a Supabase project.** Sign up at supabase.com and create a new project.
   Pick a region close to your families (for example London or Frankfurt for UK
   and European families).

2. **Create the tables and privacy rules.** In the project, open **SQL Editor**,
   paste the whole of `supabase/migrations/20261020000000_family_accounts.sql`, and
   click **Run**.

3. **Set up sign-in.** Under **Authentication → Sign In / Providers → Email**:
   - keep **Email** switched on and **Confirm email** switched on
   - set the minimum password length to **8**

   Under **Authentication → URL Configuration**:
   - **Site URL:** your website's address, e.g. `https://learninglanterns.com`
   - **Redirect URLs:** add `https://learninglanterns.com/**`

4. **Send emails from your own address.** Supabase's built-in email sender is only
   meant for testing and sends just a few emails an hour. Under
   **Authentication → Emails → SMTP Settings**, connect a real email service (for
   example Resend, Postmark or your email provider's SMTP), so confirmation and
   password-reset emails arrive reliably. You can also reword the email templates
   there.

5. **Connect the website.** Under **Project Settings → API**, copy the **Project URL**
   and the **anon public** key into `src/config.mjs`:

   ```js
   supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
   supabaseAnonKey: 'eyJ...',
   ```

   The anon key is designed to be public: the database rules from step 2 are what
   keep each family's data private. **Never** put the `service_role` key in the
   website.

6. **Rebuild and publish** the site (`npm run build`, then upload `dist/`).

7. **Check the privacy rules on your project** (recommended):

   ```sh
   npm install
   SUPABASE_URL=https://YOUR-PROJECT.supabase.co \
   SUPABASE_ANON_KEY=... \
   SUPABASE_SERVICE_ROLE_KEY=... \
   npm run test:privacy
   ```

   It creates two throwaway parent accounts, checks that neither can see or change
   the other's children or activity, then deletes them.

8. **Before real families sign up**, have the Privacy Policy and Terms of Use
   written or reviewed by a qualified adviser, and fill in the placeholders on the
   Privacy page (storage region, how long data is kept, privacy contact).

## How it works

| Piece | Where |
| --- | --- |
| Tables and privacy rules | `supabase/migrations/` |
| Shared client, header link, "who's playing" | `src/assets/js/accounts.js` |
| Sign up, log in, forgotten and reset password | `src/assets/js/auth-pages.js`, `src/pages/account.mjs` |
| Child profiles and account settings (including deleting the account) | `src/assets/js/family.js` |
| Tracking on game pages | `src/assets/js/track.js` |
| Dashboard and charts | `src/assets/js/dashboard.js`, `src/assets/js/charts.js` |

**Privacy model.** Every row stores the parent's user id, and Row Level Security
means the database only returns or changes rows for the signed-in parent. Children
never sign in. A child profile holds a nickname, an age group, a learning level and
optional favourite studios. Deleting a child deletes their activity. Deleting the
account deletes everything.

**What is tracked.** The games are not modified. Each game's play page watches the
embedded game, which is served from the same site:

- opening a game (`game_opened`)
- the game's play screen appearing, i.e. a level starting (`level_started`, with the game's level label)
- the game's "well done" card appearing, i.e. a level finished (`level_completed`)
- active time: seconds when the page is visible, a level is on screen, and the child
  has tapped, clicked or pressed a key in the last 60 seconds (capped at 4 hours a session)
- the number of taps, clicks and key presses
- visits to learning studio pages (at most once a day per studio)

Nothing is recorded unless a parent is signed in and has picked who's playing.
A tab closed without warning simply stops at its last saved moment (saved every 15 seconds).

**What is not tracked.** Individual answers and attempts. The games handle those
internally, and reading them would mean changing the game files. Because of that, the
dashboard never shows accuracy or mastery. It shows time spent, games played and
levels finished, and says clearly that these are not test scores.

## Local development

`supabase/config.toml` lets the [Supabase CLI](https://supabase.com/docs/guides/cli)
run a local copy (`npx supabase start`). Build against it with:

```sh
LL_SUPABASE_URL=http://127.0.0.1:54321 LL_SUPABASE_ANON_KEY=<local anon key> npm run serve
```
