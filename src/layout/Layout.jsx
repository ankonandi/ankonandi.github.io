import { Outlet } from 'react-router-dom'
import Rail from './Rail.jsx'
import Contact from '../components/Contact.jsx'

export default function Layout() {
  return (
    <div className="shell">
      <a className="skip" href="#content">Skip to content</a>
      <Rail />
      <main id="content">
        <Outlet />
        <Contact />
      </main>
    </div>
  )
}
