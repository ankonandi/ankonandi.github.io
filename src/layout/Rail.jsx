import { Link } from 'react-router-dom'
import { profile } from '../content/profile.js'

const sections = [
  ['/#top', 'Overview'],
  ['/#work', 'Selected work'],
  ['/teachos', 'TeachOS case study'],
  ['/#how', 'How I work'],
  ['/#background', 'Background'],
  ['/#contact', 'Contact'],
]

export default function Rail() {
  return (
    <aside className="rail">
      <div>
        <p className="name">{profile.name}</p>
        <p className="role">{profile.role}</p>
      </div>
      <nav aria-label="Sections">
        {sections.map(([to, label]) => (
          <Link key={to} to={to}>{label}</Link>
        ))}
      </nav>
      <div className="rail-foot">
        <a className="btn" href={profile.resumeUrl} download={profile.resumeFileName}>Download resume</a>
        <a className="btn ghost" href={`tel:${profile.phoneTel}`}>Call me</a>
      </div>
    </aside>
  )
}
