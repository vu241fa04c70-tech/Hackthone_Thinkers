// Centralized Reusable Voice & Speech Recognition Utility
// Supports all 23 Official Scheduled Languages of India + English

import { getLocaleForLang, SUPPORTED_LANGUAGES } from '../localization/languageMap';

export const getLanguageLocale = (langCode) => {
  return getLocaleForLang(langCode);
};

export const cleanTextForSpeech = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // markdown links [text](url) -> text
    .replace(/https?:\/\/\S+/g, '') // remove URL links
    .replace(/[*#_~`>]/g, '') // remove markdown symbols like **, ##, --, `
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // remove emojis
    .replace(/•/g, '') // remove bullet dots
    .replace(/[ \t]+/g, ' ') // normalize tabs and multiple spaces
    .replace(/\n{3,}/g, '\n\n') // normalize excessive newlines
    .trim();
};

// Global playback session management & GC protection
let activeUtterance = null;
let currentAudio = null;
let voiceWatchdog = null;

export const stopSpeech = () => {
  if (voiceWatchdog) {
    clearInterval(voiceWatchdog);
    voiceWatchdog = null;
  }
  activeUtterance = null;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('[TTS] Cancel error:', e);
    }
  }
};

export const speakText = async (text, langCode = 'te', onStart, onEnd, onError) => {
  // 1. Cancel previous speech and clean up state
  stopSpeech();

  const speechText = cleanTextForSpeech(text);
  if (!speechText) {
    if (onEnd) onEnd();
    return;
  }

  const locale = getLanguageLocale(langCode) || 'te-IN';

  console.log('[TTS Debug] =====================================');
  console.log('DISPLAYED ANSWER:', text);
  console.log('TTS INPUT:', speechText);
  console.log('FINAL TTS TEXT:', speechText);
  console.log('TTS LANGUAGE:', locale);

  // Strategy 1: High-fidelity natural voice synthesis via backend proxy (handles all Telugu, Hindi, English full texts flawlessly)
  let playedAudio = false;
  try {
    const endpoints = ['/api/tts/speak', 'http://127.0.0.1:8000/api/tts/speak'];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: speechText, language: langCode || 'te' })
        });
        if (res.ok) {
          const blob = await res.blob();
          if (blob && blob.size > 100) {
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            currentAudio = audio;

            audio.onplay = () => {
              console.log('[TTS Debug] Audio playback started.');
              if (onStart) onStart();
            };

            audio.onended = () => {
              console.log('[TTS Debug] Audio playback finished completely.');
              URL.revokeObjectURL(audioUrl);
              currentAudio = null;
              if (onEnd) onEnd();
            };

            audio.onerror = (e) => {
              console.warn('[TTS Debug] Audio playback error, falling back to browser synthesis:', e);
              URL.revokeObjectURL(audioUrl);
              currentAudio = null;
              fallbackToWebSpeech();
            };

            await audio.play();
            playedAudio = true;
            break;
          }
        }
      } catch (endpointErr) {
        // try next endpoint or fallback
      }
    }
  } catch (err) {
    console.warn('[TTS Debug] Backend audio stream unavailable, falling back to Web Speech API:', err);
  }

  if (playedAudio) return;

  // Strategy 2: Browser Web Speech API fallback
  const fallbackToWebSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('[TTS Debug] Speech synthesis unavailable');
      if (onError) onError('Speech synthesis unavailable');
      return;
    }

    const performSpeak = () => {
      if (window.speechSynthesis.paused) {
        try {
          window.speechSynthesis.resume();
        } catch (e) {}
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = locale;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      activeUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      const targetLang = (langCode || 'te').toLowerCase();
      const targetLocale = (locale || 'te-IN').toLowerCase();

      const normLang = (v) => (v.lang || '').replace(/_/g, '-').toLowerCase();
      const normName = (v) => (v.name || '').toLowerCase();

      let matchingVoice = null;

      if (targetLang === 'te') {
        matchingVoice = voices.find(v => normLang(v) === 'te-in') ||
                        voices.find(v => normLang(v).startsWith('te')) ||
                        voices.find(v => normName(v).includes('telugu') || normName(v).includes('తెలుగు'));
      } else if (targetLang === 'hi') {
        matchingVoice = voices.find(v => normLang(v) === 'hi-in') ||
                        voices.find(v => normLang(v).startsWith('hi')) ||
                        voices.find(v => normName(v).includes('hindi') || normName(v).includes('हिन्दी') || normName(v).includes('हिंदी'));
      } else if (targetLang === 'en') {
        matchingVoice = voices.find(v => normLang(v) === 'en-in') ||
                        voices.find(v => normLang(v).startsWith('en')) ||
                        voices.find(v => normName(v).includes('english'));
      } else {
        const langConfig = SUPPORTED_LANGUAGES[langCode];
        const langSubName = (langConfig?.subName || '').toLowerCase();
        matchingVoice = voices.find(v => normLang(v) === targetLocale) ||
                        voices.find(v => normLang(v).startsWith(targetLang)) ||
                        (langSubName ? voices.find(v => normName(v).includes(langSubName)) : null);
      }

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      console.log('TTS VOICE:', utterance.voice ? utterance.voice.name : 'NONE (Using browser native ' + locale + ')');
      console.log('TTS VOICE LANGUAGE:', utterance.voice ? utterance.voice.lang : locale);

      utterance.onstart = () => {
        console.log('[TTS Debug] Speech started.');
        if (onStart) onStart();
      };

      utterance.onend = () => {
        console.log('[TTS Debug] Speech finished completely.');
        if (voiceWatchdog) {
          clearInterval(voiceWatchdog);
          voiceWatchdog = null;
        }
        activeUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        console.warn('[TTS Debug] Speech error event:', event.error, event);
        if (voiceWatchdog) {
          clearInterval(voiceWatchdog);
          voiceWatchdog = null;
        }
        activeUtterance = null;
        if (event.error === 'interrupted' || event.error === 'canceled') return;
        if (onError) onError(event.error || 'TTS playback error');
        if (onEnd) onEnd();
      };

      if (voiceWatchdog) clearInterval(voiceWatchdog);
      voiceWatchdog = setInterval(() => {
        if (activeUtterance && window.speechSynthesis.speaking) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      }, 3000);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('[TTS Debug] Exception in speak():', err);
        if (onError) onError(err);
        if (onEnd) onEnd();
      }
    };

    setTimeout(() => {
      if (window.speechSynthesis.getVoices().length === 0) {
        let loaded = false;
        const onVoices = () => {
          if (loaded) return;
          loaded = true;
          window.speechSynthesis.onvoiceschanged = null;
          performSpeak();
        };
        window.speechSynthesis.onvoiceschanged = onVoices;
        setTimeout(() => {
          if (!loaded) {
            loaded = true;
            performSpeak();
          }
        }, 200);
      } else {
        performSpeak();
      }
    }, 60);
  };

  fallbackToWebSpeech();
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
