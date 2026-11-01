import { useEffect, useMemo, useState } from 'react'
import { phases } from '../content/metrics.js'
import { useMetricRows } from '../lib/useMetricRows.js'
import { formatMetric as format } from '../lib/formatMetric.js'
import { useTime } from '../lib/time.jsx'
import { useTween, usePrefersReducedMotion } from '../hooks/useTween.js'

// TeachOS before and after. Which period it shows comes from the time bar, so the panel has no tabs of its own.
export default function MetricsPanel() {
  const reduce = usePrefersReducedMotion()
  const metricRows = useMetricRows()
  const { phase } = useTime()

  // On first paint every number starts at zero and counts up to today's value.
  const [armed, setArmed] = useState(reduce)
  useEffect(() => {
    if (armed) return undefined
    const t = setTimeout(() => setArmed(true), 200)
    return () => clearTimeout(t)
  }, [armed])

  const numTarget = useMemo(
    () => metricRows.map((r) => {
      const v = r.vals[phase]
      if (typeof v !== 'number') return null
      return armed ? v : 0
    }),
    [phase, metricRows, armed],
  )
  const nums = useTween(numTarget, reduce, 900)

  const bigIdx = Math.max(0, metricRows.findIndex((r) => r.label === 'AI evaluations a month'))
  const big = metricRows[bigIdx]
  const bigRaw = big.vals[phase]
  const bigIsText = typeof bigRaw !== 'number'

  return (
    <div className="panel" aria-labelledby="panel-h">
      <div className="panel-head">
        <h2 id="panel-h">TeachOS, before and after</h2>
        <span className="px-when" aria-live="polite">{phases[phase].label}</span>
      </div>
      <div className={bigIsText ? 'px-big text' : 'px-big'} aria-live="polite">{bigIsText ? bigRaw : format(big, nums[bigIdx] ?? bigRaw)}</div>
      <p className="px-big-cap">{big.label}</p>
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
