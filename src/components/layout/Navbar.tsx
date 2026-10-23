import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Languages, 
  ChevronDown, 
  Menu, 
  X,
  Play
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MegaMenu } from './MegaMenu';
import { LanguageCode, NavigationRoute } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentRoute, 
    setRoute, 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    toggleCommandPalette 
  } = useAppStore();

  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ja', label: '日本語' },
  ];

  const handleNavClick = (route: NavigationRoute) => {
    setRoute(route);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-950/75 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)]'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
            aria-label="DroveT Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-cyan-500 to-sky-400 flex items-center justify-center font-mono font-black text-black text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              DT
            </div>
            <span className={`text-lg font-bold tracking-tight whitespace-nowrap ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              DroveT
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-semibold hidden sm:inline-block">
              CFD
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className={`hidden lg:flex items-center gap-6 text-sm font-medium ${
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-cyan-400 ${
              currentRoute === 'home' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            onMouseEnter={() => setMegaMenuOpen(true)}
            className="whitespace-nowrap shrink-0 transition-colors py-1 hover:text-cyan-400 flex items-center gap-1.5"
            aria-expanded={megaMenuOpen}
          >
            <span>Platform</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={() => handleNavClick('validation')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-cyan-400 ${
              currentRoute === 'validation' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Validation
          </button>

          <button
            onClick={() => handleNavClick('industries')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-cyan-400 ${
              currentRoute === 'industries' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Industries
          </button>

          <button
            onClick={() => handleNavClick('learn')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-cyan-400 ${
              currentRoute === 'learn' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Learn & Tools
          </button>

          <button
            onClick={() => handleNavClick('compare')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-cyan-400 ${
              currentRoute === 'compare' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Compare
          </button>
        </nav>

        {/* Zone 3: 1 primary action + minimal utility buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick search shortcut */}
          <button
            onClick={toggleCommandPalette}
            className={`p-2 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs font-mono ${
              theme === 'dark' 
                ? 'text-slate-400 hover:text-cyan-400 hover:bg-white/5' 
                : 'text-slate-600 hover:text-cyan-600 hover:bg-slate-100'
            }`}
            aria-label="Open search command palette"
          >
            <Search className="w-4 h-4" />
            <span className={`hidden xl:inline ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>⌘K</span>
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                theme === 'dark' 
                  ? 'text-slate-400 hover:text-cyan-400 hover:bg-white/5' 
                  : 'text-slate-600 hover:text-cyan-600 hover:bg-slate-100'
              }`}
              aria-label="Select language"
              aria-expanded={langMenuOpen}
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs uppercase font-mono hidden sm:inline">{language}</span>
            </button>
            {langMenuOpen && (
              <div 
                className={`absolute right-0 mt-2 w-32 glass-panel rounded-xl shadow-2xl py-1 z-50 border ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-200 bg-white/95'
                }`}
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      language === l.code 
                        ? theme === 'dark' ? 'text-cyan-400 bg-white/10 font-semibold' : 'text-cyan-600 bg-cyan-50 font-semibold'
                        : theme === 'dark' ? 'text-slate-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-400">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark' 
                ? 'text-slate-400 hover:text-amber-400 hover:bg-white/5' 
                : 'text-slate-600 hover:text-amber-600 hover:bg-slate-100'
            }`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleNavClick('simulator')}
            className="hidden sm:flex px-4 py-2 text-xs font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-sm hover:shadow-cyan-500/20 items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Launch Simulator</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MegaMenu Drawer */}
      <MegaMenu 
        isOpen={megaMenuOpen} 
        onClose={() => setMegaMenuOpen(false)} 
      />

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-4 border-t border-white/10 glass-panel space-y-3">
          {[
            { route: 'home' as NavigationRoute, label: 'Overview' },
            { route: 'simulator' as NavigationRoute, label: 'Interactive Simulator' },
            { route: 'validation' as NavigationRoute, label: 'Validation & Benchmarks' },
            { route: 'industries' as NavigationRoute, label: 'Applied Industries' },
            { route: 'learn' as NavigationRoute, label: 'Learning Hub & Courses' },
            { route: 'calculators' as NavigationRoute, label: 'Calculators & Tools' },
            { route: 'compare' as NavigationRoute, label: 'Compare vs Ansys & SimScale' },
            { route: 'docs' as NavigationRoute, label: 'Documentation' },
            { route: 'pricing' as NavigationRoute, label: 'Pricing & Open Access' },
            { route: 'about' as NavigationRoute, label: 'About & Advisory Board' },
            { route: 'contact' as NavigationRoute, label: 'Contact Engineers' },
          ].map((item) => (
            <button
              key={item.route}
              onClick={() => handleNavClick(item.route)}
              className={`w-full text-left py-2 text-sm font-medium transition-colors ${
                currentRoute === item.route ? 'text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
