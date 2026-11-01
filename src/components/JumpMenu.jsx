import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profile } from '../content/profile.js'
import { phases } from '../content/metrics.js'
import { copyText } from '../lib/copy.js'
import { openResume } from '../lib/resume.js'
import { track } from '../lib/track.js'
import { useReader } from '../lib/reader.jsx'
import { useTime } from '../lib/time.jsx'

// A small "go anywhere" menu: sections, time travel, reading mode and the two actions people want most.
export default function JumpMenu({ onClose }) {
  const nav = useNavigate()
  const { setSkim, toast } = useReader()
  const { go } = useTime()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef(null)

  const cmds = useMemo(() => [
    ['Overview', 'Section', () => nav('/#top')],
    ['Selected work', 'Section', () => nav('/#work')],
    ['TeachOS case study', 'Section', () => nav('/teachos')],
    ['How I work', 'Section', () => nav('/#how')],
    ['Background', 'Section', () => nav('/#background')],
    ['How I built this site', 'Section', () => nav('/#site')],
    ['Contact', 'Section', () => nav('/#contact')],
    ...phases.map((p, i) => [`See TeachOS ${i === 0 ? 'at the start' : i === 1 ? 'in Oct–Nov 2025' : 'today'}`, 'Time', () => { nav('/#top'); go(i, 'jump') }]),
    ['Skim view', 'Reading mode', () => setSkim(true, 'mode-skim')],
    ['Full story', 'Reading mode', () => setSkim(false, 'mode-full')],
    ['Copy my email', 'Action', async () => { track('click', 'copy-email'); toast((await copyText(profile.email)) ? 'Email copied' : profile.email) }],
    ['Download resume', 'Action', () => { track('click', 'resume'); openResume(profile.resumeUrl, profile.resumeFileName) }],
  ], [nav, go, setSkim, toast])

  const shown = useMemo(() => {
    const v = q.trim().toLowerCase()
    return cmds.filter(([t, s]) => !v || t.toLowerCase().includes(v) || s.toLowerCase().includes(v))
  }, [cmds, q])

  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => { track('click', 'jump-open') }, [])

  const run = (i) => {
    const c = shown[i]
    if (!c) return
    track('click', 'jump-run')
    onClose()
    c[2]()
  }
  const key = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { setSel((s) => Math.min(shown.length - 1, s + 1)); e.preventDefault() }
    else if (e.key === 'ArrowUp') { setSel((s) => Math.max(0, s - 1)); e.preventDefault() }
    else if (e.key === 'Enter') { run(sel); e.preventDefault() }
  }

  return (
    <div className="px-pal" role="dialog" aria-modal="true" aria-label="Jump to" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="px-box" onKeyDown={key}>
        <input
          ref={input}
          className="px-q"
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0) }}
          placeholder="Jump to a section, or travel in time"
          autoComplete="off"
          aria-label="Search"
        />
        <div className="px-list">
          {shown.length === 0 && <p className="px-none">Nothing matches. Try "contact" or "today".</p>}
          {shown.map(([t, s], i) => (
            <button key={t} type="button" className={i === sel ? 'sel' : ''} onMouseEnter={() => setSel(i)} onClick={() => run(i)}>
              {t}<small>{s}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
