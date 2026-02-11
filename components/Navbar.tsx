
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['teacher', 'about', 'playground', 'quests', 'games', 'schedule', 'ebooks', 'sheets', 'contact'];
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.mentor'), id: 'teacher', href: '#teacher' },
    { name: t('nav.map'), id: 'about', href: '#about' },
    { name: t('nav.lab'), id: 'playground', href: '#playground' },
    { name: t('nav.practice'), id: 'quests', href: '#quests' },
    { name: t('nav.gamezone'), id: 'games', href: '#games' },
    { name: t('nav.batches'), id: 'schedule', href: '#schedule' },
    { name: t('nav.library'), id: 'ebooks', href: '#ebooks' },
    { name: t('nav.sheets'), id: 'sheets', href: '#sheets' },
    { name: t('nav.contact'), id: 'contact', href: '#contact' },
  ];

  const enrollUrl = "https://forms.gle/97byA6Ek5QYuuu6WA";
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
      isScrolled ? 'bg-slate-950/90 backdrop-blur-2xl py-2 border-b border-white/5 shadow-2xl' : 'bg-transparent py-4 border-b border-transparent'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3 sm:space-x-8">
            <a href="#home" className="flex items-center space-x-3 group outline-none shrink-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg group-hover:bg-blue-600/40 transition-all duration-500"></div>
                <svg className="w-full h-full text-blue-500 relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:rotate-[5deg]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="6" width="28" height="28" rx="7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="#020617" />
                  <path d="M14 17L11 20L14 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M26 17L29 20L26 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="18" y="14" width="4" height="12" rx="1" transform="rotate(15 20 20)" fill="currentColor" fillOpacity="0.8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white italic leading-none">
                  5MIN<span className="text-blue-500">ICT</span>
                </span>
                <span className="text-[6px] sm:text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mt-1 sm:mt-1.5 ml-0.5">CSE Logic Master</span>
              </div>
            </a>

            <div className="h-6 w-px bg-white/10 hidden xl:block"></div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2 bg-white/5 pr-3 py-1 pl-1 rounded-full border border-white/5 hidden xs:flex">
                <img src={teacherPhotoUrl} alt="Toufiq Sir" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-blue-500/30" />
              </div>
              
              <div className="flex items-center bg-slate-900 rounded-full p-0.5 sm:p-1 border border-white/5 shadow-inner">
                <button 
                  onClick={() => setLang('en')}
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('bn')}
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black transition-all ${lang === 'bn' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  বাং
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`px-2.5 xl:px-4 py-2 text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all rounded-xl relative overflow-hidden group ${
                  activeSection === link.id ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
                {activeSection === link.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></span>}
              </a>
            ))}
            <a 
              href={enrollUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 xl:ml-4 px-4 xl:px-6 py-2 xl:py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 border border-white/10 shrink-0"
            >
              {t('nav.enroll')}
            </a>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] sm:top-[72px] bg-slate-950/98 backdrop-blur-3xl z-[150] overflow-y-auto pb-10 animate-in slide-in-from-top-4">
          <div className="flex flex-col p-6 sm:p-10 space-y-1">
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`group flex items-center justify-between py-5 border-b border-white/5 hover:px-2 transition-all ${activeSection === link.id ? 'text-blue-500' : ''}`}
              >
                <span className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter">
                  {link.name}
                </span>
                <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${activeSection === link.id ? 'opacity-100' : 'opacity-0'} text-blue-600 group-hover:opacity-100 transition-all`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ))}
            <div className="pt-8">
              <a 
                href={enrollUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full text-center py-5 sm:py-8 bg-blue-600 text-white rounded-[24px] sm:rounded-[32px] font-black uppercase tracking-[0.2em] shadow-3xl shadow-blue-600/30 text-base sm:text-lg"
              >
                {t('nav.enroll')}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
