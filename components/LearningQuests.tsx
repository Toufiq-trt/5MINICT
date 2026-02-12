
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';

interface Quest {
  id: number;
  title: string;
  problem: string;
  visualOutput: React.ReactNode;
  hint: string;
  solution: string;
  boilerplate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  xp: number;
  expectedPattern: RegExp;
  category: string;
}

const HTML_STRUCT = `<!DOCTYPE html>\n<html>\n  <body>\n    \n  </body>\n</html>`;
const C_STRUCT = `#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}`;

const generate100Quests = (type: 'HTML' | 'C'): Quest[] => {
  const quests: Quest[] = [];
  
  for (let i = 1; i <= 50; i++) {
    let title = "";
    let problem = "";
    let visual: React.ReactNode;
    let solution = "";
    let pattern = /.*/;
    let category = "";
    let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master' = 'Beginner';

    if (type === 'HTML') {
      if (i <= 35) {
        if (i === 1) {
          title = "Structural Core";
          category = "Basics";
          visual = <div className="text-white border p-2">Standard Page Content</div>;
          problem = "Write the basic HTML structure including <html>, <body> tags and 'Standard Page Content' inside.";
          solution = "<html>\n  <body>\n    Standard Page Content\n  </body>\n</html>";
          pattern = /<html>.*<body>.*Standard Page Content.*<\/body>.*<\/html>/is;
        } else if (i === 4) {
          title = "Chemical Formulas";
          category = "Formatting";
          visual = <div className="text-white text-xl font-bold">H<sub>2</sub>SO<sub>4</sub></div>;
          problem = "Recreate the Sulfuric Acid formula using the subscript tag.";
          solution = "H<sub>2</sub>SO<sub>4</sub>";
          pattern = /H<sub>2<\/sub>SO<sub>4<\/sub>/i;
        } else if (i === 5) {
          title = "Algebraic Powers";
          category = "Formatting";
          visual = <div className="text-white text-xl font-bold">(a+b)<sup>2</sup></div>;
          problem = "Use the superscript tag to show the power of 2.";
          solution = "(a+b)<sup>2</sup>";
          pattern = /\(a\+b\)<sup>2<\/sup>/i;
        } else {
          title = `HTML Task ${i}`;
          category = "General HTML";
          visual = <div className="text-white">HTML Level {i} Logic</div>;
          problem = `Display 'HTML Level ${i} Logic' inside any heading or paragraph tag.`;
          solution = `<p>HTML Level ${i} Logic</p>`;
          pattern = new RegExp(`HTML Level ${i} Logic`, 'i');
        }
      } else {
        difficulty = i > 45 ? 'Master' : 'Advanced';
        category = "Complex Tables";

        if (i === 36) {
          title = "Navigation Grid";
          visual = <table border={1} className="text-white border-white"><tr><td colSpan={2} className="p-2 text-center bg-blue-900/50 font-black italic">Menu</td></tr><tr><td className="p-2"><a href="#" className="text-blue-400 underline">Home</a></td><td className="p-2">Page</td></tr></table>;
          problem = "Create a table with border='1'. First cell merges 2 columns (colspan), has a blue background (bgcolor), and contains 'Menu'. Second row's first cell contains a link to '#'.";
          solution = '<table border="1">\n  <tr>\n    <td colspan="2" bgcolor="blue">Menu</td>\n  </tr>\n  <tr>\n    <td><a href="#">Home</a></td>\n    <td>Page</td>\n  </tr>\n</table>';
          pattern = /colspan\s*=\s*["']2["'].*bgcolor.*<a/is;
        } else if (i === 44) {
          title = "The Colorful Cross";
          visual = <table border={1} className="text-white border-white text-center"><tr><td colSpan={2} className="p-2 bg-blue-600 font-bold italic underline">Main Topic</td></tr><tr><td rowSpan={2} className="p-4 bg-yellow-600 text-slate-900 font-black">Side</td><td className="p-2">Info A</td></tr><tr><td className="p-2 italic"><span style={{ color: 'lime' }}>Special Note</span></td></tr></table>;
          problem = "Row 1: Colspan='2', blue background, underlined bold text. Row 2: First cell rowspan='2' with yellow background. Last cell: green text using <font>.";
          solution = '<table border="1">\n  <tr>\n    <td colspan="2" bgcolor="blue"><b><u>Main Topic</u></b></td>\n  </tr>\n  <tr>\n    <td rowspan="2" bgcolor="yellow">Side</td>\n    <td>Info A</td>\n  </tr>\n  <tr>\n    <td><font color="lime">Special Note</font></td>\n  </tr>\n</table>';
          pattern = /colspan\s*=\s*["']2["'].*rowspan\s*=\s*["']2["'].*<font\s+color\s*=\s*["']lime["']/is;
        } else {
           title = `Complex Table ${i}`;
           problem = "Complete a complex table structure following the stem pattern shown.";
           solution = "<table>...</table>";
           pattern = /<table>/i;
        }
      }
    } else {
      if (i === 1) {
        title = "Output Protocol";
        category = "Basics";
        visual = <div className="mono text-emerald-400">Hello Student</div>;
        problem = "Print the exact string: 'Hello Student' using printf.";
        solution = '#include <stdio.h>\n\nint main() {\n    printf("Hello Student");\n    return 0;\n}';
        pattern = /printf\s*\(\s*".*Hello Student.*"\s*\)\s*;/;
      } else {
        title = `C Logic Level ${i}`;
        category = "Logic Flow";
        visual = <div className="mono text-emerald-400">Level {i} Online</div>;
        problem = `Write a logic to print 'Level ${i} Online' to the console.`;
        solution = `#include <stdio.h>\n\nint main() {\n    printf("Level ${i} Online");\n    return 0;\n}`;
        pattern = new RegExp(`Level ${i} Online`, 'i');
      }
    }

    if (i > 15) difficulty = 'Intermediate';
    if (i > 30) difficulty = 'Advanced';
    if (i === 50) difficulty = 'Master';

    quests.push({
      id: i,
      title: title || `${type} Quest ${i}`,
      problem: problem,
      visualOutput: visual,
      hint: `Mastering ${category}`,
      solution: solution,
      boilerplate: type === 'HTML' ? HTML_STRUCT : C_STRUCT,
      difficulty: difficulty,
      xp: i * 15,
      expectedPattern: pattern,
      category: category
    });
  }
  return quests;
};

const HTML_QUESTS = generate100Quests('HTML');
const C_QUESTS = generate100Quests('C');

const LearningQuests: React.FC = () => {
  const { t } = useLanguage();
  const [activePath, setActivePath] = useState<'HTML' | 'C'>('HTML');
  const [completedLevels, setCompletedLevels] = useState<{HTML: number[], C: number[]}>(() => {
    const saved = localStorage.getItem('ict_completed_levels_final_v1');
    return saved ? JSON.parse(saved) : {HTML: [], C: []};
  });
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('ict_total_xp_final_v1');
    return saved ? parseInt(saved) : 0;
  });

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState<'mission' | 'solution' | 'practice'>('mission');
  const [userCode, setUserCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error' | null, msg: string }>({ status: null, msg: '' });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const quests = activePath === 'HTML' ? HTML_QUESTS : C_QUESTS;

  useEffect(() => {
    localStorage.setItem('ict_completed_levels_final_v1', JSON.stringify(completedLevels));
    localStorage.setItem('ict_total_xp_final_v1', totalXP.toString());
  }, [completedLevels, totalXP]);

  const openQuest = (q: Quest) => {
    setSelectedQuest(q);
    setUserCode(q.boilerplate);
    setActiveTab('mission');
    setFeedback({ status: null, msg: '' });
  };

  const handleVerify = () => {
    if (!selectedQuest) return;
    setIsVerifying(true);
    setFeedback({ status: null, msg: 'Connecting to Logic Engine...' });

    setTimeout(() => {
      const isCorrect = selectedQuest.expectedPattern.test(userCode);
      if (isCorrect) {
        setFeedback({ status: 'success', msg: 'System check passed! Your logic is flawless. 🚀' });
        if (!completedLevels[activePath].includes(selectedQuest.id)) {
          setCompletedLevels(prev => ({ 
            ...prev, 
            [activePath]: [...prev[activePath], selectedQuest.id] 
          }));
          setTotalXP(prev => prev + selectedQuest.xp);
        }
      } else {
        setFeedback({ status: 'error', msg: 'Logic mismatch. Re-read the Mission requirements!' });
      }
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div className="py-4 bg-transparent px-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6 text-center">
          <div className="space-y-1">
            <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px]">Student Evolution Map</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter uppercase">Quest <span className="text-blue-600">Roadmap</span></h3>
          </div>
          <div className="flex gap-4 items-center">
             <div className="bg-slate-900 border border-white/5 rounded-2xl p-1.5 flex shadow-2xl">
                {['HTML', 'C'].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setActivePath(p as any)} 
                    className={`px-5 sm:px-8 py-2 rounded-xl text-[10px] font-black transition-all ${activePath === p ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
                  >
                    {p}
                  </button>
                ))}
             </div>
             <div className="glass-card px-4 py-2.5 rounded-2xl border-blue-500/20 text-white font-black text-xs flex items-center gap-2">
               <span className="text-blue-400">⚡</span> {totalXP} XP
             </div>
          </div>
        </div>

        {/* Roadmap Track */}
        <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth">
          <div className="flex-shrink-0 w-4 sm:w-8"></div>
          {quests.map((q) => {
            const isCompleted = completedLevels[activePath].includes(q.id);
            return (
              <div 
                key={q.id} 
                onClick={() => openQuest(q)} 
                className={`flex-shrink-0 w-[200px] sm:w-[260px] snap-center transition-all cursor-pointer group hover:-translate-y-2`}
              >
                <div className={`h-full glass-card rounded-[35px] border-2 p-6 flex flex-col justify-between transition-all duration-500 ${isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 hover:border-blue-500/30'}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {isCompleted ? 'Completed' : `Lvl_${q.id}`}
                      </span>
                      <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                        q.difficulty === 'Beginner' ? 'bg-blue-500/10 text-blue-400' :
                        q.difficulty === 'Intermediate' ? 'bg-cyan-500/10 text-cyan-400' :
                        'bg-rose-500/10 text-rose-400'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-white uppercase italic leading-tight group-hover:text-blue-400 transition-colors h-10 overflow-hidden">
                      {q.title}
                    </h4>
                    <span className="text-[9px] text-slate-600 uppercase tracking-widest font-black opacity-60 block">{q.category}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase">{q.xp} XP</span>
                    {isCompleted ? (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex-shrink-0 w-4 sm:w-8"></div>
        </div>

      {selectedQuest && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-0 sm:p-4 bg-slate-950/98 backdrop-blur-3xl animate-in zoom-in-95 duration-300">
          <div className="glass-card w-full max-w-6xl sm:rounded-[50px] border-blue-600/30 flex flex-col h-full sm:h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
              <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="bg-blue-600 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-black shadow-xl text-sm sm:text-lg italic">
                  {selectedQuest.id}
                </div>
                <div>
                  <h3 className="text-base sm:text-2xl font-black text-white italic uppercase tracking-tighter truncate max-w-[150px] sm:max-w-none">{selectedQuest.title}</h3>
                  <div className="flex gap-3 items-center">
                    <span className="text-[7px] sm:text-[9px] text-blue-400 font-bold uppercase tracking-widest">{selectedQuest.category} MODULE</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedQuest(null)} className="text-slate-500 hover:text-white p-2 sm:p-3 bg-white/5 rounded-xl transition-all hover:rotate-90">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Content Tabs */}
            <div className="flex bg-slate-900/60 p-2 gap-2 border-b border-white/5">
              {(['mission', 'solution', 'practice'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[10px] uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-blue-600 text-white shadow-2xl scale-[1.02]' : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Pane Container */}
            <div className="flex-1 overflow-hidden relative flex flex-col lg:flex-row">
              {/* Mission View */}
              <div className={`flex-1 overflow-y-auto p-5 sm:p-12 space-y-6 animate-in fade-in duration-500 ${activeTab === 'practice' ? 'hidden lg:block lg:max-w-md bg-slate-950/50 border-r border-white/5' : 'w-full'}`}>
                {activeTab === 'mission' || activeTab === 'practice' ? (
                  <>
                    <div className="space-y-4 sm:space-y-6">
                      <h5 className="text-blue-400 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em]">Expected Output</h5>
                      <div className="bg-white/5 p-4 sm:p-8 rounded-[25px] sm:rounded-[40px] border border-white/10 flex items-center justify-center min-h-[120px] overflow-auto">
                        <div className="scale-[0.85] sm:scale-100 transform origin-center">
                          {selectedQuest.visualOutput}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="text-blue-400 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em]">Instructions</h5>
                        <p className="text-base sm:text-2xl font-bold text-white leading-snug tracking-tight">{selectedQuest.problem}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-1">
                      <h5 className="text-emerald-400 font-black text-[8px] sm:text-[10px] uppercase tracking-[0.3em]">Toufiq Solution</h5>
                      <p className="text-slate-500 text-[10px] sm:text-sm italic">Analyze logic carefully.</p>
                    </div>
                    <div className="bg-black/80 p-5 sm:p-8 rounded-[25px] sm:rounded-[40px] border border-white/10 shadow-3xl">
                      <pre className="text-emerald-400 mono text-[10px] sm:text-base leading-relaxed overflow-x-auto selection:bg-emerald-500/20">
                        {selectedQuest.solution}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Practice Pane */}
              {(activeTab === 'practice' || window.innerWidth >= 1024) && (
                <div className={`flex-1 flex flex-col p-4 sm:p-10 bg-black/40 ${activeTab !== 'practice' ? 'hidden lg:flex' : 'flex'}`}>
                  <div className="flex-1 bg-black/60 rounded-[25px] sm:rounded-[40px] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative">
                    <div className="p-3 sm:p-4 bg-slate-900/50 border-b border-white/5 flex justify-between items-center">
                      <span className="text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">Compiler_Active</span>
                      {feedback.status && (
                        <div className={`px-3 py-1 rounded-full text-[7px] sm:text-[9px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 ${
                          feedback.status === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {feedback.msg}
                        </div>
                      )}
                    </div>
                    <textarea 
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="flex-1 bg-transparent text-blue-400 mono text-xs sm:text-base p-5 sm:p-8 outline-none resize-none leading-relaxed custom-scrollbar"
                      spellCheck="false"
                      placeholder="Start building logic..."
                    />
                  </div>
                  <button 
                    onClick={handleVerify} 
                    disabled={isVerifying} 
                    className="mt-4 sm:mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-6 rounded-xl sm:rounded-[30px] font-black uppercase text-[10px] sm:text-sm tracking-[0.2em] shadow-3xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isVerifying ? 'SYSTEM ANALYZING...' : 'SUBMIT SOLUTION'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningQuests;
