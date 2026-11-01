import { useEffect, useState } from 'react'
import { metricRows } from '../content/metrics.js'
import { firebase } from './firebase.js'

// The numbers in src/content/metrics.js are the default. If /admin has saved newer values to
// Firestore, those replace the defaults for the rows they cover. If Firestore is slow or down,
// the page simply keeps the defaults.
export function useMetricRows() {
  const [rows, setRows] = useState(metricRows)
  useEffect(() => {
    let stop = false
    ;(async () => {
      try {
        const { db, fs } = await firebase()
        const snap = await fs.getDoc(fs.doc(db, 'config', 'metrics'))
        const saved = snap.exists() ? snap.data().rows : null
        if (!saved || stop) return
        setRows(metricRows.map((r) => {
          const v = saved[r.label]
          return Array.isArray(v) && v.length === 3 ? { ...r, vals: v } : r
        }))
      } catch { /* keep defaults */ }
    })()
    return () => { stop = true }
  }, [])
  return rows
}
