
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
    { title: 'Root Structure', prob: 'Create the basic html and body tags.', insight: 'DOM Architecture', output: 'Empty Skeleton', sol: '<!DOCTYPE html>\n<html>\n  <body>\n  </body>\n</html>', pattern: /<html>.*<body>.*<\/body>.*<\/html>/s },
    { title: 'Top Heading', prob: 'Add an h1 with "Evolution Path".', insight: 'Semantic Hierarchy', output: 'Bold Header', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Evolution Path</h1>\n  </body>\n</html>', pattern: /<h1>.*Evolution Path.*<\/h1>/i },
    { title: 'Article Text', prob: 'Add a p with "Learning logic is fun".', insight: 'Content Flow', output: 'Standard Text', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <p>Learning logic is fun</p>\n  </body>\n</html>', pattern: /<p>.*Learning logic is fun.*<\/p>/i },
    { title: 'Global Link', prob: 'Link to google.com.', insight: 'Resource Linking', output: 'Hyperlink Node', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <a href="https://google.com">Search</a>\n  </body>\n</html>', pattern: /<a\s+href=["'].*google\.com/i },
    { title: 'Image Asset', prob: 'Add an image with a valid src.', insight: 'Media Rendering', output: 'Graphic Component', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <img src="logo.png" alt="Logo">\n  </body>\n</html>', pattern: /<img\s+src=/i },
    { title: 'Unordered Stack', prob: 'List 2 items using ul/li.', insight: 'Sequential Data', output: 'Bulleted List', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <ul><li>A</li><li>B</li></ul>\n  </body>\n</html>', pattern: /<ul>.*<li>.*<\/li>.*<li>.*<\/li>.*<\/ul>/s },
    { title: 'Data Grid', prob: 'Create a 1x2 table row.', insight: 'Tabular Logic', output: 'Structured Grid', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <table><tr><td>1</td><td>2</td></tr></table>\n  </body>\n</html>', pattern: /<table>.*<tr>.*<td>.*<\/td>.*<\/tr>.*<\/table>/s },
    { title: 'Input Portal', prob: 'Add a text input field.', insight: 'User Interaction', output: 'Interaction Slot', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <input type="text">\n  </body>\n</html>', pattern: /<input\s+type=["']text["']/i },
    { title: 'Action Trigger', prob: 'Add a "Submit" button.', insight: 'Event Handling', output: 'Clickable Item', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <button>Submit</button>\n  </body>\n</html>', pattern: /<button>.*Submit.*<\/button>/i },
    { title: 'Form Cluster', prob: 'Wrap an input inside a form.', insight: 'Data Grouping', output: 'Submit Packet', sol: '<!DOCTYPE html>\n<html>\n  <body>\n    <form><input type="text"></form>\n  </body>\n</html>', pattern: /<form>.*<input.*<\/form>/s }
  ];

  const cTemplates = [
    { title: 'System Output', prob: 'Print "System Initialized".', insight: 'Buffer Stream', output: 'Terminal Log', sol: '#include <stdio.h>\n\nint main() {\n    printf("System Initialized");\n    return 0;\n}', pattern: /printf\s*\(\s*".*System Initialized.*"\s*\)\s*;/ },
    { title: 'Int Variable', prob: 'Declare int x = 50.', insight: 'Stack Allocation', output: 'Memory Value', sol: '#include <stdio.h>\n\nint main() {\n    int x = 50;\n    return 0;\n}', pattern: /int\s+x\s*=\s*50\s*;/ },
    { title: 'Math Addition', prob: 'Calculate a + b.', insight: 'ALU Op', output: 'Sum Result', sol: '#include <stdio.h>\n\nint main() {\n    int a=5, b=10, c=a+b;\n    return 0;\n}', pattern: /a\s*\+\s*b/ },
    { title: 'Branching If', prob: 'Check if age > 18.', insight: 'Control Flow', output: 'Decision Path', sol: '#include <stdio.h>\n\nint main() {\n    int age = 20;\n    if (age > 18) printf("Adult");\n    return 0;\n}', pattern: /if\s*\(\s*age\s*>\s*18\s*\)/ },
    { title: 'Cycle For', prob: 'Loop 5 times.', insight: 'Iteration Logic', output: 'Repeated Task', sol: '#include <stdio.h>\n\nint main() {\n    for(int i=0; i<5; i++) { }\n    return 0;\n}', pattern: /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*5/ },
    { title: 'User Input', prob: 'scanf an integer to x.', insight: 'Runtime Input', output: 'Injected Data', sol: '#include <stdio.h>\n\nint main() {\n    int x;\n    scanf("%d", &x);\n    return 0;\n}', pattern: /scanf\s*\(\s*".*%d.*"\s*,\s*&x\s*\)/ },
    { title: 'Float Precision', prob: 'float temp = 36.5;', insight: 'Decimal Memory', output: 'Precise Value', sol: '#include <stdio.h>\n\nint main() {\n    float temp = 36.5;\n    return 0;\n}', pattern: /float\s+temp\s*=\s*36/ },
    { title: 'Array Bank', prob: 'Declare int arr[10].', insight: 'Contiguous Set', output: 'Multi-Store', sol: '#include <stdio.h>\n\nint main() {\n    int arr[10];\n    return 0;\n}', pattern: /int\s+arr\s*\[\s*10\s*\]/ },
    { title: 'Condition Check', prob: 'Check x % 2 == 0.', insight: 'Parity Logic', output: 'Binary Logic', sol: '#include <stdio.h>\n\nint main() {\n    int x = 4;\n    if (x % 2 == 0) printf("Even");\n    return 0;\n}', pattern: /x\s*%\s*2\s*==\s*0/ },
    { title: 'While Guard', prob: 'Loop while x < 10.', insight: 'Indefinite Loop', output: 'Controlled Flow', sol: '#include <stdio.h>\n\nint main() {\n    int x = 0;\n    while(x < 10) { x++; }\n    return 0;\n}', pattern: /while\s*\(\s*x\s*<\s*10\s*\)/ }
  ];

  const templates = type === 'HTML' ? htmlTemplates : cTemplates;

  for (let i = 1; i <= 150; i++) {
    const t = templates[(i - 1) % templates.length];
    const difficulty = i <= 50 ? 'Beginner' : i <= 100 ? 'Intermediate' : 'Pro';
    const complexitySuffix = i > templates.length ? ` (Lvl ${Math.ceil(i/templates.length)})` : '';
    
    quests.push({
      id: i,
      title: `${t.title}${complexitySuffix}`,
      problem: i > 100 ? `[PRO] Complex logic: ${t.prob}` : t.prob,
      hint: `Reference Ch ${type === 'HTML' ? '4' : '5'} rules.`,
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
  
  // Persistence via LocalStorage
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
    if (nextQuest) {
      setSelectedQuest(nextQuest);
    } else {
      setSelectedQuest(null);
    }
  };

  const handleVerify = async () => {
    if (!selectedQuest) return;
    setIsVerifying(true);
    setFeedback({ status: null, msg: 'Synchronizing Logic Matrix...' });

    const isCorrect = selectedQuest.expectedPattern.test(userCode);

    setTimeout(async () => {
      if (isCorrect) {
        setFeedback({ 
          status: 'success', 
          msg: t('quest.congrats')
        });
        if (selectedQuest.id === unlockedLevels[activePath]) {
          setUnlockedLevels(prev => ({ ...prev, [activePath]: prev[activePath] + 1 }));
          setTotalXP(prev => prev + selectedQuest.xp);
        }
      } else {
        try {
          const ai = getGeminiClient();
          const response: GenerateContentResponse = await ai.models.generateContent({
            model: CHAT_MODEL,
            contents: `As Toufiq Sir, find the mistake in this ${activePath} code for task: "${selectedQuest.problem}". Code: "${userCode}". One short line in ${lang === 'bn' ? 'Bengali' : 'English'}.`,
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
      <style>{`
        .quest-scroll::-webkit-scrollbar { height: 6px; }
        .quest-scroll::-webkit-scrollbar-track { background: rgba(59, 130, 246, 0.05); }
        .quest-scroll::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-3">
            <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px]">ICT Logical Circuits</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">Learning <span className="text-blue-600">Practice</span> Map</h3>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
             <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-1.5 flex gap-1 backdrop-blur-md">
                {(['HTML', 'C'] as const).map(p => (
                  <button key={p} onClick={() => setActivePath(p)} className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePath === p ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500'}`}>{p}</button>
                ))}
             </div>
             <div className="glass-card px-6 sm:px-8 py-3 rounded-2xl border-blue-500/20 glow-blue">
                <span className="text-[10px] font-black text-blue-500 mr-2 sm:mr-4 uppercase tracking-widest">Global XP</span>
                <span className="text-2xl sm:text-3xl font-black text-white mono">{totalXP}</span>
             </div>
          </div>
        </div>

        <div className="relative pt-4 pb-20 sm:pt-12 sm:pb-24">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/10 -translate-y-1/2 -z-0"></div>
          <div ref={scrollRef} className="quest-scroll flex overflow-x-auto gap-6 sm:gap-10 pb-12 px-2 sm:px-6 scroll-smooth snap-x relative z-10">
            {quests.map((q) => {
              const isLocked = q.id > unlockedLevels[activePath];
              const isCompleted = q.id < unlockedLevels[activePath];
              const isCurrent = q.id === unlockedLevels[activePath];

              return (
                <div key={q.id} onClick={() => !isLocked && setSelectedQuest(q)} className={`flex-shrink-0 w-72 sm:w-80 snap-center group cursor-pointer transition-all duration-700 ${isLocked ? 'opacity-25 grayscale pointer-events-none' : 'hover:-translate-y-3'}`}>
                  <div className={`h-full glass-card rounded-[40px] sm:rounded-[50px] border-2 p-8 sm:p-10 flex flex-col transition-all relative overflow-hidden ${isCurrent ? 'border-blue-500 shadow-3xl scale-105 bg-blue-600/5' : isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5'}`}>
                    
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isCurrent ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-500 border-white/5'}`}>
                        Node {q.id.toString().padStart(3, '0')}
                      </span>
                      {isCompleted && <div className="text-emerald-500"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>}
                    </div>

                    <h4 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter mb-6 sm:mb-8 leading-none">{q.title}</h4>

                    <div className="space-y-4 sm:space-y-6 mt-auto">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Knowledge Insight</p>
                        <p className="text-xs sm:text-sm font-bold text-slate-200 leading-tight">{q.knowledgeInsight}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Output Insight</p>
                        <p className="text-xs sm:text-sm font-bold text-slate-200 leading-tight">{q.outputInsight}</p>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{q.xp} XP</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${q.difficulty === 'Pro' ? 'text-rose-500' : 'text-blue-400'}`}>{q.difficulty}</span>
                    </div>

                    {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]"><svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Evolution Modal */}
      {selectedQuest && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-2 sm:p-4 bg-slate-950/98 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
          <div className="glass-card w-full max-w-6xl rounded-[40px] sm:rounded-[60px] border-blue-600/30 flex flex-col h-[95vh] sm:h-[90vh] overflow-hidden shadow-4xl relative">
            
            <div className="p-6 sm:p-10 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em]">Node {selectedQuest.id}</span>
                </div>
                <h3 className="text-xl sm:text-4xl font-black text-white italic uppercase tracking-tighter">{selectedQuest.title}</h3>
              </div>
              <button onClick={() => setSelectedQuest(null)} className="p-3 sm:p-5 hover:bg-white/5 rounded-full transition-all text-slate-500 hover:text-white">
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <div className="w-full lg:w-[35%] p-6 sm:p-10 overflow-y-auto space-y-8 sm:space-y-12 border-r border-white/5 bg-slate-900/20">
                <div className="space-y-4">
                  <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-widest">Problem Statement</h4>
                  <p className="text-lg sm:text-2xl font-bold text-white leading-tight">{selectedQuest.problem}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <button 
                      onClick={() => {setUserCode(selectedQuest.solution); setIsSolutionMode(true); setFeedback({status: 'success', msg: 'Solution protocol loaded.'})}} 
                      className={`flex items-center justify-between p-4 sm:p-6 bg-white/5 border rounded-2xl sm:rounded-[35px] transition-all text-left ${isSolutionMode ? 'border-blue-500/80 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/50'}`}
                    >
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-black text-white uppercase mb-1">Load Full Solution</p>
                        <p className="text-[9px] text-slate-500 font-medium">Injects complete code</p>
                      </div>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                    </button>
                    <button 
                      onClick={() => {setUserCode(selectedQuest.boilerplate); setIsSolutionMode(false); setFeedback({status: null, msg: ''})}} 
                      className={`flex items-center justify-between p-4 sm:p-6 bg-white/5 border rounded-2xl sm:rounded-[35px] transition-all text-left ${!isSolutionMode ? 'border-emerald-500/80 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/50'}`}
                    >
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-black text-white uppercase mb-1">{t('quest.tryByYourself')}</p>
                        <p className="text-[9px] text-slate-500 font-medium">Reset editor</p>
                      </div>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2"/></svg>
                    </button>
                </div>

                {feedback.msg && (
                  <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-[40px] border animate-in slide-in-from-bottom-5 ${
                    feedback.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                    feedback.status === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 
                    'bg-blue-500/10 border-blue-500/20 text-blue-300'
                  }`}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 sm:mb-4 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-3 ${
                        feedback.status === 'success' ? 'bg-emerald-500' : 
                        feedback.status === 'error' ? 'bg-rose-500 animate-pulse' : 
                        'bg-blue-500 animate-bounce'
                      }`}></span>
                      Feedback
                    </p>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">{feedback.msg}</p>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col p-6 sm:p-10 bg-black/40">
                <div className="relative flex-1 group">
                   <textarea 
                    value={userCode}
                    onChange={(e) => !isSolutionMode && setUserCode(e.target.value)}
                    readOnly={isSolutionMode}
                    className={`w-full h-full bg-transparent border-none text-blue-400 mono text-lg sm:text-2xl p-0 outline-none resize-none leading-relaxed placeholder:opacity-20 font-medium ${isSolutionMode ? 'opacity-80' : ''}`}
                    spellCheck="false"
                    placeholder="Enter code here..."
                   />
                </div>
                
                <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
                   {isSolutionMode ? (
                     <button 
                      onClick={() => {setIsSolutionMode(false); setUserCode(selectedQuest.boilerplate);}} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-8 rounded-2xl sm:rounded-[40px] font-black uppercase tracking-widest text-xs sm:text-sm transition-all"
                     >
                       {t('quest.tryByYourself')}
                     </button>
                   ) : (
                     <>
                       {feedback.status === 'success' ? (
                         <button 
                          onClick={handleNextQuest} 
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 sm:py-8 rounded-2xl sm:rounded-[40px] font-black uppercase tracking-widest text-xs sm:text-sm transition-all flex items-center justify-center space-x-4"
                         >
                           <span>{t('quest.next')}</span>
                           <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                         </button>
                       ) : (
                         <div className="flex w-full gap-4">
                            <button 
                              onClick={handleVerify} 
                              disabled={isVerifying || !userCode.trim()} 
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-8 rounded-2xl sm:rounded-[40px] font-black uppercase tracking-widest text-xs sm:text-sm transition-all"
                            >
                              {isVerifying ? t('quest.validating') : `Verify Logic`}
                            </button>
                         </div>
                       )}
                     </>
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
