import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Cell } from '../types/matrix'

type MatrixContextType = {
  m: number
  n: number
  x: number // percentile 0..100
  setM: (v: number) => void
  setN: (v: number) => void
  setX: (v: number) => void
  matrix: Cell[][]
  generate: (m?: number, n?: number) => void
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined)

function randomThreeDigit(): number {
  // 100..999 inclusive
  return Math.floor(Math.random() * 900) + 100
}

export const MatrixProvider = ({ children }: { children: ReactNode }) => {
  const [m, setM] = useState<number>(3)
  const [n, setN] = useState<number>(4)
  const [x, setX] = useState<number>(60)
  const [matrix, setMatrix] = useState<Cell[][]>([])

  const generate = (mm?: number, nn?: number) => {
    const rows = mm ?? m
    const cols = nn ?? n
    if (rows <= 0 || cols <= 0) {
      setMatrix([])
      return
    }
    let id = 1
    const next: Cell[][] = []
    for (let i = 0; i < rows; i++) {
      const row: Cell[] = []
      for (let j = 0; j < cols; j++) {
        row.push({ id: id++, amount: randomThreeDigit() })
      }
      next.push(row)
    }
    setMatrix(next)
  }

  return (
    <MatrixContext.Provider value={{ m, n, x, setM, setN, setX, matrix, generate }}>
      {children}
    </MatrixContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMatrix = () => {
  const ctx = useContext(MatrixContext)
  if (!ctx) throw new Error('useMatrix must be used within MatrixProvider')
  return ctx
}
