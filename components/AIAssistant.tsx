
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiClient, CHAT_CONFIG, CHAT_MODEL } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../LanguageContext';

const AIAssistant: React.FC = () => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  // Reset Session on Close/Open
  useEffect(() => {
    if (isOpen) {
      // Starting a fresh session every time it opens
      setMessages([{ role: 'model', text: t('ai.intro') }]);
      initChatSession();
    } else {
      // Clear references when closed to ensure a new session next time
      chatRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const initChatSession = () => {
    try {
      const ai = getGeminiClient();
      chatRef.current = ai.chats.create({
        model: CHAT_MODEL,
        config: {
          systemInstruction: CHAT_CONFIG.systemInstruction + `\nPreferred Language: ${lang === 'bn' ? 'Bengali' : 'English'}.`,
          temperature: CHAT_CONFIG.temperature,
        }
      });
    } catch (err) {
      console.error("AI Init Failed", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    if (!chatRef.current) initChatSession();

    const currentInput = input;
    setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: currentInput });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Logic error!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "কানেক্টিভিটি ইস্যু! অনুগ্রহ করে পুনরায় চেষ্টা করুন।" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render text with buttons for links
  const renderMessage = (text: string) => {
    // Regex to find [LINK: Label | URL] or raw URLs
    const linkRegex = /\[LINK:\s*(.*?)\s*\|\s*(.*?)\]|https?:\/\/[^\s]+/g;
    const parts = text.split(linkRegex);
    const matches = Array.from(text.matchAll(linkRegex));

    if (matches.length === 0) return text;

    let matchIdx = 0;
    return text.split('\n').map((line, li) => (
      <div key={li} className="mb-2">
        {line.split(/(\[LINK:.*?\]|https?:\/\/[^\s]+)/g).map((part, pi) => {
          const linkMatch = part.match(/\[LINK:\s*(.*?)\s*\|\s*(.*?)\]/);
          const rawUrlMatch = part.match(/https?:\/\/[^\s]+/);

          if (linkMatch) {
            const label = linkMatch[1];
            const url = linkMatch[2];
            return (
              <a key={pi} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest my-1 transition-all shadow-lg active:scale-95">
                <span>{label}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            );
          }
          if (rawUrlMatch) {
            const url = rawUrlMatch[0];
            const label = url.includes('wa.me') ? 'WhatsApp' : url.includes('facebook') ? 'Facebook' : 'Visit Link';
            return (
              <a key={pi} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest my-1 border border-white/5 transition-all">
                <span>{label}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            );
          }
          return part;
        })}
      </div>
    ));
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200] flex flex-col items-end">
      {!isOpen && (
        <div className="flex flex-col items-end group">
          <div className="mb-3 px-4 py-2 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-bounce relative group-hover:bg-blue-600 group-hover:text-white transition-colors">
            Ask Anything to Toufiq Sir
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-inherit rotate-45"></div>
          </div>
          <button onClick={() => setIsOpen(true)} className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/10 glow-blue overflow-hidden transition-all hover:scale-110 active:scale-90">
             <img src={teacherPhotoUrl} alt="Toufiq Sir" className="w-full h-full object-cover" />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-0 right-0 w-[calc(100vw-2rem)] sm:w-[450px] h-[650px] max-h-[calc(100vh-4rem)] glass-card rounded-[40px] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95">
          <div className="bg-blue-600 p-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-3">
              <img src={teacherPhotoUrl} className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20 shadow-inner" alt="" />
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-tight">Toufiq Sir AI</h4>
                <div className="flex items-center space-x-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span><span className="text-[9px] text-blue-100 font-bold uppercase tracking-widest">Active Session</span></div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-5 py-4 rounded-3xl text-[13px] sm:text-sm leading-[1.6] shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-900 text-slate-200 border border-white/5'}`}>
                  {msg.role === 'model' ? renderMessage(msg.text) : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 px-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest italic">Fast Analyzing...</span>
              </div>
            )}
          </div>

          <div className="p-5 bg-slate-900 border-t border-white/5 flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="আইসিটি লজিক জানতে চাও..." 
              className="flex-1 bg-white/5 border border-white/10 text-white text-sm p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600" 
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading} 
              className="bg-blue-600 text-white px-6 rounded-2xl hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
