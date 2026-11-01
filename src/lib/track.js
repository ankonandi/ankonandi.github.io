import { firebase } from './firebase.js'

// First-party, cookie-free analytics. Each visit is one Firestore document that is updated as the
// person scrolls and reads. Stored: a random visit id (sessionStorage), a random visitor id
// (localStorage, to tell new from returning), pages, sections, clicks, scroll depth, active seconds,
// browser, OS, language, time zone, screen size, referrer host and page speed.
// Never stored: IP address, name, email, or anything typed by the visitor.
// Skipped on localhost, when the browser sends Do Not Track, and in any browser where /admin was opened.

const S = {
  ready: false,
  created: false,
  entry: '',
  newPaths: new Set(),
  newSections: new Set(),
  newPhases: new Set(),
  clickD: {},
  pvD: 0,
  errD: 0,
  sd: {},
  sdDirty: {},
  act: 0,
  actSent: 0,
  lcp: 0,
  sentLcp: 0,
  cls: 0,
  sentCls: 0,
  ld: 0,
  sentLd: 0,
  timer: null,
  lastFlush: 0,
  flushing: false,
  lastInteract: Date.now(),
  raf: 0,
  err: '',
  camp: null,
}

// Why tracking is off, in words. Used by the ?trackcheck=1 panel.
function offReason() {
  try {
    if (['localhost', '127.0.0.1'].includes(location.hostname)) return 'this is localhost'
    if (navigator.doNotTrack === '1') return 'the browser sends Do Not Track'
    if (localStorage.getItem('noTrack') === '1') return 'this browser has opened /admin, so it is excluded'
  } catch { return 'browser storage is blocked' }
  return ''
}

// Add ?trackcheck=1 to any page address to see whether this browser is counted and if a save worked.
export function showTrackCheck() {
  if (document.getElementById('trackcheck')) return
  const el = document.createElement('div')
  el.id = 'trackcheck'
  el.setAttribute('role', 'status')
  el.style.cssText = 'position:fixed;left:12px;right:12px;bottom:76px;z-index:99999;background:#0F1B3D;color:#fff;font:14px/1.45 system-ui,sans-serif;padding:12px 14px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.35)'
  document.body.appendChild(el)
  const draw = () => {
    const why = offReason()
    const lines = [
      why ? `Tracking is OFF: ${why}.` : 'Tracking is ON for this browser.',
      !why && (S.created ? 'This visit has been saved.' : S.err ? `Saving failed: ${S.err}` : 'Waiting to save (takes about 4 seconds after you scroll or click).'),
    ].filter(Boolean)
    el.textContent = lines.join(' ')
  }
  draw(); setInterval(draw, 1000)
}

function disabled() {
  try {
    return (
      ['localhost', '127.0.0.1'].includes(location.hostname) ||
      navigator.doNotTrack === '1' ||
      localStorage.getItem('noTrack') === '1'
    )
  } catch {
    return false
  }
}

function rand() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function ids() {
  let sid
  let vid
  let nw = true
  try {
    sid = sessionStorage.getItem('sid')
    if (!sid) { sid = rand(); sessionStorage.setItem('sid', sid) }
    vid = localStorage.getItem('vid')
    if (vid) nw = false
    else { vid = rand(); localStorage.setItem('vid', vid) }
    S.created = sessionStorage.getItem('sidMade') === '1'
  } catch {
    sid = sid || rand()
    vid = vid || rand()
  }
  return { sid, vid, nw }
}

