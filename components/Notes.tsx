
import React from 'react';
import { SHEETS } from '../constants';
import { useLanguage } from '../LanguageContext';

const Notes: React.FC = () => {
  const { lang, t } = useLanguage();
  const handleDownload = (url?: string) => { if (url) window.open(url, '_blank'); };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />;
      case 'Wifi': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.91 9.91 0 0114.142 0M2.828 9.9a14 14 0 0119.344 0" />;
      case 'Hash': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />;
      case 'Cpu': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />;
      case 'Code': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />;
      case 'Terminal': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case 'Database': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />;
      default: return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />;
    }
  };

  return (
    <section id="sheets" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-20">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">{t('notes.badge')}</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white">{t('notes.title')}</h3>
          <p className="text-slate-400 max-w-2xl mx-auto mt-6 italic">{t('notes.desc')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SHEETS.map((sheet) => (
            <div key={sheet.id} className="group glass-card p-10 rounded-[50px] hover:bg-white/5 transition-all duration-500 hover:scale-[1.02] text-left">
              <div className="flex justify-between items-start mb-8">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-xl ${sheet.downloadUrl ? 'bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-800 text-slate-600'}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{getIcon(sheet.icon)}</svg>
                </div>
                <span className="text-3xl font-black text-white/5 group-hover:text-blue-500/10 transition-colors italic uppercase">{lang === 'bn' ? 'অধ্যায়' : 'CH'} {sheet.chapter}</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">{sheet.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-10 h-12 overflow-hidden">{sheet.description}</p>
              {sheet.downloadUrl ? (
                <button onClick={() => handleDownload(sheet.downloadUrl)} className="flex items-center space-x-3 font-extrabold uppercase tracking-tighter text-blue-400 hover:text-blue-300 transition-all group-hover:translate-x-1 duration-300">
                  <span>{t('notes.download')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              ) : (
                <button disabled className="flex items-center space-x-3 font-extrabold uppercase tracking-tighter text-slate-600 cursor-not-allowed italic">
                  <span>{lang === 'bn' ? 'শীঘ্রই আসছে...' : 'Coming Soon...'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notes;
