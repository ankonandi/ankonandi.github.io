import { useEffect, useRef, useState } from 'react'

// Animates an array of numbers toward a target. A null entry means "no number", and is shown as text.
// Jumps straight to the target when motion is reduced.
export function useTween(target, reduce, ms = 700) {
  const [vals, setVals] = useState(target)
  const cur = useRef(target)
  useEffect(() => {
    if (reduce) { cur.current = target; setVals(target); return undefined }
    const from = cur.current.slice()
    let raf = 0
    let t0 = null
    const step = (t) => {
      if (t0 === null) t0 = t
      const p = Math.min(1, (t - t0) / ms)
      const e = 1 - Math.pow(1 - p, 3)
      const next = target.map((to, i) => {
        if (to === null) return null
        if (from[i] === null || from[i] === undefined) return to
        return from[i] + (to - from[i]) * e
      })
      cur.current = next
      setVals(next)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, reduce, ms])
  return vals
}

export function usePrefersReducedMotion() {
  const [reduce] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  return reduce
}
