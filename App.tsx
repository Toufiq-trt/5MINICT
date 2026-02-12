
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

  // High-Performance Scroll Reveal Logic
  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Once revealed, no need to track it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [isPracticeMode, lang]);

  // Smooth scroll fix
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
            {/* Page 1: Brand & Mentor Section (Designed for 100vh visibility) */}
            <div className="reveal">
              <BrandHeader />
              <Teacher />
            </div>

            {/* Page 2: Branding & Chapters Section (Hero) */}
            <div className="reveal delay-100">
              <Hero onStartPractice={() => setIsPracticeMode(true)} />
            </div>

            {/* Subsequent Sections */}
            <div className="reveal">
              <Schedule />
            </div>
            <div className="reveal">
              <InteractivePlayground />
            </div>
            <div className="reveal">
              <GameZone />
            </div>
            <div className="reveal">
              <Notes />
            </div>
            <div className="reveal">
              <EBooks />
            </div>
            <div className="reveal">
              <Contact />
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-950 py-24 text-center text-slate-600 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 mb-12">
             <div className="w-12 h-12 flex items-center justify-center text-blue-500 drop-shadow-lg">
                <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                  <rect x="6" y="6" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="2" fill="#020617" />
                  <path d="M16 14L12 20L16 26M24 14L28 20L24 26M22 13L18 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
             </div>
             <div>
                <span className="text-3xl font-black text-white tracking-tighter uppercase italic">
                  5MIN<span className="text-blue-500">ICT</span>
                </span>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] mt-2">The Logic Evolution</p>
             </div>
          </div>
          <div className="max-w-2xl mx-auto space-y-8">
             <p className="text-xl font-bold text-slate-400 max-w-lg mx-auto leading-relaxed">
               {lang === 'en' ? '"Making complex digital logic as simple as a 5-minute conversation."' : '"জটিল ডিজিটাল লজিককে ৫ মিনিটের কথোপকথনের মতো সহজ করা।"'}
             </p>
             <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full opacity-50"></div>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">© {new Date().getFullYear()} 5 Minute ICT by Toufiq Sir. NIT Rourkela Alumnus.</p>
          </div>
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
