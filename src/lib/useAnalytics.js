import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { track, showTrackCheck, captureCampaign } from './track.js'

const SECTIONS = ['work', 'how', 'background', 'contact', 'teachos', 'manager-connect', 'docs', 'cut']

function classify(a) {
  if (a.dataset.track) return a.dataset.track
  const h = a.getAttribute('href') || ''
  if (h.startsWith('tel:')) return 'call'
  if (h.startsWith('mailto:')) return 'email'
  if (/linkedin\.com/.test(h)) return 'linkedin'
  if (/github\.com/.test(h)) return 'github'
  if (/lovable\.app/.test(h)) return 'live-mvp'
  if (h.startsWith('http')) return 'external'
  if (h === '/teachos') return 'open-case-study'
  return null
}

export function useAnalytics() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/r/')) return
    captureCampaign()
    if (/[?&]trackcheck=1/.test(location.search)) showTrackCheck()
    track('pageview')
  }, [pathname])

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a')
      if (!a) return
      const label = classify(a)
      if (label) track('click', label)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/admin') || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            track('section', en.target.id)
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.35 },
    )
    const t = setTimeout(() => {
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id)
        if (el) io.observe(el)
      })
    }, 500)
    return () => { clearTimeout(t); io.disconnect() }
  }, [pathname])
}
