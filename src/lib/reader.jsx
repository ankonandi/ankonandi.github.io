import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { track } from './track.js'

// Who is reading, and whether they want the short version. The first visit asks once; the answer is
// remembered in this browser only (localStorage), and never sent anywhere except as an anonymous click count.
export const READERS = {
  recruiter: { label: 'Recruiter', chip: 'Recruiter', skim: true, start: ['contact', 'Contact'], blurb: 'A thirty-second skim: the numbers and how to reach me.' },
  manager: { label: 'Hiring manager', chip: 'Hiring manager', skim: false, start: ['work', 'Selected work'], blurb: 'The full story: the product, the numbers and the reasoning.' },
  pm: { label: 'Fellow PM', chip: 'Fellow PM', skim: false, start: ['how', 'How I work'], blurb: 'The full story, starting with how I work.' },
  all: { label: 'Just looking around', chip: 'Everyone', skim: false, start: ['work', 'Selected work'], blurb: 'Everything, from the top.' },
}

const KEY = 'who'
function saved() {
  try {
    const v = localStorage.getItem(KEY)
    return READERS[v] ? v : null
  } catch { return null }
}
function save(v) {
  try { localStorage.setItem(KEY, v) } catch { /* storage blocked */ }
}

const Ctx = createContext(null)
export const useReader = () => useContext(Ctx)

export function ReaderProvider({ children }) {
  const [who, setWho] = useState(saved)
  const [skim, setSkimState] = useState(() => { const s = saved(); return s ? READERS[s].skim : false })
  const [asking, setAsking] = useState(false)
  const [msg, setMsg] = useState('')
  const [on, setOn] = useState(false)
  const timer = useRef(0)

  // The short version is a class on <body>; the CSS folds the long text away.
  useEffect(() => {
    document.body.classList.toggle('skim', skim)
    return () => document.body.classList.remove('skim')
  }, [skim])

  const toast = useCallback((m) => {
    setMsg(m)
    setOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), 1900)
  }, [])

  const choose = useCallback((k) => {
    const r = READERS[k]
    setWho(k)
    setSkimState(r.skim)
    save(k)
    setAsking(false)
    track('click', `who-${k}`)
    toast(`Reading as ${r.chip}`)
  }, [toast])

  // Closing the window without choosing counts as "just looking around", so the visitor is not asked again.
  const skip = useCallback(() => {
    setAsking(false)
    if (!saved()) { setWho('all'); save('all') }
    track('click', 'who-skip')
  }, [])

  const ask = useCallback((auto) => {
    setAsking(true)
    if (auto) track('section', 'who-seen')
    else track('click', 'who-open')
  }, [])

  const setSkim = useCallback((v, label) => {
    setSkimState(v)
    if (label) track('click', label)
  }, [])

  const reader = READERS[who] || READERS.all
  const value = useMemo(
    () => ({ who, reader, skim, setSkim, asking, ask, choose, skip, toast }),
    [who, reader, skim, setSkim, asking, ask, choose, skip, toast],
  )
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className={`px-toast${on ? ' on' : ''}`} role="status">{msg}</div>
    </Ctx.Provider>
  )
}
