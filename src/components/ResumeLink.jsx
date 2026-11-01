import { profile } from '../content/profile.js'
import { openResume } from '../lib/resume.js'

export default function ResumeLink({ className, children }) {
  return (
    <a
      className={className}
      href={profile.resumeUrl}
      download={profile.resumeFileName}
      data-track="resume"
      onClick={(e) => { e.preventDefault(); openResume(profile.resumeUrl, profile.resumeFileName) }}
    >
      {children}
    </a>
  )
}
