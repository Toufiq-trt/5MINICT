
import React, { useState, useEffect } from 'react';

const BrandHeader: React.FC = () => {
  const [effectId, setEffectId] = useState<number | null>(null);
  const [hackerText, setHackerText] = useState<string[]>([]);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const brandText = "5 MINUTE ICT";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789";

  useEffect(() => {
    const lastEffect = sessionStorage.getItem('ict_brand_effect');
    let nextEffect: number;
    do {
      nextEffect = Math.floor(Math.random() * 15) + 1;
    } while (nextEffect.toString() === lastEffect && lastEffect !== null);

    sessionStorage.setItem('ict_brand_effect', nextEffect.toString());
    setEffectId(nextEffect);
    
    if (nextEffect === 2) {
      let currentIdx = 0;
      const interval = setInterval(() => {
        setTypewriterIndex(prev => prev + 1);
        currentIdx++;
        if (currentIdx >= brandText.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }

    if (nextEffect === 3) {
      let iterations = 0;
      const interval = setInterval(() => {
        setHackerText(brandText.split("").map((char, index) => {
          if (index < iterations) return brandText[index];
          return symbols[Math.floor(Math.random() * symbols.length)];
        }));
        if (iterations >= brandText.length) clearInterval(interval);
        iterations += 1/3;
      }, 40);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <section className="relative pt-24 pb-4 flex flex-col items-center justify-center overflow-hidden min-h-[160px] sm:min-h-[180px]">
      <style>{`
        @keyframes laser-scan {
          0% { left: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        .brand-container {
          position: relative;
          padding: 10px 15px;
          display: inline-block;
        }
        @media (min-width: 640px) {
          .brand-container { padding: 15px 30px; }
        }

        .laser-bar {
          position: absolute;
          top: 0; bottom: 0; width: 3px;
          background: linear-gradient(to bottom, transparent, #3b82f6, transparent);
          box-shadow: 0 0 20px #3b82f6, 0 0 40px #3b82f6;
          z-index: 30;
          pointer-events: none;
          animation: laser-scan 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tech-corner {
          position: absolute;
          width: 8px; height: 8px;
          border-color: #3b82f6; border-style: solid;
          opacity: 0.6;
          z-index: 10;
        }
        @media (min-width: 640px) {
          .tech-corner { width: 14px; height: 14px; }
        }
        .corner-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .corner-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
        @media (min-width: 640px) {
          .corner-tl { border-width: 3px 0 0 3px; }
          .corner-tr { border-width: 3px 3px 0 0; }
          .corner-bl { border-width: 0 0 3px 3px; }
          .corner-br { border-width: 0 3px 3px 0; }
        }

        .char {
          display: inline-block;
          transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          opacity: 0;
          white-space: pre;
          filter: blur(10px);
          transform-origin: center;
        }

        .active .char {
          opacity: 1 !important;
          transform: translate(0, 0) scale(1) rotate(0deg) !important;
          filter: blur(0) !important;
        }

        ${Array.from({ length: 15 }).map((_, i) => `
          .char:nth-child(${i + 1}) { transition-delay: ${i * 0.08}s; }
        `).join('')}

        .effect-1 .char:nth-child(4n+1) { transform: translate(-100vw, -100vh) rotate(-45deg); }
        .effect-1 .char:nth-child(4n+2) { transform: translate(100vw, -100vh) rotate(45deg); }
        .effect-1 .char:nth-child(4n+3) { transform: translate(-100vw, 100vh) rotate(45deg); }
        .effect-1 .char:nth-child(4n+4) { transform: translate(100vw, 100vh) rotate(-45deg); }

        @keyframes cursor-blink { 50% { opacity: 0; } }
        .cursor {
          display: inline-block;
          width: 0.15em;
          height: 1.2em;
          background-color: #3b82f6;
          margin-left: 0.1em;
          vertical-align: middle;
          animation: cursor-blink 0.8s infinite;
        }

        .effect-3 .char { opacity: 1; filter: none; transform: none; transition: none; }
        .effect-4 .char { transform: translateY(-300px); transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .effect-5 .char { transform: scale(8); filter: blur(40px); opacity: 0; }
        .effect-6 .char { transform: rotate(1080deg) scale(0) translate(300px, 300px); }
        @keyframes glitch-shake { 
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-8px, 4px); }
          40% { transform: translate(8px, -4px); }
          60% { transform: translate(-4px, -8px); }
          80% { transform: translate(4px, 8px); }
        }
        .effect-7.active .char { animation: glitch-shake 0.2s 3; }
        .effect-7 .char { transform: scale(1.5); filter: contrast(3); }
        .effect-8 .brand-container { perspective: 1000px; }
        .effect-8 .char { transform: rotateX(90deg); }
        .effect-9 .char { transform: translateX(-150px); filter: blur(30px); opacity: 0; }
        .effect-10 .char { transform: scale(0); transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); transition-duration: 1.2s; }
        .effect-11 .char { filter: blur(20px) brightness(10); transform: scale(0.2); }
        .effect-12 .char { transform: translateZ(800px); filter: blur(50px); opacity: 0; }
        .effect-13 .char { transform: rotateY(180deg) scale(0.2); }
        .effect-14 .char { transform: translateY(80px); opacity: 0; }
        .effect-14.active .char { transform: translateY(0); opacity: 1; transition-duration: 0.6s; }
        .effect-15 .char { transform: translate(calc(var(--rx)*1px), calc(var(--ry)*1px)) rotate(calc(var(--rd)*1deg)) scale(0); }
      `}</style>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[80px] sm:h-[120px] bg-blue-600/5 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none"></div>

      <div key={effectId} className={`relative z-10 text-center px-4 ${effectId ? `effect-${effectId} active` : ''}`}>
        <div className="brand-container">
          <div className="laser-bar"></div>
          <div className="tech-corner corner-tl"></div>
          <div className="tech-corner corner-tr"></div>
          <div className="tech-corner corner-bl"></div>
          <div className="tech-corner corner-br"></div>

          <h1 className="text-2xl xs:text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white italic tracking-tighter whitespace-nowrap px-2 sm:px-4 py-1 sm:py-2 mono select-none flex justify-center items-center">
            {effectId === 2 ? (
              <>
                {brandText.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={`inline-block ${i > 8 ? 'text-blue-500 not-italic' : ''} ${i < typewriterIndex ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
                {typewriterIndex < brandText.length && <span className="cursor"></span>}
              </>
            ) : 
            effectId === 3 ? (
              hackerText.map((char, i) => (
                <span key={i} className={`char ${i > 8 ? 'text-blue-500 not-italic' : ''}`}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))
            ) : 
            brandText.split('').map((char, i) => (
              <span 
                key={i} 
                className={`char ${i > 8 ? 'text-blue-500 not-italic' : ''}`}
                style={{
                  '--rx': Math.random() * 1200 - 600,
                  '--ry': Math.random() * 1000 - 500,
                  '--rd': Math.random() * 720
                } as React.CSSProperties}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          
          <div className="absolute -bottom-4 sm:-bottom-6 left-0 right-0 flex justify-between px-2 sm:px-4 opacity-30 mono text-[6px] sm:text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em] sm:tracking-[0.4em]">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-500 rounded-full animate-pulse"></span>
              <span>ENGINE_{effectId || '00'}</span>
            </div>
            <div className="hidden sm:block">INITIALIZING_VECTORS_OK</div>
            <span>ID_{Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandHeader;
