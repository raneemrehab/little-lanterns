// Sends help-centre chat messages and enquiry forms to the owner's WhatsApp.
//
// The phone number is never in the website's code or in this repository.
// It is read from environment variables set in the host's dashboard
// (Netlify: Site configuration > Environment variables):
//
//   WHATSAPP_NUMBER            the number that receives messages, with
//                              country code and no spaces or +, e.g. 919876543210
//
// and one of these two ways of sending:
//
//   CALLMEBOT_API_KEY          CallMeBot (free, for messages to your own number).
//                              Get a key by messaging the CallMeBot WhatsApp
//                              number once: see docs/HELP-CHAT.md.
//
//   WHATSAPP_TOKEN +           The official WhatsApp Business Cloud API from Meta.
//   WHATSAPP_PHONE_NUMBER_ID   Messages arrive from your business number.
//
// Visitors only ever see "message sent". They never see the number.

const LIMITS = { name: 80, contact: 120, email: 120, organisation: 120, role: 80, topic: 80, page: 200, message: 2000 };

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

async function readFields(req) {
  const type = req.headers.get('content-type') || '';
  if (type.includes('application/json')) return (await req.json()) || {};
  const form = await req.formData();
  return Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string'));
}

function clean(value, max) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').trim().slice(0, max);
}

function compose(f) {
  const lines = [`Learning Lanterns · ${f.topic || 'Help centre chat'}`];
  if (f.name) lines.push(`From: ${f.name}`);
  const reply = f.contact || f.email;
  if (reply) lines.push(`Reply to: ${reply}`);
  if (f.organisation) lines.push(`Organisation: ${f.organisation}`);
  if (f.role) lines.push(`Role: ${f.role}`);
  if (f.page) lines.push(`Page: ${f.page}`);
  if (f.message) lines.push('', f.message);
  return lines.join('\n');
}

async function sendCallMeBot(to, text, apikey) {
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url);
  const body = await res.text();
  // CallMeBot answers 200 with an error message in the page when a key is wrong.
  if (!res.ok || /error|invalid|not (been )?activated/i.test(body)) throw new Error(`CallMeBot: ${res.status} ${body.slice(0, 200)}`);
}

async function sendCloudApi(to, text, token, phoneNumberId) {
  const res = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(phoneNumberId)}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { preview_url: false, body: text } }),
  });
  if (!res.ok) throw new Error(`WhatsApp Cloud API: ${res.status} ${(await res.text()).slice(0, 300)}`);
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'method' });

  let raw;
  try {
    raw = await readFields(req);
  } catch {
    return json(400, { ok: false, error: 'bad-request' });
  }
  // Bots fill in the hidden field. Pretend it worked and send nothing.
  if (raw._gotcha) return json(200, { ok: true });

  const f = {};
  for (const [key, max] of Object.entries(LIMITS)) f[key] = clean(raw[key], max);
  if (!f.message && !f.email && !f.contact) return json(400, { ok: false, error: 'empty' });

  const to = (process.env.WHATSAPP_NUMBER || '').replace(/\D/g, '');
  const { CALLMEBOT_API_KEY, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
  if (!to || !(CALLMEBOT_API_KEY || (WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID))) {
    return json(503, { ok: false, error: 'not-configured' });
  }

  try {
    const text = compose(f);
    if (WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID) await sendCloudApi(to, text, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID);
    else await sendCallMeBot(to, text, CALLMEBOT_API_KEY);
  } catch (err) {
    console.error(err.message);
    return json(502, { ok: false, error: 'send-failed' });
  }
  return json(200, { ok: true });
};

export const config = { path: '/api/message' };
