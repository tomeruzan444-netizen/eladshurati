/**
 * Lead form handler.
 *
 * WordPress delivered every sidebar enquiry by email and stored nothing. This
 * reproduces that exactly, so a lead does not change hands differently after
 * the migration:
 *
 *   to      LEAD_TO      — eladshurati131@gmail.com on the live site
 *   cc      LEAD_CC      — webpress2022@gmail.com
 *   subject the live Rank Math subject line, unchanged
 *
 * Spam: reCAPTCHA guarded the old form. A honeypot plus a minimum fill time
 * turns away the volume bots without loading a third-party script on every
 * page. If real spam shows up, Cloudflare Turnstile drops in here — the DNS is
 * already on Cloudflare — without touching the markup.
 */

const TO = process.env.LEAD_TO || 'eladshurati131@gmail.com'
const CC = process.env.LEAD_CC || ''
const FROM = process.env.LEAD_FROM || 'טפסים מהאתר <onboarding@resend.dev>'
const SUBJECT = process.env.LEAD_SUBJECT || 'פנייה מהאתר- אלעד- יועץ ופיתוח עסקי'

// The two channels that work whether or not mail is wired up. Same values as
// `site` in scripts/lib/render.mjs — kept here as constants because this file
// is a serverless function and must not import the build.
const WHATSAPP = process.env.LEAD_WHATSAPP || 'https://wa.me/972527075029'
const PHONE = process.env.LEAD_PHONE || '052-707-5029'
const TEL = process.env.LEAD_TEL || 'tel:0527075029'

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max)

