
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[];:+-*";
    const fontSize = 10;
    let width = canvas.width;
    let height = canvas.height;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
};

const Teacher: React.FC = () => {
  const { t } = useLanguage();
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  return (
    <section id="teacher-profile" className="flex-1 w-full flex items-center justify-center relative overflow-hidden px-4 pb-4">
      <MatrixBackground />
      <div className="max-w-6xl mx-auto relative z-20 w-full flex flex-col items-center">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center justify-center w-full">
          {/* Photo Block */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-[30px] blur-lg opacity-15 pointer-events-none"></div>
              <div className="relative aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden border-2 border-white/10 shadow-2xl w-[160px] xs:w-[190px] sm:w-[240px] lg:w-[280px]">
                <img src={teacherPhotoUrl} alt="Md Toufiqur Rahman Toufiq" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
              </div>
            </div>
            
            {/* Functional Social Icons */}
            <div className="flex justify-center mt-4 gap-4 relative z-50">
              <a 
                href="https://wa.me/8801794903262" 
                target="_blank" 
                rel="noreferrer" 
                className="w-11 h-11 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.011 0-3.986-.51-5.746-1.474l-6.247 1.638zm6.248-3.553c1.731.91 3.428 1.458 5.242 1.458 5.759 0 10.439-4.68 10.439-10.439 0-2.791-1.087-5.414-3.061-7.388-1.975-1.973-4.595-3.06-7.387-3.06-5.761 0-10.441 4.68-10.441 10.441 0 1.956.541 3.863 1.565 5.518l-1.026 3.744 3.869-1.014zm11.238-7.839c-.198-.103-1.168-.578-1.348-.644-.18-.067-.31-.101-.441.101-.131.202-.508.644-.622.775-.115.132-.23.149-.427.046-.198-.103-.834-.308-1.588-.981-.585-.522-.98-1.168-1.095-1.373-.115-.206-.013-.318.089-.419.091-.092.198-.231.297-.346.099-.115.132-.198.198-.33.066-.132.033-.248-.017-.35-.05-.101-.441-1.066-.605-1.46-.16-.382-.321-.33-.441-.336-.114-.005-.246-.006-.377-.006-.131 0-.344.049-.524.246-.18.197-.688.673-.688 1.641 0 .969.704 1.905.802 2.037.098.132 1.386 2.116 3.357 2.968.469.203.835.324 1.12.414.471.15.9.129 1.239.079.378-.056 1.168-.478 1.332-.94.164-.461.164-.858.115-.941-.049-.083-.18-.132-.378-.235z"/></svg>
              </a>
              <a 
                href="https://www.facebook.com/toufiqurahmantareq/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Content Block */}
          <div className="w-full lg:w-[60%] flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="space-y-1 lg:border-l-4 lg:border-blue-600 lg:pl-6">
              <p className="text-white text-xl sm:text-2xl lg:text-3xl font-black italic uppercase tracking-tighter leading-none">Md Toufiqur Rahman Toufiq</p>
              <p className="text-blue-400 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] opacity-90">B.Tech (NIT Rourkela) • ICT Lecturer at BGPSC</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px] sm:text-xs leading-none">{t('teacher.mission')}</h2>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">
                {t('teacher.fearToLove')}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
                {t('teacher.why')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto lg:mx-0">
              <div className="p-4 glass-card rounded-[20px] border-white/5 group hover:border-blue-500/30 transition-all">
                 <h4 className="text-white font-black text-lg mb-1 italic uppercase leading-none">{t('teacher.simplyIct')}</h4>
                 <p className="text-slate-500 text-[10px] sm:text-xs leading-snug">{t('teacher.simplyIctDesc')}</p>
              </div>
              <div className="p-4 glass-card rounded-[20px] border-white/5 group hover:border-cyan-500/30 transition-all">
                 <h4 className="text-white font-black text-lg mb-1 italic uppercase leading-none">{t('teacher.smartResults')}</h4>
                 <p className="text-slate-500 text-[10px] sm:text-xs leading-snug">{t('teacher.smartResultsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teacher;
