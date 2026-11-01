import { Link } from 'react-router-dom'
import MetricsPanel from './MetricsPanel.jsx'
import Fold from './Fold.jsx'

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <h1>I take AI products from pilot to daily habit.</h1>
          <Fold>
            <p className="lede">I'm the Associate Product Manager on TeachOS at NxtWave, and I drive its product strategy, roadmap and delivery. It's an LLM-powered platform that now runs about 26,000 evaluations a month for around 600 instructors across 45+ institutes. It started as a 6-instructor pilot.</p>
            <p className="lede">I find the problem in research and data, prototype it myself, and measure whether people actually change what they do.</p>
          </Fold>
          <p className="hero-meta">M.Tech, IIIT Hyderabad</p>
          <div className="cta">
            <Link className="btn on-dark" to="/teachos">Read the TeachOS case study</Link>
          </div>
        </div>
        <MetricsPanel />
      </div>
    </header>
  )
}
