import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type Cell } from "../types/matrix";
import { type MatrixContextType } from "../types/matrix";
import randomThreeDigit from "../utils/randomThreeDigit";

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export const MatrixProvider = ({ children }: { children: ReactNode }) => {
  const [m, setM] = useState<number>(3);
  const [n, setN] = useState<number>(4);
  const [x, setX] = useState<number>(60);
  const [matrix, setMatrix] = useState<Cell[][]>([]);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const [idCounter, setIdCounter] = useState<number>(1);

  const generate = (mm?: number, nn?: number) => {
    const rows = mm ?? m;
    const cols = nn ?? n;
    if (rows <= 0 || cols <= 0) {
      setMatrix([]);
      return;
    }

    setIdCounter((prevId) => {
      let id = prevId;
      const next: Cell[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          id: id++,
          amount: randomThreeDigit(),
        }))
      );
      setMatrix(next);
      return id;
    });
  };

  const incrementCell = (id: number) => {
    setMatrix((prev) =>
      prev.map((row) => {
        const idx = row.findIndex((c) => c.id === id);
        if (idx === -1) return row;
        const updated = [...row];
        updated[idx] = { ...updated[idx], amount: updated[idx].amount + 1 };
        return updated;
      })
    );
  };

  const allCells = useMemo(() => matrix.flat(), [matrix]);

  const highlightNearest = (id: number, x: number) => {
    const total = allCells.length;

    const target = allCells.find((c) => c.id === id);
    if (!target) return;

    const limit = Math.min(x, total - 1);

    const nearest = allCells
      .filter((c) => c.id !== id)
      .map((c) => ({
        ...c,
        diff: Math.abs(c.amount - target.amount),
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, limit)
      .map((c) => c.id);

    setHighlightedIds(nearest);
  };

  const addRow = () => {
    if (n <= 0) return;

    let nextId = idCounter;
    const newRow: Cell[] = Array.from({ length: n }, () => ({
      id: nextId++,
      amount: randomThreeDigit(),
    }));

    setMatrix((prev) => [...prev, newRow]);
    setM((prev) => prev + 1);
    setIdCounter(nextId);
    setHighlightedIds([]);
  };

  const adjustHoveredRowIndex = (removedIndex: number) => {
    setHoveredRowIndex((prev) => {
      if (prev === null) return null;
      if (prev === removedIndex) return null;
      if (prev > removedIndex) return prev - 1;
      return prev;
    });
  };

  const removeRow = (index: number) => {
    setMatrix((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
    setM((prev) => Math.max(0, prev - 1));
    adjustHoveredRowIndex(index);
    setHighlightedIds([]);
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
        addRow,
        removeRow,
        hoveredRowIndex,
        setHoveredRowIndex,
        highlightedIds,
        setHighlightedIds,
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
