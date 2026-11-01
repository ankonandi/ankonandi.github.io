import { timeline, timelineYears } from '../content/about.js'

// Work and education side by side, newest first. Each study period spans the rows of the jobs done
// during it. On a phone the same entries become one list. Dates stay as text, so nothing depends on the layout.
const monthsBetween = (a, b) => (b[0] - a[0]) * 12 + (b[1] - a[1]) + 1
function length(t) {
  const now = new Date()
  const m = monthsBetween(t.from, t.to || [now.getFullYear(), now.getMonth() + 1])
  if (!t.to) return `${m} ${m === 1 ? 'month' : 'months'} so far`
  if (m >= 24) return `${Math.round(m / 12)} years`
  return `${m} months`
}

export default function Timeline() {
  return (
    <div className="tl">
      <div className="tl-cols" aria-hidden="true"><span /><span>Work</span><span>Education</span></div>
      <ol className="tl-grid">
        {timelineYears.map((y, i) => <li key={y} className="tl-year" aria-hidden="true" style={{ gridRow: i + 1 }}>{y}</li>)}
        {timeline.map((t) => (
          <li key={t.org + t.role} className={`tl-item ${t.kind}${t.to ? '' : ' now'}`} style={{ '--row': `${t.row} / span ${t.span}` }}>
            <div className="tl-top">
              <b>{t.org}</b>
              {!t.to && <em className="tl-now">Now</em>}
            </div>
            <span className="tl-role">{t.role}{t.grade ? `, ${t.grade}` : ''}</span>
            <span className="tl-date">{t.text}<i>{length(t)}</i></span>
          </li>
        ))}
      </ol>
    </div>
  )
}
