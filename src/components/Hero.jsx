import { Link } from 'react-router-dom'
import MetricsPanel from './MetricsPanel.jsx'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <h1>I take AI products from pilot to daily habit.</h1>
          <p className="lede">I'm the Associate Product Manager on TeachOS at NxtWave, and I own its product outputs. It's an LLM-powered platform that now runs about 26,000 evaluations a month for around 600 instructors across 51 institutes. It started as a 6-instructor pilot.</p>
          <p className="lede">M.Tech, IIIT Hyderabad. I find the problem in research and data, prototype it myself, and measure whether people actually change what they do.</p>
          <div className="cta">
            <Link className="btn on-dark" to="/teachos">Read the TeachOS case study</Link>
          </div>
        </div>
        <MetricsPanel />
      </div>
    </header>
  )
}
