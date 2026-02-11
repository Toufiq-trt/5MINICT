
import React from 'react';
import { useLanguage } from '../LanguageContext';

const Teacher: React.FC = () => {
  const { t } = useLanguage();
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  return (
    <section id="teacher" className="pt-24 pb-20 sm:pt-40 sm:pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          {/* Photo Block - Order 1 on Mobile, Left on Desktop */}
          <div className="w-full lg:w-2/5 group relative order-1">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-[4/5] rounded-[30px] sm:rounded-[50px] overflow-hidden border-4 border-white/5 shadow-2xl mx-auto max-w-sm lg:max-w-none">
              <img src={teacherPhotoUrl} alt="Md Toufiqur Rahman Toufiq" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 p-4 sm:p-6 glass-card rounded-2xl border-white/10">
                <p className="text-[10px] font-bold text-blue-400 mb-1 tracking-widest uppercase">Lead Instructor</p>
                <p className="text-lg font-bold text-white">Toufiq.init()</p>
              </div>
            </div>
          </div>

          {/* Content Block - Order 2 on Mobile, Right on Desktop */}
          <div className="w-full lg:w-3/5 space-y-8 sm:space-y-12 order-2">
            <div className="space-y-6 text-center lg:text-left">
              {/* Identity Section - Now at the top of content for mobile flow */}
              <div className="space-y-3 lg:border-l-4 lg:border-blue-600 lg:pl-8 py-2">
                <p className="text-white text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">Md Toufiqur Rahman Toufiq</p>
                <p className="text-blue-400 text-xs sm:text-sm font-black uppercase tracking-[0.2em]">B.Tech in CSE (NIT Rourkela, India) • ICT Lecturer at BGPSC, Rangpur</p>
              </div>

              <div className="h-px bg-white/5 w-full hidden lg:block"></div>

              <h2 className="text-blue-500 font-bold uppercase tracking-widest text-xs sm:text-sm">{t('teacher.mission')}</h2>
              <h3 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight">
                {t('teacher.fearToLove').split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? 'gradient-text mr-2' : i === 2 ? 'text-blue-400' : ''}>{word} </span>
                ))}
              </h3>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {t('teacher.why')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 glass-card rounded-[40px] border-white/5 hover:border-blue-500/20 transition-all flex flex-col justify-center text-center lg:text-left">
                 <h4 className="text-white font-black text-2xl mb-2 italic uppercase">{t('teacher.simplyIct')}</h4>
                 <p className="text-slate-400 text-sm">{t('teacher.simplyIctDesc')}</p>
              </div>
              <div className="p-8 glass-card rounded-[40px] border-white/5 hover:border-cyan-500/20 transition-all flex flex-col justify-center text-center lg:text-left">
                 <h4 className="text-white font-black text-2xl mb-2 italic uppercase">{t('teacher.smartResults')}</h4>
                 <p className="text-slate-400 text-sm">{t('teacher.smartResultsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teacher;
