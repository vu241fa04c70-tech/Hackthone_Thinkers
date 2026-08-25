import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../localization/LanguageContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang } = useLanguage();

  const getTooltip = () => {
    if (isDark) {
      return lang === 'te' ? 'లైట్ మోడ్‌కి మారండి ☀️' : (lang === 'hi' ? 'लाइट मोड में बदलें ☀️' : 'Switch to Light Mode ☀️');
    }
    return lang === 'te' ? 'డార్క్ మోడ్‌కి మారండి 🌙' : (lang === 'hi' ? 'डार्क मोड में बदलें 🌙' : 'Switch to Dark Mode 🌙');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer flex items-center gap-1.5 font-bold text-xs shadow-sm ${
        isDark
          ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:border-amber-400/50'
          : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
      } ${className}`}
      title={getTooltip()}
    >
      {isDark ? (
        <>
          <Moon className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
          <span className="hidden sm:inline">{lang === 'te' ? 'డార్క్' : (lang === 'hi' ? 'डार्क' : 'Dark')}</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="hidden sm:inline">{lang === 'te' ? 'లైట్' : (lang === 'hi' ? 'लाइट' : 'Light')}</span>
        </>
      )}
    </button>
  );
}
