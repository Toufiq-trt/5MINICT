
import React from 'react';
import { useLanguage } from '../LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const enrollUrl = "https://forms.gle/97byA6Ek5QYuuu6WA";
  const email = "toufiq.nit.rkl2019@gmail.com";

  return (
    <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-white space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{t('contact.title')}</h2>
              <p className="text-blue-100 text-lg max-w-md">{t('contact.desc')}</p>
            </div>

            <div className="space-y-4">
               <a href={enrollUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-8 bg-blue-600 hover:bg-blue-500 text-white rounded-[32px] shadow-2xl transition-all group active:scale-95">
                 <div className="flex items-center space-x-6 text-left">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black uppercase tracking-tight">{t('contact.enrollBtn')}</h4>
                      <p className="text-blue-100 font-bold text-sm">{t('contact.enrollDesc')}</p>
                    </div>
                 </div>
                 <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
               </a>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="https://wa.me/8801794903262" target="_blank" rel="noreferrer" className="flex items-center space-x-4 glass-card p-6 rounded-3xl hover:border-emerald-500/50 transition-all">
                    <div className="bg-emerald-500 p-3 rounded-2xl shrink-0"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.011 0-3.986-.51-5.746-1.474l-6.247 1.638zm6.248-3.553c1.731.91 3.428 1.458 5.242 1.458 5.759 0 10.439-4.68 10.439-10.439 0-2.791-1.087-5.414-3.061-7.388-1.975-1.973-4.595-3.06-7.387-3.06-5.761 0-10.441 4.68-10.441 10.441 0 1.956.541 3.863 1.565 5.518l-1.026 3.744 3.869-1.014zm11.238-7.839c-.198-.103-1.168-.578-1.348-.644-.18-.067-.31-.101-.441.101-.131.202-.508.644-.622.775-.115.132-.23.149-.427.046-.198-.103-.834-.308-1.588-.981-.585-.522-.98-1.168-1.095-1.373-.115-.206-.013-.318.089-.419.091-.092.198-.231.297-.346.099-.115.132-.198.198-.33.066-.132.033-.248-.017-.35-.05-.101-.441-1.066-.605-1.46-.16-.382-.321-.33-.441-.336-.114-.005-.246-.006-.377-.006-.131 0-.344.049-.524.246-.18.197-.688.673-.688 1.641 0 .969.704 1.905.802 2.037.098.132 1.386 2.116 3.357 2.968.469.203.835.324 1.12.414.471.15.9.129 1.239.079.378-.056 1.168-.478 1.332-.94.164-.461.164-.858.115-.941-.049-.083-.18-.132-.378-.235z"/></svg></div>
                    <span className="font-bold">WhatsApp</span>
                  </a>
                  <a href="https://www.facebook.com/toufiqurahmantareq/" target="_blank" rel="noreferrer" className="flex items-center space-x-4 glass-card p-6 rounded-3xl hover:border-blue-500/50 transition-all">
                    <div className="bg-blue-600 p-3 rounded-2xl shrink-0"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                    <span className="font-bold">Facebook</span>
                  </a>
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8 lg:border-l lg:border-white/5 lg:pl-16">
            <div className="w-full glass-card p-10 rounded-[40px] text-center space-y-6">
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto text-blue-400 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h4 className="text-2xl font-bold text-white">{t('contact.mailTitle')}</h4>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">{t('contact.mailDesc')}</p>
              <a href={`mailto:${email}?subject=ICT Inquiry from Student`} className="inline-flex items-center space-x-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl group active:scale-95">
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>{t('contact.mailBtn')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
