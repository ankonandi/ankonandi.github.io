import { useEffect, useMemo, useState } from 'react'
import { firebase, authKit, OWNER } from '../lib/firebase.js'
import { openResume } from '../lib/resume.js'
import { metricRows, phases } from '../content/metrics.js'
import { profile } from '../content/profile.js'
import '../styles/admin.css'

const CTA = [
  ['call', 'Call'],
  ['email', 'Email'],
  ['resume', 'Resume download'],
  ['linkedin', 'LinkedIn'],
  ['github', 'GitHub'],
  ['live-mvp', 'AdCraft live MVP'],
  ['open-case-study', 'Opened the case study'],
]
const SECTION_NAMES = {
  work: 'Selected work', how: 'How I work', background: 'Background', contact: 'Contact',
  teachos: 'Case study: six problems', 'manager-connect': 'Case study: Manager Connect',
  docs: 'Case study: documents', cut: 'Case study: what I cut',
}
const day = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : '0%')

function count(list, key) {
  const m = new Map()
  list.forEach((x) => m.set(key(x), (m.get(key(x)) || 0) + 1))
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

function summarize(events, days) {
  const bySession = new Map()
  events.forEach((e) => {
    if (!bySession.has(e.sid)) bySession.set(e.sid, [])
    bySession.get(e.sid).push(e)
  })
  const sessions = [...bySession.values()]
  const first = sessions.map((s) => s.reduce((a, b) => (a.ts < b.ts ? a : b)))
  const clicks = events.filter((e) => e.type === 'click')
  const hasClick = (s, labels) => s.some((e) => e.type === 'click' && labels.includes(e.label))
  const reachedSection = (s, id) => s.some((e) => e.type === 'section' && e.label === id)
  const today = new Date()
  const series = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
    series.push({ key: day(d), visits: 0, views: 0 })
  }
  const idx = new Map(series.map((r, i) => [r.key, i]))
  first.forEach((e) => { const i = idx.get(day(e.ts)); if (i !== undefined) series[i].visits++ })
  events.filter((e) => e.type === 'pageview').forEach((e) => { const i = idx.get(day(e.ts)); if (i !== undefined) series[i].views++ })
  return {
    sessions: sessions.length,
    views: events.filter((e) => e.type === 'pageview').length,
    contacted: sessions.filter((s) => hasClick(s, ['call', 'email', 'resume'])).length,
    openedCase: sessions.filter((s) => s.some((e) => e.type === 'pageview' && e.path.startsWith('/teachos'))).length,
    reachedContact: sessions.filter((s) => reachedSection(s, 'contact')).length,
    series,
    pages: count(events.filter((e) => e.type === 'pageview'), (e) => e.path).slice(0, 8),
    sources: count(first, (e) => e.ref || 'direct').slice(0, 10),
    devices: count(first, (e) => e.dev || 'unknown'),
    clicks: CTA.map(([k, name]) => [name, clicks.filter((e) => e.label === k).length, sessions.filter((s) => hasClick(s, [k])).length]),
    sections: Object.entries(SECTION_NAMES).map(([id, name]) => [name, sessions.filter((s) => reachedSection(s, id)).length]),
    phases: count(events.filter((e) => e.type === 'phase'), (e) => e.label),
  }
}

function Bars({ rows, total }) {
  const max = Math.max(1, ...rows.map((r) => r[1]))
  return (
    <ul className="adm-bars">
      {rows.length === 0 && <li className="adm-empty">No data yet</li>}
      {rows.map(([name, n]) => (
        <li key={name}>
          <span className="adm-bar-name">{name}</span>
          <span className="adm-bar-track"><i style={{ width: `${(n / max) * 100}%` }} /></span>
          <span className="adm-bar-n">{n}{total ? ` · ${pct(n, total)}` : ''}</span>
        </li>
      ))}
    </ul>
  )
}

