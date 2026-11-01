import { profile } from '../content/profile.js'

export default function Home() {
  return (
    <header className="hero" id="top">
      <div className="wrap">
        <h1>I take AI products from pilot to daily habit.</h1>
        <p>Foundation is in place. The hero, selected work and the rest arrive in the next commits.</p>
        <div className="cta">
          <a className="btn on-dark" href={profile.resumeUrl} download={profile.resumeFileName}>Download resume</a>
          <a className="btn ghost-dark" href={`tel:${profile.phoneTel}`}>Call me</a>
          <a className="btn ghost-dark" href={`mailto:${profile.email}`}>Email me</a>
        </div>
      </div>
    </header>
  )
}
