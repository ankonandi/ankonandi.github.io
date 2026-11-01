import { useEffect, useState } from 'react'
import { supabase, adminEnabled } from '../lib/supabase.js'
import { resumeBucket, resumeObject } from '../lib/config.js'
import { profile } from '../content/profile.js'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.title = 'Admin | Ankon Nandi'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    if (!supabase) { setReady(true); return undefined }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <div className="wrap admin">
      <h1>Admin</h1>
      {!ready && <p>Loading…</p>}
      {ready && !adminEnabled && <p>Admin is not set up yet. Add the Supabase URL and key in <code>src/lib/config.js</code>.</p>}
      {ready && adminEnabled && !session && <SignIn />}
      {ready && adminEnabled && session && <Upload email={session.user.email} />}
    </div>
  )
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError('Sign in failed. Check the email and password.')
    setBusy(false)
  }

  return (
    <form className="admin-card" onSubmit={submit}>
      <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
      <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  )
}

function Upload({ email }) {
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const upload = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    if (!file) return
    if (file.type !== 'application/pdf') { setError('Choose a PDF file.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('The file is over 5 MB. Compress it and try again.'); return }
    setBusy(true)
    const { error: err } = await supabase.storage.from(resumeBucket).upload(resumeObject, file, {
      upsert: true, contentType: 'application/pdf', cacheControl: '60',
    })
    setBusy(false)
    if (err) setError(`Upload failed: ${err.message}`)
    else setMsg('Resume uploaded. The Download resume button now serves this file.')
  }

  return (
    <div className="admin-card">
      <p>Signed in as {email}.</p>
      <form onSubmit={upload}>
        <label>New resume (PDF, up to 5 MB)
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0] || null)} />
        </label>
        <button className="btn" type="submit" disabled={busy || !file}>{busy ? 'Uploading…' : 'Upload resume'}</button>
      </form>
      {msg && <p role="status">{msg}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}
      <p><a href={profile.resumeUrl}>Check the current download</a></p>
      <button className="btn ghost" type="button" onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  )
}
