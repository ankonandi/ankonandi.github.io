// Copies text to the clipboard. Falls back to a hidden textarea where the clipboard API is blocked.
export async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch { /* try the fallback */ }
  try {
    const t = document.createElement('textarea')
    t.value = value
    t.setAttribute('readonly', '')
    t.style.cssText = 'position:fixed;left:-999px;top:0'
    document.body.appendChild(t)
    t.select()
    const ok = document.execCommand('copy')
    t.remove()
    return ok
  } catch {
    return false
  }
}
