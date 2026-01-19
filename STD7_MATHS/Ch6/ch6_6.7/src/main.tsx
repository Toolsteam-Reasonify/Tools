import React from 'react'
import ReactDOM from 'react-dom/client'
import InteractiveTriangleCanvas from './components/InteractiveTriangleCanvas.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InteractiveTriangleCanvas />
  </React.StrictMode>,
)
