import { facts } from '../content/metrics.js'

export default function Facts() {
  return (
    <div className="facts" aria-label="Headline numbers">
      {facts.map((f) => (
        <div className="fact" key={f.big}>
          <b>{f.big}</b>
          <span>{f.text}</span>
        </div>
      ))}
    </div>
  )
}
