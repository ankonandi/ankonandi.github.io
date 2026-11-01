import Hero from '../components/Hero.jsx'
import Facts from '../components/Facts.jsx'
import Section from '../components/Section.jsx'
import WorkList from '../components/WorkList.jsx'
import { work } from '../content/work.jsx'
import Timeline from '../components/Timeline.jsx'
import { principles, tools } from '../content/about.js'

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
          <Timeline />
        </Section>
      </div>
    </>
  )
}
