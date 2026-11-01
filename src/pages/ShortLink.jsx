import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// A clean link such as /r/priya-acme/email/product-roles-nov/short-intro.
// Parts, in order: who it is for, type of message, campaign, version. Use - to skip a part.
// It stores the tags for this visit and moves on to the home page, so the address a visitor ends up on
// has no tracking text in it.
const clean = (v) => {
  const t = String(v || '').trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
  return t === '-' ? '' : t
}

export default function ShortLink() {
  const { '*': rest } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    const [src, med, cmp, cnt] = String(rest || '').split('/').map(clean)
    const camp = { src: src || '', med: med || '', cmp: cmp || '', cnt: cnt || '' }
    try { sessionStorage.setItem('camp', JSON.stringify(camp)) } catch { /* ignore */ }
    navigate('/', { replace: true })
  }, [rest, navigate])
  return null
}
