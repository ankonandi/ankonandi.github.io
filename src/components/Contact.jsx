import { profile } from '../content/profile.js'
import ResumeLink from './ResumeLink.jsx'
import { copyText } from '../lib/copy.js'
import { track } from '../lib/track.js'
import { useReader } from '../lib/reader.jsx'

export default function Contact() {
  const { toast } = useReader()
  const copy = async () => {
    track('click', 'copy-email')
    toast((await copyText(profile.email)) ? 'Email copied' : profile.email)
  }
  return (
    <>
      <section className="contact" id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <h2 id="contact-h">Hiring a product manager? Let's talk.</h2>
          <p>I'm looking for APM and PM roles where I can own a product from the problem to the results. A 15-minute call is the quickest way to see if we fit. Call or email, whichever is easier.</p>
          <div className="cta">
            <a className="btn on-dark" href={`tel:${profile.phoneTel}`}>Call {profile.phoneDisplay}</a>
            <a className="btn ghost-dark" href={`mailto:${profile.email}?subject=${encodeURIComponent('Product role')}`}>Email me</a>
            <ResumeLink className="btn ghost-dark">Download resume</ResumeLink>
            <a className="btn ghost-dark" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
            <a className="btn ghost-dark" href={profile.github} target="_blank" rel="noopener noreferrer">View my code</a>
          </div>
          <p className="px-copyline">{profile.email}<button type="button" onClick={copy}>Copy email</button></p>
        </div>
      </section>
      <div className="wrap">
        <footer className="foot">Ankon Nandi, Hyderabad, India. Figures are from internal product analytics as of 1 Nov 2026. Visits are counted anonymously. No cookies, no IP address.</footer>
      </div>
    </>
  )
}
