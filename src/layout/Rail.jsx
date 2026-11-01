import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile, siteInfo } from '../content/profile.js'
import { phases } from '../content/metrics.js'
import { useReader } from '../lib/reader.jsx'
import { useTime } from '../lib/time.jsx'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import ResumeLink from '../components/ResumeLink.jsx'

const sections = [
  ['/#top', 'top', 'Overview'],
  ['/#work', 'work', 'Selected work'],
  ['/teachos', 'teachos', 'TeachOS case study'],
  ['/#how', 'how', 'How I work'],
  ['/#background', 'background', 'Background'],
  ['/#site', 'site', 'How I built this site'],
  ['/#contact', 'contact', 'Contact'],
]

// Phone tab bar: five tabs. How I work and Background share the About tab.
const icons = {
  top: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
  work: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  teachos: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11M9 8h6',
  how: 'M12 3a4.5 4.5 0 0 1 2.5 8.2V14h-5v-2.8A4.5 4.5 0 0 1 12 3zM9.5 17h5M10.5 20h3',
  contact: 'M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z',
}
const tabs = [
  ['/#top', 'top', 'Home', ['top']],
  ['/#work', 'work', 'Work', ['work']],
  ['/teachos', 'teachos', 'TeachOS', ['teachos']],
  ['/#how', 'how', 'About', ['how', 'background', 'site']],
  ['/#contact', 'contact', 'Contact', ['contact']],
]

// On the case-study page the TeachOS sub-sections all count as "TeachOS case study".
const caseStudy = ['teachos', 'manager-connect', 'docs', 'cut']

export default function Rail() {
  const { pathname } = useLocation()
  const { who, reader, ask } = useReader()
  const { phase } = useTime()
  const onHome = pathname === '/'
  const onCase = pathname.startsWith('/teachos')
  const ids = onCase ? [...caseStudy, 'contact'] : ['top', 'work', 'how', 'background', 'site', 'contact']
  const spy = useScrollSpy(ids, [pathname])
  // Highlight a clicked item immediately and keep it while the smooth scroll runs, so the highlight
  // does not flicker through the sections in between.
  const [picked, setPicked] = useState(null)
  const pick = (id) => { setPicked(id); setTimeout(() => setPicked(null), 1200) }
  const live = onCase && caseStudy.includes(spy) ? 'teachos' : spy
  const current = picked || live

  return (
    <aside className="rail">
      <div>
        <p className="name">{profile.name}</p>
        <p className="role">{profile.role}</p>
      </div>
      <nav aria-label="Sections">
        {sections.map(([to, id, label]) => (
          <Link key={to} to={to} onClick={() => pick(id)} aria-current={id === current ? 'true' : undefined}>{label}</Link>
        ))}
      </nav>
      {onHome && (
        <div className="px-rail-extra">
          <div className="px-viewing" aria-live="polite">Viewing TeachOS as of<b>{phases[phase].when}</b><span>{phases[phase].blurb}</span></div>
          {who && (
            <div className="px-reading">
              <button type="button" className="px-readbtn" onClick={() => ask(false)} aria-label={`Reading as ${reader.chip}. Change`}>
                <span>Reading as <b>{reader.chip}</b></span><span className="px-change">Change</span>
              </button>
              <Link to={`/#${reader.start[0]}`}>Start here: {reader.start[1]}</Link>
            </div>
          )}
          <p className="px-ver">Portfolio v{siteInfo.version}. Updated {siteInfo.updated}.</p>
        </div>
      )}
      <div className="rail-foot">
        <ResumeLink className="btn"><span className="long">Download resume</span><span className="short">Resume</span></ResumeLink>
        <a className="btn ghost" href={`tel:${profile.phoneTel}`}><span className="long">Call me</span><span className="short">Call</span></a>
      </div>
      <nav className="tabbar" aria-label="Main">
        {tabs.map(([to, id, label, match]) => (
          <Link key={to} to={to} onClick={() => pick(id)} aria-current={match.includes(current) ? 'true' : undefined}>
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={icons[id]} /></svg>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
