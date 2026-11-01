import { useMemo } from 'react'
import { acted, engaged, analyze, buckets } from './stats.js'
import { TimeChart, Funnel, Bars, Stacked, int, pct } from './charts.jsx'
import { dur, rel, fmtDateTime } from './range.js'

// Deep analysis for one campaign link: who opened it, how far they went, what they did, and how it compares
// with every other visit in the same range.
const sum = (list, f) => list.reduce((a, s) => a + (f(s) || 0), 0)
const mean = (list, f) => (list.length ? sum(list, f) / list.length : 0)
const median = (nums) => {
  const a = nums.slice().sort((x, y) => x - y)
  if (!a.length) return 0
  const m = Math.floor(a.length / 2)
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2
}
const caseStudy = (s) => (s.paths || []).includes('/teachos')
const reachedContact = (s) => (s.sections || []).includes('contact')
const ACTION_NAMES = { call: 'Call', email: 'Email', resume: 'Resume', linkedin: 'LinkedIn', github: 'GitHub', 'live-mvp': 'AdCraft', 'open-case-study': 'Case study link' }

function Block({ title, note, children, wide }) {
  return (
    <section className={`a-panel${wide ? ' wide' : ''}`}>
      <h3>{title}</h3>
      {note && <p className="a-panel-note">{note}</p>}
      {children}
    </section>
  )
}

function rates(list) {
  const n = list.length
  return {
    n,
    engaged: n ? list.filter(engaged).length / n : 0,
    acted: n ? list.filter(acted).length / n : 0,
    study: n ? list.filter(caseStudy).length / n : 0,
    contact: n ? list.filter(reachedContact).length / n : 0,
    avg: mean(list, (s) => s.act),
    scroll: mean(list.filter((s) => s.sd && s.sd.home != null), (s) => s.sd.home),
  }
}

function Compare({ mine, rest }) {
  const rows = [
    ['Engaged', mine.engaged, rest.engaged, (v) => `${Math.round(v * 100)}%`],
    ['Opened the case study', mine.study, rest.study, (v) => `${Math.round(v * 100)}%`],
    ['Reached Contact', mine.contact, rest.contact, (v) => `${Math.round(v * 100)}%`],
    ['Called, emailed or got the resume', mine.acted, rest.acted, (v) => `${Math.round(v * 100)}%`],
    ['Average active time', mine.avg, rest.avg, dur],
    ['Average scroll of the home page', mine.scroll, rest.scroll, (v) => `${Math.round(v)}%`],
  ]
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th>Measure</th><th className="n">This link</th><th className="n">All other visits</th><th className="n">Difference</th></tr></thead>
        <tbody>{rows.map(([label, a, b, f]) => {
          const d = b ? ((a - b) / b) * 100 : null
          return (
            <tr key={label}>
              <td>{label}</td><td className="n"><b>{f(a)}</b></td><td className="n">{rest.n ? f(b) : '–'}</td>
              <td className="n">{d === null || Math.abs(d) < 1 ? <span className="delta flat">{rest.n ? 'same' : '–'}</span> : <span className={`delta ${d > 0 ? 'up' : 'down'}`}>{d > 0 ? '+' : '−'}{Math.abs(Math.round(d))}%</span>}</td>
            </tr>
          )
        })}</tbody>
      </table>
    </div>
  )
}

function actions(s) {
  return Object.entries(s.clicks || {})
    .filter(([k]) => ACTION_NAMES[k])
    .map(([k, v]) => (v > 1 ? `${ACTION_NAMES[k]} ×${v}` : ACTION_NAMES[k]))
}

