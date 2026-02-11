import React from 'react';
import { EBOOKS } from '../constants';

const EBooks: React.FC = () => {
  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <section id="ebooks" className="py-32 relative bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="space-y-4">
            <h2 className="text-cyan-500 font-bold uppercase tracking-widest text-sm">Digital Library</h2>
            <h3 className="text-4xl md:text-6xl font-black text-white">ICT Books</h3>
          </div>
          <p className="text-slate-400 max-w-md mt-6 md:mt-0 italic leading-relaxed">
            Premium textbooks available for high-speed direct downloads. Enhance your learning with these official resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {EBOOKS.map((book) => (
            <div key={book.id} className="group flex flex-col sm:flex-row items-start glass-card p-10 rounded-[50px] hover:border-cyan-500/40 transition-all duration-500">
              <div className="w-40 h-56 bg-slate-800 rounded-3xl shadow-2xl mb-8 sm:mb-0 sm:mr-10 flex-shrink-0 relative overflow-hidden border border-white/5 group-hover:scale-105 transition-transform duration-500">
                 <img 
                   src={book.coverImage} 
                   alt={book.title} 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                 <div className="absolute top-2 right-2 bg-cyan-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full shadow-lg">
                    Full PDF
                 </div>
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight">{book.title}</h4>
                <p className="text-slate-500 text-sm mb-10 leading-relaxed">{book.description}</p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleDownload(book.downloadUrl)}
                    className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EBooks;