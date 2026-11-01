import { firebase } from './firebase.js'

// First-party, cookie-free analytics. Stores a random per-visit id (sessionStorage), the page,
// an event name, the referrer's host and a device class. No IP address, no name, no cookie.
// Skipped on localhost, when the browser sends Do Not Track, and in a browser where /admin was opened.

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

function sessionId() {
  try {
    let s = sessionStorage.getItem('sid')
    if (!s) {
      s = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
      sessionStorage.setItem('sid', s)
    }
    return s
  } catch {
    return 'x' + Math.random().toString(36).slice(2, 8)
  }
}

function source() {
  try {
    const q = new URLSearchParams(location.search)
    const tagged = q.get('src') || q.get('utm_source')
    if (tagged) return tagged.slice(0, 40)
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '')
      if (host && host !== location.hostname) return host.slice(0, 60)
    }
  } catch { /* ignore */ }
  return 'direct'
}

function device() {
  const w = window.innerWidth
  return w < 720 ? 'phone' : w < 1100 ? 'tablet' : 'desktop'
}

const seen = new Set()

export function track(type, label) {
  if (disabled()) return
  if (type === 'section') {
    if (seen.has(label)) return
    seen.add(label)
  }
  firebase()
    .then(({ db, fs }) =>
      fs.addDoc(fs.collection(db, 'events'), {
        sid: sessionId(),
        type,
        path: location.pathname.slice(0, 80),
        ...(label ? { label: String(label).slice(0, 60) } : {}),
        ref: source(),
        dev: device(),
        w: window.innerWidth,
        ts: fs.serverTimestamp(),
      }),
    )
    .catch(() => {})
}
