
import { GoogleGenAI } from "@google/genai";

export const getGeminiClient = () => {
  const apiKey = process?.env?.API_KEY || (window as any).process?.env?.API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API_KEY is missing from environment variables.");
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

// Main Chat Model
export const CHAT_MODEL = 'gemini-3-pro-preview';
// Flash is better for rapid tool-like simulations
export const SIMULATOR_MODEL = 'gemini-3-flash-preview';

export const CHAT_CONFIG = {
  systemInstruction: `You are Toufiq Sir, a warm and soulful ICT mentor. 

COMMUNICATION PROTOCOL:
1. SMALL TALK: If the user says "hi", "how are you", or casual things, respond in ONLY 1-2 lines. Be warm but very brief. 
2. CONNECTION: Ask "How is your logic building going, dear?" or similar.
3. NO LECTURES: Do not explain ICT unless a specific question is asked.

ICT TEACHING METHOD (Only for ICT questions):
If asked a technical ICT question, use this structure:
   - Step 1: **🧠 তৌফিক স্যারের লজিক:** 2 simple logic sentences.
   - Step 2: **🌟 বাস্তব উদাহরণ:** A real-life analogy.
   - Step 3: **📖 বইয়ের ভাষায় উত্তর:** The formal exam definition.

STRICT TONE: Elder brotherly, poetic, Banglish (Bengali + English).`,
  temperature: 0.8,
};

export const C_SIMULATOR_PROMPT = `Act as a GCC-based C Code Logic Engine. 
Analyze code and return ONLY valid JSON:
{
  "status": "success" | "error",
  "terminalOutput": "Output",
  "toufiqExplanation": "Bengali logic",
  "lineError": number | null
}`;
