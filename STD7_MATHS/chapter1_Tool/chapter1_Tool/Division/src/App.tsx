import { Link, Outlet, useLocation } from 'react-router-dom';
import ModeSwitcher from './features/DivisionVisualization/SharedControls/ModeSwitcher';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

function AppShell() {
  const { t, isTransitioning } = useLanguage();
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-brand-700 text-white sticky top-0 z-50 shadow-soft">
        <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className={`text-sm sm:text-base md:text-lg font-semibold truncate transition-all duration-300 ${isTransitioning ? 'opacity-70 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              {t('header')}
            </div>
          </div>
          <nav className="flex-none flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <ModeSwitcher />
          </nav>
        </div>
      </header>
      <main className={`flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-6 transition-all duration-300 ${isTransitioning ? 'opacity-80 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-3 text-xs sm:text-sm text-slate-500">
          <span className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            Division Tool · Powered by VisualizationStateContext · Progress tracked
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