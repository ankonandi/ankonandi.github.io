import { firebase } from './firebase.js'

function save(url, name) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}

// Downloads the resume uploaded from /admin if there is one, otherwise the PDF that ships with the site.
export async function openResume(staticUrl, fileName) {
  try {
    const data = await Promise.race([
      (async () => {
        const { db, fs } = await firebase()
        const snap = await fs.getDoc(fs.doc(db, 'files', 'resume'))
        return snap.exists() ? snap.data() : null
      })(),
      new Promise((res) => setTimeout(() => res(null), 3000)),
    ])
    if (data && data.b64) {
      const bytes = Uint8Array.from(atob(data.b64), (c) => c.charCodeAt(0))
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
      save(url, fileName)
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      return
    }
  } catch { /* fall through to the bundled file */ }
  save(staticUrl, fileName)
}
