import { Link } from 'react-router-dom'
import { profile } from './profile.js'
import LiveEvals from '../components/LiveEvals.jsx'

export const work = [
  {
    title: 'TeachOS',
    sub: 'NxtWave. Associate Product Manager',
    body: 'The instructor operating system for NIAT: prepare, teach, get AI feedback, practice, get coached, raise issues. I own strategy, the roadmap, delivery and the metrics.',
    out: (
      <>
        <LiveEvals /><br />
        <Link className="btn small" to="/teachos">Read the case study</Link>
      </>
    ),
  },
  {
    title: 'Manager Connect',
    sub: 'A separate product. I own it end to end',
    body: 'I designed, built and still run this product myself in Replit: the code, the database and the maintenance. It was designed from the start to sit inside TeachOS as an embedded page, so teachers get it with no engineering effort. That was a product-led decision, not an engineering embed, and it is its own product. It handles 1:1 scheduling, recording, transcripts, an AI session report, and action items that sync back to the instructor. Managers are users too: their coaching is recorded, reported and scored.',
    out: (
      <>
        <span className="mark">3,000+</span> 1:1s with 17 managers<br />
        <Link className="btn small" to="/teachos#manager-connect">See how it works</Link>
      </>
    ),
  },
  {
    title: 'AdCraft AI',
    sub: 'Final-year project, IIIT Hyderabad. Built with Ashwani Raj',
    body: "An AI toolkit for India's micro-creators who sell physical products online. It writes product listings and platform-specific captions, puts every sales channel behind one tracked product link, and generates campaigns. It began with five research ideas scored out of 30, then customer validation, personas, a PRD and MVP testing.",
    out: (
      <>
        <a className="btn small" href="https://ai-adcraft3.lovable.app/" target="_blank" rel="noopener noreferrer">Try the live MVP</a><br />
        <a className="btn small ghost" href="https://github.com/ankonandi/AdCraft_AI" target="_blank" rel="noopener noreferrer">View the code</a>
      </>
    ),
  },
  {
    title: 'Prototyping lab',
    sub: 'Lovable, Replit, Claude',
    body: 'About 20 Lovable prototypes, about 15 Replit prototypes with 10 to 15 of them deployed, and, more recently, about 10 interactive HTML prototypes. Proofs of concept include Training and Teaching Mode, AI Assessment and Manager Connect.',
    out: (
      <>
        Proven before engineering invested<br />
        <a className="btn small" href={`mailto:${profile.email}?subject=${encodeURIComponent('Prototype walkthrough')}`}>Ask for a walkthrough</a>
      </>
    ),
  },
]
