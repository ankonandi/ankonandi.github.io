import { useEffect, useRef } from 'react'
import { READERS, useReader } from '../lib/reader.jsx'

const ORDER = ['recruiter', 'manager', 'pm', 'all']

// The first thing a new visitor sees: how would you like to read this? Reopened from the top bar.
export default function WelcomePrompt() {
  const { who, asking, ask, choose, skip } = useReader()
  const asked = useRef(false)
  const first = useRef(null)

  useEffect(() => {
    if (!who && !asked.current) { asked.current = true; ask(true) }
  }, [who, ask])

  useEffect(() => {
    if (asking && first.current) first.current.focus()
  }, [asking])

  if (!asking) return null
  return (
    <div
      className="px-pal px-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="who-h"
      onMouseDown={(e) => { if (e.target === e.currentTarget) skip() }}
      onKeyDown={(e) => { if (e.key === 'Escape') skip() }}
    >
      <div className="px-box px-who">
        <h2 id="who-h">Welcome. How would you like to read this?</h2>
        <p>Pick one and I'll set the page up for you. You can change it any time from the top bar.</p>
        <ul>
          {ORDER.map((k, i) => (
            <li key={k}>
              <button type="button" ref={i === 0 ? first : null} className={who === k ? 'cur' : ''} onClick={() => choose(k)}>
                <b>{READERS[k].label}</b>
                <span>{READERS[k].blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
