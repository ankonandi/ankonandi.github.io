// Each row carries its own baseline month, because the baselines differ.
export const metricRows = [
  { label: 'AI evaluations a month', note: 'baseline Oct 2025', then: 13441, now: 26121, fmt: 'int', max: 26121 },
  { label: 'Instructors evaluated a month', note: 'baseline Oct 2025', then: 314, now: 584, fmt: 'int', max: 584 },
  { label: 'Lecture reports opened a month', note: 'baseline Nov 2025', then: 9707, now: 21224, fmt: 'int', max: 21224 },
  { label: 'Lectures with a pre-lecture demo', note: 'baseline Oct 2025, the month demos launched', then: 1.5, now: 40.1, fmt: 'pct', max: 100 },
  { label: 'Sessions on an external mic', note: 'baseline Nov 2025', then: 8, now: 31.7, fmt: 'pct', max: 100 },
  { label: 'Sessions flagged critically low quality', note: 'baseline Nov 2025. Lower is better', then: 17.1, now: 3.0, fmt: 'pct', max: 100 },
]

export const facts = [
  { big: '203K+', text: 'AI evaluations processed, covering 84K+ hours of classroom audio' },
  { big: '98%', text: 'of evaluations completing, up from 84% in Aug 2025' },
  { big: '450+', text: 'tasks shipped over 55 weekly sprints, and 64 killed on purpose' },
  { big: '2.2×', text: 'more lecture reports opened a month since Nov 2025, 9.7K to 21K, by 598 instructors' },
]