// Where the visit came from. Read once, early, from either a tagged address (?utm_source=...) or a
// short link (/r/name/medium/campaign/version, which stores the tags in sessionStorage and redirects).
// The tags are then removed from the address bar, so visitors never see them.
const TAGS = ['utm_source', 'src', 'utm_medium', 'med', 'utm_campaign', 'cmp', 'utm_content', 'cnt']
const clean = (v) => String(v || '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

export function captureCampaign() {
  try {
    if (S.camp) return
    const q = new URLSearchParams(location.search)
    const fromUrl = {
      src: clean(q.get('utm_source') || q.get('src')),
      med: clean(q.get('utm_medium') || q.get('med')),
      cmp: clean(q.get('utm_campaign') || q.get('cmp')),
      cnt: clean(q.get('utm_content') || q.get('cnt')),
    }
    let saved = {}
    try { saved = JSON.parse(sessionStorage.getItem('camp') || '{}') } catch { /* ignore */ }
    const camp = fromUrl.src || fromUrl.med || fromUrl.cmp || fromUrl.cnt ? fromUrl : saved
    S.camp = camp
    if (camp.src || camp.med || camp.cmp || camp.cnt) {
      try { sessionStorage.setItem('camp', JSON.stringify(camp)) } catch { /* ignore */ }
    }
    if (TAGS.some((k) => q.has(k))) {
      TAGS.forEach((k) => q.delete(k))
      const rest = q.toString()
      history.replaceState(history.state, '', location.pathname + (rest ? `?${rest}` : '') + location.hash)
    }
  } catch { /* ignore */ }
}

function source() {
  try {
    if (S.camp && S.camp.src) return S.camp.src
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '')
      if (host && host !== location.hostname) return host.slice(0, 60)
    }
  } catch { /* ignore */ }
  return 'direct'
}

// utm_medium, utm_campaign and utm_content ride along with the source.
function campaign() {
  const out = {}
  const c = S.camp || {}
  if (c.med) out.med = c.med
  if (c.cmp) out.cmp = c.cmp
  if (c.cnt) out.cnt = c.cnt
  return out
}

