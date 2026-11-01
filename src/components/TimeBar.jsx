import { useEffect, useRef, useState } from 'react'
import { phases } from '../content/metrics.js'
import { track } from '../lib/track.js'
import { useTime } from '../lib/time.jsx'
import { usePrefersReducedMotion } from '../hooks/useTween.js'

// "TeachOS time": a bar at the bottom of the screen that moves every TeachOS number on the page between three
// real dates. It fades away as the reader scrolls past the hero, and comes back on the way up.
export default function TimeBar() {
  const { phase, set, go, use, used, last } = useTime()
  const reduce = usePrefersReducedMotion()
  const dock = useRef(null)
  const trackEl = useRef(null)
  const drag = useRef({ on: false, moved: false, x: 0, i: phase })
  const [dragPos, setDragPos] = useState(null)
  const [off, setOff] = useState(false)

  const pos = dragPos === null ? phase / last : dragPos
  const fromX = (x) => {
    const r = trackEl.current.getBoundingClientRect()
    return Math.max(0, Math.min(1, (x - r.left) / r.width))
  }

  const down = (e) => {
    if (e.target.closest('.px-stop-l')) return
    const p = fromX(e.clientX)
    const i = Math.round(p * last)
    drag.current = { on: true, moved: false, x: e.clientX, i }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragPos(p)
    set(i)
  }
  const move = (e) => {
    const d = drag.current
    if (!d.on) return
    if (Math.abs(e.clientX - d.x) > 6) d.moved = true
    const p = fromX(e.clientX)
    d.i = Math.round(p * last)
    setDragPos(p)
    set(d.i)
  }
  const up = () => {
    const d = drag.current
    if (!d.on) return
    d.on = false
    setDragPos(null)
    use(d.moved ? 'drag' : 'track', d.i)
  }
  const keys = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { go(Math.max(0, phase - 1), 'key'); e.preventDefault() }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { go(Math.min(last, phase + 1), 'key'); e.preventDefault() }
  }

  // Fade with the scroll: opacity, a little drift, a little blur. Stays until the before-and-after panel ends, then fades.
  useEffect(() => {
    const el = dock.current
    let raf = 0
    let wasOff = false
    const run = () => {
      raf = 0
      // Stay fully visible while the before-and-after panel is on screen. Start fading when its bottom edge
      // rises into the lower part of the screen, and be gone shortly after it has passed.
      const vh = window.innerHeight
      const panel = document.querySelector('.panel')
      let t
      if (panel) {
        const bottom = panel.getBoundingClientRect().bottom
        t = Math.max(0, Math.min(1, (vh * 0.78 - bottom) / (vh * 0.45)))
      } else {
        t = Math.max(0, Math.min(1, (window.scrollY - 30) / Math.max(300, Math.min(620, vh * 0.6))))
      }
      const e = t * t * (3 - 2 * t)
      el.style.setProperty('--do', (1 - e).toFixed(3))
      if (!reduce) {
        el.style.setProperty('--dy', `${(e * 26).toFixed(1)}px`)
        el.style.setProperty('--ds', (1 - e * 0.05).toFixed(3))
        el.style.setProperty('--db', `${(e * 6).toFixed(1)}px`)
      }
      const now = t >= 0.985
      if (now !== wasOff) { wasOff = now; setOff(now) }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduce])

  // Counts visits where the bar was actually on screen, so use can be compared with sight.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { track('section', 'tb-seen'); io.disconnect() } }, { threshold: 0.6 })
    io.observe(dock.current)
    return () => io.disconnect()
  }, [])

  const label = !used ? 'Click here' : phase === 0 ? 'Back to today' : phase === 1 ? 'Rewind more' : 'Rewind again'

  return (
    <div className={off ? 'px-dock off' : 'px-dock'} ref={dock} role="group" aria-label="TeachOS time" aria-hidden={off ? 'true' : undefined}>
      <button
        type="button"
        className={used ? 'px-rew' : 'px-rew hint'}
        aria-label={used ? label : 'Rewind TeachOS'}
        title={label}
        onClick={() => go(phase === 0 ? last : phase - 1, 'button')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 8v4l3 2" />
        </svg>
      </button>
      {!used && <span className="px-cap" aria-hidden="true">Tap a date, or drag, to see TeachOS then</span>}
      <div className="px-track-wrap">
        <div className="px-track" ref={trackEl} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <div className={dragPos === null ? 'px-fill snap' : 'px-fill'} style={{ width: `${pos * 100}%` }} />
          {phases.map((p, i) => <span key={p.id} className="px-stop" style={{ left: `${(i / last) * 100}%` }} />)}
          {phases.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={phase === i ? 'px-stop-l on' : 'px-stop-l'}
              style={{ left: `${(i / last) * 100}%` }}
              onClick={() => go(i, 'label')}
            >
              {p.label}
            </button>
          ))}
          <div
            className={`px-thumb${dragPos === null ? ' snap' : ''}${used ? '' : ' hint'}`}
            style={{ left: `${pos * 100}%` }}
            role="slider"
            tabIndex={0}
            aria-label="TeachOS period"
            aria-valuemin={0}
            aria-valuemax={last}
            aria-valuenow={phase}
            aria-valuetext={phases[phase].label}
            onKeyDown={keys}
          />
        </div>
      </div>
    </div>
  )
}
