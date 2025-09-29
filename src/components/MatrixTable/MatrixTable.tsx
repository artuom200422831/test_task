import { useMemo } from "react";
import { useMatrix } from "../../context/MatrixContext";
import percentile from "../../utils/percentile";
import cn from "classnames";
import "./MatrixTable.css";

export default function MatrixTable() {
  const {
    matrix,
    x,
    highlightedIds,
    incrementCell,
    highlightNearest,
    setHighlightedIds,
    hoveredRowIndex,
    setHoveredRowIndex,
    removeRow,
  } = useMatrix();

  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;

  const { rowSums, rowAvgs, colPercentiles, overallAvg } = useMemo(() => {
    if (rows === 0 || cols === 0) {
      return { rowSums: [], rowAvgs: [], colPercentiles: [], overallAvg: 0 };
    }

    const rowSums = matrix.map((r) => r.reduce((s, c) => s + c.amount, 0));
    const rowAvgs = rowSums.map((s) => (cols > 0 ? s / cols : 0));

    const colValues: number[][] = [];
    for (let j = 0; j < cols; j++) {
      colValues[j] = [];
      for (let i = 0; i < rows; i++) {
        colValues[j].push(matrix[i][j].amount);
      }
    }

    const colPercentiles = colValues.map((vals) => percentile(vals, x));
    const totalSum = rowSums.reduce((s, v) => s + v, 0);
    const overallAvg = rows * cols > 0 ? totalSum / (rows * cols) : 0;

    return { rowSums, rowAvgs, colPercentiles, overallAvg };
  }, [matrix, x, rows, cols]);

  if (!matrix || matrix.length === 0) {
    return (
      <div className="empty">
        Matrix is empty. Set M and N & click Generate.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="matrix-table">
        <thead>
          <tr>
            <th>#</th>
            {Array.from({ length: cols }).map((_, j) => (
              <th key={j}>Col {j + 1}</th>
            ))}
            <th>Row avg</th>
            <th>Row sum</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => {
            const rowSum = rowSums[i];
            const maxInRow = Math.max(...row.map((c) => c.amount), 1);

            return (
              <tr key={i}>
                <td className="row-label">
                  Row {i + 1}
                  <button
                    className="row-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRow(i);
                    }}
                    title={`Remove row ${i + 1}`}
                    aria-label={`Remove row ${i + 1}`}
                  >
                    ×
                  </button>
                </td>

                {row.map((cell) => {
                  if (hoveredRowIndex === i) {
                    const percentOfTotal =
                      rowSum > 0
                        ? ((cell.amount / rowSum) * 100).toFixed(0)
                        : "0";
                    const intensity = (cell.amount / maxInRow) * 100;

                    return (
                      <td
                        key={cell.id}
                        className="cell"
                        style={
                          {
                            "--intensity": `${intensity}%`,
                          } as React.CSSProperties
                        }
                      >
                        {percentOfTotal}%
                      </td>
                    );
                  }

                  return (
                    <td
                      key={cell.id}
                      className={cn("cell", {
                        highlight: highlightedIds.includes(cell.id),
                      })}
                      onClick={() => incrementCell(cell.id)}
                      onMouseEnter={() => highlightNearest(cell.id, x)}
                      onMouseLeave={() => setHighlightedIds([])}
                    >
                      {cell.amount}
                    </td>
                  );
                })}

                <td className="row-avg">{rowAvgs[i].toFixed(2)}</td>

                <td
                  className="row-sum"
                  onMouseEnter={() => setHoveredRowIndex(i)}
                  onMouseLeave={() => setHoveredRowIndex(null)}
                >
                  {rowSum}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="percentile-row">
            <td className="row-label">{x}th percentile</td>

            {colPercentiles.map((v, j) => (
              <td key={j}>{Number.isNaN(v) ? "—" : v.toFixed(2)}</td>
            ))}

            <td className="row-avg">{overallAvg.toFixed(2)}</td>

            <td className="row-sum">
              {colPercentiles
                .reduce((s, v) => s + (Number.isNaN(v) ? 0 : v), 0)
                .toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
