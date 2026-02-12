
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { getGeminiClient, CHAT_MODEL } from '../services/geminiService';
import { Type } from "@google/genai";

type GameType = 'TIC_TAC_TOE' | 'QUIZ' | null;

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface PlayerNames {
  x: string;
  o: string;
}

const FALLBACK_QUIZ: QuizQuestion[] = [
  { question: "What is the decimal equivalent of binary 1011?", options: ["9", "10", "11", "12"], correctAnswer: 2 },
  { question: "Which layer of OSI model is responsible for routing?", options: ["Physical", "Data Link", "Network", "Transport"], correctAnswer: 2 },
  { question: "What does HTML stand for?", options: ["Hyperlink Text Markup Language", "Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink Tool Management Logic"], correctAnswer: 1 }
];

const GameZone: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });
  const [showSummary, setShowSummary] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  // Tic Tac Toe State
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerNames, setPlayerNames] = useState<PlayerNames | null>(() => {
    const saved = sessionStorage.getItem('ttt_players');
    return saved ? JSON.parse(saved) : null;
  });
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempNames, setTempNames] = useState<PlayerNames>({ x: '', o: '' });
  const [celebrating, setCelebrating] = useState(false);
  const [lastWinnerName, setLastWinnerName] = useState<string | null>(null);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [dynamicQuiz, setDynamicQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const watermarkStyle: React.CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ctext x='0' y='100' fill='rgba(255, 255, 255, 0.03)' font-size='16' font-weight='bold' font-family='sans-serif' transform='rotate(-45 75 75)'%3EToufiq Sir%3C/text%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  };

  const generateNewQuiz = async () => {
    setIsLoadingQuiz(true);
    setActiveGame('QUIZ');
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsQuizSubmitted(false);
    setUserAnswers([]);
    setScore({ correct: 0, wrong: 0, total: 0 });

    try {
      const ai = getGeminiClient();
      const promptLang = lang === 'bn' ? 'Bengali (বাংলা)' : 'English';
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate exactly 25 challenging Multiple Choice Questions for HSC ICT (Bangladesh Syllabus).
        IMPORTANT: All text (questions and options) MUST be strictly in ${promptLang}. 
        Technical terms can remain in English within brackets if needed.
        Cover all 6 chapters thoroughly.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.INTEGER }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      if (Array.isArray(data) && data.length > 0) {
        setDynamicQuiz(data);
      } else {
        setDynamicQuiz(FALLBACK_QUIZ);
      }
    } catch (error) {
      console.error("Quiz Gen Failed:", error);
      setDynamicQuiz(FALLBACK_QUIZ);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  useEffect(() => {
    if (winner) {
      const winnerName = winner === 'X' ? playerNames?.x : playerNames?.o;
      setLastWinnerName(winnerName || winner);
      setCelebrating(true);
      const timer = setTimeout(() => {
        setCelebrating(false);
        setBoard(Array(9).fill(null));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  const handleTTTClick = (i: number) => {
    if (winner || board[i] || celebrating) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const handleTicTacToeStart = () => {
    if (!playerNames) {
      setShowNameModal(true);
    } else {
      setActiveGame('TIC_TAC_TOE');
      setBoard(Array(9).fill(null));
      setIsXNext(true);
    }
  };

  const submitNames = () => {
    if (tempNames.x.trim() && tempNames.o.trim()) {
      const names = {
        x: tempNames.x.trim(),
        o: tempNames.o.trim()
      };
      setPlayerNames(names);
      sessionStorage.setItem('ttt_players', JSON.stringify(names));
      setShowNameModal(false);
      setActiveGame('TIC_TAC_TOE');
      setBoard(Array(9).fill(null));
      setIsXNext(true);
    }
  };

  const resetSession = () => {
    setScore({ correct: 0, wrong: 0, total: 0 });
    setShowSummary(false);
    setActiveGame(null);
    setUserAnswers([]);
    setCurrentQuizIdx(0);
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    // Remember names until app closes (sessionStorage persists)
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsQuizSubmitted(true);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuizIdx] = selectedOption;
    setUserAnswers(newAnswers);

    const correct = dynamicQuiz[currentQuizIdx].correctAnswer;
    if (selectedOption === correct) {
      setScore(s => ({ ...s, correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1, total: s.total + 1 }));
    }
  };

  const nextQuiz = () => {
    if (currentQuizIdx < dynamicQuiz.length - 1) {
      setIsQuizSubmitted(false);
      setSelectedOption(null);
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleDownloadReport = () => {
    const successRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const questionRows = userAnswers.map((ansIdx, i) => {
      if (ansIdx === null) return '';
      const q = dynamicQuiz[i];
      const isCorrect = ansIdx === q.correctAnswer;
      return `
        <div class="q-box ${isCorrect ? 'correct' : 'wrong'}">
          <div class="q-text"><b>Q${i+1}:</b> ${q.question}</div>
          <div class="ans-line">Your Ans: ${q.options[ansIdx]}</div>
          ${!isCorrect ? `<div class="correct-line">Correct: ${q.options[q.correctAnswer]}</div>` : ''}
        </div>
      `;
    }).join('');

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>TOUFIQ Sir's Smart Quizz Test - Report</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Segoe UI', sans-serif; color: #1a202c; line-height: 1.4; margin: 0; padding: 0; }
          .header { text-align: center; border-bottom: 2px solid #3182ce; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { color: #2c5282; margin: 0; font-size: 24px; text-transform: uppercase; }
          .header p { margin: 5px 0; font-size: 12px; color: #4a5568; font-weight: bold; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; text-align: center; }
          .stat-card { border: 1px solid #e2e8f0; padding: 10px; border-radius: 8px; }
          .content-columns { column-count: 2; column-gap: 30px; }
          .q-box { break-inside: avoid; border-left: 3px solid #cbd5e0; padding: 8px 10px; margin-bottom: 12px; font-size: 11px; background: #f7fafc; border-radius: 0 4px 4px 0; }
          .q-box.correct { border-left-color: #48bb78; background: #f0fff4; }
          .q-box.wrong { border-left-color: #f56565; background: #fff5f5; }
          .sig-line { border-top: 1px solid #2d3748; width: 150px; text-align: center; padding-top: 5px; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TOUFIQ Sir's Smart Quizz Test</h1>
          <p>The Logic Evolution | WhatsApp 01794903262</p>
        </div>
        <div class="stats-grid">
          <div class="stat-card"><b>${score.total}</b><br/><span>Total</span></div>
          <div class="stat-card"><b>${score.correct}</b><br/><span>Correct</span></div>
          <div class="stat-card"><b>${score.wrong}</b><br/><span>Wrong</span></div>
          <div class="stat-card"><b>${successRate}%</b><br/><span>Success</span></div>
        </div>
        <div class="content-columns">${questionRows}</div>
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div class="sig-line">Student's Name</div>
          <div class="sig-line">Mentor's Signature</div>
        </div>
        <script>window.onload = () => setTimeout(() => window.print(), 500);</script>
      </body>
      </html>
    `;
    const printWin = window.open('', '_blank');
    printWin?.document.write(reportHtml);
    printWin?.document.close();
  };

  return (
    <section id="games" className="py-24 relative overflow-hidden bg-slate-950 px-4">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px]">Neural Playzone</h2>
          <h3 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter uppercase">Game <span className="text-blue-600">Zone</span></h3>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { id: 'TIC_TAC_TOE', name: 'Tic Tac Toe', desc: 'Logic Combat', color: 'blue', action: handleTicTacToeStart },
              { id: 'QUIZ', name: 'ICT QUIZ', desc: 'AI Exam Engine', color: 'emerald', action: generateNewQuiz }
            ].map((g) => (
              <div key={g.name} onClick={g.action} className="group cursor-pointer">
                <div className={`glass-card p-6 sm:p-10 rounded-[35px] border-white/5 group-hover:border-${g.color}-500/50 transition-all duration-500 text-center space-y-4 group-hover:-translate-y-2 h-full flex flex-col justify-center shadow-xl`}>
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-${g.color}-600/10 flex items-center justify-center text-${g.color}-500 group-hover:bg-${g.color}-600 group-hover:text-white transition-all`}>
                    {g.id === 'TIC_TAC_TOE' ? (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M9 4v16M15 4v16" /></svg>
                    ) : (
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </div>
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{g.name}</h4>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative glass-card rounded-[40px] border-blue-500/20 min-h-[500px] flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden animate-in zoom-in-95 duration-500" style={watermarkStyle}>
            
            <button onClick={resetSession} className="absolute top-4 right-4 p-3 bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-full transition-all z-30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {isLoadingQuiz ? (
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">
                  Toufiq sir is preparing question<br/><span className="text-blue-500">Please Wait</span>
                </h4>
              </div>
            ) : activeGame === 'TIC_TAC_TOE' ? (
              <div className="flex flex-col items-center space-y-8 w-full">
                <div className="text-center">
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">
                    {winner 
                      ? `${winner === 'X' ? playerNames?.x : playerNames?.o} Wins!` 
                      : isDraw 
                        ? 'Match Draw!' 
                        : `${isXNext ? playerNames?.x : playerNames?.o}'s Turn`
                    }
                  </h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Mark: {isXNext ? 'X' : 'O'}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {board.map((cell, i) => (
                    <button key={i} onClick={() => handleTTTClick(i)} className={`w-20 h-20 sm:w-28 sm:h-28 bg-slate-900/50 border-2 border-white/5 rounded-2xl sm:rounded-[30px] text-3xl sm:text-5xl font-black ${cell === 'X' ? 'text-blue-500' : 'text-rose-500'} hover:border-blue-500/40 transition-all flex items-center justify-center`}>
                      {cell}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setBoard(Array(9).fill(null))} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest text-[9px] transition-all shadow-lg">Reset Board</button>
                  <button onClick={resetSession} className="px-8 py-3 glass-card border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[9px] transition-all">Exit Game</button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl space-y-8">
                <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">Q_{currentQuizIdx + 1}/{dynamicQuiz.length}</span>
                   {userAnswers.length > 0 && (
                      <button onClick={() => setShowSummary(true)} className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">Finish Exam</button>
                   )}
                </div>
                <h4 className="text-lg sm:text-2xl font-black text-white text-center italic leading-snug">{dynamicQuiz[currentQuizIdx]?.question}</h4>
                <div className="grid grid-cols-1 gap-3">
                   {dynamicQuiz[currentQuizIdx]?.options.map((opt, i) => {
                     let btnClass = "p-4 sm:p-5 rounded-2xl border-2 text-left font-bold transition-all text-xs sm:text-sm ";
                     if (isQuizSubmitted) {
                        if (i === dynamicQuiz[currentQuizIdx].correctAnswer) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400 ";
                        else if (i === selectedOption) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400 ";
                        else btnClass += "bg-slate-900 border-white/5 text-slate-500 ";
                     } else {
                        btnClass += selectedOption === i ? "bg-blue-600/10 border-blue-500 text-blue-400 " : "bg-slate-900/50 border-white/5 text-slate-300 hover:border-blue-500/30 ";
                     }
                     return (
                       <button key={i} onClick={() => !isQuizSubmitted && setSelectedOption(i)} className={btnClass}>{opt}</button>
                     );
                   })}
                </div>
                <div className="pt-6 border-t border-white/5 flex gap-4">
                   {!isQuizSubmitted ? (
                     <button onClick={handleQuizSubmit} disabled={selectedOption === null} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 text-[10px]">Submit Logic</button>
                   ) : (
                     <button onClick={nextQuiz} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 text-[10px]">
                       <span>{currentQuizIdx === dynamicQuiz.length - 1 ? 'Show Summary' : 'Next Mission'}</span>
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {celebrating && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-300">
           <style>{`
              @keyframes confetti { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
              .confetti { position: absolute; width: 10px; height: 10px; animation: confetti 3s linear infinite; }
           `}</style>
           {Array.from({ length: 40 }).map((_, i) => (
             <div key={i} className="confetti" style={{ left: `${Math.random() * 100}vw`, backgroundColor: ['#3b82f6', '#10b981', '#f43f5e', '#f59e0b'][Math.floor(Math.random()*4)], animationDelay: `${Math.random() * 2}s` }}></div>
           ))}
           <div className="text-center space-y-6 animate-in zoom-in duration-500">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(59,130,246,0.6)]">
                 <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
              </div>
              <h1 className="text-4xl sm:text-7xl font-black text-white italic uppercase tracking-tighter">VICTORY!</h1>
              <p className="text-xl sm:text-3xl font-black text-blue-400 uppercase tracking-widest">{lastWinnerName}</p>
           </div>
        </div>
      )}

      {showNameModal && (
        <div className="fixed inset-0 z-[550] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in zoom-in-95 duration-300">
          <div className="glass-card w-full max-w-md rounded-[35px] border-blue-500/30 p-8 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Combatants</h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Identify Players for Tic Tac Toe</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5 block ml-1">Player 1 (X)</label>
                <input type="text" value={tempNames.x} onChange={(e) => setTempNames(prev => ({ ...prev, x: e.target.value }))} className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1.5 block ml-1">Player 2 (O)</label>
                <input type="text" value={tempNames.o} onChange={(e) => setTempNames(prev => ({ ...prev, o: e.target.value }))} className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-rose-600 transition-all text-sm font-bold" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNameModal(false)} className="flex-1 py-3 bg-white/5 text-slate-400 rounded-xl font-black uppercase text-[10px]">Cancel</button>
              <button onClick={submitNames} disabled={!tempNames.x || !tempNames.o} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] shadow-lg disabled:opacity-30">Start Battle</button>
            </div>
          </div>
        </div>
      )}

      {showSummary && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
           <div className="glass-card w-full max-w-xl rounded-[40px] border-blue-500/20 p-6 sm:p-10 flex flex-col max-h-[85vh] overflow-hidden" style={watermarkStyle}>
              <div className="text-center space-y-2 mb-6">
                <div className="bg-blue-600/10 inline-block px-4 py-1.5 rounded-xl border border-blue-500/20">
                   <h1 className="text-sm sm:text-lg font-black text-white italic uppercase tracking-tighter">Toufiq Sir's Smart Quizz</h1>
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">WhatsApp 01794903262</p>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                 <div className="glass-card p-3 rounded-2xl border-blue-500/10 text-center"><p className="text-[7px] font-black text-slate-500 uppercase mb-1">Total</p><p className="text-xl font-black text-white">{score.total}</p></div>
                 <div className="glass-card p-3 rounded-2xl border-emerald-500/10 text-center"><p className="text-[7px] font-black text-emerald-500 uppercase mb-1">Correct</p><p className="text-xl font-black text-white">{score.correct}</p></div>
                 <div className="glass-card p-3 rounded-2xl border-rose-500/10 text-center"><p className="text-[7px] font-black text-rose-500 uppercase mb-1">Wrong</p><p className="text-xl font-black text-white">{score.wrong}</p></div>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3 mb-6">
                 {userAnswers.map((ansIdx, i) => {
                    if (ansIdx === null) return null;
                    const q = dynamicQuiz[i];
                    const isCorrect = ansIdx === q.correctAnswer;
                    return (
                      <div key={i} className={`p-3 rounded-xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                         <p className="text-[10px] font-bold text-white mb-1"><span className="text-blue-500">Q{i+1}:</span> {q.question}</p>
                         <div className="flex flex-col gap-0.5">
                            <p className={`text-[9px] ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>Ans: <b>{q.options[ansIdx]}</b></p>
                            {!isCorrect && <p className="text-[9px] text-emerald-500 italic">Correct: {q.options[q.correctAnswer]}</p>}
                         </div>
                      </div>
                    );
                 })}
              </div>
              <div className="flex gap-3">
                <button onClick={handleDownloadReport} className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-black uppercase text-[9px] shadow-lg flex items-center justify-center gap-2">Download Report</button>
                <button onClick={resetSession} className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-black uppercase text-[9px] shadow-lg">Close</button>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default GameZone;
