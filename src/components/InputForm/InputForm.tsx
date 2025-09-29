import React from "react";
import { useMatrix } from "../../context/MatrixContext";
import "./InputForm.css";

export default function InputForm() {
  const { m, n, x, setM, setN, setX, generate, addRow } = useMatrix();

  const onGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const mm = Math.max(0, Math.min(100, Math.floor(m)));
    const nn = Math.max(0, Math.min(100, Math.floor(n)));
    const xx = Math.max(0, Math.min(100, Math.floor(x)));
    setM(mm);
    setN(nn);
    setX(xx);
    generate(mm, nn);
  };

  return (
    <form className="form" onSubmit={onGenerate}>
      <div className="form-row">
        <label>Rows (M)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={m}
          onChange={(e) => setM(Number(e.target.value))}
        />
      </div>

      <div className="form-row">
        <label>Columns (N)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
      </div>

      <div className="form-row">
        <label>Percentile (X)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
        />
        <small>0..100 — percentile calculated per column</small>
      </div>

      <div className="form-row actions">
        <button type="submit">Generate matrix</button>
        <br />
        <button className="add-row-btn" onClick={addRow}>
          Add row
        </button>
      </div>
    </form>
  );
}
