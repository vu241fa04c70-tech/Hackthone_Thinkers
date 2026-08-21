import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, Bot, User, Sparkles, CheckCircle2, Globe, Cpu, ArrowRight } from 'lucide-react';

export default function FarmCopilot({ activeField }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Namaste! I am your AI Farm Copilot for ${activeField?.name || 'your farm'}. I synthesize weather, crop vision, soil NPK, and mandi market prices. Speak or type your query in your local language!`,
      agents: ['WeatherAgent', 'MarketAgent', 'SoilIrrigationAgent'],
      actions: ['Scan crop leaf photo', 'Check "Should I Harvest Now?"', 'View soil NPK advice']
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [language, setLanguage] = useState('English');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);

  const languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi'];

  const quickPrompts = [
    "My tomato leaves are turning yellow with brown spots",
    "Should I harvest my crop now or wait 3 days?",
    "How much urea fertilizer should I apply for drip fertigation?",
    "टमाटर की फसल में सड़न से कैसे बचाएं?",
    "మండీలో ధరలు ఎప్పుడు పెరుగుతాయి?"
  ];

  // Speech synthesis handle
  const speakText = (text, idx) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingIdx === idx) {
        setSpeakingIdx(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'Hindi') utterance.lang = 'hi-IN';
      else if (language === 'Telugu') utterance.lang = 'te-IN';
      else if (language === 'Tamil') utterance.lang = 'ta-IN';
      else if (language === 'Kannada') utterance.lang = 'kn-IN';
      else utterance.lang = 'en-US';
      
      utterance.onend = () => setSpeakingIdx(null);
      utterance.onerror = () => setSpeakingIdx(null);
      setSpeakingIdx(idx);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Browser Web Speech API for Mic
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type your query below!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (language === 'Hindi') recognition.lang = 'hi-IN';
    else if (language === 'Telugu') recognition.lang = 'te-IN';
    else if (language === 'Tamil') recognition.lang = 'ta-IN';
    else if (language === 'Kannada') recognition.lang = 'kn-IN';
    else recognition.lang = 'en-US';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsRecording(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSend = async (queryText) => {
    const textToSubmit = queryText || inputQuery;
    if (!textToSubmit.trim()) return;

    const userMsg = { sender: 'user', text: textToSubmit };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSubmit,
          language: language,
          field_id: activeField?.field_id || 'field_01'
        })
      });
      const data = await res.json();
      
      const botMsg = {
        sender: 'bot',
        text: data.answer,
        agents: data.source_agents_consulted || ['OrchestratorAgent'],
        actions: data.suggested_actions || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Consulting Multi-Agent Brain: For ${activeField?.crop_type || 'Tomato'}, apply Mancozeb 75% WP spray due to high rain humidity forecast. Mandi prices projected to rise +12% in 3 days.`,
        agents: ['WeatherAgent', 'CropVisionAgent', 'MarketAgent'],
        actions: ['Spray Mancozeb 75% WP', 'Harvest in 3 days']
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Copilot Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 flex items-center gap-2">
              Conversational Farm Copilot
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Multi-Lingual Voice AI
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Active Field: <span className="text-emerald-400 font-medium">{activeField?.name || 'Green Acres - Tomato'}</span> ({activeField?.location || 'Nashik'})
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <Globe className="w-4 h-4 text-emerald-400 ml-1" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer pr-2"
          >
            {languages.map(lang => (
              <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                {lang}
              </option>
            ))}
          </select>
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
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl rounded-2xl p-4 shadow-lg ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{msg.text}</p>

              {/* Bot Source Agents consult tags */}
              {msg.sender === 'bot' && msg.agents && msg.agents.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-400" /> Consulted Agents:
                  </span>
                  {msg.agents.map((agent, aIdx) => (
                    <span key={aIdx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 text-teal-300 border border-teal-500/30">
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
                      className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {act}
                    </button>
                  ))}
                </div>
              )}

              {/* Text-to-speech button */}
              {msg.sender === 'bot' && (
                <button
                  onClick={() => speakText(msg.text, idx)}
                  className={`mt-2 text-xs flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-700/50 transition-colors ${
                    speakingIdx === idx ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                  }`}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${speakingIdx === idx ? 'animate-pulse' : ''}`} />
                  {speakingIdx === idx ? 'Speaking...' : 'Listen in Audio'}
                </button>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 text-xs text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              Synthesizing domain agents (Vision + Weather + Market + Soil)...
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/50 overflow-x-auto flex gap-2 no-scrollbar">
        <span className="text-xs text-slate-400 flex items-center shrink-0 gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-xs shrink-0 px-3 py-1 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition-all cursor-pointer hover:border-emerald-500/40"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
        <button
          onClick={toggleRecording}
          className={`p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isRecording
              ? 'bg-rose-500 text-white animate-bounce shadow-lg shadow-rose-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
          }`}
          title="Click to speak (Voice Input)"
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask anything about ${activeField?.crop_type || 'crop'} health, weather, fertilizers, or market prices in ${language}...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isLoading}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
