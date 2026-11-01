// GitHub Pages serves 404.html for unknown paths. Copying index.html there lets
// client-side routes load on a direct visit or refresh. But that answers with HTTP 404, which search engines
// treat as "not a page". So /teachos also gets a real file, with its own title, description and crawlable text.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const home = readFileSync('dist/index.html', 'utf8')
copyFileSync('dist/index.html', 'dist/404.html')

const title = 'TeachOS case study | Ankon Nandi, Associate Product Manager'
const desc = 'How TeachOS grew from a 6-instructor pilot to about 26,000 AI evaluations a month: six problems, the decisions behind them and the metrics. By Ankon Nandi.'
const url = 'https://ankonandi.github.io/teachos'
const shell = `<!--seo:shell-->
      <main id="seo-shell">
        <h1>TeachOS case study: an AI product from pilot to daily habit</h1>
        <p>How Ankon Nandi, Associate Product Manager, grew TeachOS at NxtWave from a 6-instructor pilot to about 26,000 AI evaluations a month for around 600 instructors across 45+ institutes. Six problems, each found in interviews or data, the decisions behind them, and the metrics.</p>
        <p>Also covers Manager Connect, a separate product Ankon built and owns for weekly manager and instructor 1:1s.</p>
        <p><a href="/">Back to Ankon Nandi's portfolio</a></p>
      </main>
    <!--/seo:shell-->`

const page = home
  .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`)
  .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
  .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
  .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
  .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`)
  .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
  .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`)
  .replace(/<!--seo:shell-->[\s\S]*?<!--\/seo:shell-->/, shell)

mkdirSync('dist/teachos', { recursive: true })
writeFileSync('dist/teachos/index.html', page)
console.log('postbuild: dist/404.html and dist/teachos/index.html written')
