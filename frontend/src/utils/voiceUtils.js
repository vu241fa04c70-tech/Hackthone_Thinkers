// Centralized Reusable Voice & Speech Recognition Utility
// Supports all 23 Official Scheduled Languages of India + English

import { getLocaleForLang } from '../localization/languageMap';

export const getLanguageLocale = (langCode) => {
  return getLocaleForLang(langCode);
};

export const speakText = (text, langCode = 'te', onStart, onEnd, onError) => {
  if (!('speechSynthesis' in window)) {
    if (onError) onError('Speech synthesis unavailable');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const locale = getLanguageLocale(langCode);
  utterance.lang = locale;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prioritize exact locale matching (e.g. te-IN, hi-IN, ur-IN) or lang match
    const matchingVoice = voices.find(v => 
      v.lang.toLowerCase() === locale.toLowerCase() || 
      v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
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
