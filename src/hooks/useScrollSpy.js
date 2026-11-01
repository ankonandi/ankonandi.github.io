import { useEffect, useState } from 'react'

// Returns the id of the section the reader is in. A section counts once its top has passed 40% of the
// screen height. At the very bottom of the page the last section always wins, because a short last
// section (Contact) can never reach 40% on its own.
export function useScrollSpy(ids, deps = []) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      const doc = document.documentElement
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 4
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      if (atBottom && window.scrollY > 0) current = ids[ids.length - 1]
      setActive(current)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Content above can change height after load (fonts, the lazy hero panel), so measure again shortly.
    const t = setTimeout(measure, 600)
    return () => {
      clearTimeout(t)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return active
}
