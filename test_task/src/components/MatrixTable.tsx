import { useMatrix } from '../context/MatrixContext'
import { percentile } from '../utils/percentile'

export default function MatrixTable() {
  const { matrix, x } = useMatrix()

  if (!matrix || matrix.length === 0) {
    return <div className="empty">Matrix is empty. Set M and N & click Generate.</div>
  }

  const rows = matrix.length
  const cols = matrix[0].length

  // row sums
  const rowSums = matrix.map((r) => r.reduce((s, c) => s + c.amount, 0))

  // column values
  const colValues: number[][] = []
  for (let j = 0; j < cols; j++) {
    colValues[j] = []
    for (let i = 0; i < rows; i++) {
      colValues[j].push(matrix[i][j].amount)
    }
  }

  const colPercentiles = colValues.map((vals) => percentile(vals, x))

  return (
    <div className="table-wrap">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>#</th>
            {Array.from({ length: cols }).map((_, j) => (
              <th key={j}>Col {j + 1}</th>
            ))}
            <th>Row sum</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="row-label">Row {i + 1}</td>
              {row.map((cell) => (
                <td key={cell.id} className="cell">{cell.amount}</td>
              ))}
              <td className="row-sum">{rowSums[i]}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="percentile-row">
            <td className="row-label">{x}th percentile</td>
            {colPercentiles.map((v, j) => (
              <td key={j}>{Number.isNaN(v) ? '—' : v.toFixed(2)}</td>
            ))}
            <td className="row-sum">
              {colPercentiles.reduce((s, v) => s + (Number.isNaN(v) ? 0 : v), 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}