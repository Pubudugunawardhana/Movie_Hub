import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, X, Send, Film, Loader2, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hi! 🎬 I'm your Movie Hub AI Assistant. Ask me anything — movie recommendations, genres, actors, or what's trending. I know every movie on this platform!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Build history excluding the first greeting message
      const history = messages.slice(1).map(m => ({ role: m.role, text: m.text }));

      const res = await axios.post('http://localhost:5000/api/chatbot', {
        message: userMessage,
        history
      });

      setMessages(prev => [...prev, { role: 'model', text: res.data.reply }]);
    } catch (err) {
      const status = err.response?.status;
      const errorMsg = status === 429
        ? "⏳ AI is busy right now (rate limited). Please wait 1 minute and try again!"
        : "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Suggest a good action movie 🎬",
    "What Tamil movies are available? 🎭",
    "Best horror movies? 👻",
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-gray-700 rotate-0'
            : 'bg-gradient-to-br from-[#E50914] to-red-700 shadow-[0_0_25px_rgba(229,9,20,0.5)]'
        }`}
        aria-label="Open Movie AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-7 h-7 text-white" />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-[200] w-[360px] max-h-[600px] flex flex-col rounded-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#0f0f0f]/95 backdrop-blur-xl transition-all duration-300 origin-bottom-right ${
        isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
      }`}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-gradient-to-r from-[#E50914]/20 to-transparent rounded-t-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E50914] to-red-800 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Movie Hub AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">Online & Ready</span>
            </div>
          </div>
          <div className="ml-auto">
            <Film className="w-5 h-5 text-[#E50914]/60" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide" style={{ maxHeight: '380px' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E50914] to-red-800 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#E50914] text-white rounded-br-sm'
                  : 'bg-white/10 text-gray-100 rounded-bl-sm border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E50914] to-red-800 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#E50914] animate-spin" />
                <span className="text-gray-400 text-sm">Thinking...</span>
              </div>
            </div>
          )}

          {/* Suggested Questions - shown only at start */}
          {messages.length === 1 && !loading && (
            <div className="space-y-2 mt-2">
              <p className="text-gray-500 text-xs px-1">Try asking:</p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="w-full text-left text-xs text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E50914]/30 px-3 py-2 rounded-xl transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#E50914]/50 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about movies..."
              rows={1}
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 resize-none focus:outline-none max-h-24"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-[#E50914] hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-gray-600 text-[10px] mt-2">Powered by Google Gemini AI</p>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
