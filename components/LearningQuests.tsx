
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { getGeminiClient, CHAT_MODEL } from '../services/geminiService';
import { GenerateContentResponse } from "@google/genai";

interface Quest {
  id: number;
  title: string;
  problem: string;
  hint: string;
  solution: string;
  boilerplate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Pro';
  xp: number;
  expectedPattern: RegExp;
  knowledgeInsight: string;
  outputInsight: string;
}

const HTML_STRUCT = `<!DOCTYPE html>\n<html>\n  <body>\n    \n  </body>\n</html>`;
const C_STRUCT = `#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}`;

const generateQuests = (type: 'HTML' | 'C'): Quest[] => {
  const quests: Quest[] = [];
  const htmlTemplates = [
    { title: 'Root Structure', prob: 'Create basic html/body tags.', insight: 'Architecture', output: 'Skeleton', sol: '<html><body></body></html>', pattern: /<html>.*<body>.*<\/body>.*<\/html>/s },
    { title: 'Top Heading', prob: 'Add an h1 with "Hello".', insight: 'Hierarchy', output: 'Header', sol: '<h1>Hello</h1>', pattern: /<h1>.*Hello.*<\/h1>/i }
  ];
  const cTemplates = [
    { title: 'System Output', prob: 'Print "Hello ICT".', insight: 'Stream', output: 'Log', sol: 'printf("Hello ICT");', pattern: /printf\s*\(\s*".*Hello ICT.*"\s*\)\s*;/ }
  ];

  const templates = type === 'HTML' ? htmlTemplates : cTemplates;
  for (let i = 1; i <= 150; i++) {
    const t = templates[(i - 1) % templates.length];
    quests.push({
      id: i,
      title: t.title,
      problem: t.prob,
      hint: `Level ${i}`,
      solution: t.sol,
      boilerplate: type === 'HTML' ? HTML_STRUCT : C_STRUCT,
      difficulty: i <= 50 ? 'Beginner' : i <= 100 ? 'Intermediate' : 'Pro',
      xp: i * 50,
      expectedPattern: t.pattern,
      knowledgeInsight: t.insight,
      outputInsight: t.output
    });
  }
  return quests;
};

const HTML_QUESTS = generateQuests('HTML');
const C_QUESTS = generateQuests('C');

const LearningQuests: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activePath, setActivePath] = useState<'HTML' | 'C'>('HTML');
  const [unlockedLevels, setUnlockedLevels] = useState<{HTML: number, C: number}>(() => {
    const saved = localStorage.getItem('ict_unlocked_levels');
    return saved ? JSON.parse(saved) : {HTML: 1, C: 1};
  });
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('ict_total_xp');
    return saved ? parseInt(saved) : 0;
  });

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [userCode, setUserCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error' | null, msg: string }>({ status: null, msg: '' });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const quests = activePath === 'HTML' ? HTML_QUESTS : C_QUESTS;

  useEffect(() => {
    localStorage.setItem('ict_unlocked_levels', JSON.stringify(unlockedLevels));
    localStorage.setItem('ict_total_xp', totalXP.toString());
  }, [unlockedLevels, totalXP]);

  const handleVerify = async () => {
    if (!selectedQuest) return;
    setIsVerifying(true);
    setFeedback({ status: null, msg: 'Checking...' });
    const isCorrect = selectedQuest.expectedPattern.test(userCode);
    setTimeout(() => {
      if (isCorrect) {
        setFeedback({ status: 'success', msg: 'Correct! 🏆' });
        if (selectedQuest.id === unlockedLevels[activePath]) {
          setUnlockedLevels(prev => ({ ...prev, [activePath]: prev[activePath] + 1 }));
          setTotalXP(prev => prev + selectedQuest.xp);
        }
      } else {
        setFeedback({ status: 'error', msg: 'Mismatch. Try again!' });
      }
      setIsVerifying(false);
    }, 600);
  };

  return (
    <section id="quests" className="py-20 bg-slate-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6 text-center">
          <div className="space-y-1">
            <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[9px]">Roadmap</h2>
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Practice <span className="text-blue-600">Map</span></h3>
          </div>
          <div className="flex gap-4 items-center">
             <div className="bg-slate-900 border border-white/5 rounded-xl p-1 flex">
                {['HTML', 'C'].map(p => (
                  <button key={p} onClick={() => setActivePath(p as any)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activePath === p ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{p}</button>
                ))}
             </div>
             <div className="glass-card px-4 py-2 rounded-xl border-blue-500/20 text-white font-black text-xs">{totalXP} XP</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex overflow-x-auto gap-4 sm:gap-6 pb-10 snap-x snap-mandatory no-scrollbar scroll-smooth">
          {quests.map((q) => {
            const isLocked = q.id > unlockedLevels[activePath];
            const isCompleted = q.id < unlockedLevels[activePath];
            return (
              <div key={q.id} onClick={() => !isLocked && setSelectedQuest(q)} className={`flex-shrink-0 w-[240px] sm:w-[280px] snap-center transition-all ${isLocked ? 'opacity-30' : 'cursor-pointer hover:-translate-y-2'}`}>
                <div className={`h-full glass-card rounded-[35px] border-2 p-6 flex flex-col justify-between ${q.id === unlockedLevels[activePath] ? 'border-blue-500 bg-blue-600/5' : 'border-white/5'}`}>
                  <div>
                    <span className="text-[8px] font-black text-slate-500 uppercase mb-4 block">Level_{q.id}</span>
                    <h4 className="text-lg font-black text-white uppercase italic mb-4 leading-tight">{q.title}</h4>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-black text-blue-400 uppercase">{q.xp} XP</span>
                    {isCompleted ? <span className="text-emerald-500">✔</span> : isLocked ? <span>🔒</span> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedQuest && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl">
          <div className="glass-card w-full max-w-4xl rounded-[40px] border-blue-600/30 flex flex-col h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-white italic uppercase">{selectedQuest.title}</h3>
              <button onClick={() => setSelectedQuest(null)} className="text-slate-500 p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
              <div className="w-full sm:w-1/3 p-6 space-y-4 bg-slate-900/40 overflow-y-auto">
                <p className="text-xs font-black text-blue-400 uppercase">Mission</p>
                <p className="text-sm font-bold text-white leading-tight">{selectedQuest.problem}</p>
                {feedback.msg && <p className={`p-3 rounded-xl border text-[9px] font-black uppercase ${feedback.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>{feedback.msg}</p>}
              </div>
              <div className="flex-1 flex flex-col p-4 bg-black/40">
                <textarea 
                  value={userCode || selectedQuest.boilerplate}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 bg-transparent text-blue-400 mono text-base p-4 outline-none resize-none leading-relaxed"
                  spellCheck="false"
                />
                <button onClick={handleVerify} disabled={isVerifying} className="mt-4 w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs">
                  {isVerifying ? 'Verifying...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LearningQuests;
