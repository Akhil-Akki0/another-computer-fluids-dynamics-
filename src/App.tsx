import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { CfdAssistantWidget } from './components/layout/CfdAssistantWidget';

import { HomeView } from './components/home/HomeView';
import { PlatformView } from './components/pages/PlatformView';
import { SimulatorView } from './components/pages/SimulatorView';
import { ValidationView } from './components/pages/ValidationView';
import { IndustriesView } from './components/pages/IndustriesView';
import { CaseStudiesView } from './components/pages/CaseStudiesView';
import { LearnView } from './components/pages/LearnView';
import { CalculatorsView } from './components/pages/CalculatorsView';
import { CompareView } from './components/pages/CompareView';
import { DocsView } from './components/pages/DocsView';
import { AboutView } from './components/pages/AboutView';
import { PricingView } from './components/pages/PricingView';
import { ContactView } from './components/pages/ContactView';

export default function App() {
  const { currentRoute, theme } = useAppStore();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'platform':
        return <PlatformView />;
      case 'simulator':
        return <SimulatorView />;
      case 'validation':
        return <ValidationView />;
      case 'industries':
        return <IndustriesView />;
      case 'case-studies':
        return <CaseStudiesView />;
      case 'learn':
        return <LearnView />;
      case 'calculators':
        return <CalculatorsView />;
      case 'compare':
        return <CompareView />;
      case 'docs':
        return <DocsView />;
      case 'about':
        return <AboutView />;
      case 'pricing':
        return <PricingView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-[#07090e] text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Stage */}
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Floating AI-style CFD Engineering Assistant */}
      <CfdAssistantWidget />
    </div>
  );
}
