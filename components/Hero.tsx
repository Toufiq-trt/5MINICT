
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
      title: lang === 'en' ? 'ICT: World & Bangladesh Perspective' : 'তথ্য ও যোগাযোগ প্রযুক্তি: বিশ্ব ও বাংলাদেশ প্রেক্ষিত', 
      desc: lang === 'en' ? 'Virtual Reality, AI, Robotics, Cryosurgery, Biometrics & Nanotech.' : 'ভার্চুয়াল রিয়েলিটি, এআই, রোবোটিক্স, ক্রায়োসার্জারি, বায়োমেট্রিক্স ও ন্যানোটেক।', 
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 8.5V17M3 8.5V17M3 8.5L12 4L21 8.5M3 8.5L12 13L21 8.5M12 13V22M12 4V13" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="8.5" r="1.5" fill="currentColor" fillOpacity="0.3"/>
        </svg>
      ), 
      color: 'blue' 
    },
    { 
      num: 2, 
      title: lang === 'en' ? 'Communication Systems & Networking' : 'কমিউনিকেশন সিস্টেমস ও নেটওয়ার্কিং', 
      desc: lang === 'en' ? 'Data Transmission, Wireless Media, Network Topology & Cloud Computing.' : 'ডেটা ট্রান্সমিশন, ওয়্যারলেস মিডিয়া, নেটওয়ার্ক টপোলজি ও ক্লাউড কম্পিউটিং।', 
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="3" strokeWidth="1.5"/>
          <circle cx="4" cy="4" r="2" strokeWidth="1.5"/>
          <circle cx="20" cy="4" r="2" strokeWidth="1.5"/>
          <circle cx="4" cy="20" r="2" strokeWidth="1.5"/>
          <circle cx="20" cy="20" r="2" strokeWidth="1.5"/>
          <path d="M6 6l4 4M18 6l-4 4M6 18l4-4M18 18l-4-4" strokeWidth="1" strokeDasharray="3 3"/>
        </svg>
      ), 
      color: 'cyan' 
    },
    { 
      num: 3, 
      title: lang === 'en' ? 'Number Systems & Digital Devices' : 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', 
      desc: lang === 'en' ? 'Binary Math, Logic Gates, Encoder/Decoder, Flip-flops & Adders.' : 'বাইনারি গণিত, লজিক গেটস, এনকোডার/ডিকোডার, ফ্লিপ-ফ্লপ ও অ্যাডার।', 
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M2 9h4c4 0 7 3 7 7s-3 7-7 7H2V9zM13 16h9M18 12V4M13 9V4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="13" cy="16" r="1.5" fill="currentColor"/>
          <path d="M13 16h2m2 0h2" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ), 
      color: 'indigo' 
    },
    { 
      num: 4, 
      title: lang === 'en' ? 'Introduction to Web Design & HTML' : 'ওয়েব ডিজাইন পরিচিতি ও এইচটিএমএল', 
      desc: lang === 'en' ? 'HTML Tags, Lists, Tables, Hyperlinks & Web Publishing Logic.' : 'এইচটিএমএল ট্যাগ, লিস্ট, টেবিল, হাইপারলিংক ও ওয়েব পাবলিশিং লজিক।', 
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5"/>
          <path d="M7 11l-2 2 2 2M17 11l2 2-2 2M13 8l-2 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeOpacity="0.2"/>
        </svg>
      ), 
      color: 'emerald' 
    },
    { 
      num: 5, 
      title: lang === 'en' ? 'Programming Language' : 'প্রোগ্রামিং ভাষা', 
      desc: lang === 'en' ? 'Algorithm, Flowchart, C Programming: Variables, Loops & Arrays.' : 'অ্যালগরিদম, ফ্লোচার্ট, সি প্রোগ্রামিং: ভেরিয়েবল, লুপ ও অ্যারে।', 
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.5"/>
          <path d="M9 12h6M12 9v6M4 8h2M4 12h2M4 16h2M18 8h2M18 12h2M18 16h2M8 4v2M12 4v2M16 4v2M8 18v2M12 18v2M16 18v2" strokeWidth="1.5" strokeLinecap="round"/>
          <text x="10" y="14.5" fontSize="7" fontWeight="bold" fill="currentColor" fontFamily="monospace">C</text>
        </svg>
      ), 
      color: 'purple' 
    },
    { 
      num: 6, 
      title: lang === 'en' ? 'Database Management System' : 'ডেটাবেস ম্যানেজমেন্ট সিস্টেম', 
      desc: lang === 'en' ? 'RDBMS, SQL Queries, Primary Key, Foreign Key & Normalization.' : 'RDBMS, SQL কুয়েরি, প্রাইমারি কী, ফরেন কী ও নরমালাইজেশন।', 
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <ellipse cx="12" cy="5" rx="8" ry="3" strokeWidth="1.5"/>
          <path d="M4 5v10c0 1.657 3.582 3 8 3s8-1.343 8-3V5M4 10c0 1.657 3.582 3 8 3s8-1.343 8-3" strokeWidth="1.5"/>
          <path d="M12 22s5-2.5 5-6V10l-5-2-5 2v6c0 3.5 5 6 5 6z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      ), 
      color: 'rose' 
    }
  ];

  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .hacking-branding {
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.04em;
          position: relative;
          color: white;
          text-shadow: 0 0 25px rgba(59, 130, 246, 0.5);
        }
        .call-pulsar {
          position: absolute;
          width: 12px; height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          right: -20px; top: 15px;
        }
        .call-pulsar::after {
          content: "";
          position: absolute;
          inset: -6px;
          border: 1px solid #3b82f6;
          border-radius: 50%;
          animation: ripple 1.5s infinite ease-out;
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        .system-loaded-pills {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(12px);
          padding: 4px 12px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .glitch-effect {
          position: relative;
        }
        .glitch-effect::before {
          content: attr(data-text);
          position: absolute;
          left: -2px;
          text-shadow: 2px 0 #ef4444;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim {
          0% { clip: rect(31px, 9999px, 94px, 0); }
          20% { clip: rect(62px, 9999px, 42px, 0); }
          100% { clip: rect(10px, 9999px, 85px, 0); }
        }
      `}</style>
      
      {/* Dynamic Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="w-full lg:w-[46%] space-y-4 text-center lg:text-left">
            {/* System Identifier */}
            <div className="system-loaded-pills">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Status: System_Loaded_v3.0</span>
            </div>

            {/* High-End Tech Branding */}
            <div className="relative inline-block text-left">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black hacking-branding leading-[0.85] italic glitch-effect" data-text="5 MINUTE ICT">
                5 MINUTE <br />
                <span className="text-blue-500 not-italic relative inline-block">
                  ICT
                  <div className="call-pulsar"></div>
                </span>
              </h1>
            </div>
            
            <div className="pt-2">
              <p className="text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium tracking-tight">
                {t('hero.desc')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start pt-6">
              <button onClick={onStartPractice} className="group relative px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95">
                {t('hero.practice')}
              </button>
              <a href="#sheets" className="px-10 py-5 glass-card text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all border border-white/10">
                {t('hero.resources')}
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[54%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {chapters.map((ch, i) => (
                <div key={i} className="reveal glass-card p-6 rounded-[35px] group border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-${ch.color}-400 border border-white/10 group-hover:bg-${ch.color}-600 group-hover:text-white transition-all shadow-xl`}>
                      {ch.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Chapter_{ch.num}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white mb-2 uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors leading-tight">{ch.title}</h3>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{ch.desc}</p>
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
