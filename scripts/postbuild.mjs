// GitHub Pages serves 404.html for unknown paths. Copying index.html there lets
// client-side routes such as /teachos load on a direct visit or refresh.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('postbuild: dist/404.html written')
