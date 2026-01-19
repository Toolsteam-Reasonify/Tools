import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import LearnPage from './pages/LearnPage.tsx'
import PracticePage from './pages/PracticePage.tsx'
import RealWorldApplications from './pages/RealWorldApplications.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
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
