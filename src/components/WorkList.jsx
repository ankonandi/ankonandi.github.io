// Ruled rows of work. Used for Selected work and for documents.
export default function WorkList({ items }) {
  return (
    <div className="work">
      {items.map((w) => (
        <article className="work-row" key={w.title}>
          <h3>{w.title}<small>{w.sub}</small></h3>
          <p>{w.body}</p>
          <div className="out">{w.out}</div>
        </article>
      ))}
    </div>
  )
}
