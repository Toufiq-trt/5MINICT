
import React, { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { getGeminiClient, C_SIMULATOR_PROMPT, SIMULATOR_MODEL } from '../services/geminiService';

const InteractivePlayground: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'html' | 'c'>('html');
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<body style="background:#020617; color:#3b82f6; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; font-family:sans-serif;">
  <h1 style="border-bottom:2px solid;">Hello ICT!</h1>
  <p>Logic starts here.</p>
</body>
</html>`);
  const [cCode, setCCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Logic is thinking...\\n");\n    int a = 5, b = 10;\n    printf("Sum is %d\\n", a + b);\n    return 0;\n}`);
  const [terminalLog, setTerminalLog] = useState<{ type: 'cmd' | 'out' | 'err', text: string }[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + "    " + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      activeTab === 'html' ? setHtmlCode(textarea.value) : setCCode(textarea.value);
    }
  };

  const runCSimulation = async () => {
    if (!cCode.trim() || isCompiling) return;
    setIsCompiling(true);
    setTerminalLog([{ type: 'cmd', text: 'Compiling logic...' }]);

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: SIMULATOR_MODEL,
        contents: `PROMPT: ${C_SIMULATOR_PROMPT}\n\nUSER CODE:\n${cCode}`,
      });

      const responseText = response.text || "{}";
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const result = JSON.parse(responseText.substring(jsonStart, jsonEnd));

      if (result.status === 'success') {
        setTerminalLog([
          { type: 'cmd', text: './a.out' },
          { type: 'out', text: result.terminalOutput },
          { type: 'cmd', text: `\n[তৌফিক স্যার]: ${result.toufiqExplanation}` }
        ]);
      } else {
        setTerminalLog([{ type: 'err', text: `Error: ${result.toufiqExplanation}` }]);
      }
    } catch (error) {
      setTerminalLog([{ type: 'err', text: "Engine connection failed." }]);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <section id="playground" className="py-20 bg-slate-950 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-[10px] mb-2">Development Lab</h2>
          <h3 className="text-3xl font-black text-white italic tracking-tight uppercase">Interactive <span className="text-blue-600">Lab</span></h3>
        </div>

        <div className="glass-card rounded-[30px] overflow-hidden border border-white/10 flex flex-col min-h-[500px] lg:min-h-[600px] shadow-2xl">
          <div className="flex bg-slate-900/50 p-2 gap-2 border-b border-white/5">
            <button onClick={() => setActiveTab('html')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'html' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>HTML</button>
            <button onClick={() => setActiveTab('c')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'c' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>C Logic</button>
          </div>

          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2">
            <div className="bg-slate-900/40 relative border-b lg:border-b-0 lg:border-r border-white/5 h-[280px] lg:h-auto">
               <div className="absolute top-4 right-4 z-20">
                  {activeTab === 'c' && (
                    <button onClick={runCSimulation} disabled={isCompiling} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl disabled:opacity-50">
                      {isCompiling ? '...' : 'Run'}
                    </button>
                  )}
               </div>
               <textarea 
                ref={editorRef}
                value={activeTab === 'html' ? htmlCode : cCode} 
                onChange={(e) => activeTab === 'html' ? setHtmlCode(e.target.value) : setCCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent text-blue-400 mono text-[12px] sm:text-[13px] p-6 outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>
            
            <div className="bg-slate-950 p-4 sm:p-6 flex flex-col h-[280px] lg:h-auto">
              <div className="flex items-center space-x-2 mb-3 px-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Output</span>
              </div>
              
              {activeTab === 'html' ? (
                <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-900">
                  <iframe srcDoc={htmlCode} className="w-full h-full" title="HTML Preview" />
                </div>
              ) : (
                <div className="flex-1 bg-black rounded-2xl p-4 sm:p-6 mono text-[11px] sm:text-[12px] overflow-y-auto border border-white/5 shadow-inner">
                  {terminalLog.length === 0 ? (
                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Awaiting Command...</p>
                  ) : (
                    <div className="space-y-1.5">
                      {terminalLog.map((log, i) => (
                        <div key={i} className={log.type === 'cmd' ? 'text-blue-500' : log.type === 'err' ? 'text-rose-500 font-bold' : 'text-emerald-400'}>
                          <pre className="inline-block whitespace-pre-wrap break-all">{log.text}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractivePlayground;
