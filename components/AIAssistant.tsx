
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { CHAT_CONFIG, CHAT_MODEL } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../LanguageContext';

const AIAssistant: React.FC = () => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);
  const teacherPhotoUrl = "https://drive.google.com/thumbnail?id=1as-hKVb4YTplT5Mopv9COwlJEPUJlVvy&sz=w1000";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'model', text: "আসসালামু আলাইকুম, আমি তৌফিক। আইসিটি নিয়ে তোমার যেকোনো প্রশ্ন আমাকে করতে পারো।" }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    
    const userMsg = trimmedInput;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY_MISSING");

      const ai = new GoogleGenAI({ apiKey });
      
      if (!chatRef.current) {
        chatRef.current = ai.chats.create({
          model: CHAT_MODEL,
          config: {
            systemInstruction: CHAT_CONFIG.systemInstruction + `\nPreferred Output Language: ${lang === 'bn' ? 'Bengali' : 'English'}`,
            temperature: CHAT_CONFIG.temperature,
          }
        });
      }

      const responseStream = await chatRef.current.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: 'model', text: fullText };
            return newMessages;
          });
        }
      }
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      let errorMsg = "Server Logic-এ একটু সমস্যা হয়েছে, dear। একটু পর আবার চেষ্টা করো অথবা WhatsApp-এ জানাও।";
      
      if (error.message === 'API_KEY_MISSING') {
        errorMsg = "API Key error: Logic Engine not initialized.";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
      chatRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[8000] flex flex-col items-end">
      {!isOpen && (
        <div className="flex flex-col items-end group">
          <div className="bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full mb-3 shadow-2xl tracking-widest animate-bounce opacity-0 group-hover:opacity-100 transition-all duration-300">
             Ask Toufiq sir Anything
          </div>
          <button 
            onClick={() => setIsOpen(true)} 
            className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white/10 glow-blue overflow-hidden transition-all hover:scale-110 active:scale-95 relative"
          >
             <img src={teacherPhotoUrl} alt="Toufiq Sir" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
             <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors"></div>
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
                  <span className="text-[9px] text-blue-100 font-bold uppercase tracking-widest">Logic Engine Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/70 hover:text-white p-2 bg-white/5 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-5 py-4 rounded-3xl text-[13px] sm:text-sm leading-[1.6] shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-slate-900 text-slate-200 border border-white/5'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && !messages[messages.length-1].text && (
              <div className="flex items-center space-x-2 p-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest ml-2">Thinking Logic...</span>
              </div>
            )}
          </div>

          <div className="p-5 bg-slate-900 border-t border-white/5 flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="Ask anything or share your thoughts..." 
              className="flex-1 bg-white/5 border border-white/10 text-white text-sm p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600" 
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading} 
              className="bg-blue-600 text-white px-6 rounded-2xl hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
