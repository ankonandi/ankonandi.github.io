export default function Section({ id, title, sub, children }) {
  const h = `${id}-h`
  return (
    <section className="block" id={id} aria-labelledby={h}>
      <h2 className="title" id={h}>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      {children}
    </section>
  )
}
