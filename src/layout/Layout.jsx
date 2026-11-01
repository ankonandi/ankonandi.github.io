import { Outlet } from 'react-router-dom'
import Rail from './Rail.jsx'

export default function Layout() {
  return (
    <div className="shell">
      <a className="skip" href="#content">Skip to content</a>
      <Rail />
      <main id="content">
        <Outlet />
      </main>
    </div>
  )
}
