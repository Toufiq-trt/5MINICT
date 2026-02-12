
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { lang, setLang, t } = useLanguage();

  // ScrollSpy and Navbar Background effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // The IDs must match exactly what's in App.tsx
      const sections = ['home', 'about', 'schedule', 'playground', 'games', 'sheets', 'ebooks', 'contact'];
      const scrollPosition = window.scrollY + 250; // Offset for better detection

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-arranged to match page sequence in App.tsx
  const navLinks = [
    { name: t('nav.mentor'), id: 'home', href: '#home' },
    { name: t('nav.map'), id: 'about', href: '#about' },
    { name: t('nav.batches'), id: 'schedule', href: '#schedule' },
    { name: t('nav.lab'), id: 'playground', href: '#playground' },
    { name: t('nav.gamezone'), id: 'games', href: '#games' },
    { name: t('nav.sheets'), id: 'sheets', href: '#sheets' },
    { name: t('nav.library'), id: 'ebooks', href: '#ebooks' },
    { name: t('nav.contact'), id: 'contact', href: '#contact' },
  ];

  const enrollUrl = "https://forms.gle/97byA6Ek5QYuuu6WA";
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[10000] transition-all duration-500 ${
      isScrolled ? 'bg-slate-950/95 backdrop-blur-xl py-2 border-b border-white/5 shadow-2xl' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3 sm:space-x-8">
            <a href="#home" onClick={closeMenu} className="flex items-center space-x-2 sm:space-x-3 group outline-none shrink-0">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600/20 rounded-lg blur-md group-hover:bg-blue-600/40 transition-all duration-500"></div>
                <svg className="w-full h-full text-blue-500 relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:rotate-[5deg]" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="6" width="28" height="28" rx="7" stroke="currentColor" strokeWidth="2" fill="#020617" />
                  <path d="M14 17L11 20L14 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M26 17L29 20L26 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="18" y="14" width="4" height="12" rx="1" transform="rotate(15 20 20)" fill="currentColor" fillOpacity="0.8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-white italic leading-none uppercase">
                  5MIN<span className="text-blue-500">ICT</span>
                </span>
              </div>
            </a>
            <div className="flex items-center bg-slate-900 rounded-full p-0.5 border border-white/5 shadow-inner scale-90 sm:scale-100">
                <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-black transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600'}`}>EN</button>
                <button onClick={() => setLang('bn')} className={`px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-black transition-all ${lang === 'bn' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600'}`}>বাং</button>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${activeSection === link.id ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <a href={enrollUrl} target="_blank" rel="noopener noreferrer" className="ml-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shrink-0">Enroll</a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-white p-2.5 bg-white/5 rounded-xl border border-white/10 z-[10002] relative"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/98 backdrop-blur-2xl z-[10001] flex flex-col pt-24 pb-12 px-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex-1 overflow-y-auto space-y-1">
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                onClick={closeMenu} 
                className={`flex items-center justify-between py-5 border-b border-white/5 ${activeSection === link.id ? 'text-blue-500' : 'text-white/80'}`}
              >
                <span className="text-2xl font-black uppercase italic tracking-tighter">{link.name}</span>
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            ))}
            <div className="pt-10">
              <a 
                href={enrollUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={closeMenu} 
                className="block w-full text-center py-5 bg-blue-600 text-white rounded-[20px] font-black uppercase tracking-[0.2em] shadow-3xl text-sm"
              >
                Enroll Now
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
