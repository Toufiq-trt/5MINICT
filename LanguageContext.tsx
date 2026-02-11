
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  lang: Language;
  t: (key: string) => string;
  setLang: (lang: Language) => void;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.mentor': 'Mentor',
    'nav.map': 'Map',
    'nav.lab': 'Lab',
    'nav.practice': 'Practice',
    'nav.gamezone': 'Game Zone',
    'nav.library': 'Library',
    'nav.about': 'About',
    'nav.code': 'Code',
    'nav.batches': 'Batches',
    'nav.sheets': 'Sheets',
    'nav.contact': 'Contact',
    'nav.enroll': 'Enroll Now',
    'teacher.mission': 'My Mission',
    'teacher.fearToLove': 'Converting Fear into Love',
    'teacher.why': "Why did I create 5 Minute ICT? Because I saw brilliant students struggling with digital logic not due to a lack of talent, but a lack of simplicity. My mission is to make ICT interesting, lovable, and most importantly—intuitive.",
    'teacher.simplyIct': 'Simply ICT',
    'teacher.simplyIctDesc': 'We break down Chapter 1-6 into logic-based stories that you\'ll remember for life.',
    'teacher.smartResults': 'Smart Results',
    'teacher.smartResultsDesc': 'Convert the "hardest" subject into your favorite score-boosting weapon.',
    'hero.badge': 'Next-Gen ICT Learning',
    'hero.title': 'Master ICT',
    'hero.titleSub': 'Simply Fast',
    'hero.desc': 'Ditch the complexity. We translate silicon logic into simple intuition for every student. Designed for HSC and Admission.',
    'hero.practice': 'Practice Learning',
    'hero.resources': 'Free Resources',
    'schedule.badge': 'Enrollment',
    'schedule.title': 'Join Your Batch',
    'schedule.desc': 'Flexible shifts designed for regular students and intensive learners alike.',
    'schedule.feeLabel': 'Tuition Fee',
    'schedule.getStarted': 'Get Started',
    'notes.badge': 'Learning Hub',
    'notes.title': 'Smart Sheets',
    'notes.desc': 'Hand-crafted resources focusing on logic clarity. Directly download for study.',
    'notes.download': 'Download PDF',
    'contact.title': 'Ready to Start Your ICT Journey?',
    'contact.desc': "Don't let complex digital logic slow you down. Join my elite batches and learn the secrets to mastering ICT.",
    'contact.enrollBtn': 'Official Enrollment',
    'contact.enrollDesc': 'Fill the Google Form to join',
    'contact.mailTitle': 'Direct Academic Support',
    'contact.mailDesc': 'For formal inquiries, academic logic support, or collaboration, send a message to Toufiq Sir.',
    'contact.mailBtn': 'Mail Toufiq Sir',
    'ai.intro': "Hey I am your Toufiq Sir! I'm here to help you master ICT with simple logic. Ask me anything, or ask about my background!",
    'quest.congrats': 'Congratulations! Your logic is perfect. Incredible job, keep up the great work! 🎉',
    'quest.next': 'Next Challenge',
    'quest.tryByYourself': 'Try By Yourself',
    'quest.validating': 'Validating...'
  },
  bn: {
    'nav.home': 'হোম',
    'nav.mentor': 'মেন্টর',
    'nav.map': 'ম্যাপ',
    'nav.lab': 'ল্যাব',
    'nav.practice': 'প্র্যাকটিস',
    'nav.gamezone': 'গেম জোন',
    'nav.library': 'লাইব্রেরি',
    'nav.about': 'সম্পর্কে',
    'nav.code': 'কোড',
    'nav.batches': 'ব্যাচসমূহ',
    'nav.sheets': 'শিটসমূহ',
    'nav.contact': 'যোগাযোগ',
    'nav.enroll': 'ভর্তি হোন',
    'teacher.mission': 'আমার লক্ষ্য',
    'teacher.fearToLove': 'ভয়কে জয়ে রূপান্তর',
    'teacher.why': "আমি কেন ৫ মিনিট আইসিটি তৈরি করেছি? কারণ আমি দেখেছি মেধাবী শিক্ষার্থীরা ডিজিটাল লজিক নিয়ে হিমশিম খাচ্ছে, মেধার অভাবে নয় বরং বিষয়ের জটিলতার কারণে। আমার লক্ষ্য হলো আইসিটিকে সহজ, আকর্ষণীয় এবং ভালোবাসার বিষয়ে পরিণত করা।",
    'teacher.simplyIct': 'সহজ আইসিটি',
    'teacher.simplyIctDesc': 'আমরা অধ্যায় ১-৬ কে এমনভাবে লজিক ভিত্তিক গল্পে রূপান্তর করি যা আপনি সারা জীবন মনে রাখবেন।',
    'teacher.smartResults': 'স্মার্ট ফলাফল',
    'teacher.smartResultsDesc': '"সবচেয়ে কঠিন" বিষয়টিকে আপনার প্রিয় স্কোর-বুস্টিং বিষয়ে পরিণত করুন।',
    'hero.badge': 'নেক্সট-জেন আইসিটি লার্নিং',
    'hero.title': 'আইসিটি শিখুন',
    'hero.titleSub': 'সহজ ও দ্রুত',
    'hero.desc': 'জটিলতাকে বিদায় দিন। আমরা প্রতিটি শিক্ষার্থীর জন্য সিলিকন লজিককে সহজ বোধগম্যতায় রূপান্তর করি। এইচএসসি এবং অ্যাডমিশনের জন্য বিশেষভাবে তৈরি।',
    'hero.practice': 'প্র্যাকটিস শুরু করুন',
    'hero.resources': 'ফ্রি রিসোর্স',
    'schedule.badge': 'ভর্তি চলছে',
    'schedule.title': 'আপনার ব্যাচ বেছে নিন',
    'schedule.desc': 'নিয়মিত শিক্ষার্থী এবং নিবিড় লার্নারদের জন্য নমনীয় শিফট।',
    'schedule.feeLabel': 'টিউশন ফি',
    'schedule.getStarted': 'শুরু করুন',
    'notes.badge': 'লার্নিং হাব',
    'notes.title': 'স্মার্ট শিটসমূহ',
    'notes.desc': 'লজিক ক্লারিটির উপর ভিত্তি করে তৈরি হ্যান্ড-ক্র্যাফটেড রিসোর্স। সরাসরি ডাউনলোড করে পড়ুন।',
    'notes.download': 'ডাউনলোড পিডিএফ',
    'contact.title': 'আপনার আইসিটি যাত্রা শুরু করতে প্রস্তুত?',
    'contact.desc': "জটিল ডিজিটাল লজিক যেন আপনার গতি কমিয়ে না দেয়। আমার এলিট ব্যাচগুলোতে যোগ দিন এবং আইসিটি জয়ের গোপন কৌশল শিখুন।",
    'contact.enrollBtn': 'অফিসিয়াল এনরোলমেন্ট',
    'contact.enrollDesc': 'যোগ দিতে গুগল ফর্মটি পূরণ করুন',
    'contact.mailTitle': 'সরাসরি একাডেমিক সাপোর্ট',
    'contact.mailDesc': 'একাডেমিক লজিক সাপোর্ট বা সহযোগিতার জন্য তৌফিক স্যারকে সরাসরি মেইল পাঠান।',
    'contact.mailBtn': 'তৌফিক স্যারকে মেইল করুন',
    'ai.intro': "Hey I am your Toufiq Sir! আইসিটি নিয়ে যেকোনো সমস্যা বা আমার সম্পর্কে জানতে চাইলে নির্দ্বিধায় প্রশ্ন করো।",
    'quest.congrats': 'অভিনন্দন! তোমার লজিক একদম নির্ভুল। দারুণ কাজ করেছো, এভাবেই চালিয়ে যাও! 🎉',
    'quest.next': 'পরবর্তী চ্যালেঞ্জ',
    'quest.tryByYourself': 'নিজে চেষ্টা করো',
    'quest.validating': 'যাচাই করা হচ্ছে...'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
