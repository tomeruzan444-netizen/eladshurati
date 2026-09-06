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

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const clean = (v, max = 500) => String(v ?? '').trim().slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  const body = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : req.body || {}

  const name = clean(body.name, 120)
  const phone = clean(body.phone, 40)
  const email = clean(body.email, 160)
  const message = clean(body.message, 4000)
  const page = clean(body.page, 300)

  // Honeypot: a field hidden from people. Anything in it came from a bot.
  if (clean(body.company)) return res.status(200).json({ ok: true })

  // Nobody fills three fields in under two seconds.
  const elapsed = Date.now() - Number(body.ts || 0)
  if (Number.isFinite(elapsed) && body.ts && elapsed < 2000) {
    return res.status(200).json({ ok: true })
  }

  if (!name || !phone) return res.status(400).json({ ok: false, error: 'missing_required' })
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'bad_email' })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    // Fail loudly rather than pretending the lead was sent. A silent success
    // here is exactly how enquiries disappear without anyone noticing.
    console.error('lead: RESEND_API_KEY is not set — enquiry NOT delivered', { name, phone, email })
    return res.status(503).json({ ok: false, error: 'not_configured' })
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
      console.error('lead: delivery failed', r.status, detail, { name, phone, email })
      return res.status(502).json({ ok: false, error: 'delivery_failed' })
    }
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('lead: delivery threw', err, { name, phone, email })
    return res.status(502).json({ ok: false, error: 'delivery_failed' })
  }
}
