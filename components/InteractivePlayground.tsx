
import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { getGeminiClient, C_SIMULATOR_PROMPT } from '../services/geminiService';

const InteractivePlayground: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'html' | 'c'>('html');
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>\n<html>\n<body style="background:#020617; color:#3b82f6; font-family:sans-serif; text-align:center; padding:50px; border:2px solid #1e293b; border-radius:30px;">\n  <h1>Welcome to 5Min ICT Lab</h1>\n  <p style="color:#94a3b8;">Edit this code to see live changes!</p>\n</body>\n</html>`);
  const [cCode, setCCode] = useState(`#include <stdio.h>\n\nint main() {\n    int num = 5;\n    printf("5 Minute ICT Logic Check\\n");\n    if(num > 0) {\n        printf("Toufiq Sir: Logic is Positive!\\n");\n    }\n    return 0;\n}`);
  const [terminalLog, setTerminalLog] = useState<{ type: 'cmd' | 'out' | 'err', text: string }[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  const runCSimulation = async () => {
    if (!cCode.trim() || isCompiling) return;
    setIsCompiling(true);
    setTerminalLog([{ type: 'cmd', text: 'Compiling source code...' }]);

    try {
      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `PROMPT: ${C_SIMULATOR_PROMPT}\n\nCODE:\n${cCode}`,
      });

      const responseText = response.text || "{}";
      // Reliable JSON extraction
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonStr = responseText.substring(jsonStart, jsonEnd);
      const result = JSON.parse(jsonStr);

      if (result.status === 'success') {
        setTerminalLog([
          { type: 'cmd', text: 'gcc program.c -o a.out && ./a.out' },
          { type: 'out', text: result.terminalOutput },
          { type: 'cmd', text: `\n[Toufiq Sir's Logic]: ${result.toufiqExplanation}` }
        ]);
      } else {
        setTerminalLog([
          { type: 'err', text: `COMPILATION ERROR at Line ${result.lineError || '?'}` },
          { type: 'out', text: result.toufiqExplanation }
        ]);
      }
    } catch (error) {
      setTerminalLog([{ type: 'err', text: 'Runtime Error: Check your internet or API settings in Netlify.' }]);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <section id="playground" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2">{t('play.badge')}</h2>
          <h3 className="text-4xl font-black text-white italic">{t('play.title')}</h3>
        </div>

        <div className="glass-card rounded-[40px] overflow-hidden border border-white/10 flex flex-col min-h-[650px] shadow-2xl">
          <div className="flex bg-slate-900/50 p-3 gap-3 border-b border-white/5">
            <button onClick={() => setActiveTab('html')} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'html' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>HTML Editor</button>
            <button onClick={() => setActiveTab('c')} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'c' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>C Logic Lab</button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-slate-900/80 p-0 relative border-r border-white/5 overflow-hidden">
               <div className="absolute top-4 right-6 z-20">
                  {activeTab === 'c' && (
                    <button onClick={runCSimulation} disabled={isCompiling} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl disabled:opacity-50">
                      {isCompiling ? 'Analyzing...' : 'Execute Logic'}
                    </button>
                  )}
               </div>
               <textarea 
                value={activeTab === 'html' ? htmlCode : cCode} 
                onChange={(e) => activeTab === 'html' ? setHtmlCode(e.target.value) : setCCode(e.target.value)}
                className="w-full h-full bg-transparent text-blue-300 mono text-sm p-10 outline-none resize-none leading-relaxed"
                spellCheck="false"
              />
            </div>
            
            <div className="bg-slate-950 p-8 flex flex-col">
              <div className="flex items-center space-x-2 mb-6 opacity-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Real-time Output</span>
              </div>
              
              {activeTab === 'html' ? (
                <div className="flex-1 bg-white rounded-[32px] overflow-hidden shadow-inner border-8 border-slate-900">
                  <iframe srcDoc={htmlCode} className="w-full h-full" title="HTML Preview" />
                </div>
              ) : (
                <div className="flex-1 bg-black/40 rounded-[32px] p-8 mono text-xs overflow-y-auto border border-white/5 shadow-2xl">
                  {terminalLog.length === 0 ? (
                    <p className="text-slate-700 italic">Enter code and press Execute to simulate the GCC environment...</p>
                  ) : (
                    <div className="space-y-3">
                      {terminalLog.map((log, i) => (
                        <div key={i} className={log.type === 'cmd' ? 'text-slate-500' : log.type === 'err' ? 'text-rose-500 font-bold' : 'text-emerald-400'}>
                          {log.type === 'cmd' && <span className="mr-3">➜</span>}
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
