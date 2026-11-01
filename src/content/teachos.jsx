const M = ({ children }) => <span className="mark">{children}</span>

export const loop = [
  ['Prepare', 'readiness gate, AI Assessment, demos'],
  ['Teach', 'reliable recording and attendance'],
  ['Get feedback', 'Snapshot report with playbooks'],
  ['Practice', 'practice with AI'],
  ['Get coached', 'Manager Connect 1:1s'],
  ['Raise issues', 'Zoho ticket with session context'],
]

export const estimate = [
  { month: 'Oct 2025', hours: '3,516 h', auditors: '~27', cost: 'Rs 19 to 21 lakh' },
  { month: 'Oct 2026', hours: '14,062 h', auditors: '~107', cost: 'Rs 75 to 85 lakh', total: true },
]

export const problems = [
  {
    title: "Classroom audio couldn't be trusted",
    key: 'Completion 84% to 98%',
    problem: 'Recordings were lost on reloads, tab switches and network drops. Most instructors taught on laptop mics, and some re-used old recordings to get a report.',
    did: [
      'Drove a rebuild into an offline-safe flow with auto-resume, single-tab locking and crash recovery.',
      'Added mic detection, external-mic enforcement with fallback, and checks on recording metadata.',
      'Ran root-cause analyses to find where recordings were still being lost.',
    ],
    result: (
      <>
        <M>83.6% to 97.9%</M> evaluation completion.<br />
        Auto-resume rescued <M>3,903</M> recordings in four months.<br />
        External mic use rose from 8% to 31.7%, and sessions flagged as critically low quality fell from 17.1% to 3.0%.
      </>
    ),
  },
  {
    title: 'Reports were an audit nobody used',
    key: 'Open rate 61% to 85%',
    problem: 'Reports came as Word files with long lists of actions. Interviews showed instructors felt judged, not coached.',
    did: [
      'Redesigned the report around one decision per session: a Session Snapshot with the top three improvement areas.',
      'Gave each area an Action Playbook, plus deltas against the previous session and timestamped audio.',
    ],
    result: (
      <>
        Report open rate went from <M>60.6% to 84.8%</M> after the Snapshot launched.<br />
        Reports opened per month rose from 9,707 to 21,224, with open rate still 78.7% at more than twice the volume.
      </>
    ),
  },
  {
    title: 'Instructors walked into class unprepared',
    key: 'Demo lectures 1.5% to 40%',
    problem: 'Instructors prepped minutes before class with only a slide link.',
    did: [
      'Built the preparation layer: a pre-lecture readiness gate, an AI Assessment that quizzes the instructor by voice, demo lectures, and a misconceptions tab.',
      'Gave managers visibility of preparation in Team Performance.',
    ],
    result: (
      <>
        Lectures with a demo went from <M>1.5% to 40.1%</M>.<br />
        The same instructor scores +0.20 out of 10 when prepared, and 67% of 303 instructors scored higher.
      </>
    ),
  },
  {
    title: 'Managers coached from memory',
    key: '1:1s a month 56 to 985',
    problem: '17 managers coach 500+ instructors, with informal 1:1s and no shared history.',
    did: [
      'Designed and built Manager Connect myself in Replit, end to end. It is a separate product that I still own, code, database and maintenance, and it appears inside TeachOS as an embedded page.',
      "Shaped Team Performance and manager scorecards around it. Managers are judged on how they coach, and their outcomes are tied to their instructors' outcomes, because their reportees are instructors.",
    ],
    result: (
      <>
        <M>3,009</M> 1:1s completed for 520 instructors by 17 managers in six months.<br />
        Monthly 1:1s grew from 56 to 985, and transcript readiness from 40% to 86%.
      </>
    ),
  },
  {
    title: 'Attendance ate teaching time',
    key: '~10 min to ~2 min',
    problem: 'Multi-round photo attendance took a large slice of every class, and instructor issues had no tracked channel.',
    did: [
      'Led QR attendance from pilot to rollout on four campuses, working with campus operations on devices, network and policy.',
      'Built Zoho ticketing that passes session context automatically.',
    ],
    result: (
      <>
        Attendance went from about 10 minutes on paper, to about 5 with photos, to about <M>2 with QR</M>, and it is more authentic and harder to fake.<br />
        Issues raised with full context grew from 19 to 2,144 a month.
      </>
    ),
  },
  {
    title: 'Missing recordings were blamed on Wi-Fi',
    key: '25 instructors, 45% of gaps',
    problem: '15.7% of offline lectures had no recording, and the default explanation was connectivity.',
    did: ['Ran the root-cause analysis on the data myself and set product, operational and escalation actions.'],
    result: (
      <>
        The gap was behavioral, not network: most were recordings that never started, and just <M>25 instructors</M> accounted for <M>45%</M> of missed lecture recordings. The fix moved from infrastructure to product and compliance.
      </>
    ),
  },
]

export const mcFlow = [
  ['Open slots', 'manager drags a duration onto the calendar, or duplicates last week'],
  ['Book', 'instructor requests one slot a week'],
  ['Approve', 'manager approves or rejects, not within 30 minutes of the start'],
  ['Confirm', 'both get an email with a calendar invite'],
  ['Meet link', 'added by the manager, unlocks 30 minutes before'],
  ['Close out', 'completed or missed, with action items for both sides'],
]

export const mcRules = [
  "Slots can't be created in the past, and only open slots can be edited.",
  'A booked session is canceled from its own page, never from the slot list.',
  "A session happening today can't be rescheduled in the app.",
  'Reminders go out shortly before a session and only once.',
  'Action items become read-only once saved.',
]

export const mgrPoints = [
  ['Judged on how they coach', 'Every 1:1 gets a meeting link and is recorded, so the coaching itself is visible and managers are measured on it, not only instructors.'],
  ['Reports and scorecards', "Reports are generated from the sessions, and manager scorecards are built from them."],
  ["Their results are their reportees' results", "A manager's reportees are instructors, so a manager's outcomes are directly tied to how their instructors do."],
]

export const mcViews = [
  "Managers: a weekly dashboard with total, completed, scheduled, not booked and missed, a completion rate, pending approvals and today's sessions, plus a color-coded team view and each instructor's history.",
  "Instructors: a status card for the week, their counts, full session history and the action items from every completed 1:1.",
]