function browser() {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return 'Edge'
  if (/OPR\/|Opera/.test(ua)) return 'Opera'
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet'
  if (/Firefox\//.test(ua)) return 'Firefox'
  if (/Chrome\/|CriOS/.test(ua)) return 'Chrome'
  if (/Safari\//.test(ua)) return 'Safari'
  return 'Other'
}

function os() {
  const ua = navigator.userAgent
  if (/Windows/.test(ua)) return 'Windows'
  if (/Android/.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
  if (/Mac OS X|Macintosh/.test(ua)) return 'macOS'
  if (/CrOS/.test(ua)) return 'ChromeOS'
  if (/Linux/.test(ua)) return 'Linux'
  return 'Other'
}

function device() {
  const w = window.innerWidth
  return w < 720 ? 'phone' : w < 1100 ? 'tablet' : 'desktop'
}

function pathKey() {
  const p = location.pathname
  if (p === '/' || p === '') return 'home'
  if (p === '/teachos') return 'teachos'
  return p.replace(/[^a-z0-9]/gi, '').slice(0, 20) || 'other'
}

function schedule(ms) {
  if (S.timer) return
  S.timer = setTimeout(flush, ms)
}

async function flush() {
  clearTimeout(S.timer)
  S.timer = null
  if (S.flushing) { schedule(1500); return }
  const clicks = S.clickD
  const sdDirty = S.sdDirty
  const pv = S.pvD
  const errs = S.errD
  const paths = [...S.newPaths]
  const sections = [...S.newSections]
  const phases = [...S.newPhases]
  const act = S.act
  const lcp = S.lcp
  const cls = Math.round(S.cls * 1000) / 1000
  const ld = S.ld
  const changed =
    pv || errs || paths.length || sections.length || phases.length ||
    Object.keys(clicks).length || Object.keys(sdDirty).length ||
    act !== S.actSent || (lcp && lcp !== S.sentLcp) || (ld && ld !== S.sentLd) || (cls !== S.sentCls)
  if (!changed || !S.entry) return
  S.flushing = true
  S.clickD = {}; S.sdDirty = {}; S.pvD = 0; S.errD = 0
  S.newPaths = new Set(); S.newSections = new Set(); S.newPhases = new Set()
  try {
    const { db, fs } = await firebase()
    const patch = { last: fs.serverTimestamp() }
    if (!S.created) {
      const { vid, nw } = S.ids
      Object.assign(patch, {
        vid, start: fs.serverTimestamp(), entry: S.entry, ref: source(), dev: device(), br: browser(), os: os(),
        lang: (navigator.language || '').slice(0, 16), tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 40),
        w: window.innerWidth, h: window.innerHeight, nw, ...campaign(),
      })
    }
    if (pv) patch.pv = fs.increment(pv)
    if (errs) patch.err = fs.increment(errs)
    if (paths.length) patch.paths = fs.arrayUnion(...paths)
    if (sections.length) patch.sections = fs.arrayUnion(...sections)
    if (phases.length) patch.phases = fs.arrayUnion(...phases)
    if (Object.keys(clicks).length) patch.clicks = Object.fromEntries(Object.entries(clicks).map(([k, v]) => [k, fs.increment(v)]))
    if (Object.keys(sdDirty).length) patch.sd = sdDirty
    if (act !== S.actSent) patch.act = act
    if (lcp && lcp !== S.sentLcp) patch.lcp = lcp
    if (ld && ld !== S.sentLd) patch.ld = ld
    if (cls !== S.sentCls) patch.cls = cls
    await fs.setDoc(fs.doc(db, 'sessions', S.ids.sid), patch, { merge: true })
    S.err = ''
    S.lastFlush = Date.now()
    S.actSent = act
    if (lcp) S.sentLcp = lcp
    if (ld) S.sentLd = ld
    S.sentCls = cls
    if (!S.created) {
      S.created = true
      try { sessionStorage.setItem('sidMade', '1') } catch { /* ignore */ }
    }
  } catch (e) {
    S.err = (e && (e.code || e.message)) || 'unknown error'
    // Put the pending changes back so the next flush retries them.
    for (const [k, v] of Object.entries(clicks)) S.clickD[k] = (S.clickD[k] || 0) + v
    for (const [k, v] of Object.entries(sdDirty)) S.sdDirty[k] = Math.max(S.sdDirty[k] || 0, v)
    S.pvD += pv; S.errD += errs
    paths.forEach((x) => S.newPaths.add(x)); sections.forEach((x) => S.newSections.add(x)); phases.forEach((x) => S.newPhases.add(x))
  } finally {
    S.flushing = false
  }
}

function onScroll() {
  if (S.raf) return
  S.raf = requestAnimationFrame(() => {
    S.raf = 0
    const el = document.documentElement
    const total = el.scrollHeight
    if (!total) return
    const pct = Math.min(100, ((window.scrollY + window.innerHeight) / total) * 100)
    const level = pct >= 97 ? 100 : Math.floor(pct / 10) * 10
    const key = pathKey()
    if (level > (S.sd[key] || 0)) {
      S.sd[key] = level
      S.sdDirty[key] = level
      schedule(4000)
    }
  })
}

function init() {
  S.ready = true
  S.ids = ids()
  const touch = () => { S.lastInteract = Date.now() }
  ;['pointerdown', 'keydown', 'touchstart', 'mousemove', 'scroll'].forEach((t) => window.addEventListener(t, touch, { passive: true }))
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush() })
  window.addEventListener('pagehide', () => flush())
  window.addEventListener('error', () => { S.errD = Math.min(S.errD + 1, 50); schedule(4000) })
  setInterval(() => {
    if (document.visibilityState === 'visible' && Date.now() - S.lastInteract < 15000) {
      S.act += 1
      if (S.act - S.actSent >= 20 && Date.now() - S.lastFlush > 18000) schedule(0)
    }
  }, 1000)
  try {
    new PerformanceObserver((l) => { const e = l.getEntries(); S.lcp = Math.round(e[e.length - 1].startTime / 100) * 100 }).observe({ type: 'largest-contentful-paint', buffered: true })
  } catch { /* not supported */ }
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) S.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
  } catch { /* not supported */ }
  const loaded = () => {
    try {
      const nav = performance.getEntriesByType('navigation')[0]
      if (nav && nav.loadEventEnd) S.ld = Math.round(nav.loadEventEnd / 100) * 100
    } catch { /* ignore */ }
  }
  if (document.readyState === 'complete') loaded()
  else window.addEventListener('load', () => setTimeout(loaded, 0))
}

export function track(type, label) {
  if (disabled()) return
  if (!S.ready) init()
  if (type === 'pageview') {
    S.pvD += 1
    S.newPaths.add(location.pathname.slice(0, 80))
    if (!S.entry) S.entry = location.pathname.slice(0, 80)
    setTimeout(onScroll, 700)
  } else if (type === 'section') {
    S.newSections.add(String(label).slice(0, 30))
  } else if (type === 'click') {
    const k = String(label).slice(0, 24)
    S.clickD[k] = (S.clickD[k] || 0) + 1
  } else if (type === 'phase') {
    S.newPhases.add(String(label).slice(0, 16))
  }
  schedule(type === 'click' ? 1500 : 4000)
}
