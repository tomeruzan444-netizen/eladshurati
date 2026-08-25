/**
 * Step 7 — Mobile stability check.
 *
 * "The screen must not slide sideways." Chrome on Windows refuses to open a
 * window narrower than ~500px, so a phone viewport is faked with an iframe of
 * the real width; media queries and layout resolve against the iframe.
 *
 * For each page/width it disables the body's overflow-x safety net and asks
 * whether the document *actually* overflows — a page that only looks fine
 * because of `overflow-x: hidden` still pans on iOS Safari, which is exactly
 * the bug this guards against. It also confirms the page scrolls vertically
 * and the header stays pinned.
 *
 * Needs a local Chrome. Set CHROME=<path> to override; skips if none is found.
 */
import { writeFile, rm, access } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'

const run = promisify(execFile)
const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'site')
const BASE = process.env.PREVIEW || 'http://localhost:4321'

const PAGES = ['/', '/פיתוח-עסקי/', '/צרו-קשר/', '/רווח-תפעולי/', '/category/בלוג-עסקי-מקצועי/']
const WIDTHS = [320, 360, 390, 430]

const CHROME_CANDIDATES = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

async function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    try {
      await access(c)
      return c
    } catch {
      /* keep looking */
    }
  }
  return null
}

const harness = `<!doctype html><html><head><meta charset="utf-8"><title>probe</title>
<style>body{margin:0}iframe{border:0;display:block}</style></head><body>
<iframe id="f" width="390" height="900"></iframe>
<script>
const PAGES=${JSON.stringify(PAGES.map(encodeURI))};
const WIDTHS=${JSON.stringify(WIDTHS)};
const f=document.getElementById('f'),out=[];
function check(url,w){return new Promise(res=>{
  f.width=w;
  f.onload=()=>setTimeout(()=>{
    const d=f.contentDocument,win=f.contentWindow;
    const s=d.createElement('style');
    // drop the safety net and stop smooth-scroll (it never animates headlessly)
    s.textContent='html,body{overflow-x:visible!important}html{scroll-behavior:auto!important}';
    d.head.appendChild(s);
    const cw=d.documentElement.clientWidth;
    const x0=d.body.getBoundingClientRect().left,x1=x0+cw;
    const sw=Math.max(d.documentElement.scrollWidth,d.body.scrollWidth);
    const bad=[];
    d.querySelectorAll('body *').forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.width===0&&r.height===0)return;
      if([...el.children].some(c=>{const cr=c.getBoundingClientRect();
        return cr.right>x1+1||cr.left<x0-1;}))return;
      if(r.right>x1+1||r.left<x0-1){
        let p=el.parentElement,clipped=false;
        while(p&&p!==d.body){const ov=win.getComputedStyle(p).overflowX;
          if(ov==='hidden'||ov==='clip'||ov==='auto'||ov==='scroll'){clipped=true;break;}
          p=p.parentElement;}
        if(clipped)return;
        bad.push((el.tagName.toLowerCase()+(el.className?'.'+el.className.toString().trim().split(/\\s+/).join('.'):'')).slice(0,44)
          +' ['+Math.round(r.left-x0)+'…'+Math.round(r.right-x0)+']');
      }});
    // vertical scroll + pinned header
    const h=d.querySelector('.header');
    d.scrollingElement.scrollTop=1200;
    const scrolled=Math.round(d.scrollingElement.scrollTop);
    const headerTop=h?Math.round(h.getBoundingClientRect().top):null;
    d.scrollingElement.scrollTop=0;
    res({p:decodeURIComponent(url),w,over:sw-cw,bad:bad.slice(0,6),scrolled,headerTop});
  },650);
  f.src=url;
});}
(async()=>{for(const p of PAGES)for(const w of WIDTHS)out.push(await check(p,w));
document.title='DONE '+JSON.stringify(out);})();
</script></body></html>`

const main = async () => {
  const chrome = await findChrome()
  if (!chrome) {
    console.log('no Chrome found — skipping mobile check (set CHROME=<path> to enable)')
    return
  }

  const probe = path.join(OUT, '_mobile-probe.html')
  await writeFile(probe, harness, 'utf8')
  try {
    const { stdout } = await run(
      chrome,
      ['--headless=new', '--disable-gpu', '--window-size=1400,1100', '--virtual-time-budget=60000',
       '--dump-dom', `${BASE}/_mobile-probe.html`],
      { maxBuffer: 64 * 1024 * 1024 }
    )
    const m = stdout.match(/<title>DONE (.*?)<\/title>/s)
    if (!m) {
      console.log('probe did not report — is the preview server running? (npm run serve)')
      process.exitCode = 1
      return
    }
    const results = JSON.parse(m[1])
    let failures = 0
    for (const r of results) {
      const problems = []
      if (r.over > 0) problems.push(`overflows ${r.over}px`)
      if (r.bad.length) problems.push(...r.bad)
      if (r.scrolled < 1000) problems.push(`page did not scroll (scrollTop=${r.scrolled})`)
      if (r.headerTop !== 0) problems.push(`header not pinned (top=${r.headerTop})`)
      if (problems.length) {
        failures++
        console.log(`FAIL ${r.p} @${r.w}px`)
        for (const p of problems) console.log('       ' + p)
      }
    }
    console.log(
      failures
        ? `\n${failures} of ${results.length} page/width combinations have a problem`
        : `no horizontal overflow, page scrolls, header pinned — ${results.length} page/width combinations`
    )
    if (failures) process.exitCode = 1
  } finally {
    await rm(probe, { force: true })
  }
}

main()
