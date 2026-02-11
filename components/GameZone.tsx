
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

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [dynamicQuiz, setDynamicQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(Array(25).fill(null));

  // Diagonal Watermark Style
  const watermarkStyle: React.CSSProperties = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Ctext x='0' y='100' fill='rgba(255, 255, 255, 0.03)' font-size='16' font-weight='bold' font-family='sans-serif' transform='rotate(-45 75 75)'%3EToufiq Sir%3C/text%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  };

  // --- AI Quiz Generation ---
  const generateNewQuiz = async () => {
    setIsLoadingQuiz(true);
    setActiveGame('QUIZ');
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsQuizSubmitted(false);
    setUserAnswers(Array(25).fill(null));
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

  // --- Tic Tac Toe Logic ---
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const handleTTTClick = (i: number) => {
    if (calculateWinner(board) || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(cell => cell !== null);

  // --- Quiz Interaction ---
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

  const resetSession = () => {
    setScore({ correct: 0, wrong: 0, total: 0 });
    setShowSummary(false);
    setActiveGame(null);
    setUserAnswers(Array(25).fill(null));
    setCurrentQuizIdx(0);
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const handleDownloadReport = () => {
    // Report downloading logic for QUIZ only
    const finalScore = score.correct;
    const successRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const reportHtml = `
      <!DOCTYPE html>
      <html lang="bn">
      <head><meta charset="UTF-8"><title>ICT Quiz Report</title></head>
      <body style="font-family: sans-serif; padding: 40px; text-align: center;">
        <h1>ICT QUIZ REPORT</h1>
        <p>Student Performance: ${successRate}%</p>
        <p>Correct: ${score.correct} / Total: ${score.total}</p>
        <button onclick="window.print()">Print Report</button>
      </body>
      </html>
    `;
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(reportHtml);
      printWin.document.close();
    }
  };

  return (
    <section id="games" className="py-24 relative overflow-hidden bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px]">Neural Playzone</h2>
          <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase">Game <span className="text-blue-600">Zone</span></h3>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { id: 'TIC_TAC_TOE' as GameType, name: 'Tic Tac Toe', desc: 'Logic Battle', color: 'blue', action: () => setActiveGame('TIC_TAC_TOE') },
              { id: 'QUIZ' as GameType, name: 'ICT QUIZ', desc: 'AI Exam Engine', color: 'emerald', action: generateNewQuiz }
            ].map((g) => (
              <div key={g.name} onClick={g.action} className="group cursor-pointer">
                <div className={`glass-card p-10 rounded-[50px] border-white/5 group-hover:border-${g.color}-500/50 transition-all duration-500 text-center space-y-6 group-hover:-translate-y-3 h-full flex flex-col justify-center`}>
                  <div className={`w-16 h-16 mx-auto rounded-3xl bg-${g.color}-600/10 flex items-center justify-center text-${g.color}-500 group-hover:bg-${g.color}-600 group-hover:text-white transition-all shadow-xl`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {g.id === 'TIC_TAC_TOE' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M9 4v16M15 4v16" /> : 
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    </svg>
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{g.name}</h4>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative glass-card rounded-[40px] sm:rounded-[60px] border-blue-500/20 min-h-[500px] sm:min-h-[600px] flex flex-col items-center justify-center p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-500" style={watermarkStyle}>
            
            <button onClick={resetSession} className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-500 rounded-full transition-all z-30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {activeGame === 'QUIZ' && (
              <div className="absolute top-8 left-10 flex gap-4 z-20 hidden sm:flex">
                 <div className="glass-card px-4 py-1.5 rounded-full border-emerald-500/20 text-[10px] font-black text-emerald-400">CORRECT: {score.correct}</div>
                 <div className="glass-card px-4 py-1.5 rounded-full border-rose-500/20 text-[10px] font-black text-rose-400">WRONG: {score.wrong}</div>
              </div>
            )}

            {isLoadingQuiz ? (
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Preparing Question Set...</h4>
              </div>
            ) : activeGame === 'TIC_TAC_TOE' ? (
              <div className="flex flex-col items-center space-y-8">
                <div className="text-center">
                  <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                    {winner ? `Winner: ${winner}` : isDraw ? 'Match Draw!' : `${isXNext ? 'X' : 'O'}'s Turn`}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Logical Combat Zone</p>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {board.map((cell, i) => (
                    <button key={i} onClick={() => handleTTTClick(i)} className="w-20 h-20 sm:w-32 sm:h-32 bg-slate-900/50 border-2 border-white/5 rounded-2xl sm:rounded-3xl text-3xl sm:text-6xl font-black text-blue-500 hover:border-blue-500/50 transition-all flex items-center justify-center">
                      {cell}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setBoard(Array(9).fill(null))} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl">Reset Board</button>
                  <button onClick={resetSession} className="px-8 py-3 glass-card border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all">Close Game</button>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                   <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Question {currentQuizIdx + 1}/{dynamicQuiz.length}</span>
                   <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight italic">{dynamicQuiz[currentQuizIdx]?.question}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                   {dynamicQuiz[currentQuizIdx]?.options.map((opt, i) => {
                     let btnClass = "p-4 sm:p-6 rounded-2xl sm:rounded-[30px] border-2 text-left font-bold transition-all flex items-center justify-between text-sm sm:text-base ";
                     if (isQuizSubmitted) {
                        if (i === dynamicQuiz[currentQuizIdx].correctAnswer) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400 ";
                        else if (i === selectedOption) btnClass += "bg-rose-500/20 border-rose-500 text-rose-400 ";
                        else btnClass += "bg-slate-900 border-white/5 text-slate-500 ";
                     } else {
                        btnClass += selectedOption === i ? "bg-blue-600/10 border-blue-500 text-blue-400 " : "bg-slate-900/50 border-white/5 text-slate-300 hover:border-blue-500/30 ";
                     }
                     return (
                       <button key={i} onClick={() => !isQuizSubmitted && setSelectedOption(i)} className={btnClass}>
                         <span>{opt}</span>
                       </button>
                     );
                   })}
                </div>

                <div className="pt-8 border-t border-white/5">
                   {!isQuizSubmitted ? (
                     <button onClick={handleQuizSubmit} disabled={selectedOption === null} className="w-full py-5 bg-blue-600 text-white rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest shadow-2xl disabled:opacity-30">Submit Logic</button>
                   ) : (
                     <button onClick={nextQuiz} className="w-full py-5 bg-emerald-600 text-white rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
                       <span>{currentQuizIdx === dynamicQuiz.length - 1 ? 'Finish Exam' : 'Next Question'}</span>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showSummary && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
           <div className="glass-card w-full max-w-lg rounded-[60px] border-blue-500/20 p-10 sm:p-12 text-center space-y-10 relative overflow-hidden" style={watermarkStyle}>
              <div className="space-y-4">
                <h4 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px]">Session Report</h4>
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">SCORE <span className="text-blue-600">SUMMARY</span></h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="glass-card p-6 sm:p-8 rounded-[40px] border-emerald-500/20">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Correct</p>
                    <p className="text-4xl font-black text-white">{score.correct}</p>
                 </div>
                 <div className="glass-card p-6 sm:p-8 rounded-[40px] border-rose-500/20">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Wrong</p>
                    <p className="text-4xl font-black text-white">{score.wrong}</p>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={handleDownloadReport} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl transition-all">Download PDF Report</button>
                <button onClick={resetSession} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl transition-all">Close & Exit</button>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default GameZone;