function Analytics() {
  const [days, setDays] = useState(30)
  const [events, setEvents] = useState(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    let stop = false
    setEvents(null)
    ;(async () => {
      try {
        const { db, fs } = await firebase()
        const since = new Date(Date.now() - days * 86400000)
        const snap = await fs.getDocs(fs.query(fs.collection(db, 'events'), fs.where('ts', '>=', since), fs.orderBy('ts', 'desc'), fs.limit(5000)))
        if (stop) return
        setEvents(snap.docs.map((d) => ({ ...d.data(), ts: d.data().ts && d.data().ts.toDate ? d.data().ts.toDate() : new Date(0) })))
      } catch (e) { if (!stop) setErr(e.message || 'Could not load events') }
    })()
    return () => { stop = true }
  }, [days])
  const s = useMemo(() => (events ? summarize(events, days) : null), [events, days])
  if (err) return <p className="adm-error">{err}</p>
  if (!s) return <p className="adm-muted">Loading events…</p>
  const maxVisits = Math.max(1, ...s.series.map((r) => r.visits))
  return (
    <>
      <div className="adm-range" role="group" aria-label="Date range">
        {[7, 30, 90].map((n) => (
          <button key={n} type="button" aria-pressed={days === n} onClick={() => setDays(n)}>Last {n} days</button>
        ))}
      </div>
      {events.length >= 5000 && <p className="adm-muted">Showing the latest 5,000 events. Older ones in this range are not counted.</p>}
      <dl className="adm-kpis">
        <div><dt>Visits</dt><dd>{s.sessions}</dd></div>
        <div><dt>Page views</dt><dd>{s.views}</dd></div>
        <div><dt>Opened the case study</dt><dd>{s.openedCase} <small>{pct(s.openedCase, s.sessions)}</small></dd></div>
        <div><dt>Reached Contact</dt><dd>{s.reachedContact} <small>{pct(s.reachedContact, s.sessions)}</small></dd></div>
        <div><dt>Called, emailed or downloaded the resume</dt><dd>{s.contacted} <small>{pct(s.contacted, s.sessions)}</small></dd></div>
      </dl>

      <h3>Visits per day</h3>
      <ul className="adm-days">
        {s.series.map((r) => (
          <li key={r.key} title={`${r.key}: ${r.visits} visits, ${r.views} page views`}>
            <i style={{ height: `${(r.visits / maxVisits) * 100}%` }} />
          </li>
        ))}
      </ul>
      <p className="adm-muted adm-days-note">Oldest on the left. Today on the right. Hover a bar for the date.</p>

      <div className="adm-grid">
        <section><h3>Where visitors came from</h3><Bars rows={s.sources} total={s.sessions} />
          <p className="adm-muted">Share links as <code>?src=linkedin</code> or <code>?src=recruiter-name</code> to see exactly which message worked.</p></section>
        <section><h3>Devices</h3><Bars rows={s.devices} total={s.sessions} /></section>
        <section><h3>Pages</h3><Bars rows={s.pages} /></section>
        <section><h3>Sections reached</h3><Bars rows={s.sections} total={s.sessions} /></section>
        <section>
          <h3>Calls to action</h3>
          <table className="adm-table"><thead><tr><th>Action</th><th>Clicks</th><th>Visits</th></tr></thead>
            <tbody>{s.clicks.map(([n, c, v]) => <tr key={n}><td>{n}</td><td>{c}</td><td>{v}</td></tr>)}</tbody></table>
        </section>
        <section><h3>Hero panel phases opened</h3><Bars rows={s.phases} />
          <p className="adm-muted">Counts clicks on At the start, Oct–Nov 2025 and Today.</p></section>
      </div>
      <p className="adm-muted">A visit is one browser session. A returning person on another day counts again, because there is no cookie or ID that follows them.</p>
    </>
  )
}

