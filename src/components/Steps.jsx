// A numbered sequence. Only used where the content really is an ordered flow.
export default function Steps({ label, steps }) {
  return (
    <ol className="loop" aria-label={label}>
      {steps.map(([t, s]) => (
        <li key={t}>{t}<small>{s}</small></li>
      ))}
    </ol>
  )
}
