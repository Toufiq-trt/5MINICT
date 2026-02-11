
import React, { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { getGeminiClient, C_SIMULATOR_PROMPT, SIMULATOR_MODEL } from '../services/geminiService';

const InteractivePlayground: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'html' | 'c'>('html');
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<body style="background:#020617; color:#3b82f6; text-align:center; padding:50px; font-family:sans-serif;">
  <h1>Hello ICT!</h1>
  <p>Logic is the beginning of wisdom.</p>
</body>
</html>`);
  const [cCode, setCCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Logic is thinking...\\n");\n    int a = 5, b = 10;\n    printf("Sum is %d\\n", a + b);\n    return 0;\n}`);
  const [terminalLog, setTerminalLog] = useState<{ type: 'cmd' | 'out' | 'err', text: string }[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = value.substring(0, start) + "    " + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      activeTab === 'html' ? setHtmlCode(textarea.value) : setCCode(textarea.value);
    }

    const pairs: Record<string, string> = { '{': '}', '(': ')', '[': ']', '"': '"', "'": "'" };
    if (pairs[e.key]) {
      e.preventDefault();
      const closeChar = pairs[e.key];
      textarea.value = value.substring(0, selectionStart) + e.key + closeChar + value.substring(selectionEnd);
      textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      activeTab === 'html' ? setHtmlCode(textarea.value) : setCCode(textarea.value);
    }
  };

  const runCSimulation = async () => {
    if (!cCode.trim() || isCompiling) return;
    setIsCompiling(true);
    setTerminalLog([{ type: 'cmd', text: 'Connecting to Cloud GCC Engine...' }]);

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: SIMULATOR_MODEL,
        contents: `PROMPT: ${C_SIMULATOR_PROMPT}\n\nUSER CODE:\n${cCode}`,
      });

      const responseText = response.text || "{}";
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid response format from engine.");
      }
      
      const jsonStr = responseText.substring(jsonStart, jsonEnd);
      const result = JSON.parse(jsonStr);

      if (result.status === 'success') {
        setTerminalLog([
          { type: 'cmd', text: 'gcc program.c -o a.out && ./a.out' },
          { type: 'out', text: result.terminalOutput },
          { type: 'cmd', text: `\n[তৌফিক স্যারের লজিক]: ${result.toufiqExplanation}` }
        ]);
      } else {
        setTerminalLog([
          { type: 'err', text: `COMPILATION FAILED:\n${result.toufiqExplanation || 'Unknown error.'}` }
        ]);
      }
    } catch (error: any) {
      console.error("Simulation error:", error);
      let errorMsg = "System failure. Please check your internet or code.";
      
      if (error.message === "API_KEY_MISSING") {
        errorMsg = "Error: API_KEY is missing. Please check your Netlify environment variables.";
      } else if (error.message?.includes("401")) {
        errorMsg = "Error: Unauthorized. Your API Key might be invalid.";
      } else if (error.message?.includes("429")) {
        errorMsg = "Error: Too many requests. Wait a moment, dear.";
      } else if (error.message) {
        errorMsg = `Engine Error: ${error.message}`;
      }

      setTerminalLog([{ type: 'err', text: errorMsg }]);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <section id="playground" className="py-20 bg-slate-950 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-[10px] mb-2">Development Lab</h2>
          <h3 className="text-3xl font-black text-white italic tracking-tight uppercase">Interactive <span className="text-blue-600">Code</span> Engine</h3>
        </div>

        <div className="glass-card rounded-[30px] sm:rounded-[40px] overflow-hidden border border-white/10 flex flex-col min-h-[500px] lg:min-h-[600px] shadow-2xl relative">
          <div className="flex bg-slate-900/50 p-2 gap-2 border-b border-white/5">
            <button onClick={() => setActiveTab('html')} className={`flex-1 py-3 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${activeTab === 'html' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white/5'}`}>HTML Canvas</button>
            <button onClick={() => setActiveTab('c')} className={`flex-1 py-3 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all ${activeTab === 'c' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white/5'}`}>C Logic Pro</button>
          </div>

          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2">
            <div className="bg-slate-900/40 relative border-b lg:border-b-0 lg:border-r border-white/5 h-[320px] lg:h-auto">
               <div className="absolute top-4 right-4 z-20">
                  {activeTab === 'c' && (
                    <button onClick={runCSimulation} disabled={isCompiling} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 active:scale-95">
                      {isCompiling ? 'Compiling...' : 'Run Logic'}
                    </button>
                  )}
               </div>
               <textarea 
                ref={editorRef}
                value={activeTab === 'html' ? htmlCode : cCode} 
                onChange={(e) => activeTab === 'html' ? setHtmlCode(e.target.value) : setCCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent text-blue-400 mono text-[12px] sm:text-[13px] p-6 sm:p-8 outline-none resize-none leading-relaxed overflow-y-auto"
                spellCheck="false"
              />
            </div>
            
            <div className="bg-slate-950 p-4 sm:p-6 flex flex-col h-[320px] lg:h-auto">
              <div className="flex items-center space-x-2 mb-3 px-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Stream</span>
              </div>
              
              {activeTab === 'html' ? (
                <div className="flex-1 bg-white rounded-2xl sm:rounded-[24px] overflow-hidden shadow-2xl border-4 border-slate-900">
                  <iframe srcDoc={htmlCode} className="w-full h-full" title="HTML Preview" />
                </div>
              ) : (
                <div className="flex-1 bg-black rounded-2xl sm:rounded-[24px] p-4 sm:p-6 mono text-[11px] sm:text-[12px] overflow-y-auto border border-white/5 shadow-inner">
                  {terminalLog.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-30">
                       <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                       <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Awaiting Command...</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {terminalLog.map((log, i) => (
                        <div key={i} className={log.type === 'cmd' ? 'text-blue-500' : log.type === 'err' ? 'text-rose-500 font-bold' : 'text-emerald-400'}>
                          {log.type === 'cmd' && <span className="mr-1 sm:mr-2">$</span>}
                          <pre className="inline-block whitespace-pre-wrap break-all sm:break-normal">{log.text}</pre>
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
