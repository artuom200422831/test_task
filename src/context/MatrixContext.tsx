import { createContext, useContext, useState, type ReactNode } from "react";
import { type Cell } from "../types/matrix";

type MatrixContextType = {
  m: number;
  n: number;
  x: number; // percentile 0..100
  setM: (v: number) => void;
  setN: (v: number) => void;
  setX: (v: number) => void;
  matrix: Cell[][];
  generate: (m?: number, n?: number) => void;

  incrementCell: (id: number) => void;
  highlightNearest: (id: number, x: number) => void;

  hoveredCellId: number | null;
  highlightedIds: number[];
  setHighlightedIds: (ids: number[]) => void;
  hoveredRowIndex: number | null;
  setHoveredRowIndex: (index: number | null) => void;
};

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

function randomThreeDigit(): number {
  // 100..999 inclusive
  return Math.floor(Math.random() * 900) + 100;
}

export const MatrixProvider = ({ children }: { children: ReactNode }) => {
  const [m, setM] = useState<number>(3);
  const [n, setN] = useState<number>(4);
  const [x, setX] = useState<number>(60);
  const [matrix, setMatrix] = useState<Cell[][]>([]);
  const [hoveredCellId, setHoveredCellId] = useState<number | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const generate = (mm?: number, nn?: number) => {
    const rows = mm ?? m;
    const cols = nn ?? n;
    if (rows <= 0 || cols <= 0) {
      setMatrix([]);
      return;
    }
    let id = 1;
    const next: Cell[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({ id: id++, amount: randomThreeDigit() });
      }
      next.push(row);
    }
    setMatrix(next);
  };

  const incrementCell = (id: number) => {
    setMatrix((prev) =>
      prev.map((row) =>
        row.map((cell) =>
          cell.id === id ? { ...cell, amount: cell.amount + 1 } : cell
        )
      )
    );
  };

  const highlightNearest = (id: number, x: number) => {
    const allCells = matrix.flat();
    const target = allCells.find((c) => c.id === id);
    if (!target) return;

    const nearest = allCells
      .filter((c) => c.id !== id)
      .map((c) => ({ ...c, diff: Math.abs(c.amount - target.amount) }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, x)
      .map((c) => c.id);

    setHoveredCellId(id);
    setHighlightedIds(nearest);
  };

  return (
    <MatrixContext.Provider
      value={{
        m,
        n,
        x,
        setM,
        setN,
        setX,
        matrix,
        generate,
        incrementCell,
        highlightNearest,
        hoveredCellId,
        highlightedIds,
        setHighlightedIds,
        hoveredRowIndex,
        setHoveredRowIndex,
      }}
    >
      {children}
    </MatrixContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMatrix = () => {
  const ctx = useContext(MatrixContext);
  if (!ctx) throw new Error("useMatrix must be used within MatrixProvider");
  return ctx;
};
