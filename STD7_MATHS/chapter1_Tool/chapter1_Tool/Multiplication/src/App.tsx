import { Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import DemoRoute from './routes/DemoRoute';
import PracticeRoute from './routes/PracticeRoute';
import RealWorldRoute from './routes/RealWorldRoute';
import ModeSwitcher from './features/MultiplicationVisualization/SharedControls/ModeSwitcher';

function AppShell() {
  const { t, isTransitioning } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-brand-700 text-white sticky top-0 z-50 shadow-soft">
        <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 flex flex-wrap items-center gap-1 sm:gap-2">
          <div className="flex-1 min-w-0">
            <div className={`text-xs sm:text-sm md:text-base lg:text-lg font-semibold truncate transition-all duration-300 ${isTransitioning ? 'opacity-70 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <span className="inline sm:hidden">🔢 Multiplication Tool</span>
              <span className="hidden sm:inline">🔢 Multiplication Learning Tool - Visual & Interactive</span>
            </div>
          </div>
          <nav className="flex-none flex items-center gap-1 overflow-x-auto">
            <ModeSwitcher />
          </nav>
        </div>
      </header>
      
      <main className={`flex-1 w-full max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 transition-all duration-300 ${isTransitioning ? 'opacity-80 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <Routes>
          <Route path="/" element={<DemoRoute />} />
          <Route path="/demo" element={<DemoRoute />} />
          <Route path="/practice" element={<PracticeRoute />} />
          <Route path="/real-world" element={<RealWorldRoute />} />
        </Routes>
      </main>
      
      <footer className="border-t bg-white">
        <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm text-slate-500 text-center sm:text-left">
          <span className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {t('footerText')}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppShell />
      </LanguageProvider>
    </ErrorBoundary>
  );
}