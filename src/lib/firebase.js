// Firebase is loaded on demand so the first paint never waits for it.
// This config is public by design. Access is controlled by firestore.rules, not by hiding these values.
const config = {
  apiKey: 'AIzaSyA9tdbWhq2D4TbDFxkpEOXUO8neovShR-Y',
  authDomain: 'ankon-portfolio-2026.firebaseapp.com',
  projectId: 'ankon-portfolio-2026',
  appId: '1:642134923132:web:d024c3d3f4670a695176f9',
}

// Only these Google accounts can open /admin. The same list is enforced in firestore.rules.
export const ADMINS = ['ankon.iiit.exps@gmail.com', 'ankonandi5002@gmail.com']

let cached
export function firebase() {
  if (!cached) {
    cached = (async () => {
      const [{ initializeApp }, fs] = await Promise.all([import('firebase/app'), import('firebase/firestore')])
      const app = initializeApp(config)
      return { app, db: fs.getFirestore(app), fs }
    })()
  }
  return cached
}

export async function authKit() {
  const { app } = await firebase()
  const a = await import('firebase/auth')
  return { auth: a.getAuth(app), a }
}
