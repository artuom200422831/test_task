import "./App.css";
import InputForm from "./components/InputForm";
import MatrixTable from "./components/MatrixTable";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Matrix generator — React + TypeScript</h1>
        <p className="muted">
          Generate M × N cells (3-digit random numbers). Row sums + Xth
          percentile per column.
        </p>
      </header>

      <main>
        <aside>
          <InputForm />
        </aside>

        <section>
          <MatrixTable />
        </section>
      </main>

      <footer>
        <small>
          Implementation uses React Context, TypeScript and Vite. No Redux or UI
          libraries.
        </small>
      </footer>
    </div>
  );
}
