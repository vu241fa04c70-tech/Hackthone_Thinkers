// Centralized Regional Languages & Locales Configuration

export const SUPPORTED_LANGUAGES = {
  te: { code: 'te', name: 'తెలుగు', subName: 'Telugu', locale: 'te-IN', flag: '🌾' },
  hi: { code: 'hi', name: 'हिन्दी', subName: 'Hindi', locale: 'hi-IN', flag: '🇮🇳' },
  ta: { code: 'ta', name: 'தமிழ்', subName: 'Tamil', locale: 'ta-IN', flag: '🇮🇳' },
  kn: { code: 'kn', name: 'ಕನ್ನಡ', subName: 'Kannada', locale: 'kn-IN', flag: '🇮🇳' },
  ml: { code: 'ml', name: 'മലയാളം', subName: 'Malayalam', locale: 'ml-IN', flag: '🇮🇳' },
  mr: { code: 'mr', name: 'मराठी', subName: 'Marathi', locale: 'mr-IN', flag: '🇮🇳' },
  en: { code: 'en', name: 'English', subName: 'English', locale: 'en-IN', flag: '🌐' }
};

export const getLocaleForLang = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode]?.locale || 'te-IN';
};
