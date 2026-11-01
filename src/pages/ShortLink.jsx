import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { firebase } from '../lib/firebase.js'

// Short numbered links: /r/12 opens the home page and /t/12 opens the TeachOS case study.
// The number is looked up in the saved list (made in /admin, Campaign links). The tags for this visit are
// kept for analytics and the visitor lands on a clean address.
// Older links such as /r/priya-acme/email still work: their parts are read straight from the address.
const clean = (v) => {
  const t = String(v || '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
  return t === '-' ? '' : t
}

export default function ShortLink({ to = '/' }) {
  const { '*': rest } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    let stop = false
    const parts = String(rest || '').split('/').filter((x) => x !== '')
    const save = (camp) => { try { sessionStorage.setItem('camp', JSON.stringify(camp)) } catch { /* ignore */ } }
    const go = () => { if (!stop) navigate(to, { replace: true }) }
    const legacy = () => {
      const [src, med, cmp, cnt] = parts.map(clean)
      save({ src: src || '', med: med || '', cmp: cmp || '', cnt: cnt || '' })
      go()
    }
    ;(async () => {
      if (parts.length === 1 && /^[0-9]{1,6}$/.test(parts[0])) {
        try {
          const { db, fs } = await firebase()
          const snap = await Promise.race([
            fs.getDoc(fs.doc(db, 'config', 'links')),
            new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 4000)),
          ])
          const t = snap.exists() ? snap.data().items?.[parts[0]] : null
          if (t) { save({ src: t.src || '', med: t.med || '', cmp: t.cmp || '', cnt: t.cnt || '' }); go(); return }
        } catch { /* fall through */ }
      }
      legacy()
    })()
    return () => { stop = true }
  }, [rest, to, navigate])
  return null
}
