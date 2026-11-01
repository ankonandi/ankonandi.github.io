import { useEffect, useRef, useState } from 'react'
import { firebase, OWNER } from '../lib/firebase.js'
import { openResume } from '../lib/resume.js'
import { formatMetric } from '../lib/formatMetric.js'
import { metricRows, phases } from '../content/metrics.js'
import { profile } from '../content/profile.js'
import { fmtDateTime } from './range.js'

const parse = (s) => (s.trim() !== '' && !Number.isNaN(Number(s)) ? Number(s) : s.trim())
const shown = (row, raw) => {
  const v = parse(raw)
  return typeof v === 'number' ? formatMetric(row, v) : v || 'Empty'
}

export function MetricsEditor() {
  const base = () => Object.fromEntries(metricRows.map((r) => [r.label, r.vals.map(String)]))
  const [vals, setVals] = useState(base)
  const [saved, setSaved] = useState(null)
  const [status, setStatus] = useState({ kind: '', text: '' })
  useEffect(() => {
    ;(async () => {
      try {
        const { db, fs } = await firebase()
        const snap = await fs.getDoc(fs.doc(db, 'config', 'metrics'))
        if (snap.exists()) {
          const rows = snap.data().rows || {}
          setSaved(true)
          setVals((v) => ({ ...v, ...Object.fromEntries(Object.entries(rows).map(([k, a]) => [k, a.map(String)])) }))
        } else setSaved(false)
      } catch { setSaved(false) }
    })()
  }, [])
  const save = async () => {
    setStatus({ kind: '', text: 'Saving…' })
    try {
      const { db, fs } = await firebase()
      const rows = Object.fromEntries(metricRows.map((r) => [r.label, vals[r.label].map(parse)]))
      await fs.setDoc(fs.doc(db, 'config', 'metrics'), { rows, updated: fs.serverTimestamp() })
      setSaved(true)
      setStatus({ kind: 'ok', text: 'Saved. The live hero panel uses these numbers now.' })
    } catch (e) { setStatus({ kind: 'bad', text: `Could not save: ${e.message}` }) }
  }
  const reset = async () => {
    setStatus({ kind: '', text: 'Resetting…' })
    try {
      const { db, fs } = await firebase()
      await fs.deleteDoc(fs.doc(db, 'config', 'metrics'))
      setVals(base()); setSaved(false)
      setStatus({ kind: 'ok', text: 'Reset. The hero panel uses the numbers shipped with the site.' })
    } catch (e) { setStatus({ kind: 'bad', text: `Could not reset: ${e.message}` }) }
  }
  return (
    <div className="page">
      <header className="page-head">
        <h2>Hero metrics</h2>
        <p>Change the numbers in the hero panel without a redeploy. Type a number to show a figure, or words such as <code>Did not exist</code> to show text. Under each box you see exactly how it reads on the site.</p>
        <p className="badge-line"><span className={`badge ${saved ? 'on' : ''}`}>{saved === null ? 'Checking…' : saved ? 'Live site uses your saved numbers' : 'Live site uses the numbers shipped with it'}</span></p>
      </header>
      <div className="mtable">
        <div className="mhead"><span>Row</span>{phases.map((p) => <span key={p.id}>{p.label}</span>)}</div>
        {metricRows.map((r) => (
          <div className="mrow" key={r.label}>
            <div className="mlabel">
              <b>{r.label}</b>
              <small>{r.fmt === 'pct' ? 'Percent, rounded to a whole number' : r.step ? `Rounded to the nearest ${r.step.toLocaleString('en-IN')} with a plus` : 'Count'}</small>
            </div>
            {[0, 1, 2].map((i) => (
              <label className="mcell" key={i}>
                <span className="sr">{r.label}, {phases[i].label}</span>
                <input value={vals[r.label][i]} onChange={(e) => setVals((v) => ({ ...v, [r.label]: v[r.label].map((x, j) => (j === i ? e.target.value : x)) }))} />
                <em>{shown(r, vals[r.label][i])}</em>
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className="actions">
        <button type="button" className="btn" onClick={save}>Save to the live site</button>
        <button type="button" className="btn ghost" onClick={reset}>Reset to shipped numbers</button>
      </div>
      {status.text && <p className={`status ${status.kind}`} role="status">{status.text}</p>}
    </div>
  )
}

export function ResumeAdmin() {
  const [info, setInfo] = useState(undefined)
  const [src, setSrc] = useState('')
  const [status, setStatus] = useState({ kind: '', text: '' })
  const blob = useRef('')
  const load = async () => {
    try {
      const { db, fs } = await firebase()
      const snap = await fs.getDoc(fs.doc(db, 'files', 'resume'))
      if (blob.current) URL.revokeObjectURL(blob.current)
      if (snap.exists() && snap.data().b64) {
        const d = snap.data()
        const bytes = Uint8Array.from(atob(d.b64), (c) => c.charCodeAt(0))
        blob.current = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
        setSrc(blob.current)
        setInfo(d)
      } else {
        blob.current = ''
        setSrc(profile.resumeUrl)
        setInfo(null)
      }
    } catch {
      setSrc(profile.resumeUrl)
      setInfo(null)
    }
  }
  useEffect(() => { load(); return () => { if (blob.current) URL.revokeObjectURL(blob.current) } }, [])
  const upload = async (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    if (f.type !== 'application/pdf') { setStatus({ kind: 'bad', text: 'Choose a PDF file.' }); return }
    if (f.size > 600 * 1024) { setStatus({ kind: 'bad', text: 'That PDF is over 600 KB. Compress it and try again.' }); return }
    setStatus({ kind: '', text: 'Uploading…' })
    try {
      const bytes = new Uint8Array(await f.arrayBuffer())
      let bin = ''
      for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
      const { db, fs } = await firebase()
      await fs.setDoc(fs.doc(db, 'files', 'resume'), { b64: btoa(bin), name: f.name, size: f.size, updated: fs.serverTimestamp() })
      setStatus({ kind: 'ok', text: 'Uploaded. Download resume on the live site now gives this file.' })
      load()
    } catch (err) { setStatus({ kind: 'bad', text: `Could not upload: ${err.message}` }) }
  }
  const remove = async () => {
    try {
      const { db, fs } = await firebase()
      await fs.deleteDoc(fs.doc(db, 'files', 'resume'))
      setStatus({ kind: 'ok', text: 'Removed. The site now serves the PDF that ships with it.' })
      load()
    } catch (err) { setStatus({ kind: 'bad', text: `Could not remove: ${err.message}` }) }
  }
  const updated = info && info.updated && info.updated.toDate ? fmtDateTime(info.updated.toDate()) : ''
  return (
    <div className="page">
      <header className="page-head">
        <h2>Resume</h2>
        <p>This is the file visitors get when they choose Download resume. Upload a PDF up to 600 KB to replace it. If Firebase is unreachable, visitors still get the PDF that ships with the site.</p>
        <p className="badge-line">
          {info === undefined && <span className="badge">Checking…</span>}
          {info === null && <span className="badge">Showing the file shipped with the site</span>}
          {info && <span className="badge on">Showing your upload: {info.name} · {Math.round(info.size / 1024)} KB{updated ? ` · ${updated}` : ''}</span>}
        </p>
      </header>
      <div className="actions">
        <label className="btn">Upload a new PDF<input type="file" accept="application/pdf" onChange={upload} hidden /></label>
        {src && <a className="btn ghost" href={src} target="_blank" rel="noopener noreferrer">Open in a new tab</a>}
        <button type="button" className="btn ghost" onClick={() => openResume(profile.resumeUrl, profile.resumeFileName)}>Download as a visitor</button>
        {info && <button type="button" className="btn ghost" onClick={remove}>Remove the upload</button>}
      </div>
      {status.text && <p className={`status ${status.kind}`} role="status">{status.text}</p>}
      <div className="pdf-frame">
        {src ? <iframe title="The resume visitors currently get" src={`${src}#view=FitH`} /> : <p className="empty">Loading the preview…</p>}
      </div>
    </div>
  )
}

export function AccessAdmin({ me }) {
  const [list, setList] = useState(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ kind: '', text: '' })
  const load = async () => {
    try {
      const { db, fs } = await firebase()
      const snap = await fs.getDocs(fs.collection(db, 'admins'))
      setList(snap.docs.map((d) => d.id).sort())
    } catch (e) { setStatus({ kind: 'bad', text: `Could not load: ${e.message}` }) }
  }
  useEffect(() => { load() }, [])
  const isOwner = me === OWNER
  const add = async (e) => {
    e.preventDefault()
    const v = email.trim().toLowerCase()
    if (!/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(v)) { setStatus({ kind: 'bad', text: 'Enter a full email address.' }); return }
    try {
      const { db, fs } = await firebase()
      await fs.setDoc(fs.doc(db, 'admins', v), { email: v, addedBy: me, added: fs.serverTimestamp() })
      setEmail(''); setStatus({ kind: 'ok', text: `${v} can now sign in to /admin.` }); load()
    } catch (err) { setStatus({ kind: 'bad', text: `Could not add: ${err.message}` }) }
  }
  const remove = async (v) => {
    try {
      const { db, fs } = await firebase()
      await fs.deleteDoc(fs.doc(db, 'admins', v))
      setStatus({ kind: 'ok', text: `${v} no longer has access.` }); load()
    } catch (err) { setStatus({ kind: 'bad', text: `Could not remove: ${err.message}` }) }
  }
  return (
    <div className="page">
      <header className="page-head">
        <h2>Access</h2>
        <p>Only these accounts can open /admin: the owner, and anyone added here. Everyone else is blocked on this page and in the database itself.</p>
      </header>
      <ul className="people">
        <li><span>{OWNER}</span><em>Owner</em></li>
        {list === null && <li className="muted">Loading…</li>}
        {list && list.length === 0 && <li className="muted">No other admins yet.</li>}
        {list && list.map((v) => (
          <li key={v}><span>{v}</span>{isOwner && <button type="button" className="btn ghost small" onClick={() => remove(v)}>Remove</button>}</li>
        ))}
      </ul>
      {isOwner ? (
        <form className="actions" onSubmit={add}>
          <input className="input" type="email" placeholder="name@gmail.com" aria-label="Email to add" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn">Give access</button>
        </form>
      ) : <p className="muted">Only the owner can add or remove people.</p>}
      {status.text && <p className={`status ${status.kind}`} role="status">{status.text}</p>}
    </div>
  )
}

export function PasswordAdmin({ kit }) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [status, setStatus] = useState({ kind: '', text: '' })
  const save = async (e) => {
    e.preventDefault()
    if (pw.length < 10) { setStatus({ kind: 'bad', text: 'Use at least 10 characters.' }); return }
    if (pw !== pw2) { setStatus({ kind: 'bad', text: 'The two passwords do not match.' }); return }
    try {
      await kit.a.updatePassword(kit.auth.currentUser, pw)
      setPw(''); setPw2('')
      setStatus({ kind: 'ok', text: 'Saved. You can now sign in with this email and password, or still use Google.' })
    } catch (err) {
      setStatus({ kind: 'bad', text: err.code === 'auth/requires-recent-login' ? 'For safety, sign out, sign in again with Google, and then set the password right away.' : `Could not save: ${err.message}` })
    }
  }
  return (
    <div className="page">
      <header className="page-head">
        <h2>Password</h2>
        <p>Set a password for {kit.auth.currentUser && kit.auth.currentUser.email} to sign in with email instead of Google. Anyone you add under Access sets their own the same way after their first Google sign-in.</p>
      </header>
      <form onSubmit={save} className="stack-form">
        <input className="input" type="email" autoComplete="username" value={kit.auth.currentUser ? kit.auth.currentUser.email : ''} readOnly aria-label="Email" />
        <input className="input" type="password" autoComplete="new-password" placeholder="New password" aria-label="New password" value={pw} onChange={(e) => setPw(e.target.value)} />
        <input className="input" type="password" autoComplete="new-password" placeholder="Repeat the password" aria-label="Repeat the password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
        <div className="actions"><button type="submit" className="btn">Save password</button></div>
      </form>
      {status.text && <p className={`status ${status.kind}`} role="status">{status.text}</p>}
    </div>
  )
}

const MEDIUMS = [
  ['message', 'Direct message (LinkedIn, WhatsApp)'],
  ['email', 'Email'],
  ['social', 'Social post'],
  ['resume', 'Resume or PDF'],
  ['referral', 'Referral from a person'],
  ['qr', 'QR code or print'],
]
const slug = (v) => v.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

export function LinkBuilder() {
  const [f, setF] = useState({ src: '', med: 'message', cmp: '', cnt: '', page: '/' })
  const [copied, setCopied] = useState('')
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }))
  const ok = slug(f.src).length > 0
  const url = (() => {
    const u = new URL(f.page || '/', 'https://ankonandi.github.io')
    if (ok) u.searchParams.set('utm_source', slug(f.src))
    if (ok && f.med) u.searchParams.set('utm_medium', f.med)
    if (ok && slug(f.cmp)) u.searchParams.set('utm_campaign', slug(f.cmp))
    if (ok && slug(f.cnt)) u.searchParams.set('utm_content', slug(f.cnt))
    return u.toString()
  })()
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied('Copied. Paste it into your message.') } catch { setCopied('Select the link and copy it by hand.') }
  }
  return (
    <div className="page">
      <header className="page-head">
        <h2>Campaign links</h2>
        <p>Build a tagged link for each message you send. When someone opens it, Analytics shows exactly where they came from, with no cookies. These are standard UTM tags, so they work the same way as on any other site.</p>
      </header>
      <div className="lb">
        <label>Who or where is it going to
          <input className="input" value={f.src} onChange={set('src')} placeholder="For example linkedin, or priya-acme" />
          <small>{ok ? `Saved as: ${slug(f.src)}` : 'Required. Use a name you will recognize later.'}</small>
        </label>
        <label>Type of message
          <select className="input" value={f.med} onChange={set('med')}>{MEDIUMS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        </label>
        <label>Campaign
          <input className="input" value={f.cmp} onChange={set('cmp')} placeholder="For example product-roles-nov" />
          <small>Optional. Groups several links into one effort, such as a month of applications.</small>
        </label>
        <label>Version
          <input className="input" value={f.cnt} onChange={set('cnt')} placeholder="For example short-intro" />
          <small>Optional. Use it to compare two wordings of the same message.</small>
        </label>
        <label>Land them on
          <select className="input" value={f.page} onChange={set('page')}>
            <option value="/">Home page</option>
            <option value="/teachos">TeachOS case study</option>
          </select>
        </label>
      </div>
      <div className="lb-out">
        <p className="lb-label">Your link</p>
        <code className="lb-url" aria-live="polite">{ok ? url : 'Fill in who or where it is going to'}</code>
        <div className="actions"><button type="button" className="btn" onClick={copy} disabled={!ok}>Copy link</button>{ok && <a className="btn ghost" href={url} target="_blank" rel="noopener noreferrer">Test it</a>}</div>
        {copied && <p className="status ok" role="status">{copied}</p>}
        <p className="muted">Testing it from this browser will not count, because opening admin switches tracking off here. Open it on your phone to see it appear.</p>
      </div>
    </div>
  )
}
