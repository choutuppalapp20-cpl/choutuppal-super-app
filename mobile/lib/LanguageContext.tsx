import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getStoredLanguage, setStoredLanguage } from './language';

interface LanguageContextProps {
  lang: Language;
  updateLanguage: (newLang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('english');

  useEffect(() => {
    getStoredLanguage().then((l) => {
      if (l) setLang(l);
    });
  }, []);

  const updateLanguage = async (newLang: Language) => {
    await setStoredLanguage(newLang);
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
