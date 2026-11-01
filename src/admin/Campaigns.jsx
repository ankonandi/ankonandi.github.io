import { useMemo } from 'react'
import { acted, engaged } from './stats.js'
import { int, pct } from './charts.jsx'
import { dur, rel } from './range.js'

// Campaign performance: how each campaign and each link you sent did, using the same
// "engaged" and "reached out" rules as the rest of the dashboard.
const sumBy = (list, f) => list.reduce((a, s) => a + (f(s) || 0), 0)
const caseStudy = (s) => (s.paths || []).includes('/teachos')

function stats(list) {
  const visitors = new Set(list.map((s) => s.vid || s.id)).size
  return {
    visits: list.length,
    visitors,
    study: list.filter(caseStudy).length,
    engaged: list.filter(engaged).length,
    acted: list.filter(acted).length,
    avg: list.length ? sumBy(list, (s) => s.act) / list.length : 0,
    last: list.reduce((m, s) => (s.start > m ? s.start : m), new Date(0)),
  }
}

const same = (s, t) => (s.ref || '') === (t.src || '') && (s.med || '') === (t.med || '') && (s.cmp || '') === (t.cmp || '') && (s.cnt || '') === (t.cnt || '')

export default function CampaignsView({ sessions, items }) {
  const codes = useMemo(() => Object.keys(items || {}).sort((a, b) => Number(b) - Number(a)), [items])
  const tagged = useMemo(() => sessions.filter((s) => s.cmp || s.med || s.cnt || codes.some((c) => same(s, items[c]))), [sessions, codes, items])

  const links = useMemo(() => codes.map((c) => {
    const t = items[c]
    return { code: c, ...t, ...stats(sessions.filter((s) => same(s, t))) }
  }), [codes, items, sessions])

  const campaigns = useMemo(() => {
    const names = new Set([...codes.map((c) => items[c].cmp || ''), ...tagged.map((s) => s.cmp || '')])
    return [...names].map((name) => ({
      name: name || 'No campaign',
      links: codes.filter((c) => (items[c].cmp || '') === name).length,
      ...stats(tagged.filter((s) => (s.cmp || '') === name)),
    })).sort((a, b) => b.visits - a.visits || a.name.localeCompare(b.name))
  }, [codes, tagged, items])

  const all = stats(tagged)
  const opened = links.filter((l) => l.visits > 0).length

  return (
    <>
      <dl className="kpis">
        <div className="kpi"><dt>Links created</dt><dd>{int(codes.length)}</dd><div className="kpi-foot"><span className="delta flat">All time</span></div></div>
        <div className="kpi"><dt>Links opened</dt><dd>{int(opened)}</dd><div className="kpi-foot"><span className="delta flat">{codes.length ? `${pct(opened, codes.length)} of your links, in this range` : 'None yet'}</span></div></div>
        <div className="kpi"><dt>Visits from links</dt><dd>{int(all.visits)}</dd><div className="kpi-foot"><span className="delta flat">{int(all.visitors)} different people</span></div></div>
        <div className="kpi"><dt>Reached out</dt><dd>{pct(all.acted, all.visits)}</dd><div className="kpi-foot"><span className="delta flat">{int(all.acted)} call, email or resume</span></div></div>
      </dl>

      <section className="a-panel wide">
        <h3>Campaign performance</h3>
        <p className="a-panel-note">Visits that came through your tagged links, grouped by campaign. Case study means the visit opened the TeachOS page. Engaged means 10 seconds active, 2 pages or a click.</p>
        {campaigns.length === 0 ? <p className="empty">No campaigns yet. Create a link in Campaign links and add a campaign name.</p> : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Campaign</th><th className="n">Links</th><th className="n">Visits</th><th className="n">People</th><th className="n">Case study</th><th className="n">Engaged</th><th className="n">Reached out</th><th className="n">Avg time</th></tr></thead>
              <tbody>{campaigns.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td><td className="n">{int(c.links)}</td><td className="n">{int(c.visits)}</td><td className="n">{int(c.visitors)}</td>
                  <td className="n">{pct(c.study, c.visits)}</td><td className="n">{pct(c.engaged, c.visits)}</td><td className="n">{pct(c.acted, c.visits)}</td><td className="n">{dur(c.avg)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>

      <section className="a-panel wide">
        <h3>Every link you sent</h3>
        <p className="a-panel-note">One row per link number. A link with no visits has not been opened in this range.</p>
        {links.length === 0 ? <p className="empty">You have not created a link yet.</p> : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Link</th><th>Sent to</th><th>Campaign</th><th>Version</th><th className="n">Visits</th><th className="n">Case study</th><th className="n">Engaged</th><th className="n">Reached out</th><th className="n">Avg time</th><th>Last opened</th></tr></thead>
              <tbody>{links.map((l) => (
                <tr key={l.code} className={l.visits ? '' : 'dim-row'}>
                  <td><b>{l.code}</b></td>
                  <td>{[l.src, l.med].filter(Boolean).join(' · ')}</td>
                  <td>{l.cmp || ''}</td><td>{l.cnt || ''}</td>
                  <td className="n">{int(l.visits)}</td>
                  <td className="n">{l.visits ? pct(l.study, l.visits) : ''}</td>
                  <td className="n">{l.visits ? pct(l.engaged, l.visits) : ''}</td>
                  <td className="n">{l.visits ? pct(l.acted, l.visits) : ''}</td>
                  <td className="n">{l.visits ? dur(l.avg) : ''}</td>
                  <td>{l.visits ? rel(l.last) : <span className="tag dim">Not opened</span>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
