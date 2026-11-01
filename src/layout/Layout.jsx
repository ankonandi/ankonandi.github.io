import { Outlet } from 'react-router-dom'
import Rail from './Rail.jsx'
import Contact from '../components/Contact.jsx'
import { ReaderProvider } from '../lib/reader.jsx'
import { TimeProvider } from '../lib/time.jsx'

export default function Layout() {
  return (
    <ReaderProvider>
      <TimeProvider>
        <div className="shell">
          <a className="skip" href="#content">Skip to content</a>
          <Rail />
          <main id="content">
            <Outlet />
            <Contact />
          </main>
        </div>
      </TimeProvider>
    </ReaderProvider>
  )
}
