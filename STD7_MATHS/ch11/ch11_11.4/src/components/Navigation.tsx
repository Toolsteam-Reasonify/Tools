import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Brain, ClipboardCheck, Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { language, setLanguage, t } = useLanguage()

  // All nav and title labels language-flexible
  const navItems = [
    { path: '/', label: t('learn'), icon: Brain },
    { path: '/practice', label: t('practice'), icon: ClipboardCheck },
    { path: '/real-world', label: t('realWorldNav'), icon: Globe }, // new translation key for Real World
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-gradient-to-r from-teal-500/90 to-purple-600/90 backdrop-blur-md border-b border-white/30 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left side - Navigation Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Center - Logo/Title (standard form) */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <span className="text-xl font-bold">{t('standardFormTitle')}</span>
            </Link>
          </div>

          {/* Right side - Language Selector */}
          <div className="hidden md:flex items-center justify-end">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-teal-500 hover:bg-white/30 transition-colors cursor-pointer"
                style={{fontFamily: 'Poppins, sans-serif'}}
              >
                <option value="en" className="bg-gray-800 text-white">🇺🇸 {t('langEnglish')}</option>
                <option value="hi" className="bg-gray-800 text-white">🇮🇳 {t('langHindi')}</option>
                <option value="gu" className="bg-gray-800 text-white">🇮🇳 {t('langGujarati')}</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden absolute right-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white/80 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-teal-500/80 to-purple-600/80 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              {/* Mobile Language Selector */}
              <div className="flex items-center gap-2 px-3 py-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                  className="px-3 py-2 text-sm border border-white/30 rounded-lg bg-white/20 text-white focus:ring-2 focus:ring-teal-500 hover:bg-white/30 transition-colors cursor-pointer"
                  style={{fontFamily: 'Poppins, sans-serif'}}
                >
                  <option value="en" className="bg-gray-800 text-white">🇺🇸 {t('langEnglish')}</option>
                  <option value="hi" className="bg-gray-800 text-white">🇮🇳 {t('langHindi')}</option>
                  <option value="gu" className="bg-gray-800 text-white">🇮🇳 {t('langGujarati')}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
