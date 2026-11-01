import { lazy, Suspense, useEffect, useState } from 'react'
import { firebase, authKit, OWNER } from '../lib/firebase.js'
import { MetricsEditor, ResumeAdmin, AccessAdmin, PasswordAdmin } from '../admin/tabs.jsx'
import '../styles/admin.css'

const Dashboard = lazy(() => import('../admin/Dashboard.jsx'))

const NAV = [
  ['analytics', 'Analytics', 'M4 19V9m6 10V5m6 14v-7m4 7H2'],
  ['metrics', 'Hero metrics', 'M4 6h16M4 12h10M4 18h6'],
  ['resume', 'Resume', 'M7 3h7l5 5v13H7zM14 3v5h5'],
  ['access', 'Access', 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'],
  ['password', 'Password', 'M6 11V8a6 6 0 0112 0v3M5 11h14v10H5z'],
]

function Icon({ d }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
}

export default function Admin() {
  const [user, setUser] = useState(undefined)
  const [tab, setTab] = useState('analytics')
  const [kit, setKit] = useState(null)
  const [msg, setMsg] = useState('')
  const [access, setAccess] = useState('checking')
  const [mail, setMail] = useState('')
  const [pass, setPass] = useState('')

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

  // Ask the database whether this account is an admin. Only admins may read the admins list.
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

  const signIn = async () => {
    setMsg('')
    try { await kit.a.signInWithPopup(kit.auth, new kit.a.GoogleAuthProvider()) } catch (e) {
      setMsg(e.code === 'auth/unauthorized-domain' ? 'This site address is not authorized in Firebase yet.' : e.code === 'auth/popup-closed-by-user' ? '' : (e.message || 'Sign-in failed'))
    }
  }
  const signInPassword = async (e) => {
    e.preventDefault()
    setMsg('')
    try { await kit.a.signInWithEmailAndPassword(kit.auth, mail.trim(), pass) } catch (err) {
      setMsg(['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(err.code)
        ? 'Wrong email or password. If you have not set a password yet, sign in with Google and set one under Password.'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Wait a few minutes and try again.'
        : err.code === 'auth/operation-not-allowed' ? 'Password sign-in is not switched on in Firebase.'
        : (err.message || 'Sign-in failed'))
    }
  }
  const forgot = async () => {
    if (!mail.trim()) { setMsg('Type your email first, then choose Forgot password.'); return }
    try { await kit.a.sendPasswordResetEmail(kit.auth, mail.trim()) } catch { /* same message either way */ }
    setMsg('If that email has an account, a reset link is on its way.')
  }
  const signOut = () => kit.a.signOut(kit.auth)
  const allowed = user && user.emailVerified && access === 'yes'

  if (!allowed) {
    return (
      <main className="gate">
        <div className="gate-card">
          <p className="gate-mark" aria-hidden="true">AN</p>
          <h1>Portfolio admin</h1>
          {user === undefined && <p className="muted">Loading…</p>}
          {user === null && (
            <>
              <button type="button" className="btn wide" onClick={signIn} disabled={!kit}>Continue with Google</button>
              <p className="or"><span>or use email</span></p>
              <form onSubmit={signInPassword} className="stack-form">
                <input className="input" type="email" autoComplete="username" placeholder="Email" aria-label="Email" value={mail} onChange={(e) => setMail(e.target.value)} />
                <input className="input" type="password" autoComplete="current-password" placeholder="Password" aria-label="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
                <button type="submit" className="btn ghost wide" disabled={!kit}>Sign in</button>
                <button type="button" className="link" onClick={forgot}>Forgot password</button>
              </form>
              {msg && <p className="status bad" role="alert">{msg}</p>}
            </>
          )}
          {user && access === 'checking' && user.emailVerified && <p className="muted">Checking access…</p>}
          {user && !user.emailVerified && <p className="status bad">{user.email} is not verified yet. Use Forgot password to verify it, or sign in with Google.</p>}
          {user && user.emailVerified && access === 'no' && <p className="status bad">{user.email} does not have access. Sign out and use an account the owner has added.</p>}
          {user && <button type="button" className="link" onClick={signOut}>Sign out</button>}
        </div>
      </main>
    )
  }

  return (
    <div className="a-shell">
      <aside className="side">
        <div className="brand"><span aria-hidden="true">AN</span><div><b>Portfolio admin</b><small>ankonandi.github.io</small></div></div>
        <nav aria-label="Admin sections">
          {NAV.map(([id, label, d]) => (
            <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => setTab(id)}><Icon d={d} /><span>{label}</span></button>
          ))}
        </nav>
        <div className="who">
          <small>{user.email === OWNER ? 'Owner' : 'Admin'}</small>
          <span title={user.email}>{user.email}</span>
          <button type="button" className="link" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="main">
        {tab === 'analytics' && (
          <>
            <header className="page-head top">
              <h1>Analytics</h1>
              <p>Who visits, where they come from, how far they read and whether they reach out. Anonymous: no cookies and no IP address.</p>
            </header>
            <Suspense fallback={<div className="skeleton"><i /><i /><i /><i /></div>}><Dashboard /></Suspense>
          </>
        )}
        {tab === 'metrics' && <MetricsEditor />}
        {tab === 'resume' && <ResumeAdmin />}
        {tab === 'access' && <AccessAdmin me={user.email} />}
        {tab === 'password' && <PasswordAdmin kit={kit} />}
      </main>
    </div>
  )
}
