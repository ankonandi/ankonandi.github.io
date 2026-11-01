import Hero from '../components/Hero.jsx'
import Facts from '../components/Facts.jsx'
import Section from '../components/Section.jsx'
import WorkList from '../components/WorkList.jsx'
import { work } from '../content/work.jsx'
import { principles, tools, background } from '../content/about.js'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="wrap">
        <Facts />

        <Section id="work" title="Selected work" sub="One product I run end to end, and the things I built myself along the way.">
          <WorkList items={work} />
        </Section>

        <Section id="how" title="How I work" sub="Five habits that show up in every project above.">
          <ul className="principles">
            {principles.map(([b, s]) => (
              <li key={b}><b>{b}</b><span>{s}</span></li>
            ))}
          </ul>
          <p className="tools"><b>Tools:</b> {tools}</p>
        </Section>

        <Section id="background" title="Background">
          <table className="bg">
            <caption className="sr-only">Experience and education</caption>
            <tbody>
              {background.map(([org, roles, dates]) => (
                <tr key={org}>
                  <th scope="row">{org}</th>
                  <td>{roles.map((r, i) => <span key={r}>{i > 0 && <br />}{r}</span>)}</td>
                  <td>{dates.map((d, i) => <span key={d}>{i > 0 && <br />}{d}</span>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </>
  )
}
