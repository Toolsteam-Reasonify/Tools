import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import { LearnPage, PracticePage, RealWorldApplications } from './components/Addition'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LearnPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="real-world" element={<RealWorldApplications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
