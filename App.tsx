
import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Teacher from './components/Teacher';
import Schedule from './components/Schedule';
import Notes from './components/Notes';
import EBooks from './components/EBooks';
import Contact from './components/Contact';
import AIAssistant from './components/AIAssistant';
import PracticeBoard from './components/PracticeBoard';
import InteractivePlayground from './components/InteractivePlayground';
import BrandHeader from './components/BrandHeader';
import GameZone from './components/GameZone';

const MainLayout: React.FC = () => {
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isPracticeMode, lang]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        const id = anchor.getAttribute('href')?.slice(1);
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            e.preventDefault();
            setIsPracticeMode(false);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-blue-500/30 selection:text-blue-200" id="home">
      <Navbar />
      
      <main className="relative z-10">
        {isPracticeMode ? (
          <PracticeBoard onBack={() => setIsPracticeMode(false)} />
        ) : (
          <>
            {/* Page 1: Brand & Mentor Section (Designed for One-View Visibility) */}
            <div id="home" className="reveal h-[100dvh] flex flex-col justify-between overflow-hidden pt-14 sm:pt-16">
              <BrandHeader />
              <Teacher />
            </div>

            {/* Page 2: Chapters Section (Hero) */}
            <div id="about" className="reveal">
              <Hero onStartPractice={() => setIsPracticeMode(true)} />
            </div>

            <div id="schedule" className="reveal">
              <Schedule />
            </div>
            <div id="playground" className="reveal">
              <InteractivePlayground />
            </div>
            <div id="games" className="reveal">
              <GameZone />
            </div>
            <div id="sheets" className="reveal">
              <Notes />
            </div>
            <div id="ebooks" className="reveal">
              <EBooks />
            </div>
            <div id="contact" className="reveal">
              <Contact />
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-950 py-16 text-center text-slate-600 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
             <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
               5MIN<span className="text-blue-500">ICT</span>
             </span>
             <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em]">The Logic Evolution</p>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-700">© {new Date().getFullYear()} 5 Minute ICT by Toufiq Sir.</p>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <MainLayout />
  </LanguageProvider>
);

export default App;
