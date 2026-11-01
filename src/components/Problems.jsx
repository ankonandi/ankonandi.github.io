import { problems } from '../content/teachos.jsx'

// Native <details name="p"> gives a one-open-at-a-time accordion with no state.
export default function Problems() {
  return (
    <div className="problems">
      {problems.map((p, i) => (
        <details name="p" key={p.title} open={i === 0}>
          <summary>
            <h3>{p.title}</h3>
            <span className="key">{p.key}</span>
            <span className="chev" aria-hidden="true" />
          </summary>
          <div className="p-body">
            <div>
              <h4>The problem</h4>
              <p>{p.problem}</p>
              <h4 className="gap">What I did</h4>
              <ul>{p.did.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
            <div className="result">
              <h4>Result</h4>
              <p>{p.result}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}
