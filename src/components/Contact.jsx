import { profile } from '../content/profile.js'
import ResumeLink from './ResumeLink.jsx'

export default function Contact() {
  return (
    <>
      <section className="contact" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <h2 id="contact-h">Hiring for an AI product role? Let's talk.</h2>
          <p>I'm looking for APM and PM roles where AI is the product, not a feature. A 15-minute call is the quickest way to see if we fit. If you'd rather write, email me and I'll send back the case study and a resume.</p>
          <div className="cta">
            <a className="btn on-dark" href={`tel:${profile.phoneTel}`}>Call {profile.phoneDisplay}</a>
            <a className="btn ghost-dark" href={`mailto:${profile.email}?subject=${encodeURIComponent('AI product role')}`}>Email me</a>
            <ResumeLink className="btn ghost-dark">Download resume</ResumeLink>
            <a className="btn ghost-dark" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
            <a className="btn ghost-dark" href={profile.github} target="_blank" rel="noopener noreferrer">View my code</a>
          </div>
        </div>
      </section>
      <div className="wrap">
        <footer className="foot">Ankon Nandi, based in Hyderabad, India. Product figures come from NxtWave's internal analytics as of 1 Nov 2026. This site counts visits anonymously, with no cookies and no IP addresses.</footer>
      </div>
    </>
  )
}
