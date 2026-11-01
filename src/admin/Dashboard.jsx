import { useCallback, useEffect, useMemo, useState } from 'react'
import { firebase } from '../lib/firebase.js'
import {
  DAY, PRESETS, presetRange, autoGroup, toInput, fromInput, fmtDate, fmtDateTime, fmtRange, rel, dur, startOfDay,
} from './range.js'
import { toSession, kpis, analyze, buckets, heatmap, acted, engaged } from './stats.js'
import CampaignsView from './Campaigns.jsx'
import { TimeChart, Heatmap, Funnel, Bars, Stacked, Sparkline, Delta, int, pct } from './charts.jsx'

const LIMIT = 10000
const VIEWS = [
  ['overview', 'Overview'],
  ['acquisition', 'Acquisition'],
  ['campaigns', 'Campaigns'],
  ['audience', 'Audience'],
  ['behavior', 'Behavior'],
  ['conversion', 'Conversion'],
  ['speed', 'Speed'],
  ['visitors', 'Visitors'],
]

function Panel({ title, note, children, wide }) {
  return (
    <section className={`a-panel${wide ? ' wide' : ''}`}>
      <h3>{title}</h3>
      {note && <p className="a-panel-note">{note}</p>}
      {children}
    </section>
  )
}

function Kpi({ label, value, hint, cur, prev, spark }) {
  return (
    <div className="kpi">
      <dt>{label}</dt>
      <dd>{value}</dd>
      <div className="kpi-foot">
        {cur !== undefined ? <Delta cur={cur} prev={prev} /> : <span className="delta flat">{hint}</span>}
        <Sparkline data={spark} />
      </div>
    </div>
  )
}

function SourceTable({ rows, first }) {
  if (!rows.length) return <p className="empty">Nothing tagged in this range yet</p>
  return (
    <table className="tbl">
      <thead><tr><th>{first}</th><th className="n">Visits</th><th className="n">Engaged</th><th className="n">Reached out</th></tr></thead>
      <tbody>{rows.map((r) => (
        <tr key={r.name}><td>{r.name}</td><td className="n">{int(r.visits)}</td><td className="n">{pct(r.engaged, r.visits)}</td><td className="n">{pct(r.acted, r.visits)}</td></tr>
      ))}</tbody>
    </table>
  )
}

