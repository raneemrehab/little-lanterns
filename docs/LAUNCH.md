# Launching the website

The site is static (built into `dist/`) plus one small function,
`netlify/functions/message.mjs`, that passes help-chat messages and enquiry
forms to WhatsApp. It is set up for Netlify, which runs both on its free plan.

## 1. Put the site on Netlify

1. Sign in at netlify.com and choose **Add new site → Import an existing project → GitHub**.
2. Pick `raneemrehab/little-lanterns`. `netlify.toml` already sets the build
   command (`npm run build`) and the folder to publish (`dist`).
3. Deploy. Netlify gives the site an address like `little-lanterns.netlify.app`;
   a custom domain can be added under **Domain management**.
4. Put the final address in `site.url` in `src/config.mjs`.

## 2. Switch on the help chat (WhatsApp)

The WhatsApp number is **never** written in the code or the repository. It is
an environment variable on Netlify: **Site configuration → Environment
variables → Add a variable**. Visitors only ever see "message sent".

| Variable | What to put |
| --- | --- |
| `WHATSAPP_NUMBER` | The number that receives messages, with country code, digits only (no `+` or spaces). |
| `CALLMEBOT_API_KEY` | See below. |

**Getting a CallMeBot key (free, about 2 minutes).** CallMeBot sends WhatsApp
messages to your own number. From the phone with that WhatsApp number, add the
CallMeBot contact and send it the activation message, following the current
instructions at https://www.callmebot.com/blog/free-api-whatsapp-messages/.
It replies with your API key. Paste it into `CALLMEBOT_API_KEY`, then redeploy
(**Deploys → Trigger deploy**).

**Or, the official WhatsApp Business Cloud API (Meta).** Set
`WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` from a Meta developer app
instead of the CallMeBot key. Messages then come from your business number.
Meta only delivers free-form messages to a number that has messaged the
business number in the last 24 hours, so CallMeBot is the simpler start.

Test it by sending a message from the site's **Questions?** button.

**Backup inbox.** If WhatsApp isn't set up yet, or a message can't be sent,
the chat box and the forms save the message in Netlify Forms instead, so
nothing is lost. To switch this on (once):

1. In Netlify, open **Forms** and click **Enable form detection**, then
   redeploy (**Deploys → Trigger deploy**).
2. A form called **messages** appears. Open **Forms → Form notifications →
   Add notification → Email notification** and enter your email address.

Every backup message then arrives by email and is listed under **Forms**.

To try it locally: `WHATSAPP_NUMBER=… CALLMEBOT_API_KEY=… npm run serve`.

## 3. Optional: family accounts (sign up with email)

Without this step, parents can already track progress **on their own device**:
they add a child on the Progress page, choose who's playing on a game page, and
see a time chart and a play diary of which games were played on which days.
Nothing is sent to a server, and no sign-up is needed. The **Sign up free**
button explains that accounts are opening soon.

To let parents sign up with email and see progress on any device, follow
`docs/ACCOUNTS.md` to create a free Supabase project, then add two more
Netlify environment variables and redeploy:

| Variable | What to put |
| --- | --- |
| `LL_SUPABASE_URL` | The Supabase project URL. |
| `LL_SUPABASE_ANON_KEY` | The project's public "anon" key. |

The sign-up, log-in and password reset pages then switch on by themselves.

## 4. Before you share the link

- Fill in the privacy policy placeholders (`src/pages/other.mjs`) and have it reviewed.
- Add a real contact email in `src/config.mjs` if you want one shown.
