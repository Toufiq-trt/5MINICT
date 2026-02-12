
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
    <section className="relative pt-6 pb-2 flex flex-col items-center justify-center overflow-hidden min-h-[50px] sm:min-h-[80px]">
      <style>{`
        @keyframes laser-scan {
          0% { left: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        .brand-container {
          position: relative;
          padding: 4px 12px;
          display: inline-block;
        }

        .laser-bar {
          position: absolute;
          top: 0; bottom: 0; width: 3px;
          background: linear-gradient(to bottom, transparent, #3b82f6, transparent);
          box-shadow: 0 0 20px #3b82f6;
          z-index: 30;
          pointer-events: none;
          animation: laser-scan 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tech-corner {
          position: absolute;
          width: 6px; height: 6px;
          border-color: #3b82f6; border-style: solid;
          opacity: 0.6;
          z-index: 10;
        }
        .corner-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .corner-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

        .char {
          display: inline-block;
          transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          opacity: 0;
          white-space: pre;
          filter: blur(10px);
        }

        .active .char {
          opacity: 1 !important;
          transform: translate(0, 0) scale(1) rotate(0deg) !important;
          filter: blur(0) !important;
        }

        @keyframes cursor-blink { 50% { opacity: 0; } }
        .cursor {
          display: inline-block;
          width: 0.12em;
          height: 1.1em;
          background-color: #3b82f6;
          margin-left: 0.1em;
          vertical-align: middle;
          animation: cursor-blink 0.8s infinite;
        }
      `}</style>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] sm:w-[260px] h-[35px] bg-blue-600/5 blur-[30px] rounded-full pointer-events-none"></div>

      <div key={effectId} className={`relative z-10 text-center px-4 ${effectId ? `effect-${effectId} active` : ''}`}>
        <div className="brand-container">
          <div className="laser-bar"></div>
          <div className="tech-corner corner-tl"></div>
          <div className="tech-corner corner-tr"></div>
          <div className="tech-corner corner-bl"></div>
          <div className="tech-corner corner-br"></div>

          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-black text-white italic tracking-tighter whitespace-nowrap px-4 py-1 mono select-none flex justify-center items-center">
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
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default BrandHeader;
