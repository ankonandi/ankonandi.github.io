import { estimate } from '../content/teachos.jsx'

export default function WhyTeachOS() {
  return (
    <div className="why">
      <div>
        <h3>Why TeachOS exists</h3>
        <p>In 2025 NxtWave grew to 18 universities. The quality of teaching had to stay at the same level on every campus, and that takes an audit layer. Auditing by people is expensive, because someone has to sit through every class.</p>
        <p>So we built a tool that audits classes for us, and it solved two problems at once:</p>
        <ul className="outs">
          <li>Instructors get feedback on every session and improve.</li>
          <li>Leadership sees what is happening in every class, end to end, and quality stays consistent across sessions.</li>
        </ul>
      </div>
      <div className="est" role="group" aria-labelledby="est-h">
        <h4 id="est-h">What manual auditing would cost</h4>
        <p className="note">A guesstimate. One auditor reviews about 130 hours of class a month (22 days at 6 productive hours), on a salary of Rs 70,000 to 80,000.</p>
        <table>
          <thead>
            <tr><th scope="col">Month</th><th scope="col">Audio to review</th><th scope="col">Auditors</th><th scope="col">Cost a month</th></tr>
          </thead>
          <tbody>
            {estimate.map((e) => (
              <tr key={e.month}>
                <th scope="row">{e.month}</th>
                <td>{e.hours}</td>
                <td>{e.auditors}</td>
                <td className={e.total ? 'total' : undefined}>{e.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="fine">That is about Rs 9 to 10 crore a year at today's volume. Even if auditors listened at 1.5x speed it would be about Rs 50 to 57 lakh a month. Salary only, so real cost would be higher.</p>
      </div>
    </div>
  )
}
