import { useState } from 'react'
import Hero from '../components/Hero.jsx'
import Facts from '../components/Facts.jsx'
import Section from '../components/Section.jsx'
import WorkList from '../components/WorkList.jsx'
import Fold from '../components/Fold.jsx'
import Timeline from '../components/Timeline.jsx'
import SiteSpec from '../components/SiteSpec.jsx'
import TopBar from '../components/TopBar.jsx'
import TimeBar from '../components/TimeBar.jsx'
import WelcomePrompt from '../components/WelcomePrompt.jsx'
import JumpMenu from '../components/JumpMenu.jsx'
import { work } from '../content/work.jsx'
import { principles, tools } from '../content/about.js'

export default function Home() {
  const [jump, setJump] = useState(false)
  return (
    <>
      <TopBar onJump={() => setJump(true)} />
      <Hero />
      <div className="wrap">
        <Facts />

        <Section id="work" title="Selected work" sub="One product I run end to end, and the things I built myself along the way.">
          <WorkList items={work} />
        </Section>

        <Section id="how" title="How I work" sub="Five habits that show up in every project above.">
          <ul className="principles">
            {principles.map(([b, s]) => (
              <li key={b}><b>{b}</b><Fold><span>{s}</span></Fold></li>
            ))}
          </ul>
          <p className="tools"><b>Tools:</b> {tools}</p>
        </Section>

        <Section id="background" title="Background">
          <Timeline />
        </Section>

        <Section id="site" title="How I built this site" sub="I wrote a one-page spec for it first, the way I would for any product.">
          <SiteSpec />
        </Section>
      </div>
      <TimeBar />
      <WelcomePrompt />
      {jump && <JumpMenu onClose={() => setJump(false)} />}
    </>
  )
}
