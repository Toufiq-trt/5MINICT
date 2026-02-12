
import React from 'react';
import { PRACTICE_QUESTIONS } from '../constants';
import LearningQuests from './LearningQuests';

interface PracticeBoardProps {
  onBack: () => void;
}

const PracticeBoard: React.FC<PracticeBoardProps> = ({ onBack }) => {
  const enrollUrl = "https://forms.gle/97byA6Ek5QYuuu6WA";

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 italic uppercase tracking-tighter">Practice <span className="text-blue-600">Evolution</span></h2>
            <p className="text-slate-500 text-sm font-medium">Gamified logic training and chapter-wise important questions.</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all self-start text-[10px] font-black uppercase tracking-widest"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Exit Lab</span>
          </button>
        </div>

        {/* Integrated Gamified Roadmap */}
        <div className="mb-20">
          <LearningQuests />
        </div>

        {/* Static Question Grid */}
        <div className="mt-20 space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-widest mb-2">Core Question Bank</h3>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRACTICE_QUESTIONS.map((item, idx) => (
              <div key={idx} className="glass-card p-6 sm:p-8 rounded-[35px] border-white/5 hover:border-blue-500/20 transition-all group">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-blue-600/10 w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{item.chapter}</h3>
                </div>
                <ul className="space-y-3">
                  {item.questions.map((q, qidx) => (
                    <li key={qidx} className="flex space-x-3 text-slate-400 group/item">
                      <span className="text-blue-500 font-bold text-xs mt-0.5">{qidx + 1}.</span>
                      <span className="text-sm leading-relaxed group-hover/item:text-slate-200 transition-colors">{q}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-white/5 text-slate-600 italic text-[9px] mono uppercase tracking-widest">
                   Logic Mastery Series • {item.chapter} Target
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 p-8 sm:p-12 glass-card rounded-[40px] text-center border-blue-500/20 bg-blue-600/5">
          <h4 className="text-xl sm:text-2xl font-black text-white mb-4 uppercase italic">Master the Full Logic?</h4>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm leading-relaxed font-medium">The complete solution guide, logic shortcuts, and personal mentorship are available in our premium batches.</p>
          <a 
            href={enrollUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-3xl active:scale-95"
          >
            Join Next Batch
          </a>
        </div>
      </div>
    </div>
  );
};

export default PracticeBoard;
