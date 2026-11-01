import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { phases } from '../content/metrics.js'
import { track } from './track.js'

// The period the page is showing: at the start, Oct to Nov 2025, or today. Everything that shows TeachOS
// numbers reads it from here, so the time bar can move them together.
const Ctx = createContext(null)
export const useTime = () => useContext(Ctx)

export function TimeProvider({ children }) {
  const last = phases.length - 1
  const [phase, setPhase] = useState(last)
  const [used, setUsed] = useState(false)
  const usedRef = useRef(false)
  const loadedAt = useRef(Date.now())

  // Records that the visitor used the time bar, and how long after the page loaded they first did.
  const use = useCallback((via, i) => {
    setUsed(true)
    track('click', `tb-${via}`)
    track('phase', phases[i].id)
    if (usedRef.current) return
    usedRef.current = true
    const s = (Date.now() - loadedAt.current) / 1000
    track('click', 'tb-used')
    track('click', s < 5 ? 'tb-fu-5s' : s < 15 ? 'tb-fu-15s' : s < 30 ? 'tb-fu-30s' : 'tb-fu-30s+')
  }, [])

  const go = useCallback((i, via) => { setPhase(i); use(via, i) }, [use])
  const value = useMemo(() => ({ phase, set: setPhase, go, use, used, last }), [phase, go, use, used, last])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
