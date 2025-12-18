import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import DemoRoute from './routes/DemoRoute';
import PracticeRoute from './routes/PracticeRoute';
import AssessmentRoute from './routes/AssessmentRoute';
import RealWorldRoute from './routes/RealWorldRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <DemoRoute /> },
      { path: '/practice', element: <PracticeRoute /> },
      { path: '/assessment', element: <AssessmentRoute /> },
      { path: '/real-world', element: <RealWorldRoute /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);


