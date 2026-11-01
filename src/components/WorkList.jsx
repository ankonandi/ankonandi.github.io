import Fold from './Fold.jsx'

// Ruled rows of work. Used for Selected work and for documents. The long text folds away in the skim view.
export default function WorkList({ items }) {
  return (
    <div className="work">
      {items.map((w) => (
        <article className="work-row" key={w.title}>
          <h3>{w.title}<small>{w.sub}</small></h3>
          <Fold><p>{w.body}</p></Fold>
          <div className="out">{w.out}</div>
        </article>
      ))}
    </div>
  )
}
