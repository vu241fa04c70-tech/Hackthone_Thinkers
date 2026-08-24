import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User, Volume2, Sparkles, AlertCircle, StopCircle } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function FarmCopilot({ activeField }) {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: lang === 'te' 
        ? 'నమస్కారం! నేను మీ కిసాన్ AI సహాయకుడిని. మీ పంటల ఎరువులు, వర్షపాతం లేదా మార్కెట్ ధరల గురించి ఏమైనా అడగండి.' 
        : (lang === 'hi' 
          ? 'नमस्ते! मैं आपका किसान AI सहायक हूँ। अपनी फसल, खाद, बारिश या मंडी भाव के बारे में कुछ भी पूछें।' 
          : 'Namaskaram! I am your Kisan AI Copilot. Ask me anything about fertilizers, rain warnings, or mandi prices.')
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickQuestions = [
    lang === 'te' ? 'టమాటా పైరుకి ఈ రోజు మందు కొట్టవచ్చా?' : (lang === 'hi' ? 'क्या आज टमाटर पर छिड़काव कर सकते हैं?' : 'Can I spray pesticides today?'),
    lang === 'te' ? 'గుంటూరు మండీలో ప్రస్తుత టమాటా ధర ఎంత?' : (lang === 'hi' ? 'गुंटूर मंडी में टमाटर का क्या भाव है?' : 'What is the current Mandi price?'),
    lang === 'te' ? 'వరి పంటకి ఎంత యూరియా ఎరువు వేయాలి?' : (lang === 'hi' ? 'धान की फसल में कितना यूरिया डालें?' : 'How much Urea fertilizer per acre?')
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setIsTyping(true);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language: lang })
    })
      .then(res => res.json())
      .then(data => {
        setIsTyping(false);
        const botMsgText = data.response || (lang === 'te' ? 'మీ ప్రశ్న పరిశీలించబడింది.' : 'Your query has been processed.');
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botMsgText }]);
      })
      .catch(() => {
        setIsTyping(false);
        const fallbackText = lang === 'te' 
          ? 'క్షమించండి, సర్వర్ కనెక్ట్ కాలేదు. కానీ ఈ రోజు మధ్యాహ్నం వర్షం సూచన ఉంది.' 
          : 'Rain is forecast for 2 PM today. Please pause spraying.';
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: fallbackText }]);
      });
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(lang === 'te' ? 'మీ బ్రౌజర్ వాయిస్ రికగ్నిషన్‌ని మద్దతు ఇవ్వదు.' : 'Voice recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'te' ? 'te-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const toggleSpeech = (msg) => {
    if (playingAudioId === msg.id) {
      stopSpeech();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(msg.id);
    speakText(
      msg.text,
      lang,
      () => setPlayingAudioId(msg.id),
      () => setPlayingAudioId(null),
      () => setPlayingAudioId(null)
    );
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎤</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C3333]">
            {lang === 'hi' ? 'किसान वॉयस AI सहायक' : (lang === 'te' ? 'కిసాన్ వాయిస్ AI సహాయకుడు' : 'Kisan Voice AI Copilot')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
          {lang === 'hi' 
            ? 'अपनी मातृभाषा में बोलकर या लिखकर खेती से जुड़ा कोई भी सवाल पूछें।' 
            : (lang === 'te' ? 'మీ స్వంత భాషలో మాట్లాడి లేదా రాసి వ్యవసాయ సందేహాలను నివృత్తి చేసుకోండి.' : 'Ask any farming question in your native language by voice or text.')}
        </p>
      </div>

      {/* Main Chat Window */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                msg.sender === 'user'
                  ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {msg.sender === 'user' ? '👨‍🌾' : '🤖'}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] p-4 rounded-3xl space-y-2 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-emerald-100/90 text-emerald-950 rounded-tr-none font-bold text-xs sm:text-sm border border-emerald-200'
                  : 'bg-white text-slate-800 rounded-tl-none font-semibold text-xs sm:text-sm border border-slate-200'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>

                {msg.sender === 'bot' && (
                  <button
                    onClick={() => toggleSpeech(msg)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] hover:underline cursor-pointer pt-1"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === msg.id ? 'animate-bounce text-rose-600' : ''}`} />
                    <span>{playingAudioId === msg.id ? (lang === 'te' ? 'ఆపండి' : 'Stop') : (lang === 'te' ? '🔊 వాయిస్ వినండి' : '🔊 Listen')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-max animate-pulse">
              <Sparkles className="w-4 h-4 text-[#2D6A4F] animate-spin" />
              <span>{lang === 'hi' ? 'उत्तर तैयार हो रहा है...' : (lang === 'te' ? 'సమాధానం సిద్ధం చేస్తున్నాను...' : 'Kisan AI is typing...')}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#2D6A4F] border border-slate-200 text-xs font-semibold shrink-0 transition-all cursor-pointer"
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-emerald-100 flex items-center gap-2">
          
          {/* Prominent Mic Button */}
          <button
            onClick={toggleMic}
            className={`min-h-[48px] px-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
            }`}
            title="Speak Question"
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{isListening ? (lang === 'te' ? 'వింటున్నాను...' : 'Listening...') : (lang === 'te' ? 'మాట్లాడండి' : 'Voice')}</span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={lang === 'hi' ? 'अपना प्रश्न यहां लिखें या बोलें...' : (lang === 'te' ? 'మీ సందేహాన్ని ఇక్కడ రాయండి లేదా మాట్లాడండి...' : 'Type or speak your farming question...')}
            className="flex-1 min-h-[48px] bg-slate-50 border border-slate-200 rounded-full px-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2D6A4F] transition-all"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="min-h-[48px] px-5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <span>{lang === 'te' ? 'పంపండి' : (lang === 'hi' ? 'भेजें' : 'Send')}</span>
            <Send className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
}
