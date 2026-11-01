// The one-page spec for this site, shown in "How I built this site". Written like a product spec.
export const siteSpec = {
  title: 'This portfolio, as a product',
  columns: [
    ['The problem', "A hiring manager gives a portfolio about thirty seconds. A resume says what I did. It can't show how I think, or that the numbers are real."],
    ["Who it's for", 'Recruiters who skim, hiring managers who check the numbers, and other PMs who want the reasoning.'],
    ["How I'll know it works", 'Which buttons people click, and which shared link each visit came from. I can see both.'],
  ],
  decisions: [
    ['Show numbers only at three dates', 'The start, Oct–Nov 2025 and today are the only points I can source. The page never draws a line between them.'],
    ['A skim view and a full story', 'Readers have different amounts of time, so each chooses.'],
    ['One short link per message', 'Each link I send is numbered, so I learn which message worked.'],
    ['No cookies and no IP addresses', 'Visits are counted anonymously. Nobody should have to accept a banner to read a portfolio.'],
  ],
  news: [
    ['Reading as', 'Pick recruiter, hiring manager or fellow PM and the page adjusts.'],
    ['TeachOS time bar', 'Drag it to see the product at the start, in Oct–Nov 2025 and today.'],
    ['Skim or full story', 'Thirty seconds of numbers, or the reasoning behind them.'],
    ['Background as one timeline', 'Work and education on a single line, up to now.'],
    ['Short campaign links', 'Each link I share is tracked, so I learn which one worked.'],
  ],
}