function MetricsEditor() {
  const [vals, setVals] = useState(() => Object.fromEntries(metricRows.map((r) => [r.label, r.vals.map(String)])))
  const [status, setStatus] = useState('')
  useEffect(() => {
    ;(async () => {
      try {
        const { db, fs } = await firebase()
        const snap = await fs.getDoc(fs.doc(db, 'config', 'metrics'))
        if (snap.exists()) {
          const saved = snap.data().rows || {}
          setVals((v) => ({ ...v, ...Object.fromEntries(Object.entries(saved).map(([k, a]) => [k, a.map(String)])) }))
        }
      } catch { /* keep defaults */ }
    })()
  }, [])
  const parse = (s) => (s.trim() !== '' && !Number.isNaN(Number(s)) ? Number(s) : s.trim())
  const save = async () => {
    setStatus('Saving…')
    try {
      const { db, fs } = await firebase()
      const rows = Object.fromEntries(metricRows.map((r) => [r.label, vals[r.label].map(parse)]))
      await fs.setDoc(fs.doc(db, 'config', 'metrics'), { rows, updated: fs.serverTimestamp() })
      setStatus('Saved. The live hero panel uses these numbers now.')
    } catch (e) { setStatus(`Could not save: ${e.message}`) }
  }
  const reset = async () => {
    setStatus('Resetting…')
    try {
      const { db, fs } = await firebase()
      await fs.deleteDoc(fs.doc(db, 'config', 'metrics'))
      setVals(Object.fromEntries(metricRows.map((r) => [r.label, r.vals.map(String)])))
      setStatus('Reset. The hero panel uses the numbers shipped with the site.')
    } catch (e) { setStatus(`Could not reset: ${e.message}`) }
  }
  return (
    <>
      <p className="adm-muted">Edit the hero panel without a redeploy. Type a number to show it as a figure, or words (like "Did not exist") to show text. Percent rows round to whole numbers, and rows with a plus (600+, 26,000+, 1,000+) round the same way they do on the site.</p>
      <div className="adm-metrics">
        <div className="adm-mhead"><span>Row</span>{phases.map((p) => <span key={p.id}>{p.label}</span>)}</div>
        {metricRows.map((r) => (
          <div className="adm-mrow" key={r.label}>
            <span>{r.label}<small>{r.fmt === 'pct' ? 'percent' : r.step ? `rounds to the nearest ${r.step.toLocaleString('en-IN')}, then adds +` : 'count'}</small></span>
            {[0, 1, 2].map((i) => (
              <input key={i} aria-label={`${r.label}, ${phases[i].label}`} value={vals[r.label][i]}
                onChange={(e) => setVals((v) => ({ ...v, [r.label]: v[r.label].map((x, j) => (j === i ? e.target.value : x)) }))} />
            ))}
          </div>
        ))}
      </div>
      <div className="adm-actions">
        <button type="button" className="btn" onClick={save}>Save to the live site</button>
        <button type="button" className="btn ghost" onClick={reset}>Reset to shipped numbers</button>
      </div>
      {status && <p className="adm-status" role="status">{status}</p>}
    </>
  )
}

function ResumeAdmin() {
  const [info, setInfo] = useState(null)
  const [status, setStatus] = useState('')
  const load = async () => {
    try {
      const { db, fs } = await firebase()
      const snap = await fs.getDoc(fs.doc(db, 'files', 'resume'))
      setInfo(snap.exists() ? snap.data() : false)
    } catch { setInfo(false) }
  }
  useEffect(() => { load() }, [])
  const upload = async (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.type !== 'application/pdf') { setStatus('Choose a PDF file.'); return }
    if (f.size > 600 * 1024) { setStatus('That PDF is over 600 KB. Compress it and try again.'); return }
    setStatus('Uploading…')
    try {
      const bytes = new Uint8Array(await f.arrayBuffer())
      let bin = ''
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
      const { db, fs } = await firebase()
      await fs.setDoc(fs.doc(db, 'files', 'resume'), { b64: btoa(bin), name: f.name, size: f.size, updated: fs.serverTimestamp() })
      setStatus('Uploaded. Download resume on the live site now gives this file.')
      load()
    } catch (err) { setStatus(`Could not upload: ${err.message}`) }
  }
  const remove = async () => {
    try {
      const { db, fs } = await firebase()
      await fs.deleteDoc(fs.doc(db, 'files', 'resume'))
      setStatus('Removed. The site now serves the PDF that ships with it.')
      load()
    } catch (err) { setStatus(`Could not remove: ${err.message}`) }
  }
  return (
    <>
      <p className="adm-muted">Upload a PDF up to 600 KB. Visitors get this file from Download resume. If none is uploaded, or Firebase is unreachable, they get the PDF that ships with the site.</p>
      <p className="adm-current">
        {info === null && 'Checking…'}
        {info === false && 'No uploaded resume. The shipped file is in use.'}
        {info && `Live: ${info.name} (${Math.round(info.size / 1024)} KB)`}
      </p>
      <div className="adm-actions">
        <label className="btn">Choose a PDF<input type="file" accept="application/pdf" onChange={upload} hidden /></label>
        <button type="button" className="btn ghost" onClick={() => openResume(profile.resumeUrl, profile.resumeFileName)}>Download what visitors get</button>
        {info && <button type="button" className="btn ghost" onClick={remove}>Remove the upload</button>}
      </div>
      {status && <p className="adm-status" role="status">{status}</p>}
    </>
  )
}

