export const HOUR = 3600000
export const DAY = 86400000

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const PRESETS = [
  ['today', 'Today'],
  ['yesterday', 'Yesterday'],
  ['24h', 'Last 24 hours'],
  ['7d', 'Last 7 days'],
  ['30d', 'Last 30 days'],
  ['90d', 'Last 90 days'],
]

export function autoGroup(from, to) {
  return to - from <= 2 * DAY + HOUR ? 'hour' : 'day'
}

export function presetRange(id) {
  const now = new Date()
  let from
  let to = now
  if (id === 'today') from = startOfDay(now)
  else if (id === 'yesterday') { to = new Date(startOfDay(now).getTime() - 1); from = startOfDay(to) }
  else if (id === '24h') from = new Date(now.getTime() - DAY)
  else if (id === '7d') from = new Date(startOfDay(now).getTime() - 6 * DAY)
  else if (id === '30d') from = new Date(startOfDay(now).getTime() - 29 * DAY)
  else from = new Date(startOfDay(now).getTime() - 89 * DAY)
  return { id, from, to, group: autoGroup(from, to) }
}

// datetime-local inputs speak "YYYY-MM-DDTHH:mm" in local time.
export const toInput = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
export const fromInput = (s) => new Date(s)

export const fmtDate = (d) => d.toLocaleString('en-IN', { day: 'numeric', month: 'short' })
export const fmtDateTime = (d) => d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
export const fmtHour = (d) => d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric' })
export const fmtRange = (from, to) => `${fmtDateTime(from)} to ${fmtDateTime(to)}`

export function rel(d, now = new Date()) {
  const s = Math.round((now - d) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  return `${Math.round(s / 86400)} d ago`
}

export function dur(sec) {
  const s = Math.round(sec || 0)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${String(s % 60).padStart(2, '0')}s`
}