/** The enquiry as a WhatsApp message, so a failed send costs nothing. */
const waLink = (lead) => {
  const lines = [
    'היי, מילאתי טופס באתר והשליחה נכשלה. הפרטים:',
    ...[
      ['שם', lead.name],
      ['נייד', lead.phone],
      ['מייל', lead.email],
      ['הודעה', lead.message],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`),
    `עמוד: ${lead.page || '/'}`,
  ]
  return `${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`
}

/** The page shell both answers share, so they cannot drift apart. */
const shell = (title, inner) => `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(title)} | אלעד שורתי</title>
<style>
  :root{color-scheme:light dark}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:1.5rem;
    font:16px/1.7 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
    background:#f7f6fb;color:#1c1a2e}
  .card{max-width:30rem;width:100%;background:#fff;border-radius:1.25rem;padding:2rem;
    box-shadow:0 1.5rem 3rem rgba(28,26,46,.12)}
  h1{font-size:1.35rem;margin:0 0 .75rem}
  p{margin:0 0 1.25rem;color:#4a4663}
  a.btn{display:block;text-align:center;text-decoration:none;border-radius:999px;
    padding:.85rem 1.25rem;font-weight:700;margin-block-end:.65rem}
  .wa{background:#25d366;color:#08331a}
  .tel{background:#f1eff8;color:#30265c}
  .back{display:inline-block;margin-block-start:.5rem;color:#6b6688;font-size:.9rem}
  @media(prefers-color-scheme:dark){
    body{background:#15131f;color:#efedf7}.card{background:#1f1c2d;box-shadow:none}
    p{color:#b6b2c9}.tel{background:#2a2640;color:#efedf7}.back{color:#9a95b3}}
</style></head><body><div class="card">${inner}</div></body></html>`

/** Only ever treat the submitted page as a same-site path. */
const backTo = (p) => (/^\/(?!\/)/.test(p || '') ? p : '/')

/** Success, for the browser that posted the form without JavaScript. */
const ok = (req, res, lead) => {
  if (!String(req.headers?.accept || '').includes('text/html')) {
    return res.status(200).json({ ok: true })
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return res.status(200).send(
    shell(
      'ההודעה נשלחה',
      `<h1>תודה! ההודעה נשלחה.</h1><p>אחזור אליך בהקדם.</p>` +
        `<a class="back" href="${esc(backTo(lead.page))}">חזרה לעמוד</a>`
    )
  )
}

/**
 * Answer a failure.
 *
 * With JavaScript the browser never sees this page — site.js reads the JSON
 * and renders the same two links inline. Without JavaScript the browser
 * *navigates* to this response and renders whatever comes back, so returning
 * JSON would leave someone staring at `{"ok":false,"error":"not_configured"}`
 * on a white page with no way back. That is the worst outcome the form has:
 * the person filled it in, and the site answers in machine.
 */
const fail = (req, res, status, error, lead, headline) => {
  if (!String(req.headers?.accept || '').includes('text/html')) {
    return res.status(status).json({ ok: false, error })
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  return res.status(status).send(
    shell(
      headline,
      `<h1>${esc(headline)}</h1>` +
        `<p>הפרטים שמילאת לא נשלחו, אבל הם לא אבדו — הם כבר ממולאים בהודעה כאן למטה.</p>` +
        `<a class="btn wa" href="${esc(waLink(lead))}">שליחת הפרטים בוואטסאפ</a>` +
        `<a class="btn tel" href="${esc(TEL)}">חיוג ${esc(PHONE)}</a>` +
        `<a class="back" href="${esc(backTo(lead.page))}">חזרה לעמוד</a>`
    )
  )
}

export default async function handler(req, res) {
  // Health probe for the go-live sweep. Reports only whether delivery is
  // wired up — never the key itself. Without this the sweep cannot tell a
  // working endpoint from one that will drop every enquiry.
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, configured: Boolean(process.env.RESEND_API_KEY) })
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const body = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : req.body || {}

  // The build now posts canonical keys, but a page cached in someone's browser
  // still posts the Elementor ones it was built with. Note that the captured
  // field called `form_fields[email]` is the *phone* — type `tel`, labelled
  // נייד — and the email is `form_fields[field_1]`. Reading the obvious way
  // round would file every phone number as an address.
  const pick = (...keys) => {
    for (const k of keys) if (body[k] != null && String(body[k]).trim()) return body[k]
    return ''
  }

  const name = clean(pick('name', 'form_fields[name]'), 120)
  const phone = clean(pick('phone', 'form_fields[email]'), 40)
  const email = clean(pick('email', 'form_fields[field_1]'), 160)
  const message = clean(pick('message', 'form_fields[message]', 'form_fields[field_2]'), 4000)
  const page = clean(body.page, 300)

  // Honeypot: a field hidden from people. Anything in it came from a bot.
  if (clean(body.company)) return res.status(200).json({ ok: true })

  // Nobody fills three fields in under two seconds.
  const elapsed = Date.now() - Number(body.ts || 0)
  if (Number.isFinite(elapsed) && body.ts && elapsed < 2000) {
    return res.status(200).json({ ok: true })
  }

  const lead = { name, phone, email, message, page }

  if (!name || !phone) return fail(req, res, 400, 'missing_required', lead, 'חסרים שם או טלפון')
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return fail(req, res, 400, 'bad_email', lead, 'כתובת המייל לא תקינה')
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    // Fail loudly rather than pretending the lead was sent. A silent success
    // here is exactly how enquiries disappear without anyone noticing.
    // The whole enquiry goes to the log, not just the contact fields — while
    // the key is missing this line is the only copy that exists.
    console.error('lead: RESEND_API_KEY is not set — enquiry NOT delivered', lead)
    return fail(req, res, 503, 'not_configured', lead, 'השליחה נכשלה')
  }

  const rows = [
    ['שם מלא', name],
    ['טלפון', phone],
    ['מייל', email],
    ['הודעה', message],
    ['נשלח מהעמוד', page],
  ].filter(([, v]) => v)

  const html =
    `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7">` +
    `<h2 style="margin:0 0 12px">פנייה חדשה מהאתר</h2><table cellpadding="6" style="border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="border:1px solid #ddd;background:#f5f4f8"><b>${esc(k)}</b></td>` +
          `<td style="border:1px solid #ddd">${esc(v).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('') +
    `</table></div>`

  const payload = {
    from: FROM,
    to: [TO],
    subject: SUBJECT,
    html,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
  }
  // Reply hits the enquirer, not the site, so the mail client does the obvious thing.
  if (email) payload.reply_to = email
  if (CC) payload.cc = CC.split(',').map((s) => s.trim()).filter(Boolean)

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!r.ok) {
      const detail = await r.text().catch(() => '')
      // 403 here almost always means the `from` address is still on
      // resend.dev, which may only deliver to the Resend account's own
      // address. The detail string says which — keep it in the log.
      console.error('lead: delivery failed', r.status, detail, lead)
      return fail(req, res, 502, 'delivery_failed', lead, 'השליחה נכשלה')
    }
    return ok(req, res, lead)
  } catch (err) {
    console.error('lead: delivery threw', err, lead)
    return fail(req, res, 502, 'delivery_failed', lead, 'השליחה נכשלה')
  }
}
