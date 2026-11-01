import { timeline } from '../content/about.js'

// Experience and education on one shared time axis. Each row keeps its dates as text, so the chart
// reads fine without the bars. Months are counted from Jan 2020.
const START = 2020 * 12 + 6 // Jul 2020
const mo = ([y, m]) => y * 12 + (m - 1)
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026]

export default function Timeline() {
  const now = new Date()
  const nowMo = now.getFullYear() * 12 + now.getMonth()
  const END = Math.max(2026 * 12 + 12, nowMo + 2)
  const span = END - START
  const x = (m) => ((m - START) / span) * 100
  const groups = ['Work', 'Education']
  return (
    <div className="tl" style={{ '--o': x(2021 * 12), '--w': (12 / span) * 100 }}>
      <div className="tl-axis" aria-hidden="true">
        <span />
        <div className="tl-ticks">{YEARS.map((y) => <i key={y} style={{ left: `${x(y * 12)}%` }}>{y}</i>)}</div>
      </div>
      {groups.map((g) => (
        <section key={g} className="tl-group" aria-label={g}>
          <h3 className="tl-h">{g}</h3>
          <ol>
            {timeline.filter((t) => t.group === g).map((t) => {
              const a = x(mo(t.from))
              const b = t.to ? x(mo(t.to)) : x(nowMo + 1)
              return (
                <li key={t.org + t.role} className="tl-row">
                  <div className="tl-who"><b>{t.org}</b><span>{t.role}</span><span className="tl-date">{t.text}</span></div>
                  <div className="tl-track" aria-hidden="true">
                    <i className={`tl-bar${t.now ? ' now' : ''}${g === 'Education' ? ' edu' : ''}`} style={{ left: `${a}%`, width: `max(${(b - a).toFixed(2)}%, 8px)` }} />
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
