import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './layout/Layout.jsx'
import Home from './pages/Home.jsx'
import TeachOS from './pages/TeachOS.jsx'
import NotFound from './pages/NotFound.jsx'
import ShortLink from './pages/ShortLink.jsx'
import { useAnalytics } from './lib/useAnalytics.js'

const Admin = lazy(() => import('./pages/Admin.jsx'))

function ScrollToHash() {
  const { pathname, hash, key } = useLocation()
  // key changes on every navigation, including a click on a link to the address you are already at,
  // so Contact scrolls again after you have scrolled away from it.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, key])
  return null
}

// Keeps the tab title and canonical address right when someone moves between pages without a reload.
const pageMeta = {
  '/': ['Ankon Nandi | Associate Product Manager, AI | IIIT Hyderabad', 'https://ankonandi.github.io/'],
  '/teachos': ['TeachOS case study | Ankon Nandi, Associate Product Manager', 'https://ankonandi.github.io/teachos/'],
}

function PageMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const m = pageMeta[pathname.replace(/\/+$/, '') || '/']
    if (!m) return
    document.title = m[0]
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', m[1])
  }, [pathname])
  return null
}

export default function App() {
  useAnalytics()
  return (
    <>
      <ScrollToHash />
      <PageMeta />
      <Routes>
        <Route path="r/*" element={<ShortLink />} />
        <Route path="t/*" element={<ShortLink to="/teachos" />} />
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
