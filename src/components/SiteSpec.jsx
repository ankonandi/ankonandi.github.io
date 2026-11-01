import { siteSpec } from '../content/site.js'
import { siteInfo } from '../content/profile.js'

// The portfolio described the way I would describe any product: problem, audience, success, decisions.
export default function SiteSpec() {
  return (
    <div className="px-sheet">
      <div className="px-sheet-head">
        <h3>{siteSpec.title}</h3>
        <span>Version {siteInfo.version}. Updated {siteInfo.updated}</span>
      </div>
      <div className="px-cols">
        {siteSpec.columns.map(([h, t]) => (
          <div key={h}><h4>{h}</h4><p>{t}</p></div>
        ))}
      </div>
      <p className="px-log-h">Decisions I made</p>
      <div className="px-log">
        {siteSpec.decisions.map(([b, s]) => (
          <div key={b}><b>{b}</b><span>{s}</span></div>
        ))}
      </div>
    </div>
  )
}
