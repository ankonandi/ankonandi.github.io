import { estimate } from '../content/teachos.jsx'

export default function WhyTeachOS() {
  return (
    <div className="why">
      <div>
        <h3>Why TeachOS exists</h3>
        <p>In 2025 NxtWave grew to 18 universities. The quality of teaching had to stay at the same level on every campus, and that takes an audit layer. Auditing by people is expensive, because an auditor has to be in the room for the whole class, and can only be in one room at a time.</p>
        <p>So we built a tool that audits classes for us, and it solved three problems at once:</p>
        <ul className="outs">
          <li>Instructors get feedback on every session and improve.</li>
          <li>Leadership sees what is happening in every class, end to end, and quality stays consistent across sessions.</li>
          <li>Each instructor's performance is visible class by class, which one auditor in one room at a time could never cover.</li>
        </ul>
      </div>
      <div className="est" role="group" aria-labelledby="est-h">
        <h4 id="est-h">What manual auditing would cost</h4>
        <p className="note">A guesstimate. An auditor sits in the class for its full length, so one auditor covers about 130 class hours a month (22 days at 6 productive hours), on a salary of Rs 70,000 to 80,000. Class hours are the audio hours TeachOS processed.</p>
        <table>
          <thead>
            <tr><th scope="col">Month</th><th scope="col">Class hours to cover</th><th scope="col">Auditors in class</th><th scope="col">Cost a month</th></tr>
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
        <p className="fine">That is about Rs 9 to 10 crore a year at today's volume. Salary only, so real cost would be higher. And even that buys one auditor in one class at a time, not a view of every class.</p>
      </div>
    </div>
  )
}
