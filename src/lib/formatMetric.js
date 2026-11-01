// How a hero panel value is written. Used by the public panel and by the admin preview.
export function formatMetric(row, v) {
  if (row.fmt === 'pct') return `${Math.round(v)}%`
  if (row.step) return `${(Math.round(v / row.step) * row.step).toLocaleString('en-IN')}+`
  return Math.round(v).toLocaleString('en-IN')
}
