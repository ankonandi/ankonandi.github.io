import { Link } from 'react-router-dom'

export const work = [
  {
    title: 'TeachOS',
    sub: 'NxtWave. Product lead',
    body: 'The instructor operating system for NIAT: prepare, teach, get AI feedback, practise, get coached, raise issues. I own strategy, the roadmap, delivery and the metrics.',
    out: (
      <>
        <span className="mark">26K+</span> evaluations a month<br />
        <Link to="/teachos">Read the case study</Link>
      </>
    ),
  },
  {
    title: 'Manager Connect',
    sub: 'A separate product. I own it end to end',
    body: 'I designed, built and still run this product myself in Replit: the code, the database and the maintenance. Managers and instructors see it inside TeachOS because engineering embedded it as a page, but it is its own product. It handles 1:1 scheduling, recording, transcripts, an AI session report, and action items that sync back to the instructor.',
    out: (
      <>
        <span className="mark">3,000+</span> 1:1s with 17 managers<br />
        <Link to="/teachos#manager-connect">See how it works</Link>
      </>
    ),
  },
  {
    title: 'AdCraft AI',
    sub: 'Final-year project, IIIT Hyderabad. Built with Ashwani Raj',
    body: "An AI toolkit for India's micro-creators who sell physical products online. It writes product listings and platform-specific captions, puts every sales channel behind one tracked product link, and generates campaigns. It began with five research ideas scored out of 30, then customer validation, personas, a PRD and MVP testing.",
    out: (
      <>
        <a href="https://ai-adcraft3.lovable.app/">Live MVP</a><br />
        <a href="https://github.com/ankonandi/AdCraft_AI">GitHub</a>
      </>
    ),
  },
  {
    title: 'Prototyping lab',
    sub: 'Lovable, Replit, Claude',
    body: 'A level-1 class video analysis proof of concept that engineering later took through testing, about 20 Lovable prototypes with 10 to 15 of them deployed (including a full TeachOS clone used to test flows before any production code), and, more recently, about 10 interactive HTML prototypes.',
    out: <>Proven before engineering invested</>,
  },
]
