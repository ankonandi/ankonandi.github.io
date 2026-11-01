import { useEffect, useRef, useState } from 'react'
import { siteSpec } from '../content/site.js'
import { track } from '../lib/track.js'
import { useReader } from '../lib/reader.jsx'

// Floats over the top of the home page: availability, who is reading, short or full, jump to, what's new.
export default function TopBar({ onJump }) {
  const { reader, who, skim, setSkim, ask } = useReader()
  const [news, setNews] = useState(false)
  const box = useRef(null)

  useEffect(() => {
    if (!news) return undefined
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setNews(false) }
    const esc = (e) => { if (e.key === 'Escape') setNews(false) }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc) }
  }, [news])

  return (
    <div className="px-top">
      <div className="px-top-in">
        <span className="px-chip px-open"><i className="px-dot2" />Open to APM and PM roles</span>
        <button type="button" className={who ? 'px-chip' : 'px-chip hint'} onClick={() => ask(false)}>
          <i className="px-dot" /><span className="px-lbl">Reading as </span><b>{reader.chip}</b>
        </button>
        <div className="px-mode" role="group" aria-label="Reading mode">
          <button type="button" aria-pressed={skim} onClick={() => setSkim(true, 'mode-skim')}>Skim</button>
          <button type="button" aria-pressed={!skim} onClick={() => setSkim(false, 'mode-full')}>Full story</button>
        </div>
        <button type="button" className="px-chip" onClick={onJump}>Jump to</button>
        <div className="px-newswrap" ref={box}>
          <button type="button" className="px-chip px-news-btn" aria-expanded={news} onClick={() => { setNews((v) => !v); if (!news) track('click', 'news-open') }}>
            <i className="px-dot" />What's new
          </button>
          {news && (
            <div className="px-news">
              <h2>What's new on this site</h2>
              <ol>
                {siteSpec.news.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
