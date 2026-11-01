import { supabaseConfig, resumeBucket, resumeObject } from '../lib/config.js'

const fileName = 'Ankon_Nandi_Resume.pdf'

// When Supabase is configured the resume comes from the admin upload.
// ?download= makes the browser save the file instead of opening it, even though it is on another origin.
const hosted = supabaseConfig.url
  ? `${supabaseConfig.url}/storage/v1/object/public/${resumeBucket}/${resumeObject}?download=${fileName}`
  : null

// Single source of truth for contact details and links.
export const profile = {
  name: 'Ankon Nandi',
  role: 'Associate Product Manager, AI',
  email: 'YOUR_EMAIL_HERE',
  phoneDisplay: '+91 XXXXX XXXXX',
  phoneTel: '+91XXXXXXXXXX',
  linkedin: 'https://www.linkedin.com/in/ankon-nandi',
  github: 'https://github.com/ankonandi',
  resumeUrl: hosted || `/${fileName}`,
  resumeFileName: fileName,
}
