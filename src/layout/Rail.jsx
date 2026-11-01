import { Link, useLocation } from 'react-router-dom'
import { profile } from '../content/profile.js'
import { useScrollSpy } from '../hooks/useScrollSpy.js'

const sections = [
  ['/#top', 'top', 'Overview'],
  ['/#work', 'work', 'Selected work'],
  ['/teachos', 'teachos', 'TeachOS case study'],
  ['/#how', 'how', 'How I work'],
  ['/#background', 'background', 'Background'],
  ['/#contact', 'contact', 'Contact'],
]

// On the case-study page the TeachOS sub-sections all count as "TeachOS case study".
const caseStudy = ['teachos', 'manager-connect', 'docs', 'cut']

export default function Rail() {
  const { pathname } = useLocation()
  const onCase = pathname.startsWith('/teachos')
  const ids = onCase ? [...caseStudy, 'contact'] : ['top', 'work', 'how', 'background', 'contact']
  const spy = useScrollSpy(ids, [pathname])
  const current = onCase && caseStudy.includes(spy) ? 'teachos' : spy

  return (
    <aside className="rail">
      <div>
        <p className="name">{profile.name}</p>
        <p className="role">{profile.role}</p>
      </div>
      <nav aria-label="Sections">
        {sections.map(([to, id, label]) => (
          <Link key={to} to={to} aria-current={id === current ? 'true' : undefined}>{label}</Link>
        ))}
      </nav>
      <div className="rail-foot">
        <a className="btn" href={profile.resumeUrl} download={profile.resumeFileName}>Download resume</a>
        <a className="btn ghost" href={`tel:${profile.phoneTel}`}>Call me</a>
      </div>
    </aside>
  )
}
