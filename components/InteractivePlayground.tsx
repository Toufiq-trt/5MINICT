
import React, { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { getGeminiClient, C_SIMULATOR_PROMPT, CHAT_MODEL } from '../services/geminiService';

const InteractivePlayground: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'html' | 'c'>('html');
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { background: #020617; color: #3b82f6; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }\n    .box { border: 2px solid #1e293b; padding: 40px; border-radius: 24px; text-align: center; }\n  </style>\n</head>\n<body>\n  <div class="box">\n    <h1>5Min ICT Lab</h1>\n    <p>Live Code Playground</p>\n  </div>\n</body>\n</html>`);
  const [cCode, setCCode] = useState(`#include <stdio.h>\n\nint main() {\n    printf("Logic is thinking...\\n");\n    int a = 5, b = 10;\n    printf("Sum of %d and %d is %d\\n", a, b, a+b);\n    return 0;\n}`);
  const [terminalLog, setTerminalLog] = useState<{ type: 'cmd' | 'out' | 'err', text: string }[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd, value } = textarea;

    // 1. Tab Support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = value.substring(0, start) + "    " + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      activeTab === 'html' ? setHtmlCode(textarea.value) : setCCode(textarea.value);
    }

    // 2. HTML Auto-close Tags
    if (activeTab === 'html' && e.key === '>') {
      const lastTagMatch = value.substring(0, selectionStart).match(/<(\w+)[^>]*$/);
      if (lastTagMatch) {
        const tagName = lastTagMatch[1];
        // Basic self-closing check
        const selfClosing = ['img', 'br', 'hr', 'input', 'link', 'meta'].includes(tagName.toLowerCase());
        if (!selfClosing) {
          setTimeout(() => {
            const currentPos = textarea.selectionStart;
            const newValue = textarea.value.substring(0, currentPos) + `</${tagName}>` + textarea.value.substring(currentPos);
            setHtmlCode(newValue);
            textarea.value = newValue;
            textarea.selectionStart = textarea.selectionEnd = currentPos;
          }, 0);
        }
      }
    }

    // 3. Brackets & Quotes Auto-close
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
    setTerminalLog([{ type: 'cmd', text: 'Compiling with Toufiq Sir\'s Cloud GCC Engine...' }]);

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: CHAT_MODEL,
        contents: `PROMPT: ${C_SIMULATOR_PROMPT}\n\nUSER CODE:\n${cCode}`,
      });

      const responseText = response.text || "{}";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Server communication error.");
      
      const result = JSON.parse(jsonMatch[0]);

      if (result.status === 'success') {
        setTerminalLog([
          { type: 'cmd', text: 'gcc program.c -o a.out && ./a.out' },
          { type: 'out', text: result.terminalOutput },
          { type: 'cmd', text: `\n[তৌফিক স্যারের লজিক]: ${result.toufiqExplanation}` }
        ]);
      } else {
        setTerminalLog([
          { type: 'err', text: `COMPILATION ERROR: ${result.toufiqExplanation || 'Logic failure.'}` }
        ]);
      }
    } catch (error) {
      setTerminalLog([{ type: 'err', text: 'Server connection timeout. Please try again.' }]);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <section id="playground" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-[10px] mb-2">Development Lab</h2>
          <h3 className="text-3xl font-black text-white italic tracking-tight">Interactive Code Engine</h3>
        </div>

        <div className="glass-card rounded-[40px] overflow-hidden border border-white/10 flex flex-col min-h-[600px] shadow-2xl relative">
          <div className="flex bg-slate-900/50 p-2.5 gap-2.5 border-b border-white/5">
            <button onClick={() => setActiveTab('html')} className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'html' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white/5'}`}>HTML Canvas</button>
            <button onClick={() => setActiveTab('c')} className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'c' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white/5'}`}>C Logic Pro</button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-slate-900/40 relative border-r border-white/5">
               <div className="absolute top-4 right-6 z-20">
                  {activeTab === 'c' && (
                    <button onClick={runCSimulation} disabled={isCompiling} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 active:scale-95">
                      {isCompiling ? 'Processing...' : 'Run Logic'}
                    </button>
                  )}
               </div>
               <textarea 
                ref={editorRef}
                value={activeTab === 'html' ? htmlCode : cCode} 
                onChange={(e) => activeTab === 'html' ? setHtmlCode(e.target.value) : setCCode(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent text-blue-400 mono text-[13px] p-8 outline-none resize-none leading-relaxed overflow-y-auto"
                spellCheck="false"
              />
            </div>
            
            <div className="bg-slate-950 p-6 flex flex-col">
              <div className="flex items-center space-x-2 mb-4 px-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Result Stream</span>
              </div>
              
              {activeTab === 'html' ? (
                <div className="flex-1 bg-white rounded-[24px] overflow-hidden shadow-2xl border-4 border-slate-900">
                  <iframe srcDoc={htmlCode} className="w-full h-full" title="HTML Preview" />
                </div>
              ) : (
                <div className="flex-1 bg-black rounded-[24px] p-6 mono text-[12px] overflow-y-auto border border-white/5 shadow-inner">
                  {terminalLog.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-30">
                       <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                       <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Command...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {terminalLog.map((log, i) => (
                        <div key={i} className={log.type === 'cmd' ? 'text-blue-500' : log.type === 'err' ? 'text-rose-500 font-bold' : 'text-emerald-400'}>
                          {log.type === 'cmd' && <span className="mr-2">$</span>}
                          <pre className="inline-block whitespace-pre-wrap">{log.text}</pre>
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
