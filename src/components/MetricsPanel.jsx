import { useEffect, useMemo, useState } from 'react'
import { phases } from '../content/metrics.js'
import { useMetricRows } from '../lib/useMetricRows.js'
import { track } from '../lib/track.js'
import { formatMetric as format } from '../lib/formatMetric.js'
import { useTween, usePrefersReducedMotion } from '../hooks/useTween.js'

export default function MetricsPanel() {
  const reduce = usePrefersReducedMotion()
  const metricRows = useMetricRows()
  const last = phases.length - 1
  const [phase, setPhase] = useState(reduce ? last : 0)
  const [touched, setTouched] = useState(false)

  // Plays start, then the Oct to Nov 2025 changes, then today, once. Stops as soon as the visitor picks a phase.
  useEffect(() => {
    if (reduce || touched) return undefined
    const a = setTimeout(() => setPhase(1), 1100)
    const b = setTimeout(() => setPhase(last), 2400)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [reduce, touched, last])

  const target = useMemo(
    () => metricRows.map((r) => (typeof r.vals[phase] === 'number' ? r.vals[phase] : null)),
    [phase, metricRows],
  )
  const nums = useTween(target, reduce)
  const pick = (i) => { setTouched(true); setPhase(i); track('phase', phases[i].id) }

  return (
    <div className="panel" aria-labelledby="panel-h">
      <div className="panel-head">
        <h2 id="panel-h">TeachOS, before and after</h2>
        <div className="seg" role="group" aria-label="Compare phases">
          {phases.map((p, i) => (
            <button key={p.id} type="button" aria-pressed={phase === i} onClick={() => pick(i)}>{p.label}</button>
          ))}
        </div>
      </div>
      <p className="phase-blurb" aria-live="polite">{phases[phase].blurb}</p>
      <ul className="metric-list">
        {metricRows.map((r, i) => {
          const raw = r.vals[phase]
          const isText = typeof raw !== 'number'
          return (
            <li className="metric" key={r.label}>
              <div className="m-top">
                <div className="m-label">{r.label}<small>{r.note}</small></div>
                <div className={isText ? 'm-val text' : 'm-val'}>{isText ? raw : format(r, nums[i] ?? raw)}</div>
              </div>
              <div className="m-bar" aria-hidden="true">
                <i style={{ width: isText ? '0%' : `${Math.max(0, Math.min(100, ((nums[i] ?? raw) / r.max) * 100))}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="panel-note">Each row shows when its change shipped. Figures from Metabase, pulled 1 Nov 2026. These are not controlled experiments.</p>
    </div>
  )
}
