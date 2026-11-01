import { useState } from 'react'
import { timeline } from '../content/about.js'
import { track } from '../lib/track.js'

// One line from the first day to now. Each milestone sits on the line, alternating above and below so
// short stints get the same room as long ones. On a phone the line runs down the page instead.
// The two keys are buttons: both are on by default, one click shows only that kind, and at least one stays on.
export default function Timeline() {
  const [on, setOn] = useState({ work: true, edu: true })

  const pick = (kind) => {
    const both = on.work && on.edu
    if (both) setOn({ work: kind === 'work', edu: kind === 'edu' })
    else if (on[kind]) return
    else setOn({ work: true, edu: true })
    track('click', both ? `tl-only-${kind}` : 'tl-both')
  }

  const items = timeline.filter((t) => on[t.kind === 'edu' ? 'edu' : 'work'])

  return (
    <div className="tl">
      <div className="tl-key" role="group" aria-label="Show on the timeline">
        <button type="button" className="k-work" aria-pressed={on.work} onClick={() => pick('work')}>Work</button>
        <button type="button" className="k-edu" aria-pressed={on.edu} onClick={() => pick('edu')}>Education</button>
      </div>
      <ol className={items.some((t) => !t.to) ? 'tl-line live' : 'tl-line'} style={{ '--n': items.length }}>
        {items.map((t, i) => (
          <li key={t.org + t.role} className={`tl-m ${t.kind === 'edu' ? 'edu' : 'job'} ${i % 2 ? 'down' : 'up'}${t.to ? '' : ' now'}`}>
            <span className="tl-dot" aria-hidden="true" />
            <div className="tl-card">
              <span className="tl-date">{t.text}</span>
              <b>{t.org}</b>
              <span className="tl-role">{t.role}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
