import { Outlet } from 'react-router-dom';
import { ModeSwitcher, LanguageProvider, useLanguage, ErrorBoundary } from './components/Addition';

function AppShell() {
  const { isTransitioning, t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b bg-gradient-to-r from-teal-600 to-purple-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className={`text-sm sm:text-base md:text-lg font-semibold text-center sm:text-left transition-all duration-300 ${isTransitioning ? 'opacity-70 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              {t('simpleEquationsTitle')}
            </div>
          </div>
          <nav className="flex-none flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto justify-center sm:justify-end">
            <ModeSwitcher />
          </nav>
        </div>
      </header>
      <main className={`flex-1 w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6 transition-all duration-300 ${isTransitioning ? 'opacity-80 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        <Outlet />
      </main>
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
