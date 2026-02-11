
import React, { useState, useEffect } from 'react';

const BrandHeader: React.FC = () => {
  const [effectId, setEffectId] = useState<number | null>(null);
  const [hackerText, setHackerText] = useState<string[]>([]);
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const brandText = "5 MINUTE ICT";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789";

  useEffect(() => {
    // 1. Randomization Engine: Pick a new effect (1-15) different from the last session
    const lastEffect = sessionStorage.getItem('ict_brand_effect');
    let nextEffect: number;
    do {
      nextEffect = Math.floor(Math.random() * 15) + 1;
    } while (nextEffect.toString() === lastEffect && lastEffect !== null);

    sessionStorage.setItem('ict_brand_effect', nextEffect.toString());
    setEffectId(nextEffect);

    // 2. Logic for Specific Effects
    
    // Effect 2: Typewriter Sequence
    if (nextEffect === 2) {
      let currentIdx = 0;
      const interval = setInterval(() => {
        setTypewriterIndex(prev => prev + 1);
        currentIdx++;
        if (currentIdx >= brandText.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }

    // Effect 3: Hacker Scramble Logic
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
    <section className="relative pt-20 pb-2 flex flex-col items-center justify-center overflow-hidden min-h-[180px]">
      <style>{`
        /* --- CORE TECH AESTHETICS --- */
        @keyframes laser-scan {
          0% { left: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        .brand-container {
          position: relative;
          padding: 15px 30px;
          display: inline-block;
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
          width: 14px; height: 14px;
          border-color: #3b82f6; border-style: solid;
          opacity: 0.6;
          z-index: 10;
        }
        .corner-tl { top: 0; left: 0; border-width: 3px 0 0 3px; }
        .corner-tr { top: 0; right: 0; border-width: 3px 3px 0 0; }
        .corner-bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; }
        .corner-br { bottom: 0; right: 0; border-width: 0 3px 3px 0; }

        /* --- SHARED CHARACTER ANIMATION BASE --- */
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

        /* Default staggered delays (not for typewriter/hacker) */
        ${Array.from({ length: 15 }).map((_, i) => `
          .char:nth-child(${i + 1}) { transition-delay: ${i * 0.08}s; }
        `).join('')}

        /* --- 15 ENGINEERED EFFECTS --- */

        /* 1: Corners Fly-In */
        .effect-1 .char:nth-child(4n+1) { transform: translate(-100vw, -100vh) rotate(-45deg); }
        .effect-1 .char:nth-child(4n+2) { transform: translate(100vw, -100vh) rotate(45deg); }
        .effect-1 .char:nth-child(4n+3) { transform: translate(-100vw, 100vh) rotate(45deg); }
        .effect-1 .char:nth-child(4n+4) { transform: translate(100vw, 100vh) rotate(-45deg); }

        /* 2: Typewriter Sequence (Handled via typewriterIndex state) */
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

        /* 3: Hacker (Scramble text handled in React state) */
        .effect-3 .char { opacity: 1; filter: none; transform: none; transition: none; }

        /* 4: Matrix Drop */
        .effect-4 .char { transform: translateY(-300px); transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        /* 5: Converge from Infinity */
        .effect-5 .char { transform: scale(8); filter: blur(40px); opacity: 0; }

        /* 6: Spiral Spin */
        .effect-6 .char { transform: rotate(1080deg) scale(0) translate(300px, 300px); }

        /* 7: Glitch Burst */
        @keyframes glitch-shake { 
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-8px, 4px); }
          40% { transform: translate(8px, -4px); }
          60% { transform: translate(-4px, -8px); }
          80% { transform: translate(4px, 8px); }
        }
        .effect-7.active .char { animation: glitch-shake 0.2s 3; }
        .effect-7 .char { transform: scale(1.5); filter: contrast(3); }

        /* 8: Flip-In (3D) */
        .effect-8 .brand-container { perspective: 1000px; }
        .effect-8 .char { transform: rotateX(90deg); }

        /* 9: Blur-Slide */
        .effect-9 .char { transform: translateX(-150px); filter: blur(30px); opacity: 0; }

        /* 10: Elastic Bounce */
        .effect-10 .char { transform: scale(0); transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); transition-duration: 1.2s; }

        /* 11: Pixel Assemble */
        .effect-11 .char { filter: blur(20px) brightness(10); transform: scale(0.2); }

        /* 12: Warp Speed (Z-Axis) */
        .effect-12 .char { transform: translateZ(800px); filter: blur(50px); opacity: 0; }

        /* 13: Vertical Flip Sequence */
        .effect-13 .char { transform: rotateY(180deg) scale(0.2); }

        /* 14: Ladder Step Reveal */
        .effect-14 .char { transform: translateY(80px); opacity: 0; }
        .effect-14.active .char { transform: translateY(0); opacity: 1; transition-duration: 0.6s; }

        /* 15: Deep Space Assembly */
        .effect-15 .char { transform: translate(calc(var(--rx)*1px), calc(var(--ry)*1px)) rotate(calc(var(--rd)*1deg)) scale(0); }
      `}</style>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[120px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div key={effectId} className={`relative z-10 text-center px-4 ${effectId ? `effect-${effectId} active` : ''}`}>
        <div className="brand-container">
          {/* Tech UI Elements */}
          <div className="laser-bar"></div>
          <div className="tech-corner corner-tl"></div>
          <div className="tech-corner corner-tr"></div>
          <div className="tech-corner corner-bl"></div>
          <div className="tech-corner corner-br"></div>

          {/* Main Title Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white italic tracking-tighter whitespace-nowrap px-4 py-2 mono select-none flex justify-center items-center">
            {/* Effect 2: Typewriter logic */}
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
            /* Effect 3: Hacker logic */
            effectId === 3 ? (
              hackerText.map((char, i) => (
                <span key={i} className={`char ${i > 8 ? 'text-blue-500 not-italic' : ''}`}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))
            ) : 
            /* General animation logic for other effects */
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
          
          {/* HUD Metadata Footer */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-4 opacity-30 mono text-[8px] font-bold text-blue-400 uppercase tracking-[0.4em]">
            <div className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
              <span>ENGINE_V3.0_FX_{effectId || '00'}</span>
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
