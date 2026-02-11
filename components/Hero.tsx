import React from 'react';
import { useLanguage } from '../LanguageContext';

interface HeroProps {
  onStartPractice: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartPractice }) => {
  const { lang, t } = useLanguage();

  const chapters = [
    { 
      num: 1, 
      title: lang === 'en' ? 'ICT World' : 'বিশ্ব ও বাংলাদেশ', 
      desc: lang === 'en' ? 'VR, AI & Future Tech trends.' : 'ভার্চুয়াল রিয়েলিটি ও এআই।',
      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
      color: 'blue' 
    },
    { 
      num: 2, 
      title: lang === 'en' ? 'Networking' : 'কমিউনিকেশন', 
      desc: lang === 'en' ? 'Topology & Data transmission.' : 'টপোলজি ও ডেটা ট্রান্সমিশন।',
      icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.91 9.91 0 0114.142 0M2.828 9.9a14 14 0 0119.344 0',
      color: 'cyan' 
    },
    { 
      num: 3, 
      title: lang === 'en' ? 'Digital Logic' : 'সংখ্যা পদ্ধতি', 
      desc: lang === 'en' ? 'Binary & Hardware Architectures.' : 'বাইনারি ও লজিক গেটস।',
      icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      color: 'indigo' 
    },
    { 
      num: 4, 
      title: lang === 'en' ? 'Web/HTML' : 'ওয়েব ডিজাইন', 
      desc: lang === 'en' ? 'Building modern Web structures.' : 'এইচটিএমএল ও ওয়েব ডিজাইন।',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      color: 'emerald' 
    },
    { 
      num: 5, 
      title: lang === 'en' ? 'C Programs' : 'সি প্রোগ্রামিং', 
      desc: lang === 'en' ? 'Logic building with algorithms.' : 'অ্যালগরিদম ও প্রোগ্রামিং লজিক।',
      icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'purple' 
    },
    { 
      num: 6, 
      title: lang === 'en' ? 'Database' : 'ডেটাবেস', 
      desc: lang === 'en' ? 'SQL & Information management.' : 'এসকিউএল ও ডেটা সিকিউরিটি।',
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
      color: 'rose' 
    }
  ];

  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Content Side */}
          <div className="w-full lg:w-[45%] space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center space-x-3 py-2 px-5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mono mx-auto lg:mx-0">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              <span>{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              {t('hero.title')} <br />
              <span className="gradient-text italic">{t('hero.titleSub')}</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium">
              {t('hero.desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-5 justify-center lg:justify-start">
              <button 
                onClick={onStartPractice}
                className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 active:scale-95 border border-white/10"
              >
                {t('hero.practice')}
              </button>
              <a href="#sheets" className="px-10 py-5 glass-card text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-white/5">
                {t('hero.resources')}
              </a>
            </div>
          </div>

          {/* Logic Grid - All 6 Chapters */}
          <div className="w-full lg:w-[55%] relative">
            <div className="absolute -inset-20 bg-blue-600/5 blur-[120px] rounded-full float-anim pointer-events-none"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6 relative">
              {chapters.map((ch, i) => (
                <div 
                  key={i} 
                  className="reveal glass-card p-6 sm:p-8 rounded-[32px] group border-white/5 hover:border-blue-500/40 transition-all duration-700 flex flex-col justify-between"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-${ch.color}-500/10 flex items-center justify-center text-${ch.color}-400 group-hover:scale-110 group-hover:bg-${ch.color}-500/20 transition-all border border-${ch.color}-500/20`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={ch.icon} />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-2">Chapter {ch.num}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase italic tracking-tighter">{ch.title}</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">{ch.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;