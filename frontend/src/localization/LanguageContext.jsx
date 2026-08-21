import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('kisanLanguage') || 'te'; // Telugu default!
  });

  const setLanguage = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('kisanLanguage', newLang);
  };

  // Helper t('nav.appName')
  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang] || translations['te'];
    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k];
      } else {
        // Fallback to Telugu
        let fallback = translations['te'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
