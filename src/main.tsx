import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { MatrixProvider } from './context/MatrixContext'
import "./index.css";

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MatrixProvider>
      <App />
    </MatrixProvider>
  </React.StrictMode>
)