import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { isRTLLanguage } from './languageMap';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('kisanLanguage') || 'te'; // Default Telugu!
  });

  const setLanguage = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('kisanLanguage', newLang);
  };

  useEffect(() => {
    const isRTL = isRTLLanguage(lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Helper t('nav.appName') with multi-level fallback
  const t = (path) => {
    const keys = path.split('.');
    
    // 1. Try selected language
    let current = translations[lang];
    let found = true;
    if (current) {
      for (const k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k];
        } else {
          found = false;
          break;
        }
      }
      if (found) return current;
    }

    // 2. Fallback to Telugu
    current = translations['te'];
    found = true;
    if (current) {
      for (const k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k];
        } else {
          found = false;
          break;
        }
      }
      if (found) return current;
    }

    // 3. Fallback to English
    current = translations['en'];
    found = true;
    if (current) {
      for (const k of keys) {
        if (current && current[k] !== undefined) {
          current = current[k];
        } else {
          found = false;
          break;
        }
      }
      if (found) return current;
    }

    return path;
  };

  const isRTL = isRTLLanguage(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