function AccessAdmin({ me }) {
  const [list, setList] = useState(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const load = async () => {
    try {
      const { db, fs } = await firebase()
      const snap = await fs.getDocs(fs.collection(db, 'admins'))
      setList(snap.docs.map((d) => d.id).sort())
    } catch (e) { setStatus(`Could not load: ${e.message}`) }
  }
  useEffect(() => { load() }, [])
  const isOwner = me === OWNER
  const add = async () => {
    const v = email.trim().toLowerCase()
    if (!/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(v)) { setStatus('Enter a full email address.'); return }
    try {
      const { db, fs } = await firebase()
      await fs.setDoc(fs.doc(db, 'admins', v), { email: v, addedBy: me, added: fs.serverTimestamp() })
      setEmail(''); setStatus(`${v} can now sign in to /admin.`); load()
    } catch (e) { setStatus(`Could not add: ${e.message}`) }
  }
  const remove = async (v) => {
    try {
      const { db, fs } = await firebase()
      await fs.deleteDoc(fs.doc(db, 'admins', v))
      setStatus(`${v} no longer has access.`); load()
    } catch (e) { setStatus(`Could not remove: ${e.message}`) }
  }
  return (
    <>
      <p className="adm-muted">Only these Google accounts can open /admin: the owner below, and anyone added here. Everyone else is blocked, both on this page and in the database itself.</p>
      <p className="adm-current">Owner: {OWNER}</p>
      <ul className="adm-people">
        {list === null && <li className="adm-muted">Loading…</li>}
        {list && list.length === 0 && <li className="adm-muted">No other admins yet.</li>}
        {list && list.map((v) => (
          <li key={v}><span>{v}</span>{isOwner && <button type="button" className="btn ghost" onClick={() => remove(v)}>Remove</button>}</li>
        ))}
      </ul>
      {isOwner ? (
        <div className="adm-actions">
          <input className="adm-input" type="email" placeholder="name@gmail.com" aria-label="Email to add" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="button" className="btn" onClick={add}>Give access</button>
        </div>
      ) : (
        <p className="adm-muted">Only the owner can add or remove people.</p>
      )}
      {status && <p className="adm-status" role="status">{status}</p>}
    </>
  )
}

export default function Admin() {
  const [user, setUser] = useState(undefined)
  const [tab, setTab] = useState('analytics')
  const [kit, setKit] = useState(null)
  const [msg, setMsg] = useState('')
  const [access, setAccess] = useState('checking')

  useEffect(() => {
    document.title = 'Admin'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    try { localStorage.setItem('noTrack', '1') } catch { /* ignore */ }
    let off
    authKit().then((k) => { setKit(k); off = k.a.onAuthStateChanged(k.auth, setUser) }).catch(() => setUser(null))
    return () => { robots.remove(); if (off) off() }
  }, [])

  const signIn = async () => {
    setMsg('')
    try { await kit.a.signInWithPopup(kit.auth, new kit.a.GoogleAuthProvider()) } catch (e) { setMsg(e.code === 'auth/unauthorized-domain' ? 'This site address is not authorized in Firebase yet.' : (e.message || 'Sign-in failed')) }
  }
  // Ask the database whether this account is an admin. Only admins are allowed to read the admins list.
  useEffect(() => {
    if (!user) { setAccess('checking'); return undefined }
    let stop = false
    ;(async () => {
      try {
        const { db, fs } = await firebase()
        await fs.getDocs(fs.query(fs.collection(db, 'admins'), fs.limit(1)))
        if (!stop) setAccess('yes')
      } catch { if (!stop) setAccess('no') }
    })()
    return () => { stop = true }
  }, [user])
  const allowed = user && user.emailVerified && access === 'yes'

  return (
    <div className="adm">
      <header className="adm-top">
        <h1>Admin</h1>
        {user && <button type="button" className="btn ghost" onClick={() => kit.a.signOut(kit.auth)}>Sign out</button>}
      </header>
      {user === undefined && <p className="adm-muted">Loading…</p>}
      {user === null && (
        <div className="adm-gate">
          <p>Sign in with your Google account to continue.</p>
          <button type="button" className="btn" onClick={signIn} disabled={!kit}>Sign in with Google</button>
          {msg && <p className="adm-error">{msg}</p>}
        </div>
      )}
      {user && access === 'checking' && <p className="adm-muted">Checking access…</p>}
      {user && access === 'no' && <p className="adm-error">{user.email} does not have access. Sign out and use an account the owner has added.</p>}
      {allowed && (
        <>
          <nav className="adm-tabs" aria-label="Admin sections">
            {[['analytics', 'Analytics'], ['metrics', 'Hero metrics'], ['resume', 'Resume'], ['access', 'Access']].map(([id, label]) => (
              <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>
            ))}
          </nav>
          {tab === 'analytics' && <Analytics />}
          {tab === 'metrics' && <MetricsEditor />}
          {tab === 'resume' && <ResumeAdmin />}
          {tab === 'access' && <AccessAdmin me={user.email} />}
        </>
      )}
    </div>
  )
}
