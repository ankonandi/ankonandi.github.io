import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './layout/Layout.jsx'
import Home from './pages/Home.jsx'
import TeachOS from './pages/TeachOS.jsx'
import NotFound from './pages/NotFound.jsx'
import { useAnalytics } from './lib/useAnalytics.js'

const Admin = lazy(() => import('./pages/Admin.jsx'))

function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  useAnalytics()
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="teachos" element={<TeachOS />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