function RangeBar({ range, setRange, onRefresh, busy, updated, back, onBack }) {
  const [from, setFrom] = useState(toInput(range.from))
  const [to, setTo] = useState(toInput(range.to))
  const [err, setErr] = useState('')
  useEffect(() => { setFrom(toInput(range.from)); setTo(toInput(range.to)); setErr('') }, [range])
  const apply = (e) => {
    e.preventDefault()
    const f = fromInput(from)
    const t = fromInput(to)
    if (Number.isNaN(f.getTime()) || Number.isNaN(t.getTime())) { setErr('Pick both a start and an end.'); return }
    if (t <= f) { setErr('The end must be after the start.'); return }
    if (t - f > 366 * DAY) { setErr('Pick a range of one year or less.'); return }
    setRange({ id: 'custom', from: f, to: t, group: autoGroup(f, t) })
  }
  return (
    <div className="rangebar">
      <div className="rb-row">
        <div className="a-seg" role="group" aria-label="Quick ranges">
          {PRESETS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={range.id === id} onClick={() => setRange(presetRange(id))}>{label}</button>
          ))}
        </div>
        <div className="rb-end">
          <span className="rb-updated">{busy ? 'Loading…' : updated ? `Updated ${updated.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}` : ''}</span>
          <button type="button" className="icon-btn" onClick={onRefresh} disabled={busy} aria-label="Refresh data">Refresh</button>
        </div>
      </div>
      <form className="rb-row rb-custom" onSubmit={apply}>
        <label>From<input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>To<input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button type="submit" className="btn small" aria-pressed={range.id === 'custom'}>Apply range</button>
        <div className="a-seg" role="group" aria-label="Group chart by">
          {[['hour', 'By hour'], ['day', 'By day']].map(([g, label]) => (
            <button key={g} type="button" aria-pressed={range.group === g} onClick={() => setRange({ ...range, group: g })}>{label}</button>
          ))}
        </div>
      </form>
      <div className="rb-row rb-crumb">
        {back && <button type="button" className="link" onClick={onBack}>Back to {back}</button>}
        <span className="rb-range">{fmtRange(range.from, range.to)}</span>
        {err && <span className="rb-err" role="alert">{err}</span>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [range, setRangeRaw] = useState(() => presetRange('7d'))
  const [trail, setTrail] = useState([])
  const [view, setView] = useState('overview')
  const [rows, setRows] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [updated, setUpdated] = useState(null)
  const [nonce, setNonce] = useState(0)
  const [links, setLinks] = useState({})
  useEffect(() => {
    ;(async () => {
      try {
        const { db, fs } = await firebase()
        const snap = await fs.getDoc(fs.doc(db, 'config', 'links'))
        if (snap.exists()) setLinks(snap.data().items || {})
      } catch { /* the table then shows only tagged visits */ }
    })()
  }, [nonce, range])

  const setRange = (r) => { setTrail([]); setRangeRaw(r) }
  const drill = (d) => {
    const from = new Date(d.t)
    const to = new Date(startOfDay(from).getTime() + DAY - 1)
    setTrail((t) => [...t, range])
    setRangeRaw({ id: 'custom', from, to, group: 'hour' })
  }
  const back = trail.length ? trail[trail.length - 1] : null
  const goBack = () => { setRangeRaw(back); setTrail((t) => t.slice(0, -1)) }

  const span = range.to - range.from
  const prevFrom = useMemo(() => new Date(range.from.getTime() - span), [range, span])

  const load = useCallback(async () => {
    setBusy(true)
    setErr('')
    try {
      const { db, fs } = await firebase()
      const snap = await fs.getDocs(fs.query(
        fs.collection(db, 'sessions'),
        fs.where('start', '>=', prevFrom),
        fs.where('start', '<=', range.to),
        fs.orderBy('start', 'desc'),
        fs.limit(LIMIT),
      ))
      setRows(snap.docs.map(toSession))
      setUpdated(new Date())
    } catch (e) {
      setErr(e.message || 'Could not load visits')
    } finally { setBusy(false) }
  }, [prevFrom, range.to])
  useEffect(() => { load() }, [load, nonce])

  // A quick range such as "Last 7 days" ends at the moment it was picked. Move that end to now on
  // Refresh and every minute, so visits that arrive after the page opened are counted.
  const rolling = range.id !== 'custom'
  useEffect(() => {
    if (!rolling) return undefined
    const t = setInterval(() => { if (document.visibilityState === 'visible') setRangeRaw(presetRange(range.id)) }, 60000)
    return () => clearInterval(t)
  }, [rolling, range.id])
  const refresh = () => { if (rolling) setRangeRaw(presetRange(range.id)); else setNonce((n) => n + 1) }

  const cur = useMemo(() => (rows ? rows.filter((s) => s.start >= range.from && s.start <= range.to) : null), [rows, range])
  const prev = useMemo(() => (rows ? rows.filter((s) => s.start < range.from) : null), [rows, range])
  const k = useMemo(() => (cur ? kpis(cur) : null), [cur])
  const kp = useMemo(() => (prev ? kpis(prev) : null), [prev])
  const a = useMemo(() => (cur ? analyze(cur) : null), [cur])
  const series = useMemo(() => (cur ? buckets(cur, range.from, range.to, range.group) : []), [cur, range])
  const grid = useMemo(() => (cur ? heatmap(cur) : null), [cur])
  const capped = rows && rows.length >= LIMIT

  return (
    <div className="dash">
      <RangeBar range={range} setRange={setRange} onRefresh={refresh} busy={busy} updated={updated}
        back={back ? (back.id === 'custom' ? fmtRange(back.from, back.to) : PRESETS.find((p) => p[0] === back.id)?.[1] || 'previous range') : ''} onBack={goBack} />

      <nav className="subnav" aria-label="Analytics sections">
        {VIEWS.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>
        ))}
      </nav>

      {err && <p className="notice bad" role="alert">{err}{/permission|insufficient/i.test(err) ? ' Your account may not have admin access yet.' : ''}</p>}
      {capped && <p className="notice">This range has more than {int(LIMIT)} visits, so only the most recent {int(LIMIT)} are counted. Narrow the range for exact numbers.</p>}

      {!rows && !err && <div className="skeleton" aria-busy="true"><i /><i /><i /><i /></div>}

      {rows && k && a && (
        <>
          {cur.length === 0 && (
            <p className="empty-state">
              <b>No visits in this range.</b>
              Try a wider range. Visits are not counted from a browser where you have opened /admin, and that includes a private window you used for both the site and /admin. To test, browse the site in a different browser or on your phone.
            </p>
          )}

          {view === 'overview' && (
            <>
              <dl className="kpis">
                <Kpi label="Visits" value={int(k.visits)} cur={k.visits} prev={kp.visits} spark={series.map((d) => d.visits)} />
                <Kpi label="Unique visitors" value={int(k.visitors)} cur={k.visitors} prev={kp.visitors} spark={series.map((d) => d.visits)} />
                <Kpi label="Page views" value={int(k.views)} cur={k.views} prev={kp.views} spark={series.map((d) => d.views)} />
                <Kpi label="Time on page (active)" value={dur(k.avgAct)} cur={k.avgAct} prev={kp.avgAct} />
                <Kpi label="Engaged visits" value={pct(k.engagedRate, 1)} hint="10 s, 2 pages or a click" cur={k.engagedRate} prev={kp.engagedRate} />
                <Kpi label="Reached out" value={pct(k.contactRate, 1)} hint={`${k.actions} call, email or resume`} cur={k.contactRate} prev={kp.contactRate} spark={series.map((d) => d.acts)} />
                <Kpi label="Average scroll, home" value={`${Math.round(k.avgScroll)}%`} hint="How far down the home page" cur={k.avgScroll} prev={kp.avgScroll} />
                <Kpi label="New visitors" value={pct(k.newShare, 1)} hint="Rest are returning" cur={k.newShare} prev={kp.newShare} />
              </dl>
              <Panel title="Visits over time" wide>
                <TimeChart data={series} group={range.group} onDrill={drill} />
              </Panel>
              <div className="cols">
                <Panel title="Journey from visit to contact" note="Each step counts visits that got that far.">
                  <Funnel steps={a.funnel} />
                </Panel>
                <Panel title="When people visit" note="Local time, by weekday and hour.">
                  <Heatmap grid={grid} />
                </Panel>
              </div>
            </>
          )}

          {view === 'acquisition' && (
            <div className="cols">
              <Panel title="Where visitors came from" wide note="Engaged means 10 seconds active, 2 pages or a click. Reached out means call, email or resume.">
                {a.sources.length === 0 ? <p className="empty">Nothing yet in this range</p> : <SourceTable rows={a.sources} first="Source" />}
                <p className="tip">Tag every link you send. Open Campaign links in the sidebar to build one in a few clicks. Visits without a tag show as the site they came from, or as direct.</p>
              </Panel>
              <Panel title="Campaigns" note={`${int(a.tagged)} of ${int(a.n)} visits came through a tagged link.`}><SourceTable rows={a.campaigns} first="Campaign" /></Panel>
              <Panel title="Medium" note="The kind of channel: message, email, social, resume."><SourceTable rows={a.mediums} first="Medium" /></Panel>
              <Panel title="Which version of the link" note="Use this to compare two versions of one message."><SourceTable rows={a.contents} first="Content tag" /></Panel>
              <Panel title="First page seen"><Bars rows={a.entry.slice(0, 8)} total={a.n} /></Panel>
            </div>
          )}

          {view === 'campaigns' && <CampaignsView sessions={cur} items={links} range={range} />}

          {view === 'audience' && (
            <div className="cols">
              <Panel title="New and returning"><Stacked rows={a.visitorType} /></Panel>
              <Panel title="Devices"><Stacked rows={a.devices} /></Panel>
              <Panel title="Countries" note="Estimated from the browser time zone. No IP address is stored."><Bars rows={a.countries.slice(0, 8)} total={a.n} /></Panel>
              <Panel title="Browsers"><Bars rows={a.browsers.slice(0, 6)} total={a.n} /></Panel>
              <Panel title="Operating systems"><Bars rows={a.systems.slice(0, 6)} total={a.n} /></Panel>
              <Panel title="Languages"><Bars rows={a.languages.slice(0, 6)} total={a.n} /></Panel>
            </div>
          )}

          {view === 'behavior' && (
            <div className="cols">
              <Panel title="Scroll depth, home page" note={`${int(a.scrollHome.base)} visits saw the home page. Each row is how many scrolled at least that far.`}>
                <Funnel steps={a.scrollHome.steps.map(([l, v]) => [`${l} of the page`, v])} />
              </Panel>
              <Panel title="Scroll depth, case study" note={`${int(a.scrollCase.base)} visits opened the case study.`}>
                <Funnel steps={a.scrollCase.steps.map(([l, v]) => [`${l} of the page`, v])} />
              </Panel>
              <Panel title="Sections reached" note="Counts visits that had the section on screen."><Bars rows={a.sections} total={a.n} /></Panel>
              <Panel title="Time actually spent" note="Only seconds when the tab is visible and the person is interacting."><Bars rows={a.activeTime} total={a.n} /></Panel>
              <Panel title="Pages viewed"><Bars rows={a.pages.slice(0, 8)} /></Panel>
              <Panel title="Hero panel stage opened" note="Clicks on At the start, Oct to Nov 2025 and Today."><Bars rows={a.phases} /></Panel>
            </div>
          )}

          {view === 'conversion' && (
            <div className="cols">
              <Panel title="Journey from visit to contact"><Funnel steps={a.funnel} /></Panel>
              <Panel title="Calls to action" note="Clicks is every tap. Visits is how many different visits tapped it.">
                <table className="tbl">
                  <thead><tr><th>Action</th><th className="n">Clicks</th><th className="n">Visits</th><th className="n">Rate</th></tr></thead>
                  <tbody>{a.cta.map(([label, c, v]) => (
                    <tr key={label}><td>{label}</td><td className="n">{int(c)}</td><td className="n">{int(v)}</td><td className="n">{pct(v, a.n)}</td></tr>
                  ))}</tbody>
                </table>
              </Panel>
            </div>
          )}

          {view === 'speed' && (
            <>
              <dl className="kpis three">
                <Kpi label="Median load" value={a.perf.load ? `${(a.perf.load / 1000).toFixed(1)} s` : 'n/a'} hint="Time to finish loading" />
                <Kpi label="Median largest paint" value={a.perf.lcp ? `${(a.perf.lcp / 1000).toFixed(1)} s` : 'n/a'} hint={a.perf.lcp && a.perf.lcp <= 2500 ? 'Good, under 2.5 s' : a.perf.lcp ? 'Over the 2.5 s target' : 'No data yet'} />
                <Kpi label="Layout shift" value={a.perf.measured ? a.perf.cls.toFixed(2) : 'n/a'} hint={!a.perf.measured ? 'No data yet' : a.perf.cls <= 0.1 ? 'Good, under 0.1' : 'Over the 0.1 target'} />
              </dl>
              <Panel title="Errors">
                <p className="big-line"><b>{int(a.perf.errors)}</b> of {int(a.n)} visits hit a script error ({pct(a.perf.errors, a.n)}).</p>
                <p className="a-panel-note">{int(a.perf.measured)} visits reported speed measurements. Safari does not report the largest paint, so those visits are left out of the median.</p>
              </Panel>
            </>
          )}

          {view === 'visitors' && (
            <Panel title="Latest visits" wide note="The 40 most recent in this range. Each row is one visit.">
              {cur.length === 0 ? <p className="empty">Nothing yet in this range</p> : (
                <div className="tbl-wrap">
                  <table className="tbl visits">
                    <thead><tr><th>When</th><th>From</th><th>Landed on</th><th>Device</th><th>Where</th><th className="n">Active</th><th className="n">Scroll</th><th>Result</th></tr></thead>
                    <tbody>{cur.slice(0, 40).map((s) => (
                      <tr key={s.id}>
                        <td title={fmtDateTime(s.start)}>{rel(s.start)}</td>
                        <td>{s.ref || 'direct'}</td>
                        <td>{s.entry || '/'}</td>
                        <td>{[s.dev, s.br].filter(Boolean).join(', ')}</td>
                        <td>{s.tz ? s.tz.split('/').pop().replace('_', ' ') : ''}</td>
                        <td className="n">{dur(s.act)}</td>
                        <td className="n">{s.sd && s.sd.home != null ? `${s.sd.home}%` : ''}</td>
                        <td>{acted(s) ? <b className="tag hot">Reached out</b> : engaged(s) ? <span className="tag">Engaged</span> : <span className="tag dim">Bounced</span>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </Panel>
          )}
        </>
      )}
    </div>
  )
}
