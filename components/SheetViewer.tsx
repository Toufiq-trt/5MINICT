
import React, { useEffect } from 'react';

interface SheetViewerProps {
  title: string;
  isEbook?: boolean;
  fileUrl?: string; // Original URL
  onClose: () => void;
}

const SheetViewer: React.FC<SheetViewerProps> = ({ title, isEbook = false, fileUrl = '', onClose }) => {
  
  useEffect(() => {
    // Basic anti-screenshot / protection logic
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && (e.key === 'p' || e.key === 's')) || (e.metaKey && e.key === 's')) {
        e.preventDefault();
        alert("Resources are protected. Enrolled students get the official PDF file.");
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Convert Drive view link to preview link for iframe
  const embedUrl = fileUrl.replace('/view?usp=sharing', '/preview').replace('/view', '/preview');

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-2xl flex flex-col p-4 sm:p-6 select-none">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
            {isEbook ? 'BOOK' : 'SHEET'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-none mb-1">{title}</h2>
            <p className="text-[10px] text-blue-400 mono uppercase tracking-widest font-bold">
              {isEbook ? 'Full Access Granted' : '2-Page Preview Active'}
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white p-3 rounded-2xl transition-all border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-w-6xl mx-auto w-full space-y-12 pb-20 scrollbar-hide rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
        {isEbook ? (
          <div className="w-full h-full min-h-[80vh] bg-white rounded-2xl overflow-hidden">
            <iframe 
              src={embedUrl} 
              className="w-full h-full border-none" 
              allow="autoplay"
              title={title}
            ></iframe>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Page 1 (Simulated) */}
            <div className="bg-white rounded-[40px] h-[1000px] flex flex-col p-16 text-slate-800 relative shadow-2xl overflow-hidden">
               <div className="absolute top-10 right-10 text-slate-100 font-black text-8xl pointer-events-none italic">5MIN ICT</div>
               <div className="relative z-10 space-y-12">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="w-2 h-12 bg-blue-600 rounded-full"></div>
                    <h3 className="text-5xl font-black text-slate-900 uppercase">Page 01</h3>
                  </div>
                  <div className="space-y-6">
                    <p className="text-2xl font-bold text-blue-600">Overview: {title}</p>
                    <p className="text-xl leading-relaxed text-slate-600 font-medium">
                      In this chapter, we explore the core logic behind {title}. Toufiq Sir's methodology focuses on 
                      visualizing the process before memorizing the formula.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-8 pt-10">
                     <div className="h-64 bg-slate-50 rounded-[30px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
                        <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Chapter Concept Diagram</p>
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-10 left-16 text-slate-300 mono font-black">TOUFIQ SIR ICT NOTES</div>
            </div>

            {/* Page 2 (Simulated) */}
            <div className="bg-white rounded-[40px] h-[1000px] flex flex-col p-16 text-slate-800 relative shadow-2xl overflow-hidden">
               <div className="absolute top-10 right-10 text-slate-100 font-black text-8xl pointer-events-none italic">5MIN ICT</div>
               <div className="relative z-10 space-y-12">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="w-2 h-12 bg-blue-600 rounded-full"></div>
                    <h3 className="text-5xl font-black text-slate-900 uppercase">Page 02</h3>
                  </div>
                  <div className="bg-blue-50 p-10 rounded-[40px] border border-blue-100">
                    <h4 className="text-2xl font-black text-blue-700 mb-4 uppercase">Toufiq Logic™ Shortcut</h4>
                    <p className="text-lg text-slate-700 font-bold leading-relaxed italic">
                      "Never try to solve {title} using traditional long-form methods. Use the 5-Minute bit-shifting rule to get your MCQ answer in seconds."
                    </p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-xl text-slate-600 leading-relaxed">
                      Detailed step-by-step logic breakdown follows in this section. We cover common board exam traps and how to avoid them.
                    </p>
                  </div>
               </div>
               <div className="absolute bottom-10 left-16 text-slate-300 mono font-black">TOUFIQ SIR ICT NOTES</div>
            </div>

            {/* Restricted Blur */}
            <div className="relative h-[600px] rounded-[50px] overflow-hidden">
              <div className="absolute inset-0 bg-white/20 blur-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col items-center justify-center p-12 text-center border-t border-white/10">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-10 shadow-3xl shadow-blue-500/40 animate-pulse">
                   <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <h3 className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight">Sheet Locked</h3>
                <p className="text-slate-400 mb-12 max-w-xl text-xl leading-relaxed font-medium">
                  To access the full version of these high-quality notes, please join one of our premium batches. Enrollment includes 100+ sheets and personal support.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <a href="#contact" onClick={onClose} className="px-12 py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-blue-500 transition-all active:scale-95">
                    Enroll Now to Unlock
                  </a>
                  <button onClick={onClose} className="px-12 py-6 bg-white/5 border border-white/20 text-white rounded-3xl font-bold text-xl hover:bg-white/10 transition-all">
                    Return to Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SheetViewer;
