// Public values only. The publishable key is safe in the browser because
// Row Level Security (see supabase/setup.sql) decides who can write.
export const supabaseConfig = {
  url: '',            // e.g. https://xxxx.supabase.co
  publishableKey: '', // starts with sb_publishable_
}
export const resumeBucket = 'resume'
export const resumeObject = 'Ankon_Nandi_Resume.pdf'
