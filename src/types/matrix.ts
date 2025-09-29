export type CellId = number;
export type CellValue = number;

export type Cell = {
  id: CellId;
  amount: CellValue;
}

export type MatrixContextType = {
  m: number;
  n: number;
  x: number;
  setM: (v: number) => void;
  setN: (v: number) => void;
  setX: (v: number) => void;
  matrix: Cell[][];
  generate: (m?: number, n?: number) => void;

  incrementCell: (id: number) => void;
  highlightNearest: (id: number, x: number) => void;

  addRow: () => void;
  removeRow: (index: number) => void;
  hoveredRowIndex: number | null;
  setHoveredRowIndex: (index: number | null) => void;
  highlightedIds: number[];
  setHighlightedIds: (ids: number[]) => void;
};