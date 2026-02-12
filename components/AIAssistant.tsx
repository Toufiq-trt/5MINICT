
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiClient, CHAT_CONFIG, CHAT_MODEL } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../LanguageContext';
import { GenerateContentResponse, Chat } from "@google/genai";

const AIAssistant: React.FC = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'thinking' | 'typing'>('thinking');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  const ICT_KEYWORDS = [
    'ict', 'html', 'css', 'programming', 'binary', 'decimal', 'hex', 'octal', 'gate', 
    'flipflop', 'register', 'ram', 'database', 'sql', 'topology', 'network', 'bus', 
    'cloud', 'biometric', 'vr', 'robotics', 'logic', 'chapter', 'c ', 'adder', 'encoder', 'decoder', 'program', 'loop', 'array', 'explain', 'what is'
  ];

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setMessages([{ role: 'model', text: "Assalamu alaikum, I am Toufiq. What's your name, dear student?" }]);
      }
      if (!chatRef.current) {
        initChatSession();
      }
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
          systemInstruction: CHAT_CONFIG.systemInstruction + `\nPreferred Language: ${lang === 'bn' ? 'Bengali' : 'English'}`,
          temperature: CHAT_CONFIG.temperature,
        }
      });
    } catch (err) {
      console.error("AI Initialization Error:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setIsLoading(true);

    const lowerText = userMsg.toLowerCase();
    const isICT = ICT_KEYWORDS.some(k => lowerText.includes(k));
    setLoadingType(isICT ? 'thinking' : 'typing');

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      if (!chatRef.current) {
        initChatSession();
      }

      if (!chatRef.current) throw new Error("AI_NOT_READY");

      const responseStream = await chatRef.current.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text;
        if (textChunk) {
          fullText += textChunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', text: fullText };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("AI Send Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Server Logic-এ একটু সমস্যা হয়েছে, dear। একটু পর আবার চেষ্টা করো অথবা WhatsApp-এ জানাও।" }]);
      chatRef.current = null; // Reset for next attempt
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (text: string) => {
    return text.split('\n').map((line, li) => {
      const isHeader = line.includes('🧠') || line.includes('📖') || line.includes('🌟') || line.startsWith('**');
      return (
        <div key={li} className={`${isHeader ? 'mt-4 mb-2 text-blue-400 font-black' : 'mb-2'}`}>
          {line.split(/(\[LINK:.*?\]|https?:\/\/[^\s]+)/g).map((part, pi) => {
            const linkMatch = part.match(/\[LINK:\s*(.*?)\s*\|\s*(.*?)\]/);
            if (linkMatch) {
              return (
                <a key={pi} href={linkMatch[2]} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest my-1 transition-all shadow-lg">
                  <span>{linkMatch[1]}</span>
                </a>
              );
            }
            return part.replace(/\*\*/g, '');
          })}
        </div>
      );
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[8000] flex flex-col items-end">
      {!isOpen && (
        <div className="flex flex-col items-end group">
          <div className="mb-3 px-5 py-2.5 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-bounce relative group-hover:bg-blue-600 group-hover:text-white transition-all cursor-pointer" onClick={() => setIsOpen(true)}>
            Ask Toufiq Sir Anything
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-inherit rotate-45 shadow-2xl"></div>
          </div>
          <button onClick={() => setIsOpen(true)} className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/10 glow-blue overflow-hidden transition-all hover:scale-110 active:scale-90 rotate-3 hover:rotate-0">
             <img src={teacherPhotoUrl} alt="Toufiq Sir" className="w-full h-full object-cover" />
          </button>
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-0 right-0 w-[calc(100vw-2rem)] sm:w-[450px] h-[650px] max-h-[calc(100vh-4rem)] glass-card rounded-[40px] shadow-3xl border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="bg-blue-600 p-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-3">
              <img src={teacherPhotoUrl} className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20" alt="" />
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-tight">Toufiq Sir AI</h4>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[9px] text-blue-100 font-bold uppercase tracking-widest">Logic Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-2 bg-white/5 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-5 py-4 rounded-3xl text-[13px] sm:text-sm leading-[1.6] shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-900 text-slate-200 border border-white/5'}`}>
                  {msg.role === 'model' ? renderMessage(msg.text) : msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && !messages[messages.length-1].text && (
              <div className="flex items-center space-x-2 px-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest italic">
                  {loadingType === 'thinking' ? 'Analyzing Logic...' : 'Typing...'}
                </span>
              </div>
            )}
          </div>

          <div className="p-5 bg-slate-900 border-t border-white/5 flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="সাজেশন বা মনের কথা বলো..." 
              className="flex-1 bg-white/5 border border-white/10 text-white text-sm p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600" 
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white px-6 rounded-2xl hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
