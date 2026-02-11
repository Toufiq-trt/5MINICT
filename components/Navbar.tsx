import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.about'), href: '#teacher' },
    { name: t('nav.code'), href: '#playground' },
    { name: t('nav.batches'), href: '#schedule' },
    { name: t('nav.sheets'), href: '#sheets' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  const enrollUrl = "https://forms.gle/97byA6Ek5QYuuu6WA";
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
      isScrolled ? 'bg-slate-950/90 backdrop-blur-2xl py-3 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-5">
            {/* High-Tech Logic Chip Logo */}
            <a href="#" className="flex items-center space-x-3 group outline-none">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-600/20 rounded-xl blur-lg group-hover:bg-blue-600/40 transition-all duration-500"></div>
                <svg className="w-full h-full text-blue-500 relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:rotate-[5deg]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Chip Die Container */}
                  <rect x="6" y="6" width="28" height="28" rx="7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="#020617" />
                  {/* Logic Connections / Pins */}
                  <path d="M6 13H2M6 20H2M6 27H2M34 13H38M34 20H38M34 27H38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
                  {/* Top/Bottom Pins */}
                  <path d="M14 6V2M20 6V2M26 6V2M14 34V38M20 34V38M26 34V38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
                  {/* Internal Processor Core Symbol */}
                  <path d="M14 17L11 20L14 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M26 17L29 20L26 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="18" y="14" width="4" height="12" rx="1" transform="rotate(15 20 20)" fill="currentColor" fillOpacity="0.8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white italic leading-none">
                  5MIN<span className="text-blue-500">ICT</span>
                </span>
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mt-1.5 ml-0.5">CSE Logic Master</span>
              </div>
            </a>

            {/* Profile & Language Toggle */}
            <div className="h-7 w-px bg-white/10 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/5 pr-3 py-1 pl-1 rounded-full border border-white/5">
                <img src={teacherPhotoUrl} alt="Toufiq Sir" className="w-7 h-7 rounded-full object-cover border border-blue-500/30" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">Toufiq.init()</span>
              </div>
              
              <div className="flex items-center bg-slate-900 rounded-full p-1 border border-white/5 shadow-inner">
                <button 
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg glow-blue' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('bn')}
                  className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${lang === 'bn' ? 'bg-blue-600 text-white shadow-lg glow-blue' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  বাং
                </button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all rounded-xl hover:bg-white/5"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={enrollUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 border border-white/10"
            >
              {t('nav.enroll')}
            </a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-3xl border-b border-white/5 p-8 space-y-6 animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="block text-2xl font-black text-slate-300 hover:text-blue-500 transition-colors uppercase italic">
              {link.name}
            </a>
          ))}
          <a href={enrollUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest">
            {t('nav.enroll')}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;