export default function LinkDetail({ link, sessions, all, range, onBack }) {
  const mine = sessions
  const rest = useMemo(() => { const ids = new Set(mine.map((s) => s.id)); return all.filter((s) => !ids.has(s.id)) }, [all, mine])
  const a = useMemo(() => analyze(mine), [mine])
  const r = useMemo(() => rates(mine), [mine])
  const rr = useMemo(() => rates(rest), [rest])
  const series = useMemo(() => buckets(mine, range.from, range.to, range.group), [mine, range])
  const people = new Set(mine.map((s) => s.vid || s.id)).size
  const repeat = useMemo(() => {
    const m = new Map()
    mine.forEach((s) => m.set(s.vid || s.id, (m.get(s.vid || s.id) || 0) + 1))
    return [...m.values()].filter((v) => v > 1).length
  }, [mine])
  const visits = useMemo(() => mine.slice().sort((x, y) => y.start - x.start).slice(0, 200), [mine])
  const last = mine.reduce((m, s) => (s.start > m ? s.start : m), new Date(0))
  const first = mine.reduce((m, s) => (s.start < m ? s.start : m), new Date(8.64e15))
  const med = median(mine.map((s) => s.act || 0))

  return (
    <div className="ld">
      <button type="button" className="ld-back" onClick={onBack}>‹ All links</button>
      <header className="ld-head">
        <div>
          <h2>Link {link.code}</h2>
          <p className="ld-tags">
            {[['Sent to', link.src], ['Medium', link.med], ['Campaign', link.cmp], ['Version', link.cnt]].filter((x) => x[1]).map(([k, v]) => <span key={k} className="chip"><small>{k}</small>{v}</span>)}
          </p>
        </div>
        <p className="ld-when">{mine.length ? <>Opened {int(mine.length)} time{mine.length === 1 ? '' : 's'} in this range<br />First {fmtDateTime(first)} · last {rel(last)}</> : 'Not opened in this range'}</p>
      </header>

      {mine.length === 0 ? (
        <p className="empty-state"><b>No visits from this link in the selected range.</b>Widen the range above, for example to 90 days or all time, to see its full history.</p>
      ) : (
        <>
          <dl className="kpis">
            <div className="kpi"><dt>Visits</dt><dd>{int(mine.length)}</dd><div className="kpi-foot"><span className="delta flat">{int(people)} different {people === 1 ? 'person' : 'people'}{repeat ? ` · ${int(repeat)} came back` : ''}</span></div></div>
            <div className="kpi"><dt>Engaged</dt><dd>{pct(mine.filter(engaged).length, mine.length)}</dd><div className="kpi-foot"><span className="delta flat">10 s, 2 pages or a click</span></div></div>
            <div className="kpi"><dt>Reached out</dt><dd>{pct(mine.filter(acted).length, mine.length)}</dd><div className="kpi-foot"><span className="delta flat">{int(mine.filter(acted).length)} call, email or resume</span></div></div>
            <div className="kpi"><dt>Active time</dt><dd>{dur(r.avg)}</dd><div className="kpi-foot"><span className="delta flat">Typical visit {dur(med)}</span></div></div>
          </dl>

          <div className="cols">
            <Block title="Visits over time" wide><TimeChart data={series} group={range.group} /></Block>
            <Block title="What happened after they opened it" note="Each step is a share of this link's visits."><Funnel steps={a.funnel} /></Block>
            <Block title="Compared with everything else" note={rest.length ? `This link against the other ${int(rest.length)} visits in the same range.` : 'No other visits in this range to compare with.'}><Compare mine={r} rest={rr} /></Block>
            <Block title="Sections they reached" note="Counts visits that had the section on screen."><Bars rows={a.sections} total={a.n} /></Block>
            <Block title="What they clicked"><Bars rows={a.cta.filter((c) => c[2] > 0).map((c) => [c[0], c[2]])} total={a.n} empty="No clicks on calls to action yet" /></Block>
            <Block title="How far they scrolled: home page"><Funnel steps={a.scrollHome.steps.map(([l, v]) => [`${l} of the page`, v])} /></Block>
            <Block title="How far they scrolled: case study"><Funnel steps={a.scrollCase.steps.map(([l, v]) => [`${l} of the page`, v])} /></Block>
            <Block title="Time actually spent" note="Only seconds when the tab is visible and the person is interacting."><Bars rows={a.activeTime} total={a.n} /></Block>
            <Block title="TeachOS time bar" note="Which date they picked in the hero panel."><Bars rows={a.phases} empty="Nobody used the time bar" /></Block>
            <Block title="New and returning"><Stacked rows={a.visitorType} /></Block>
            <Block title="Devices"><Stacked rows={a.devices} /></Block>
            <Block title="Countries" note="Estimated from the browser time zone."><Bars rows={a.countries.slice(0, 8)} total={a.n} /></Block>
            <Block title="Browsers and systems"><Bars rows={[...a.browsers.slice(0, 4), ...a.systems.slice(0, 4)]} total={a.n} /></Block>
          </div>

          <Block title={`Every visit${mine.length > visits.length ? ` (latest ${visits.length})` : ''}`} note="One row per visit. The person column is a short anonymous code, so the same code means the same browser." wide>
            <div className="tbl-wrap">
              <table className="tbl visits">
                <thead><tr><th>When</th><th>Person</th><th>Device</th><th>Country</th><th className="n">Pages</th><th className="n">Active</th><th className="n">Scroll</th><th>Reached</th><th>Did</th></tr></thead>
                <tbody>{visits.map((s) => {
                  const acts = actions(s)
                  return (
                    <tr key={s.id}>
                      <td>{fmtDateTime(s.start)}</td>
                      <td><code>{(s.vid || s.id).slice(-4)}</code> {s.nw === false ? <span className="tag">Returning</span> : <span className="tag dim">New</span>}</td>
                      <td>{[s.dev, s.br, s.os].filter(Boolean).join(' · ')}</td>
                      <td>{s.tz ? s.tz.split('/').pop().replace('_', ' ') : ''}</td>
                      <td className="n">{s.pv || 0}</td>
                      <td className="n">{dur(s.act || 0)}</td>
                      <td className="n">{s.sd && s.sd.home != null ? `${Math.round(s.sd.home)}%` : ''}</td>
                      <td>{(s.sections || []).length ? `${(s.sections || []).length} section${(s.sections || []).length === 1 ? '' : 's'}` : ''}{caseStudy(s) ? ' · case study' : ''}</td>
                      <td>{acts.length ? <span className={acted(s) ? 'tag hot' : 'tag'}>{acts.join(', ')}</span> : ''}</td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          </Block>
        </>
      )}
    </div>
  )
}
