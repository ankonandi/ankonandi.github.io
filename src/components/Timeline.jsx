import { timeline } from '../content/about.js'

// One line from the first day to now. Each milestone sits on the line, alternating above and below so
// short stints get the same room as long ones. On a phone the line runs down the page instead.
export default function Timeline() {
  return (
    <div className="tl">
      <p className="tl-key" aria-hidden="true"><span className="k-work">Work</span><span className="k-edu">Education</span></p>
      <ol className="tl-line">
        {timeline.map((t, i) => (
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
