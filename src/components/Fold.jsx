// Long text that folds away in the skim view. The grid-rows trick animates height without measuring it.
export default function Fold({ children }) {
  return <div className="px-fold"><div>{children}</div></div>
}
