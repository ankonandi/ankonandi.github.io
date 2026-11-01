import { HOUR, startOfDay } from './range.js'

export function toSession(doc) {
  const x = doc.data()
  const date = (v) => (v && v.toDate ? v.toDate() : new Date(0))
  return { id: doc.id, ...x, start: date(x.start), last: date(x.last) }
}

const ACTIONS = ['call', 'email', 'resume']
const clicksOf = (s, k) => (s.clicks && s.clicks[k]) || 0
export const engaged = (s) => (s.act || 0) >= 10 || (s.pv || 0) >= 2 || Object.keys(s.clicks || {}).length > 0
export const acted = (s) => ACTIONS.some((k) => clicksOf(s, k) > 0)

const sum = (list, f) => list.reduce((a, s) => a + (f(s) || 0), 0)
const mean = (list, f) => (list.length ? sum(list, f) / list.length : 0)
const median = (nums) => {
  const a = nums.filter((n) => n > 0).sort((x, y) => x - y)
  if (!a.length) return 0
  const m = Math.floor(a.length / 2)
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2
}
function tally(list, keyFn) {
  const m = new Map()
  list.forEach((s) => { const k = keyFn(s); if (k) m.set(k, (m.get(k) || 0) + 1) })
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

export function kpis(list) {
  const n = list.length
  const homeScroll = list.filter((s) => s.sd && s.sd.home != null)
  return {
    visits: n,
    visitors: new Set(list.map((s) => s.vid)).size,
    views: sum(list, (s) => s.pv),
    avgAct: mean(list, (s) => s.act),
    engagedRate: n ? list.filter(engaged).length / n : 0,
    contactRate: n ? list.filter(acted).length / n : 0,
    actions: list.filter(acted).length,
    avgScroll: mean(homeScroll, (s) => s.sd.home),
    newShare: n ? list.filter((s) => s.nw).length / n : 0,
  }
}

const bucketKey = (d, group) =>
  group === 'hour'
    ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()).getTime()
    : startOfDay(d).getTime()

export function buckets(list, from, to, group) {
  const out = []
  const idx = new Map()
  let d = new Date(bucketKey(from, group))
  while (d <= to && out.length < 800) {
    idx.set(d.getTime(), out.length)
    out.push({ t: d.getTime(), visits: 0, views: 0, acts: 0 })
    d = group === 'hour' ? new Date(d.getTime() + HOUR) : new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  }
  list.forEach((s) => {
    const i = idx.get(bucketKey(s.start, group))
    if (i === undefined) return
    out[i].visits += 1
    out[i].views += s.pv || 0
    if (acted(s)) out[i].acts += 1
  })
  return out
}

export function heatmap(list) {
  const grid = Array.from({ length: 7 }, () => Array(24).fill(0))
  list.forEach((s) => { grid[(s.start.getDay() + 6) % 7][s.start.getHours()] += 1 })
  return grid
}

const TZ_COUNTRY = {
  'Asia/Kolkata': 'India', 'Asia/Calcutta': 'India', 'Asia/Dubai': 'UAE', 'Asia/Singapore': 'Singapore',
  'Asia/Karachi': 'Pakistan', 'Asia/Dhaka': 'Bangladesh', 'Asia/Colombo': 'Sri Lanka', 'Asia/Kathmandu': 'Nepal',
  'Asia/Tokyo': 'Japan', 'Asia/Shanghai': 'China', 'Asia/Hong_Kong': 'Hong Kong', 'Asia/Riyadh': 'Saudi Arabia',
  'Europe/London': 'United Kingdom', 'Europe/Berlin': 'Germany', 'Europe/Paris': 'France', 'Europe/Amsterdam': 'Netherlands',
  'Europe/Dublin': 'Ireland', 'Europe/Madrid': 'Spain', 'Europe/Zurich': 'Switzerland', 'Europe/Stockholm': 'Sweden',
  'America/New_York': 'United States', 'America/Chicago': 'United States', 'America/Denver': 'United States',
  'America/Los_Angeles': 'United States', 'America/Phoenix': 'United States', 'America/Toronto': 'Canada',
  'America/Vancouver': 'Canada', 'America/Sao_Paulo': 'Brazil', 'Australia/Sydney': 'Australia',
  'Australia/Melbourne': 'Australia', 'Pacific/Auckland': 'New Zealand', 'Africa/Lagos': 'Nigeria',
  'Africa/Johannesburg': 'South Africa', 'Africa/Cairo': 'Egypt',
}
const country = (s) => (s.tz ? TZ_COUNTRY[s.tz] || s.tz : '')

