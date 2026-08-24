import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, Bot, User, Sparkles, CheckCircle2, Cpu, Square, ArrowRight, Loader2 } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech, startSpeechRecognition } from '../utils/voiceUtils';

export default function FarmCopilot({ activeField }) {
  const { lang, t } = useLanguage();
  const chatBottomRef = useRef(null);

  const getQuickPrompts = () => {
    if (lang === 'te') {
      return [
        "నా వరి పంటకు పురుగులు వస్తున్నాయి. నేను ఏం చేయాలి?",
        "నా టమాటా ఆకులు పసుపు రంగులోకి మారుతున్నాయి",
        "ఈరోజు వర్షం పడుతుందా?",
        "పంట కోయవచ్చా లేక 3 రోజులు ఆగాలా?",
        "ఎకరానికి ఎంత Urea ఎరువు వేయాలి?"
      ];
    } else if (lang === 'hi') {
      return [
        "मेरी फसल में कीट लग रहे हैं, मुझे क्या करना चाहिए?",
        "मेरी टमाटर की पत्तियां पीली हो रही हैं",
        "क्या आज बारिश होगी?",
        "यूरिया खाद कितनी मात्रा में डालें?"
      ];
    } else {
      return [
        "Pests are infecting my rice crop, what should I do?",
        "My tomato leaves are turning yellow with brown spots",
        "Should I harvest my crop now or wait 3 days?",
        "How much urea fertilizer should I apply?"
      ];
    }
  };

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  useEffect(() => {
    const welcome = lang === 'te'
      ? `నమస్కారం! నేను మీ కిసాన్ AI సహాయకుడిని. మీ పంట సంరక్షణ, ఎరువుల వాడకం లేదా మార్కెట్ ధరల గురించిన ప్రశ్నకు వాయిస్ లేదా టెక్స్ట్ ద్వారా అడగండి.`
      : (lang === 'hi'
        ? `नमस्ते! मैं आपका किसान AI सहायक हूँ। अपनी फसल देखभाल या मंडी भाव के बारे में प्रश्न पूछें।`
        : `Namaste! I am your Kisan AI Agriculture Assistant. Ask any question about crop health, fertilizer dosage, weather, or mandi prices by voice or text.`);

    setMessages([
      {
        sender: 'ai',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agents/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          language: lang,
          crop: activeField?.crop_type || 'Tomato'
        })
      });

      if (!res.ok) throw new Error('Query failed');
      const data = await res.json();

      const aiMsg = {
        sender: 'ai',
        text: data.response || 'Here is your agricultural advice.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // Auto speak AI response
      speakText(aiMsg.text, lang);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: lang === 'te' ? 'క్షమించండి, లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Sorry, an error occurred. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    startSpeechRecognition(
      lang,
      (transcript) => {
        setIsRecording(false);
        if (transcript) {
          handleSendQuery(transcript);
        }
      },
      (err) => {
        setIsRecording(false);
      }
    );
  };

  const handleSpeakMsg = (idx, text) => {
    if (speakingIdx === idx) {
      stopSpeech();
      setSpeakingIdx(null);
      return;
    }

    setSpeakingIdx(idx);
    speakText(
      text,
      lang,
      () => setSpeakingIdx(idx),
      () => setSpeakingIdx(null),
      () => setSpeakingIdx(null)
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950 p-6 rounded-3xl border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xl font-black shadow-lg">
            🎤
          </div>
          <div>
            <h2 className="text-xl font-black text-cyan-400 flex items-center gap-2">
              Kisan Voice AI Assistant
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black">
                Multilingual Speech AI
              </span>
            </h2>
            <p className="text-xs text-slate-300 font-bold">Ask any farming question in your native language by voice or text.</p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Tap Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
          💡 Quick Farming Question Shortcuts:
        </span>
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {getQuickPrompts().map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(prompt)}
              className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold text-slate-200 cursor-pointer shrink-0 transition-all shadow-md"
            >
              <span>💬 {prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col min-h-[450px] max-h-[550px] justify-between">
        
        <div className="overflow-y-auto space-y-4 pr-1 no-scrollbar flex-1">
          {messages.map((msg, idx) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
              >
                {isAI && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shrink-0">
                    🌾
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl space-y-2 shadow-lg ${
                    isAI
                      ? 'bg-slate-950 border border-slate-800 text-slate-100'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-bold'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-bold leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>

                  <div className={`flex items-center justify-between text-[10px] pt-1 ${isAI ? 'text-slate-400 font-bold border-t border-slate-800' : 'text-slate-900 font-extrabold'}`}>
                    <span>{msg.timestamp}</span>
                    {isAI && (
                      <button
                        onClick={() => handleSpeakMsg(idx, msg.text)}
                        className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${speakingIdx === idx ? 'animate-bounce' : ''}`} />
                        <span>{speakingIdx === idx ? 'Stop ⏹️' : 'Listen 🔊'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAI && (
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shrink-0">
                    👨‍🌾
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 justify-start animate-in fade-in">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-sm shrink-0">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Kisan AI is formulating agricultural advice...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar & Prominent Mic Button (Min 52px Touch Height) */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
          
          <button
            onClick={handleMicClick}
            className={`min-h-[52px] min-w-[52px] rounded-2xl flex items-center justify-center text-slate-950 font-black cursor-pointer shadow-xl transition-all ${
              isRecording
                ? 'bg-rose-500 animate-pulse text-slate-950 shadow-rose-500/30'
                : 'bg-gradient-to-tr from-cyan-500 to-emerald-400 hover:scale-105 shadow-cyan-500/20'
            }`}
            title="Voice Input (Speech-to-Text)"
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <input
            type="text"
            placeholder={isRecording ? 'Listening to your voice...' : (lang === 'te' ? 'మీ వ్యవసాయ ప్రశ్నా ఇక్కడ రాయండి లేదా మాట్లాడండి...' : 'Type or speak your farming question...')}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-cyan-500 min-h-[52px]"
          />

          <button
            onClick={() => handleSendQuery()}
            disabled={!inputQuery.trim() || isLoading}
            className="min-h-[52px] px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>

        </div>

      </div>

    </div>
  );
}
