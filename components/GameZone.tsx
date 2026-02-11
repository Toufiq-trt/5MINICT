
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
        
        Cover all 6 chapters thoroughly:
        1. ICT: World & Bangladesh Perspective
        2. Communication Systems & Networking
        3. Number System & Logic Gates
        4. Web Design & HTML
        5. Programming Language (C)
        6. Database Management System.
        
        Ensure a mix of theoretical and logical/mathematical questions suitable for Board and Admission tests.`,
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
                  items: { type: Type.STRING },
                  description: "Exactly 4 options"
                },
                correctAnswer: { 
                  type: Type.INTEGER, 
                  description: "Index of correct option (0-3)" 
                }
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

  // --- Quiz Interaction ---
  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsQuizSubmitted(true);
    
    // Store user answer
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
  };

  const handleDownloadReport = () => {
    const finalScore = score.correct;
    const successRate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    
    // Filter to only questions that were actually answered
    const answeredQuestionsIndices = userAnswers
      .map((ans, idx) => (ans !== null ? idx : -1))
      .filter(idx => idx !== -1);

    // Build HTML for Printing
    const reportHtml = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>ICT Quiz Report - Toufiq Sir</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 0; 
            margin: 0; 
            color: #1a202c; 
            line-height: 1.2; 
            font-size: 9pt;
          }
          .header { border-bottom: 2pt solid #2563eb; padding-bottom: 10px; margin-bottom: 15px; text-align: center; }
          .header h1 { margin: 0; color: #1e3a8a; font-size: 20pt; letter-spacing: 1px; text-transform: uppercase; }
          .header h2 { margin: 2px 0; color: #2563eb; font-size: 14pt; font-weight: bold; }
          .contact { color: #4a5568; font-weight: bold; font-size: 10pt; }
          
          .stats-row { 
            display: flex; 
            justify-content: space-between; 
            background: #f1f5f9; 
            padding: 10px; 
            border-radius: 8px; 
            margin-bottom: 15px; 
            border: 1pt solid #cbd5e1;
          }
          .stat-item { text-align: center; flex: 1; border-right: 1pt solid #cbd5e1; }
          .stat-item:last-child { border-right: none; }
          .stat-label { display: block; font-size: 7pt; color: #64748b; text-transform: uppercase; font-weight: 800; }
          .stat-value { font-size: 12pt; font-weight: 900; color: #0f172a; }

          .questions-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 10px; 
          }
          .question-box { 
            padding: 8px; 
            border: 0.5pt solid #e2e8f0; 
            border-radius: 6px; 
            break-inside: avoid;
            background: #fff;
          }
          .q-text { font-weight: bold; font-size: 9pt; margin-bottom: 4px; color: #1e293b; }
          .option { padding: 2px 6px; margin: 1px 0; border-radius: 4px; font-size: 8pt; border: 0.2pt solid transparent; }
          .correct-opt { background: #dcfce7; color: #166534; font-weight: bold; border-color: #bbf7d0; }
          .wrong-opt { background: #fee2e2; color: #991b1b; text-decoration: line-through; border-color: #fecaca; }
          .info { color: #2563eb; font-size: 7pt; font-style: italic; margin-top: 2px; border-top: 0.1pt dashed #cbd5e1; padding-top: 2px; }
          
          .footer { text-align:center; margin-top: 15px; border-top: 1pt solid #e2e8f0; padding-top: 8px; color: #94a3b8; font-size: 7pt; font-weight: bold; }
          
          @media print {
            .no-print { display: none; }
            body { -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ICT BY TOUFIQ SIR</h1>
          <h2>QUIZ Result Progress Report</h2>
          <div class="contact">Contact: 01794903262</div>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">Total Answered</span>
            <span class="stat-value">${score.total}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Correct</span>
            <span class="stat-value" style="color: #059669">${score.correct}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Wrong</span>
            <span class="stat-value" style="color: #dc2626">${score.wrong}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Final Score</span>
            <span class="stat-value" style="color: #2563eb">${finalScore}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Correct Rate</span>
            <span class="stat-value">${successRate}%</span>
          </div>
        </div>

        <div class="questions-grid">
          ${answeredQuestionsIndices.map((idx) => {
            const q = dynamicQuiz[idx];
            const userIdx = userAnswers[idx];
            const isCorrect = userIdx === q.correctAnswer;
            
            return `
              <div class="question-box">
                <div class="q-text">${idx + 1}. ${q.question}</div>
                <div class="options">
                  ${q.options.map((opt, oi) => {
                    let cls = "option ";
                    if (oi === q.correctAnswer) cls += "correct-opt";
                    else if (oi === userIdx && !isCorrect) cls += "wrong-opt";
                    
                    return `<div class="${cls}">${opt} ${oi === q.correctAnswer ? '✓' : ''} ${oi === userIdx && !isCorrect ? '✗' : ''}</div>`;
                  }).join('')}
                </div>
                ${!isCorrect ? `<div class="info">Correct: ${q.options[q.correctAnswer]}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="footer">
          Generated by 5MinICT Engine - Toufiq Sir - Master HSC ICT Easily
        </div>

        <div class="no-print" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.3); font-size: 10pt; text-transform: uppercase;">Save as PDF / Print</button>
        </div>
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
          <p className="text-slate-400 max-w-2xl mx-auto">Boost your ICT IQ with specialized logical games. Win matches to prove your dominance in the digital realm.</p>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { id: 'TIC_TAC_TOE' as GameType, name: 'Tic Tac Toe', desc: 'Classic Logic Battle', color: 'blue', action: () => setActiveGame('TIC_TAC_TOE') },
              { id: 'QUIZ' as GameType, name: 'ICT QUIZ', desc: 'Dynamic AI Question Engine', color: 'emerald', action: generateNewQuiz }
            ].map((g) => (
              <div key={g.name} onClick={g.action} className="group cursor-pointer">
                <div className={`glass-card p-10 rounded-[50px] border-white/5 group-hover:border-${g.color}-500/50 transition-all duration-500 text-center space-y-6 group-hover:-translate-y-3 h-full flex flex-col justify-center`}>
                  <div className={`w-20 h-20 mx-auto rounded-3xl bg-${g.color}-600/10 flex items-center justify-center text-${g.color}-500 group-hover:bg-${g.color}-600 group-hover:text-white transition-all shadow-xl`}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {g.id === 'TIC_TAC_TOE' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M9 4v16M15 4v16" /> : 
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    </svg>
                  </div>
                  <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">{g.name}</h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative glass-card rounded-[60px] border-blue-500/20 min-h-[600px] flex flex-col items-center justify-center p-8 overflow-hidden animate-in zoom-in-95 duration-500" style={watermarkStyle}>
            
            {/* Header / Stats Overlay */}
            <div className="absolute top-8 left-10 right-10 flex justify-between items-center z-20">
               <button onClick={() => setShowSummary(true)} className="px-6 py-2 bg-rose-600/20 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all">Close & Finish</button>
               <div className="flex gap-4">
                 <div className="glass-card px-4 py-1.5 rounded-full border-emerald-500/20 text-[10px] font-black text-emerald-400">CORRECT: {score.correct}</div>
                 <div className="glass-card px-4 py-1.5 rounded-full border-rose-500/20 text-[10px] font-black text-rose-400">WRONG: {score.wrong}</div>
               </div>
            </div>

            {isLoadingQuiz ? (
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                    {lang === 'bn' ? 'তৌফিক স্যার প্রশ্নপত্র তৈরি করছেন' : 'TOUFIQ SIR IS MAKING QUESTION SET'}
                  </h4>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Sourcing Logic from Chapters 1-6...</p>
                </div>
              </div>
            ) : activeGame === 'TIC_TAC_TOE' ? (
              <div className="flex flex-col items-center space-y-8">
                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  {winner ? `Winner: ${winner}` : `Next Turn: ${isXNext ? 'X' : 'O'}`}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {board.map((cell, i) => (
                    <button key={i} onClick={() => handleTTTClick(i)} className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-900/50 border-2 border-white/5 rounded-3xl text-4xl sm:text-6xl font-black text-blue-500 hover:border-blue-500/50 transition-all flex items-center justify-center">
                      {cell}
                    </button>
                  ))}
                </div>
                <button onClick={() => setBoard(Array(9).fill(null))} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Reset Board</button>
              </div>
            ) : (
              <div className="w-full max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                   <div className="flex justify-center items-center space-x-3">
                     <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Question {currentQuizIdx + 1}/{dynamicQuiz.length}</span>
                   </div>
                   <h4 className="text-3xl font-black text-white leading-tight italic">{dynamicQuiz[currentQuizIdx]?.question}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {dynamicQuiz[currentQuizIdx]?.options.map((opt, i) => {
                     let btnClass = "p-6 rounded-[30px] border-2 text-left font-bold transition-all flex items-center justify-between ";
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
                         {isQuizSubmitted && i === dynamicQuiz[currentQuizIdx].correctAnswer && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                       </button>
                     );
                   })}
                </div>

                <div className="pt-8 border-t border-white/5 flex gap-4">
                   {!isQuizSubmitted ? (
                     <button onClick={handleQuizSubmit} disabled={selectedOption === null} className="flex-1 py-6 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl disabled:opacity-30">Submit Logic</button>
                   ) : (
                     <button onClick={nextQuiz} className="flex-1 py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
                       <span>{currentQuizIdx === dynamicQuiz.length - 1 ? 'Finish Exam' : 'Next Logic Node'}</span>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                     </button>
                   )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-3xl animate-in zoom-in-95 duration-500">
           <div className="glass-card w-full max-w-lg rounded-[60px] border-blue-500/20 p-12 text-center space-y-10 relative overflow-hidden" style={watermarkStyle}>
              <div className="space-y-4">
                <h4 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px]">Exam Finished</h4>
                <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase">QUIZ <span className="text-blue-600">REPORT</span></h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="glass-card p-8 rounded-[40px] border-emerald-500/20">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Correct Rate</p>
                    <p className="text-5xl font-black text-white italic">{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</p>
                 </div>
                 <div className="glass-card p-8 rounded-[40px] border-blue-500/20">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Final Score</p>
                    <p className="text-5xl font-black text-white italic">{score.correct}</p>
                 </div>
              </div>

              <div className="space-y-4 text-left glass-card p-8 rounded-[40px] border-white/5">
                 <div className="flex justify-between items-center text-sm font-bold">
                   <span className="text-slate-500 uppercase tracking-widest">Total Question Answered</span>
                   <span className="text-white">{score.total}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold">
                   <span className="text-emerald-500 uppercase tracking-widest">Correct Answer</span>
                   <span className="text-white">{score.correct}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-bold">
                   <span className="text-rose-500 uppercase tracking-widest">Wrong Answer</span>
                   <span className="text-white">{score.wrong}</span>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={handleDownloadReport} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[40px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Progress Report
                </button>
                <button onClick={resetSession} className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[40px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95">Re-Enter Arena</button>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default GameZone;
