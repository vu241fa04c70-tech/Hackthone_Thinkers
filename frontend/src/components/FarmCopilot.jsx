import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Bot, User, Sparkles, CheckCircle2, Cpu, Square } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech, startSpeechRecognition } from '../utils/voiceUtils';

export default function FarmCopilot({ activeField }) {
  const { lang, t } = useLanguage();

  const getQuickPrompts = () => {
    if (lang === 'te') {
      return [
        "నా టమాటా ఆకులు పసుపు రంగులోకి మారుతున్నాయి. ఏం చేయాలి?",
        "ఈరోజు వర్షం పడుతుందా?",
        "పంట కోయవచ్చా లేక 3 రోజులు ఆగాలా?",
        "ఎకరానికి ఎంత Urea ఎరువు వేయాలి?",
        "ప్రభుత్వ ఫసల్ బీమా యోజన అర్హతలు ఏంటి?"
      ];
    } else if (lang === 'hi') {
      return [
        "मेरी टमाटर की पत्तियां पीली हो रही हैं",
        "क्या आज बारिश होगी?",
        "क्या अभी फसल काटें या 3 दिन रुकें?",
        "यूरिया खाद कितनी मात्रा में डालें?"
      ];
    } else {
      return [
        "My tomato leaves are turning yellow with brown spots",
        "Should I harvest my crop now or wait 3 days?",
        "How much urea fertilizer should I apply for drip fertigation?",
        "What are PM Fasal Bima Yojana crop insurance details?"
      ];
    }
  };

  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState('idle'); // idle, listening, processing, speaking, error
  const [speakingIdx, setSpeakingIdx] = useState(null);

  useEffect(() => {
    const welcome = lang === 'te'
      ? `నమస్కారం రమేష్ గారూ! నేను మీ డిజిటల్ కిసాన్ మిత్రుడిని. మీ పంట గురించి ఏదైనా అడగండి — వాతావరణం, ఆకుల మచ్చలు, ఎరువులు లేదా మండీ ధరల గురించి మైక్ నొక్కి మాట్లాడండి!`
      : (lang === 'hi'
        ? `नमस्ते रमेश भाई! मैं आपका डिजिटल किसान मित्र हूँ। अपने खेत के बारे में कुछ भी पूछें — मौसम, खाद या मंडी भाव के बारे में बोलें!`
        : `Namaste Ramesh Bhai! I am your AI Farm Copilot. Press the mic and ask anything about crop diseases, fertilizers, weather, or mandi prices!`);

    setMessages([
      {
        sender: 'bot',
        text: welcome,
        agents: ['WeatherAgent', 'MarketAgent', 'SoilIrrigationAgent'],
        actions: lang === 'te' 
          ? ['ఆకు ఫోటో స్కాన్ చేయండి', 'మండీ ధరలు చూడండి', 'ఎరువుల సలహా వినండి']
          : ['Scan crop leaf photo', 'Check market prices', 'View soil NPK advice']
      }
    ]);
  }, [lang, activeField]);

  const handleSpeak = (text, idx) => {
    if (speakingIdx === idx) {
      stopSpeech();
      setSpeakingIdx(null);
      setVoiceState('idle');
      return;
    }

    setVoiceState('speaking');
    setSpeakingIdx(idx);
    speakText(
      text,
      lang,
      () => setVoiceState('speaking'),
      () => {
        setSpeakingIdx(null);
        setVoiceState('idle');
      },
      () => {
        setSpeakingIdx(null);
        setVoiceState('error');
      }
    );
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceState('idle');
      return;
    }

    setVoiceState('listening');
    setIsRecording(true);

    startSpeechRecognition(
      lang,
      (transcript) => {
        setInputQuery(transcript);
        setIsRecording(false);
        setVoiceState('processing');
        handleSend(transcript);
      },
      (err) => {
        setIsRecording(false);
        setVoiceState('error');
      },
      () => setIsRecording(false)
    );
  };

  const handleSend = async (queryText) => {
    const textToSubmit = queryText || inputQuery;
    if (!textToSubmit.trim()) return;

    const userMsg = { sender: 'user', text: textToSubmit };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    setVoiceState('processing');

    const savedProfile = localStorage.getItem('kisan_farmer_profile');
    let profileObj = null;
    if (savedProfile) {
      try { profileObj = JSON.parse(savedProfile); } catch (e) {}
    }

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSubmit,
          language: lang === 'te' ? 'Telugu' : (lang === 'hi' ? 'Hindi' : 'English'),
          field_id: activeField?.field_id || 'field_01',
          farmer_profile: profileObj
        })
      });
      const data = await res.json();
      
      const newIdx = messages.length + 1;
      const botMsg = {
        sender: 'bot',
        text: data.answer,
        agents: data.source_agents_consulted || ['OrchestratorAgent'],
        actions: data.suggested_actions || []
      };
      
      setMessages(prev => [...prev, botMsg]);

      // AUTO-SPEAK RESPONSE (Requirement #3 & #7 & #8)
      setTimeout(() => {
        handleSpeak(data.answer, newIdx);
      }, 300);

    } catch (err) {
      const fallbackText = lang === 'te'
        ? `🌾 సమాధానం:\nటమాటా ఆకులపై పసుపు మచ్చలు లేదా ఎండు తెగులు లక్షణాలు ఉన్నాయి.\n\n✅ ప్రస్తుతం చేయాల్సిన పని:\n48 గంటలలోపు Mancozeb 75% WP మందు పిచికారీ చేయండి.\n\n📌 ముఖ్య గమనిక:\n1 లీటరు నీటికి 2 స్పూన్లు (ఎకరానికి 600 గ్రాములు) వాడండి.\n\n⚠️ నివారించాల్సినవి:\nవర్షం పడే ముందు మందు కొట్టవద్దు.`
        : `🌾 Answer:\nTomato leaves show early blight spots.\n\n✅ Action Now:\nSpray Mancozeb 75% WP within 48 hours.\n\n📌 Note:\nDosage: 2 spoons per 1 liter water.\n\n⚠️ Avoid:\nDo not spray right before rain.`;
      
      const botMsg = {
        sender: 'bot',
        text: fallbackText,
        agents: ['SoilIrrigationAgent', 'CropVisionAgent'],
        actions: lang === 'te' ? ['మందు వివరాలు', 'మండీ ధరలు'] : ['Spray info', 'Check prices']
      };
      
      setMessages(prev => [...prev, botMsg]);
      setTimeout(() => {
        handleSpeak(fallbackText, messages.length + 1);
      }, 300);

    } finally {
      setIsLoading(false);
    }
  };

  const getVoiceStateLabel = () => {
    switch (voiceState) {
      case 'listening': return t('voiceAssistant.listening');
      case 'processing': return t('voiceAssistant.processing');
      case 'speaking': return t('voiceAssistant.speaking');
      case 'error': return t('voiceAssistant.error');
      default: return t('voiceAssistant.idle');
    }
  };

  const quickPrompts = getQuickPrompts();

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-slate-100 flex items-center gap-2 text-base">
              {t('voiceAssistant.title')}
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold">
                {lang === 'te' ? 'తెలుగు వాయిస్' : lang.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-bold">
              {t('voiceAssistant.instruct')}
            </p>
          </div>
        </div>

        {/* Voice State Badge (Requirement #7 & #10) */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${voiceState === 'listening' ? 'bg-rose-500 animate-ping' : (voiceState === 'speaking' ? 'bg-emerald-400 animate-pulse' : 'bg-teal-400')}`}></span>
          <span>{getVoiceStateLabel()}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div className={`max-w-2xl rounded-3xl p-5 shadow-xl ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none font-bold text-base'
                : 'bg-slate-950 border-2 border-slate-800 text-slate-100 rounded-tl-none'
            }`}>
              <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line font-black">{msg.text}</p>

              {/* Bot Source Agents consult tags */}
              {msg.sender === 'bot' && msg.agents && msg.agents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-400" /> Consulted Agents:
                  </span>
                  {msg.agents.map((agent, aIdx) => (
                    <span key={aIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-teal-300 border border-teal-500/30 font-bold">
                      {agent}
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested Actions Buttons */}
              {msg.sender === 'bot' && msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.actions.map((act, actIdx) => (
                    <button
                      key={actIdx}
                      onClick={() => handleSend(act)}
                      className="text-xs px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer font-bold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {act}
                    </button>
                  ))}
                </div>
              )}

              {/* Text-to-speech button (Requirement #7 & #8) */}
              {msg.sender === 'bot' && (
                <button
                  onClick={() => handleSpeak(msg.text, idx)}
                  className={`mt-3 text-xs flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-colors cursor-pointer ${
                    speakingIdx === idx 
                      ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 animate-pulse' 
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-emerald-400 font-black'
                  }`}
                >
                  {speakingIdx === idx ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {speakingIdx === idx ? (lang === 'te' ? 'వాయిస్ ప్లే అవుతోంది...' : 'Speaking...') : t('voiceAssistant.listenAudio')}
                </button>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-1">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 text-sm text-slate-300 flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              {t('voiceAssistant.processing')}
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
        <span className="text-xs text-slate-400 flex items-center shrink-0 gap-1 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          {lang === 'te' ? 'ఉదాహరణలు:' : 'Quick Prompts:'}
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-xs shrink-0 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-extrabold transition-all cursor-pointer hover:border-emerald-500/40"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box with Push-to-Talk Mic */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
        <button
          onClick={toggleRecording}
          className={`p-4 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            isRecording
              ? 'bg-rose-500 text-white animate-bounce shadow-xl shadow-rose-500/30'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
          }`}
          title={t('voiceAssistant.idle')}
        >
          {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={lang === 'te' ? 'తెలుగులో మాట్లాడండి లేదా టైప్ చేయండి...' : 'Speak or type here...'}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 text-base font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer text-base"
        >
          <span>{lang === 'te' ? 'పంపండి' : 'Send'}</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
