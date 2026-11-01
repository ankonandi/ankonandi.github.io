import { useState } from 'react'
import { fmtDate, fmtHour } from './range.js'

const nice = (n) => {
  if (n <= 4) return 4
  const p = 10 ** Math.floor(Math.log10(n))
  const m = n / p
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p
}

export const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : '0%')
export const int = (n) => Math.round(n).toLocaleString('en-IN')

export function Delta({ cur, prev }) {
  if (!prev && !cur) return <span className="delta flat">no change</span>
  if (!prev) return <span className="delta up">new</span>
  const change = ((cur - prev) / prev) * 100
  if (Math.abs(change) < 0.5) return <span className="delta flat">no change</span>
  return <span className={`delta ${change > 0 ? 'up' : 'down'}`}>{change > 0 ? '+' : '−'}{Math.abs(Math.round(change))}% vs before</span>
}

export function Sparkline({ data }) {
  if (!data || data.length < 2) return <svg className="spark" viewBox="0 0 100 28" aria-hidden="true" />
  const max = Math.max(1, ...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${26 - (v / max) * 24}`)
  return (
    <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,28 ${pts.join(' ')} 100,28`} className="spark-fill" />
      <polyline points={pts.join(' ')} className="spark-line" />
    </svg>
  )
}

export function TimeChart({ data, group, onDrill }) {
  const [hover, setHover] = useState(null)
  const max = nice(Math.max(1, ...data.map((d) => d.visits)))
  const every = Math.max(1, Math.ceil(data.length / 8))
  const label = (d) => (group === 'hour' ? fmtHour(new Date(d.t)) : fmtDate(new Date(d.t)))
  const tick = (d) => {
    const dt = new Date(d.t)
    return group === 'hour'
      ? dt.getHours() === 0 ? fmtDate(dt) : dt.toLocaleString('en-IN', { hour: 'numeric' })
      : fmtDate(dt)
  }
  const tip = hover !== null && data[hover]
  const total = data.reduce((a, d) => a + d.visits, 0)
  return (
    <div className="chart">
      <p className="chart-tip" aria-live="polite">
        {tip
          ? <><b>{label(tip)}</b> <span>{tip.visits} visit{tip.visits === 1 ? '' : 's'}</span> <span>{tip.views} page views</span> <span className="chart-act">{tip.acts} reached out</span></>
          : <><b>{int(total)} visits</b> <span>{group === 'hour' ? 'by hour' : 'by day'}</span>{onDrill && group === 'day' && <span className="chart-hint">Select a day to see it hour by hour</span>}</>}
      </p>
      <div className="chart-plot">
        {[1, 0.5, 0].map((f) => (
          <div key={f} className="chart-grid" style={{ bottom: `${f * 100}%` }}><span>{Math.round(max * f)}</span></div>
        ))}
        <ul className="chart-bars">
          {data.map((d, i) => (
            <li key={d.t}>
              <button
                type="button"
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                onClick={() => onDrill && group === 'day' && onDrill(d)}
                aria-label={`${label(d)}: ${d.visits} visits, ${d.acts} reached out`}
                disabled={!onDrill || group !== 'day'}
              >
                <i className={d.visits ? 'bar' : 'bar empty'} style={{ height: d.visits ? `${Math.max(3, (d.visits / max) * 100)}%` : '2px' }}>
                  {d.acts > 0 && <b style={{ height: `${(d.acts / d.visits) * 100}%` }} />}
                </i>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ol className="chart-x" aria-hidden="true">
        {data.map((d, i) => <li key={d.t}>{i % every === 0 ? tick(d) : ''}</li>)}
      </ol>
      <p className="chart-legend"><i className="k navy" /> Visits <i className="k red" /> Visits that ended in a call, email or resume download</p>
    </div>
  )
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export function Heatmap({ grid }) {
  const max = Math.max(1, ...grid.flat())
  return (
    <div className="heat" role="img" aria-label="Visits by weekday and hour of day">
      <div className="heat-head"><span />{Array.from({ length: 24 }, (_, h) => <span key={h}>{h % 3 === 0 ? (h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`) : ''}</span>)}</div>
      {grid.map((row, d) => (
        <div className="heat-row" key={DAYS[d]}>
          <span className="heat-day">{DAYS[d]}</span>
          {row.map((v, h) => (
            <i key={h} title={`${DAYS[d]} ${h}:00, ${v} visit${v === 1 ? '' : 's'}`} style={{ background: v ? `rgba(15, 27, 61, ${0.14 + (v / max) * 0.86})` : undefined }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function Funnel({ steps }) {
  const top = Math.max(1, steps[0][1])
  return (
    <ol className="funnel">
      {steps.map(([label, v], i) => {
        const prev = i ? steps[i - 1][1] : null
        return (
          <li key={label}>
            <div className="funnel-bar" style={{ width: `${Math.max(2, (v / top) * 100)}%` }} />
            <div className="funnel-row">
              <span className="funnel-label">{label}</span>
              <span className="funnel-n"><b>{int(v)}</b> <small>{pct(v, top)} of visits{prev ? ` · ${pct(v, prev)} of the step before` : ''}</small></span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function Bars({ rows, total, empty = 'Nothing yet in this range' }) {
  const max = Math.max(1, ...rows.map((r) => r[1]))
  if (!rows.length) return <p className="empty">{empty}</p>
  return (
    <ul className="hbars">
      {rows.map(([name, v]) => (
        <li key={name}>
          <span className="hb-name">{name}</span>
          <span className="hb-track"><i style={{ width: `${(v / max) * 100}%` }} /></span>
          <span className="hb-n">{int(v)}{total ? <small> {pct(v, total)}</small> : null}</span>
        </li>
      ))}
    </ul>
  )
}

export function Stacked({ rows }) {
  const total = rows.reduce((a, r) => a + r[1], 0)
  if (!total) return <p className="empty">Nothing yet in this range</p>
  return (
    <div>
      <div className="stack" role="img" aria-label={rows.map((r) => `${r[0]} ${pct(r[1], total)}`).join(', ')}>
        {rows.map(([name, v], i) => <i key={name} className={`s${i % 4}`} style={{ width: `${(v / total) * 100}%` }} />)}
      </div>
      <ul className="stack-key">
        {rows.map(([name, v], i) => <li key={name}><i className={`s${i % 4}`} />{name} <b>{pct(v, total)}</b> <small>{int(v)}</small></li>)}
      </ul>
    </div>
  )
}
