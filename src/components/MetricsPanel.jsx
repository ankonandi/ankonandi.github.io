import { useEffect, useMemo, useState } from 'react'
import { metricRows } from '../content/metrics.js'
import { useTween, usePrefersReducedMotion } from '../hooks/useTween.js'

function format(row, v) {
  if (row.fmt === 'pct') return `${(Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, '')}%`
  return Math.round(v).toLocaleString('en-IN')
}

export default function MetricsPanel() {
  const reduce = usePrefersReducedMotion()
  const [which, setWhich] = useState(reduce ? 'now' : 'then')
  const [touched, setTouched] = useState(false)

  // Opens on the baseline, then flips to now once, unless the visitor already chose.
  useEffect(() => {
    if (reduce) return undefined
    const id = setTimeout(() => { if (!touched) setWhich('now') }, 900)
    return () => clearTimeout(id)
  }, [reduce, touched])

  const target = useMemo(() => metricRows.map((r) => r[which]), [which])
  const vals = useTween(target, reduce)

  const pick = (w) => { setTouched(true); setWhich(w) }

  return (
    <div className="panel" aria-labelledby="panel-h">
      <div className="panel-head">
        <h2 id="panel-h">TeachOS, baseline and now</h2>
        <div className="seg" role="group" aria-label="Compare time period">
          <button type="button" aria-pressed={which === 'then'} onClick={() => pick('then')}>Baseline</button>
          <button type="button" aria-pressed={which === 'now'} onClick={() => pick('now')}>Oct 2026</button>
        </div>
      </div>
      <ul className="metric-list">
        {metricRows.map((r, i) => (
          <li className="metric" key={r.label}>
            <div className="m-top">
              <div className="m-label">{r.label}<small>{r.note}</small></div>
              <div className="m-val">{format(r, vals[i])}</div>
            </div>
            <div className="m-bar" aria-hidden="true">
              <i style={{ width: `${Math.max(0, Math.min(100, (vals[i] / r.max) * 100))}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="panel-note">Each row shows its own baseline month. Period comparisons from Metabase, pulled 1 Nov 2026. These are not controlled experiments.</p>
    </div>
  )
}
