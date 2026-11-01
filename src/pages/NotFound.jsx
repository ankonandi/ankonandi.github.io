import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingTop: 64 }}>
      <h1>Page not found</h1>
      <p><Link to="/">Go back to the home page</Link></p>
    </div>
  )
}
