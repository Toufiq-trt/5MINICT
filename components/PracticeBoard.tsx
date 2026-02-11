import React from 'react';
import { PRACTICE_QUESTIONS } from '../constants';

interface PracticeBoardProps {
  onBack: () => void;
}

const PracticeBoard: React.FC<PracticeBoardProps> = ({ onBack }) => {
  const enrollUrl = "https://forms.gle/97byA6Ek5QYuuu6WA";

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Practice <span className="gradient-text">Laboratory</span></h2>
            <p className="text-slate-400">Hand-picked important questions from every chapter to sharpen your logic.</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all self-start"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Back to Main</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRACTICE_QUESTIONS.map((item, idx) => (
            <div key={idx} className="glass-card p-8 rounded-[40px] border-white/5 hover:border-blue-500/20 transition-all">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-600/20 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-400 font-black">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-white">{item.chapter}</h3>
              </div>
              <ul className="space-y-4">
                {item.questions.map((q, qidx) => (
                  <li key={qidx} className="flex space-x-3 text-slate-300 group">
                    <span className="text-blue-500 font-bold">{qidx + 1}.</span>
                    <span className="leading-relaxed group-hover:text-white transition-colors">{q}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/5 text-slate-500 italic text-xs mono">
                 Solving these ensures 80% marks in Board CQ/MCQ.
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 p-10 glass-card rounded-[40px] text-center border-blue-500/20">
          <h4 className="text-2xl font-bold text-white mb-4">Want full solutions and shortcuts?</h4>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Solutions are provided exclusively to enrolled students. Get real-time problem solving from Toufiq Sir.</p>
          <a 
            href={enrollUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20"
          >
            Join the Next Batch
          </a>
        </div>
      </div>
    </div>
  );
};

export default PracticeBoard;