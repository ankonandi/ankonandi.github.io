// Three phases per row: at the start, when the changes shipped (Oct to Nov 2025), and today.
// A string value means there was no number to show for that phase.
export const phases = [
  { id: 'start', label: 'At the start', blurb: 'Before these features existed' },
  { id: 'launch', label: 'Oct–Nov 2025', blurb: 'The month each change shipped' },
  { id: 'now', label: 'Today', blurb: 'October 2026' },
]

export const metricRows = [
  { label: 'Instructors evaluated a month', note: 'The start was a 6-instructor pilot', fmt: 'int', step: 100, max: 600, vals: ['6, a pilot', 314, 584] },
  { label: 'AI evaluations a month', note: 'Oct 2025 and Oct 2026', fmt: 'int', step: 1000, max: 26000, vals: ['Pilot only', 13441, 26121] },
  { label: 'Lectures with a pre-lecture demo', note: 'Demos launched in Oct 2025', fmt: 'pct', max: 100, vals: ['Did not exist', 1.5, 40.1] },
  { label: 'Lecture reports opened', note: 'Share of lectures whose report was opened. Nov 2025, Feb 2026 (after the Session Snapshot), Oct 2026', fmt: 'pct', max: 100, vals: [60.6, 84.8, 84] },
  { label: 'Manager 1:1s a month', note: 'Manager Connect did not exist in Oct–Nov 2025', fmt: 'int', step: 1000, max: 1000, vals: ['Did not exist', 'Did not exist', 985] },
  { label: 'Sessions flagged critically low quality', note: 'Nov 2025 to today. Lower is better', fmt: 'pct', max: 100, vals: ['Not measured', 17.1, 3.0] },
]

export const facts = [
  { big: '203K+', text: 'AI evaluations processed, covering 84K+ hours of classroom audio' },
  { big: '98%', text: 'of evaluations completing, up from 84% in Aug 2025' },
  { big: '450+', text: 'tasks shipped over 55 weekly sprints, and 64 killed on purpose' },
  { big: '2.2×', text: 'more lecture reports opened a month since Nov 2025, 9.7K to 21K, by 598 instructors' },
]