const SECTIONS = [
  ['work', 'Selected work'], ['how', 'How I work'], ['background', 'Background'], ['contact', 'Contact'],
  ['teachos', 'Case study: six problems'], ['manager-connect', 'Case study: Manager Connect'],
  ['docs', 'Case study: documents'], ['cut', 'Case study: what I cut'],
]
const CTA = [
  ['call', 'Call'], ['email', 'Email'], ['resume', 'Resume download'], ['linkedin', 'LinkedIn'],
  ['github', 'GitHub'], ['live-mvp', 'AdCraft live MVP'], ['open-case-study', 'Opened the case study'],
]

function scrollFunnel(list, path, key) {
  const base = list.filter((s) => s.paths && s.paths.includes(path))
  return {
    base: base.length,
    steps: [20, 40, 60, 80, 100].map((lvl) => [`${lvl}%`, base.filter((s) => ((s.sd && s.sd[key]) || 0) >= lvl).length]),
  }
}

export function analyze(list) {
  const n = list.length
  const actedList = list.filter(acted)
  const byCta = CTA.map(([k, label]) => [label, sum(list, (s) => clicksOf(s, k)), list.filter((s) => clicksOf(s, k) > 0).length])
  const sources = tally(list, (s) => s.ref || 'direct').map(([name, visits]) => {
    const group = list.filter((s) => (s.ref || 'direct') === name)
    return { name, visits, engaged: group.filter(engaged).length, acted: group.filter(acted).length }
  })
  const act = [
    ['Under 10 s', (s) => (s.act || 0) < 10],
    ['10 to 30 s', (s) => (s.act || 0) >= 10 && (s.act || 0) < 30],
    ['30 to 60 s', (s) => (s.act || 0) >= 30 && (s.act || 0) < 60],
    ['1 to 3 min', (s) => (s.act || 0) >= 60 && (s.act || 0) < 180],
    ['Over 3 min', (s) => (s.act || 0) >= 180],
  ].map(([label, f]) => [label, list.filter(f).length])
  return {
    n,
    sources,
    entry: tally(list, (s) => s.entry),
    pages: tally(list.flatMap((s) => (s.paths || []).map((p) => ({ p }))), (x) => x.p),
    devices: tally(list, (s) => s.dev),
    browsers: tally(list, (s) => s.br),
    systems: tally(list, (s) => s.os),
    countries: tally(list, country),
    languages: tally(list, (s) => (s.lang ? s.lang.split('-')[0] : '')),
    visitorType: [['New visitors', list.filter((s) => s.nw).length], ['Returning visitors', list.filter((s) => s.nw === false).length]],
    scrollHome: scrollFunnel(list, '/', 'home'),
    scrollCase: scrollFunnel(list, '/teachos', 'teachos'),
    sections: SECTIONS.map(([id, label]) => [label, list.filter((s) => s.sections && s.sections.includes(id)).length]),
    activeTime: act,
    phases: tally(list.flatMap((s) => (s.phases || []).map((p) => ({ p }))), (x) => x.p),
    cta: byCta,
    funnel: [
      ['Visited', n],
      ['Engaged (10 s, 2 pages or a click)', list.filter(engaged).length],
      ['Opened the case study', list.filter((s) => s.paths && s.paths.includes('/teachos')).length],
      ['Reached Contact', list.filter((s) => s.sections && s.sections.includes('contact')).length],
      ['Called, emailed or got the resume', actedList.length],
    ],
    perf: {
      load: median(list.map((s) => s.ld)),
      lcp: median(list.map((s) => s.lcp)),
      cls: median(list.map((s) => s.cls)),
      errors: list.filter((s) => (s.err || 0) > 0).length,
      measured: list.filter((s) => s.lcp).length,
    },
  }
}
