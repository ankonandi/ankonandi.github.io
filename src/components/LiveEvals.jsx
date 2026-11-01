import { useTime } from '../lib/time.jsx'
import { useMetricRows } from '../lib/useMetricRows.js'

// The "evaluations a month" figure in Selected work, following the time bar.
export default function LiveEvals() {
  const { phase } = useTime()
  const rows = useMetricRows()
  const row = rows.find((r) => r.label === 'AI evaluations a month') || rows[1]
  const v = row.vals[phase]
  const isNum = typeof v === 'number'
  return (
    <>
      <span className={isNum ? 'mark' : 'mark px-soft'}>{isNum ? `${Math.round(v / 1000)}K+` : 'Pilot'}</span> evaluations a month
    </>
  )
}
