// Centralized Reusable Voice & Speech Recognition Utility
// Supports all 23 Official Scheduled Languages of India + English

import { getLocaleForLang, SUPPORTED_LANGUAGES } from '../localization/languageMap';

export const getLanguageLocale = (langCode) => {
  return getLocaleForLang(langCode);
};

export const cleanTextForSpeech = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/[*#_~`>]/g, '') // remove markdown symbols like **, ##, --
    .replace(/https?:\/\/\S+/g, '') // remove URL links
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
    .replace(/\s+/g, ' ')
    .trim();
};

export const speakText = (text, langCode = 'te', onStart, onEnd, onError) => {
  if (!('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis unavailable');
    return;
  }

  // Cancel any ongoing speech immediately before speaking in new language
  window.speechSynthesis.cancel();
  
  const cleanedText = cleanTextForSpeech(text);
  if (!cleanedText) return;

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  const locale = getLanguageLocale(langCode);
  utterance.lang = locale;
  utterance.rate = 0.9; // Clear, farmer-friendly listening pace
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const targetLang = (langCode || 'te').toLowerCase();
    const targetLocale = locale.toLowerCase();
    
    // 1. Prioritize exact locale match (e.g., te-IN, hi-IN, ta-IN, kn-IN)
    let matchingVoice = voices.find(v => v.lang.toLowerCase() === targetLocale);
    
    // 2. Fallback to language prefix match (e.g. te, hi, ta, kn)
    if (!matchingVoice) {
      matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(targetLang));
    }

    // 3. Fallback to any Indian accent voice if specific regional voice not installed in OS
    if (!matchingVoice && targetLang !== 'en') {
      matchingVoice = voices.find(v => v.lang.toLowerCase().includes('in'));
    }

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      doSpeak();
    };
  } else {
    doSpeak();
  }
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const announceLanguageChange = (langCode) => {
  const langConfig = SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES['te'];
  const greetingText = langConfig.greeting || `${langConfig.name} selected. Welcome!`;
  speakText(greetingText, langCode);
};

export const startSpeechRecognition = (langCode = 'te', onResult, onError, onEnd) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition unavailable');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = getLanguageLocale(langCode);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
  };

  if (onError) recognition.onerror = (e) => onError(e.error);
  if (onEnd) recognition.onend = onEnd;

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    if (onError) onError(err);
    return null;
  }
};
