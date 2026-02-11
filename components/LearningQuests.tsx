
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
    { title: 'Root Structure', prob: 'Create basic html/body tags.', insight: 'DOM Architecture', output: 'Empty Skeleton', sol: '<!DOCTYPE html>\n<html>\n  <body>\n  </body>\n</html>', pattern: /<html>.*<body>.*<\/body>.*<\/html>/s },
    { title: 'Top Heading', prob: 'Add an h1 with "Evolution Path".', insight: 'Hierarchy', output: 'Header', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Evolution Path</h1>\n  </body>\n</html>', pattern: /<h1>.*Evolution Path.*<\/h1>/i },
    { title: 'Article Text', prob: 'Add a p with "Learning is fun".', insight: 'Flow', output: 'Text', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <p>Learning logic is fun</p>\n  </body>\n</html>', pattern: /<p>.*Learning logic is fun.*<\/p>/i },
    { title: 'Global Link', prob: 'Link to google.com.', insight: 'Linking', output: 'Node', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <a href="https://google.com">Search</a>\n  </body>\n</html>', pattern: /<a\s+href=["'].*google\.com/i },
    { title: 'Image Asset', prob: 'Add an img with src.', insight: 'Media', output: 'Graphic', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <img src="logo.png" alt="Logo">\n  </body>\n</html>', pattern: /<img\s+src=/i },
    { title: 'Unordered Stack', prob: 'List 2 items using ul/li.', insight: 'Data', output: 'List', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <ul><li>A</li><li>B</li></ul>\n  </body>\n</html>', pattern: /<ul>.*<li>.*<\/li>.*<li>.*<\/li>.*<\/ul>/s },
    { title: 'Data Grid', prob: 'Create a 1x2 table row.', insight: 'Tabular', output: 'Grid', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <table><tr><td>1</td><td>2</td></tr></table>\n  </body>\n</html>', pattern: /<table>.*<tr>.*<td>.*<\/td>.*<\/tr>.*<\/table>/s },
    { title: 'Input Portal', prob: 'Add a text input field.', insight: 'User', output: 'Slot', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <input type="text">\n  </body>\n</html>', pattern: /<input\s+type=["']text["']/i },
    { title: 'Action Trigger', prob: 'Add a "Submit" button.', insight: 'Event', output: 'Trigger', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <button>Submit</button>\n  </body>\n</html>', pattern: /<button>.*Submit.*<\/button>/i },
    { title: 'Form Cluster', prob: 'Wrap input inside form.', insight: 'Grouping', output: 'Packet', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <form><input type="text"></form>\n  </body>\n</html>', pattern: /<form>.*<input.*<\/form>/s }
  ];

  const cTemplates = [
    { title: 'System Output', prob: 'Print "Hello ICT".', insight: 'Stream', output: 'Log', sol: '#include <stdio.h>\n\nint main() {\n    printf("Hello ICT");\n    return 0;\n}', pattern: /printf\s*\(\s*".*Hello ICT.*"\s*\)\s*;/ },
    { title: 'Int Variable', prob: 'Declare int x = 50.', insight: 'Stack', output: 'Value', sol: '#include <stdio.h>\n\nint main() {\n    int x = 50;\n    return 0;\n}', pattern: /int\s+x\s*=\s*50\s*;/ },
    { title: 'Math Addition', prob: 'Calculate a + b.', insight: 'ALU', output: 'Sum', sol: '#include <stdio.h>\n\nint main() {\n    int a=5, b=10, c=a+b;\n    return 0;\n}', pattern: /a\s*\+\s*b/ },
    { title: 'Branching If', prob: 'Check if age > 18.', insight: 'Flow', output: 'Path', sol: '#include <stdio.h>\n\nint main() {\n    int age = 20;\n    if (age > 18) printf("Adult");\n    return 0;\n}', pattern: /if\s*\(\s*age\s*>\s*18\s*\)/ },
    { title: 'Cycle For', prob: 'Loop 5 times.', insight: 'Logic', output: 'Task', sol: '#include <stdio.h>\n\nint main() {\n    for(int i=0; i<5; i++) { }\n    return 0;\n}', pattern: /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*5/ },
    { title: 'User Input', prob: 'scanf int to x.', insight: 'Input', output: 'Data', sol: '#include <stdio.h>\n\nint main() {\n    int x;\n    scanf("%d", &x);\n    return 0;\n}', pattern: /scanf\s*\(\s*".*%d.*"\s*,\s*&x\s*\)/ },
    { title: 'Float Precision', prob: 'float temp = 36.5;', insight: 'Memory', output: 'Value', sol: '#include <stdio.h>\n\nint main() {\n    float temp = 36.5;\n    return 0;\n}', pattern: /float\s+temp\s*=\s*36/ },
    { title: 'Array Bank', prob: 'Declare int arr[10].', insight: 'Set', output: 'Multi', sol: '#include <stdio.h>\n\nint main() {\n    int arr[10];\n    return 0;\n}', pattern: /int\s+arr\s*\[\s*10\s*\]/ },
    { title: 'Condition Check', prob: 'Check x % 2 == 0.', insight: 'Parity', output: 'Logic', sol: '#include <stdio.h>\n\nint main() {\n    int x = 4;\n    if (x % 2 == 0) printf("Even");\n    return 0;\n}', pattern: /x\s*%\s*2\s*==\s*0/ },
    { title: 'While Guard', prob: 'Loop while x < 10.', insight: 'Guard', output: 'Cycle', sol: '#include <stdio.h>\n\nint main() {\n    int x = 0;\n    while(x < 10) { x++; }\n    return 0;\n}', pattern: /while\s*\(\s*x\s*<\s*10\s*\)/ }
  ];

  const templates = type === 'HTML' ? htmlTemplates : cTemplates;

  for (let i = 1; i <= 150; i++) {
    const t = templates[(i - 1) % templates.length];
    const difficulty = i <= 50 ? 'Beginner' : i <= 100 ? 'Intermediate' : 'Pro';
    
    quests.push({
      id: i,
      title: t.title,
      problem: t.prob,
      hint: `Ch ${type === 'HTML' ? '4' : '5'}`,
      solution: t.sol,
      boilerplate: type === 'HTML' ? HTML_STRUCT : C_STRUCT,
      difficulty: difficulty,
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
  const [filter, setFilter] = useState<'Beginner' | 'Intermediate' | 'Pro' | 'All'>('All');
  
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
  const [isSolutionMode, setIsSolutionMode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error' | null, msg: string }>({ status: null, msg: '' });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const quests = (activePath === 'HTML' ? HTML_QUESTS : C_QUESTS).filter(q => filter === 'All' || q.difficulty === filter);

  useEffect(() => {
    localStorage.setItem('ict_unlocked_levels', JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);

  useEffect(() => {
    localStorage.setItem('ict_total_xp', totalXP.toString());
  }, [totalXP]);

  useEffect(() => {
    if (selectedQuest) {
      setUserCode(selectedQuest.boilerplate);
      setIsSolutionMode(false);
      setFeedback({ status: null, msg: '' });
    }
  }, [selectedQuest]);

  const handleNextQuest = () => {
    if (!selectedQuest) return;
    const nextId = selectedQuest.id + 1;
    const nextQuest = (activePath === 'HTML' ? HTML_QUESTS : C_QUESTS).find(q => q.id === nextId);
    if (nextQuest) setSelectedQuest(nextQuest);
    else setSelectedQuest(null);
  };

  const handleVerify = async () => {
    if (!selectedQuest) return;
    setIsVerifying(true);
    setFeedback({ status: null, msg: 'Validating...' });

    const isCorrect = selectedQuest.expectedPattern.test(userCode);

    setTimeout(async () => {
      if (isCorrect) {
        setFeedback({ status: 'success', msg: t('quest.congrats') });
        if (selectedQuest.id === unlockedLevels[activePath]) {
          setUnlockedLevels(prev => ({ ...prev, [activePath]: prev[activePath] + 1 }));
          setTotalXP(prev => prev + selectedQuest.xp);
        }
      } else {
        try {
          const ai = getGeminiClient();
          const response: GenerateContentResponse = await ai.models.generateContent({
            model: CHAT_MODEL,
            contents: `Toufiq Sir, find 1 mistake in this ${activePath} for: "${selectedQuest.problem}". Code: "${userCode}". Max 10 words. ${lang === 'bn' ? 'Bengali' : 'English'}.`,
            config: { thinkingConfig: { thinkingBudget: 0 } }
          });
          setFeedback({ status: 'error', msg: response.text || 'Syntax Error.' });
        } catch {
          setFeedback({ status: 'error', msg: 'System fault. Check syntax!' });
        }
      }
      setIsVerifying(false);
    }, 600);
  };

  return (
    <section id="quests" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[9px]">Learning Evolution</h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter uppercase">Practice <span className="text-blue-600">Map</span></h3>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center">
             <div className="bg-slate-900/50 border border-white/5 rounded-xl p-1 flex gap-1">
                {(['HTML', 'C'] as const).map(p => (
                  <button key={p} onClick={() => setActivePath(p)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activePath === p ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>{p}</button>
                ))}
             </div>
             <div className="glass-card px-4 py-2 rounded-xl border-blue-500/20 flex items-center gap-2">
                <span className="text-[9px] font-black text-blue-500 uppercase">XP</span>
                <span className="text-lg font-black text-white mono leading-none">{totalXP}</span>
             </div>
          </div>
        </div>

        <div className="relative pt-6 pb-12">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/10 -translate-y-1/2"></div>
          <div ref={scrollRef} className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 px-4 scroll-smooth snap-x relative z-10 no-scrollbar">
            {quests.map((q) => {
              const isLocked = q.id > unlockedLevels[activePath];
              const isCompleted = q.id < unlockedLevels[activePath];
              const isCurrent = q.id === unlockedLevels[activePath];

              return (
                <div key={q.id} onClick={() => !isLocked && setSelectedQuest(q)} className={`flex-shrink-0 w-[260px] sm:w-[300px] snap-center transition-all duration-500 ${isLocked ? 'opacity-30' : 'cursor-pointer hover:-translate-y-2'}`}>
                  <div className={`h-full glass-card rounded-[35px] border-2 p-6 flex flex-col relative overflow-hidden ${isCurrent ? 'border-blue-500 bg-blue-600/5' : isCompleted ? 'border-emerald-500/30' : 'border-white/5'}`}>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-slate-900 text-slate-500 border border-white/5">NODE_{q.id}</span>
                      {isCompleted && <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>}
                    </div>

                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-4 leading-tight">{q.title}</h4>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Logic</span>
                        <span className="text-[10px] font-bold text-white truncate ml-2">{q.knowledgeInsight}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-600 uppercase">{q.xp} XP</span>
                       <span className={`text-[9px] font-black uppercase ${q.difficulty === 'Pro' ? 'text-rose-500' : 'text-blue-400'}`}>{q.difficulty}</span>
                    </div>

                    {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]"><svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2"/></svg></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedQuest && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-3 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-5xl rounded-[40px] border-blue-600/30 flex flex-col h-[90vh] overflow-hidden shadow-4xl relative">
            
            <div className="p-5 sm:p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
              <h3 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter">{selectedQuest.title}</h3>
              <button onClick={() => setSelectedQuest(null)} className="p-3 bg-white/5 hover:bg-rose-500/20 rounded-full text-slate-500 hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="w-full lg:w-[35%] p-6 sm:p-8 overflow-y-auto space-y-6 border-r border-white/5 bg-slate-900/20">
                <div className="space-y-2">
                  <h4 className="text-blue-400 font-black text-[9px] uppercase tracking-widest">Problem Statement</h4>
                  <p className="text-base sm:text-lg font-bold text-white leading-tight">{selectedQuest.problem}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <button onClick={() => {setUserCode(selectedQuest.solution); setIsSolutionMode(true)}} className="flex flex-col p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all">
                      <span className="text-[9px] font-black text-white uppercase">Inject Solution</span>
                      <span className="text-[8px] text-slate-500">Auto-complete</span>
                    </button>
                    <button onClick={() => {setUserCode(selectedQuest.boilerplate); setIsSolutionMode(false)}} className="flex flex-col p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/50 transition-all">
                      <span className="text-[9px] font-black text-white uppercase">Reset Editor</span>
                      <span className="text-[8px] text-slate-500">Self practice</span>
                    </button>
                </div>

                {feedback.msg && (
                  <div className={`p-4 rounded-2xl border ${feedback.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-300'}`}>
                    <p className="text-[10px] font-black uppercase mb-1">Feedback</p>
                    <p className="text-xs font-bold leading-tight">{feedback.msg}</p>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col p-4 sm:p-8 bg-black/40 h-full">
                <textarea 
                  value={userCode}
                  onChange={(e) => !isSolutionMode && setUserCode(e.target.value)}
                  readOnly={isSolutionMode}
                  className="flex-1 bg-transparent border-none text-blue-400 mono text-base sm:text-xl p-0 outline-none resize-none leading-relaxed placeholder:opacity-20"
                  spellCheck="false"
                  placeholder="Enter code..."
                />
                
                <div className="pt-6 flex gap-3">
                   {isSolutionMode ? (
                     <button onClick={() => {setIsSolutionMode(false); setUserCode(selectedQuest.boilerplate)}} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Return to Practice</button>
                   ) : feedback.status === 'success' ? (
                     <button onClick={handleNextQuest} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Next Challenge</button>
                   ) : (
                     <button onClick={handleVerify} disabled={isVerifying || !userCode.trim()} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl disabled:opacity-50">
                        {isVerifying ? 'Verifying...' : 'Verify Logic'}
                     </button>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LearningQuests;
