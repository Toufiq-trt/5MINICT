
import React from 'react';
import { BATCHES } from '../constants';
import { useLanguage } from '../LanguageContext';

const Schedule: React.FC = () => {
  const { lang, t } = useLanguage();
  const enrollUrl = "https://forms.gle/97byA6Ek5QYuuu6WA";

  return (
    <section id="schedule" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">{t('schedule.badge')}</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white">{t('schedule.title')}</h3>
          <p className="text-slate-400 mt-6 max-w-2xl mx-auto">{t('schedule.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {BATCHES.map((batch) => (
            <div key={batch.id} className="group glass-card p-10 rounded-[50px] hover:border-blue-500/40 transition-all duration-500 flex flex-col hover:-translate-y-2">
              <div className="mb-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  batch.category === 'Online' ? 'bg-purple-500/20 text-purple-400' : 
                  batch.category === 'Intensive' ? 'bg-red-500/20 text-red-400' : 
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {lang === 'bn' ? (batch.category === 'Online' ? 'অনলাইন' : batch.category === 'Intensive' ? 'ইনটেনসিভ' : 'এইচএসসি') : batch.category}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-6 leading-tight">{batch.name}</h4>
              <div className="space-y-4 mb-10 flex-grow">
                {batch.timeSlots.map((slot, i) => (
                  <div key={i} className="flex items-start space-x-3 text-sm text-slate-400">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <span>{slot}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{t('schedule.feeLabel')}</p>
                <p className="text-2xl font-black text-white mono">{batch.fee.split('/')[0]}</p>
                <p className="text-[10px] text-slate-500 mono mb-6">/{batch.fee.split('/')[1]}</p>
                <a href={enrollUrl} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-white text-slate-950 text-center rounded-2xl font-bold text-sm hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                  {t('schedule.getStarted')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
