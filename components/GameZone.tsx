import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { GoogleGenAI, Type } from "@google/genai";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

type GameType = 'QUIZ' | 'WORD_QUEST' | 'TIC_TAC_TOE' | null;

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  chapter: string;
}

const SIGNATURE_URL = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

const GameZone: React.FC = () => {
  const { lang, t } = useLanguage();
  const [activeGame, setActiveGame] = useState<GameType>(null);

  // --- QUIZ STATE ---
  const [quizStatus, setQuizStatus] = useState<'IDLE' | 'CONFIG' | 'LOADING' | 'PLAYING' | 'RESULT'>('IDLE');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizLanguage, setQuizLanguage] = useState<'bn' | 'en'>('bn');
  const [studentName, setStudentName] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const timerRef = useRef<number | null>(null);

  // --- QUIZ LOGIC ---
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchQuestions = async () => {
    setCurrentQ(0);
    setUserAnswers([]);
    setQuizStatus('LOADING');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = `Act as Toufiq Sir, senior ICT mentor. Generate exactly 25 Multiple Choice Questions (MCQs) for an HSC ICT exam.
      Language: ${quizLanguage === 'bn' ? 'Bengali (বাংলা) - use Unicode/Avro compatible text' : 'English'}.
      
      CHAPTERS (Strict Distribution):
      - 3.1 (Number Systems): 3 questions (Calculations).
      - 3.2 (Digital Devices): 5 questions (3 Logic gates, 2 General).
      - 4 (Web Design/HTML): 3 questions (Tables, Lists, Tags).
      - 5 (C Programming): 7 questions (4 Logic snippets, 3 General).
      - 6 (Database): 2 questions.
      - 1 & 2 (General): 5 questions.

      Return ONLY a JSON array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                chapter: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "chapter"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      setQuestions(data);
      setUserAnswers(new Array(data.length).fill(null));
      setQuizStatus('PLAYING');
      setTimeLeft(25 * 60);
      startTimer();
    } catch (error) {
      console.error("Quiz Error:", error);
      alert("Failed to start exam. Toufiq Sir's system is busy. Please try again.");
      setQuizStatus('CONFIG');
    }
  };

  const handleOptionSelect = (idx: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = idx;
    setUserAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        handleFinishExam();
      }
    }, 400);
  };

  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuizStatus('RESULT');
  };

  const getResults = () => {
    let correct = 0;
    let attended = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] !== null) {
        attended++;
        if (userAnswers[i] === q.correctAnswer) correct++;
      }
    });
    return { correct, attended, wrong: attended - correct };
  };

  const generateReportPDF = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4') as any;
      const pageWidth = doc.internal.pageSize.getWidth();
      const results = getResults();
      const timeTaken = 25 * 60 - timeLeft;
      const mins = Math.floor(timeTaken / 60);
      const secs = timeTaken % 60;

      // --- HEADER (Single Header Rectangle) ---
      doc.setFillColor(2, 6, 23); // Slate 950
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setTextColor(255, 255, 255);
      
      // Center content within the header box
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("5 MINUTE ICT by TOUFIQ SIR", pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("ICT TEST REPORT CARD", pageWidth / 2, 32, { align: 'center' });

      // --- STUDENT INFO ---
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Student Name: ${studentName}`, 14, 55);
      doc.text(`Final Score: ${results.correct}/25`, 14, 61);
      doc.text(`Time Spent: ${mins}m ${secs}s`, 14, 67);
      
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, 55, { align: 'right' });
      doc.text(`Version: ${quizLanguage.toUpperCase()}`, pageWidth - 14, 61, { align: 'right' });

      // --- QUESTIONS (Attended Only) ---
      const attendedIndices = questions.map((_, i) => i).filter(i => userAnswers[i] !== null);
      const attendedList = attendedIndices.map(i => ({ ...questions[i], originalIdx: i }));

      const mid = Math.ceil(attendedList.length / 2);
      const leftCol = attendedList.slice(0, mid);
      const rightCol = attendedList.slice(mid);

      const tableStyles = {
        fontSize: 7,
        cellPadding: 1.5,
        overflow: 'linebreak',
        lineWidth: 0.1,
      };

      const renderRow = (q: any) => {
        const uAns = userAnswers[q.originalIdx];
        const isCorrect = uAns === q.correctAnswer;
        return [
          q.originalIdx + 1,
          `${q.question}\nYour Ans: ${q.options[uAns!]}\nCorrect: ${q.options[q.correctAnswer]}`,
          isCorrect ? 'Correct' : 'Wrong'
        ];
      };

      // Left Table
      autoTable(doc, {
        startY: 75,
        margin: { left: 10, right: pageWidth / 2 + 2 },
        head: [['#', 'Attended Question Details', 'Result']],
        body: leftCol.map(renderRow),
        styles: tableStyles,
        columnStyles: { 0: { cellWidth: 7 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 15 } },
        didDrawCell: (data: any) => {
          if (data.section === 'body' && data.column.index === 1) {
            const rowIndex = data.row.index;
            const qObj = leftCol[rowIndex];
            if (userAnswers[qObj.originalIdx] === qObj.correctAnswer) doc.setTextColor(0, 128, 0); // Green
            else doc.setTextColor(220, 0, 0); // Red
          }
        }
      });

      const leftY = (doc as any).lastAutoTable.finalY;

      // Right Table
      autoTable(doc, {
        startY: 75,
        margin: { left: pageWidth / 2 + 2, right: 10 },
        head: [['#', 'Attended Question Details', 'Result']],
        body: rightCol.map(renderRow),
        styles: tableStyles,
        columnStyles: { 0: { cellWidth: 7 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 15 } },
        didDrawCell: (data: any) => {
          if (data.section === 'body' && data.column.index === 1) {
            const rowIndex = data.row.index;
            const qObj = rightCol[rowIndex];
            if (userAnswers[qObj.originalIdx] === qObj.correctAnswer) doc.setTextColor(0, 128, 0);
            else doc.setTextColor(220, 0, 0);
          }
        }
      });

      const rightY = (doc as any).lastAutoTable.finalY;

      // --- SIGNATURE FOOTER ---
      const footerY = Math.max(leftY, rightY, 255) + 15;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Student: ${studentName}`, 14, footerY);
      doc.text(`Result: ${results.correct} Out of 25`, 14, footerY + 6);

      const sigX = pageWidth - 60;
      // Draw signature above the mentor name
      try {
        doc.addImage(SIGNATURE_URL, 'JPEG', sigX + 5, footerY - 18, 40, 15);
      } catch (e) {
        doc.setFont("courier", "bolditalic");
        doc.text("Toufiq Rahman", sigX + 5, footerY - 5);
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("TOUFIQ sir (Mentor)", pageWidth - 14, footerY + 6, { align: 'right' });
      doc.line(pageWidth - 65, footerY + 1, pageWidth - 14, footerY + 1);

      // --- PREVIEW IN NEW TAB ---
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
      alert("Error generating report. Please check browser settings.");
    }
  };

  const closeGame = () => {
    setActiveGame(null);
    setQuizStatus('IDLE');
    if (timerRef.current) clearInterval(timerRef.current);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQ(0);
  };

  const attendedCount = userAnswers.filter(a => a !== null).length;

  return (
    <section id="games" className="py-24 bg-slate-950 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none tech-grid"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-3">logic playfield</h2>
          <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
            5MIN <span className="text-blue-600">ARENA</span>
          </h3>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <button onClick={() => { setActiveGame('QUIZ'); setQuizStatus('CONFIG'); }} className="group glass-card p-10 rounded-[40px] text-center border-blue-500/20 hover:border-blue-500 transition-all shadow-xl">
               <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
               </div>
               <h4 className="text-2xl font-black text-white italic uppercase">ICT TEST</h4>
               <p className="text-slate-500 text-[9px] mt-2 uppercase tracking-widest font-bold">Board Standard Prep</p>
            </button>
            <button onClick={() => setActiveGame('WORD_QUEST')} className="group glass-card p-10 rounded-[40px] text-center border-white/5 hover:border-blue-500/50 transition-all shadow-xl">
               <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/></svg>
               </div>
               <h4 className="text-2xl font-black text-white italic uppercase">LEXICON</h4>
               <p className="text-slate-500 text-[9px] mt-2 uppercase tracking-widest font-bold">Tech Vocabulary</p>
            </button>
            <button onClick={() => setActiveGame('TIC_TAC_TOE')} className="group glass-card p-10 rounded-[40px] text-center border-white/5 hover:border-rose-500/50 transition-all shadow-xl">
               <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16M9 4v16"/></svg>
               </div>
               <h4 className="text-2xl font-black text-white italic uppercase">NEON TTT</h4>
               <p className="text-slate-500 text-[9px] mt-2 uppercase tracking-widest font-bold">Logic Duel</p>
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-[40px] border-white/10 relative shadow-2xl overflow-hidden min-h-[600px] flex flex-col bg-slate-950">
            <button onClick={closeGame} className="absolute top-6 right-6 text-white/30 hover:text-rose-500 transition-all z-[60]">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {activeGame === 'QUIZ' && (
              <div className="flex-1 flex flex-col p-6 sm:p-10 h-full">
                {quizStatus === 'CONFIG' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in-95">
                    <h4 className="text-4xl sm:text-5xl font-black text-white italic uppercase tracking-tighter">ICT TEST</h4>
                    <div className="w-full max-w-sm space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] text-blue-500 font-black uppercase tracking-widest ml-4">Full Name</label>
                        <input 
                          type="text" 
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="আপনার নাম লিখুন" 
                          className="w-full bg-slate-900 border border-white/10 p-5 rounded-3xl text-white font-bold focus:border-blue-600 outline-none transition-all text-center"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-blue-500 font-black uppercase tracking-widest ml-4">Question Version</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => setQuizLanguage('bn')} className={`py-4 rounded-2xl font-black text-xs uppercase transition-all ${quizLanguage === 'bn' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>Bangla</button>
                          <button onClick={() => setQuizLanguage('en')} className={`py-4 rounded-2xl font-black text-xs uppercase transition-all ${quizLanguage === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-white/5'}`}>English</button>
                        </div>
                      </div>
                      <button 
                        onClick={() => { if (studentName.trim()) fetchQuestions(); else alert("Please enter your name"); }} 
                        className="w-full py-6 bg-white text-slate-950 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                      >
                        Start Exam
                      </button>
                    </div>
                  </div>
                )}

                {quizStatus === 'LOADING' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-blue-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Generating Custom Logic Set...</p>
                  </div>
                )}

                {quizStatus === 'PLAYING' && (
                  <div className="flex-1 flex flex-col h-full animate-in fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <div className="bg-slate-900 px-4 py-2 rounded-xl border border-white/10 text-white font-black italic">
                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                      </div>
                      <div className="text-2xl font-black text-white italic">{currentQ + 1}/25</div>
                    </div>

                    <div className="flex-1 space-y-8 overflow-y-auto pr-2">
                      <h4 className="text-xl sm:text-2xl font-black text-white italic leading-snug">
                        {questions[currentQ].question}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {questions[currentQ].options.map((opt, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleOptionSelect(i)}
                            className={`p-5 text-left border rounded-3xl transition-all flex items-center gap-4 ${userAnswers[currentQ] === i ? 'bg-blue-600 border-blue-600 shadow-xl' : 'bg-slate-900 border-white/5 hover:border-blue-500'}`}
                          >
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${userAnswers[currentQ] === i ? 'bg-white text-blue-600' : 'bg-white/5 text-slate-500'}`}>
                               {String.fromCharCode(65 + i)}
                             </div>
                             <span className="text-white font-bold text-sm sm:text-base">{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between pt-6 border-t border-white/5 gap-4">
                      <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} className="px-6 py-3 bg-white/5 text-slate-500 rounded-xl font-bold uppercase text-[9px] tracking-widest hover:text-white">Back</button>
                      <div className="flex gap-2">
                        {attendedCount >= 3 && (
                          <button onClick={handleFinishExam} className="px-6 py-3 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-xl font-bold uppercase text-[9px] tracking-widest hover:bg-rose-600 hover:text-white">Finish Exam</button>
                        )}
                        <button onClick={() => setCurrentQ(Math.min(24, currentQ + 1))} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-[9px] tracking-widest">Next</button>
                      </div>
                    </div>
                  </div>
                )}

                {quizStatus === 'RESULT' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in zoom-in-95 h-full">
                    <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter">Evaluation Complete</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg">
                       <div className="glass-card p-6 rounded-3xl text-center border-emerald-500/20 bg-emerald-500/5">
                          <span className="text-[8px] font-bold text-emerald-500 uppercase block mb-1">Correct</span>
                          <p className="text-3xl font-black text-white">{getResults().correct}</p>
                       </div>
                       <div className="glass-card p-6 rounded-3xl text-center border-blue-500/20 bg-blue-500/5">
                          <span className="text-[8px] font-bold text-blue-500 uppercase block mb-1">Attended</span>
                          <p className="text-3xl font-black text-white">{getResults().attended}</p>
                       </div>
                       <div className="glass-card p-6 rounded-3xl text-center border-rose-500/20 bg-rose-500/5 sm:col-span-1 col-span-2">
                          <span className="text-[8px] font-bold text-rose-500 uppercase block mb-1">Wrong</span>
                          <p className="text-3xl font-black text-white">{getResults().wrong}</p>
                       </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                       <button onClick={generateReportPDF} className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-emerald-500">Preview Report</button>
                       <button onClick={() => setQuizStatus('CONFIG')} className="flex-1 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10">Restart Test</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeGame && activeGame !== 'QUIZ' && (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                 <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">{activeGame} Arena Under Construction</h4>
                 <button onClick={() => setActiveGame(null)} className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[9px] tracking-widest">Back</button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GameZone;