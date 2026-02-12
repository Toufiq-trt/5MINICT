
import React from 'react';
import { useLanguage } from '../LanguageContext';

const Teacher: React.FC = () => {
  const { t } = useLanguage();
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  return (
    <section id="teacher" className="pt-2 pb-10 sm:pt-4 sm:pb-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
          {/* Photo Block */}
          <div className="w-full lg:w-[35%] group relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[30px] blur-xl opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative aspect-[4/5] rounded-[25px] sm:rounded-[35px] overflow-hidden border-2 border-white/5 shadow-xl mx-auto max-w-[280px] lg:max-w-none">
              <img src={teacherPhotoUrl} alt="Md Toufiqur Rahman Toufiq" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
            </div>
            
            {/* Immidiate Social Icons below photo */}
            <div className="flex justify-center mt-6 gap-4">
              <a href="https://wa.me/8801794903262" target="_blank" rel="noreferrer" className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.011 0-3.986-.51-5.746-1.474l-6.247 1.638zm6.248-3.553c1.731.91 3.428 1.458 5.242 1.458 5.759 0 10.439-4.68 10.439-10.439 0-2.791-1.087-5.414-3.061-7.388-1.975-1.973-4.595-3.06-7.387-3.06-5.761 0-10.441 4.68-10.441 10.441 0 1.956.541 3.863 1.565 5.518l-1.026 3.744 3.869-1.014zm11.238-7.839c-.198-.103-1.168-.578-1.348-.644-.18-.067-.31-.101-.441.101-.131.202-.508.644-.622.775-.115.132-.23.149-.427.046-.198-.103-.834-.308-1.588-.981-.585-.522-.98-1.168-1.095-1.373-.115-.206-.013-.318.089-.419.091-.092.198-.231.297-.346.099-.115.132-.198.198-.33.066-.132.033-.248-.017-.35-.05-.101-.441-1.066-.605-1.46-.16-.382-.321-.33-.441-.336-.114-.005-.246-.006-.377-.006-.131 0-.344.049-.524.246-.18.197-.688.673-.688 1.641 0 .969.704 1.905.802 2.037.098.132 1.386 2.116 3.357 2.968.469.203.835.324 1.12.414.471.15.9.129 1.239.079.378-.056 1.168-.478 1.332-.94.164-.461.164-.858.115-.941-.049-.083-.18-.132-.378-.235z"/></svg>
              </a>
              <a href="https://www.facebook.com/toufiqurahmantareq/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Content Block */}
          <div className="w-full lg:w-[65%] space-y-6 sm:space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <div className="space-y-2 lg:border-l-4 lg:border-blue-600 lg:pl-6 py-1">
                <p className="text-white text-xl sm:text-2xl font-black italic uppercase tracking-tighter leading-none">Md Toufiqur Rahman Toufiq</p>
                <p className="text-blue-400 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] opacity-80">B.Tech (NIT Rourkela) • ICT Lecturer at BGPSC</p>
              </div>

              <div className="space-y-3">
                <h2 className="text-blue-500 font-bold uppercase tracking-widest text-[10px] sm:text-xs leading-none">{t('teacher.mission')}</h2>
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">
                  {t('teacher.fearToLove')}
                </h3>
                <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
                  {t('teacher.why')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 glass-card rounded-[25px] border-white/5 hover:border-blue-500/20 transition-all text-center lg:text-left">
                 <h4 className="text-white font-black text-lg mb-1 italic uppercase leading-none">{t('teacher.simplyIct')}</h4>
                 <p className="text-slate-500 text-[11px] leading-snug">{t('teacher.simplyIctDesc')}</p>
              </div>
              <div className="p-5 glass-card rounded-[25px] border-white/5 hover:border-cyan-500/20 transition-all text-center lg:text-left">
                 <h4 className="text-white font-black text-lg mb-1 italic uppercase leading-none">{t('teacher.smartResults')}</h4>
                 <p className="text-slate-500 text-[11px] leading-snug">{t('teacher.smartResultsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teacher;
