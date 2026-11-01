import Section from '../components/Section.jsx'
import Steps from '../components/Steps.jsx'
import WhyTeachOS from '../components/WhyTeachOS.jsx'
import Problems from '../components/Problems.jsx'
import WorkList from '../components/WorkList.jsx'
import { loop, mcFlow, mcRules, mcViews, mgrPoints } from '../content/teachos.jsx'
import { docs } from '../content/docs.jsx'

export default function TeachOS() {
  return (
    <div className="wrap">
      <Section id="teachos" title="TeachOS in six problems" sub="Each one started from something I found in interviews or data, not a feature request. The product grew in the order instructors needed it.">
        <WhyTeachOS />
        <Steps label="The teaching loop TeachOS covers" steps={loop} />
        <Problems />
      </Section>

      <Section id="manager-connect" title="Manager Connect up close" sub="A separate product I built and own. It runs the weekly 1:1 between a Capability Manager and each instructor, from booking to action items, and opens from inside TeachOS with no separate login. It has two personas, instructors and managers, and managers are measured too.">
        <Steps label="The weekly 1:1 flow" steps={mcFlow} />
        <div className="two">
          <div>
            <h3>Rules built into the flow</h3>
            <ul>{mcRules.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
          <div>
            <h3>What each person sees</h3>
            <ul>{mcViews.map((v) => <li key={v}>{v}</li>)}</ul>
          </div>
        </div>
        <h3 className="subhead">Managers are a persona too</h3>
        <ul className="principles">
          {mgrPoints.map(([b, s]) => (
            <li key={b}><b>{b}</b><span>{s}</span></li>
          ))}
        </ul>
      </Section>

      <Section id="docs" title="Product documents" sub="Guides that real users followed to book and run their weekly 1:1s.">
        <WorkList items={docs} />
      </Section>

      <Section id="cut" title="What I cut, and what is still broken" sub="A roadmap is also the list of things you decided not to build, and the problem you haven't solved yet.">
        <div className="two">
          <div>
            <span className="big">64</span>
            <h3>tasks killed after evaluation</h3>
            <p>Out of about 594, with 450 shipped. Dropped ideas included weekly summary reports, missing-recording alerts, AI 1:1 summaries, an in-house ticketing system and self-serve re-uploads. That freed engineering time for work that moved metrics, and about a third of what shipped hardened recording, evaluation and data integrity.</p>
          </div>
          <div>
            <span className="big">6.4 / 10</span>
            <h3>average lecture QA, flat while adoption rose</h3>
            <p>I surfaced this in my own platform audit. Phase one made TeachOS universal; phase two is making it change teaching. The roadmap is now six data-backed problem statements, each with a baseline. The rubric scale moved in March 2026, so I don't compare QA further back.</p>
          </div>
        </div>
      </Section>
    </div>
  )
}
