import { profile } from '../content/profile.js'

export default function Contact() {
  return (
    <>
      <section className="contact" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <h2 id="contact-h">Hiring for an AI product role?</h2>
          <p>I'm looking for APM and PM roles where AI is the product, not a feature. Call or email, whichever is easier.</p>
          <div className="cta">
            <a className="btn on-dark" href={`tel:${profile.phoneTel}`}>Call {profile.phoneDisplay}</a>
            <a className="btn ghost-dark" href={`mailto:${profile.email}`}>Email me</a>
            <a className="btn ghost-dark" href={profile.resumeUrl} download={profile.resumeFileName}>Download resume</a>
            <a className="btn ghost-dark" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn ghost-dark" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </section>
      <div className="wrap">
        <footer className="foot">Ankon Nandi, Hyderabad, India. Figures are from internal product analytics as of 1 Nov 2026.</footer>
      </div>
    </>
  )
}
