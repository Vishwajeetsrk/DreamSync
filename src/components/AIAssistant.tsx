'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Sparkles, HelpCircle, Search, Menu, ExternalLink, ArrowRight, User, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  links?: { platform: string; url: string; label: string }[];
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your DreamSync Guide. 🌸 I can help you find jobs, build a resume, or just chat about your future. What's on your mind today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/career-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMsg }],
          context: 'Support Mode: Be empathetic, helpful, and guide user to Resume, Roadmap, or Ikigai tools.'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply,
        links: data.jobLinks || []
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having a little trouble connecting. Could you please try again in a moment?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(37,99,235,0.3)] flex items-center justify-center z-[9998] hover:bg-blue-700 transition-all group"
      >
        <div className="relative">
          <MessageSquare className={`w-8 h-8 transition-all duration-300 ${isOpen ? 'rotate-90 scale-0' : 'scale-100'}`} />
          <X className={`w-8 h-8 absolute top-0 left-0 transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-0 -rotate-90'}`} />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-0 md:bottom-24 right-0 md:right-6 w-full md:w-[420px] h-[100dvh] md:h-[680px] bg-white shadow-2xl z-[9999] flex flex-col md:rounded-[2.5rem] border border-stone-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-stone-50/50 p-6 flex items-center justify-between border-b border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 tracking-tight">Career Guide</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Always here to help</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2.5 bg-white rounded-xl border border-stone-100 text-stone-400 hover:text-stone-600 shadow-sm transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-white scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                   {/* Avatar/Name */}
                   <div className="flex items-center gap-2 mb-2 px-1">
                      {msg.role === 'assistant' && <div className="p-1 bg-blue-50 rounded-lg"><Sparkles className="w-3 h-3 text-blue-600" /></div>}
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.1em]">
                        {msg.role === 'user' ? 'You' : 'DreamSync Guide'}
                      </span>
                      {msg.role === 'user' && <div className="p-1 bg-stone-50 rounded-lg"><User className="w-3 h-3 text-stone-400" /></div>}
                   </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] p-5 rounded-[1.75rem] text-[14px] font-medium leading-relaxed whitespace-pre-wrap shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                        : 'bg-stone-50 text-stone-700 border-stone-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content.split('\n').map((line, li) => {
                      const cleanLine = line.trim().replace(/\*\*/g, '').replace(/###/g, '');
                      if (!cleanLine) return <div key={li} className="h-4" />;

                      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                        return (
                          <div key={li} className="flex gap-3 mb-2 px-1">
                            <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-white/40' : 'bg-blue-400'}`} />
                            <span className="text-[14px]">{cleanLine.replace(/^-/, '').replace(/^\*/, '').trim()}</span>
                          </div>
                        );
                      }
                      
                      if (line.includes('###') || (line.startsWith('**') && line.endsWith('**'))) {
                        return (
                          <div key={li} className={`text-[12px] font-bold uppercase tracking-widest mt-6 mb-2 flex items-center gap-2 ${msg.role === 'user' ? 'text-white/80' : 'text-stone-400'}`}>
                             {cleanLine}
                          </div>
                        );
                      }

                      return <div key={li} className="mb-1">{cleanLine}</div>;
                    })}

                    {/* Links */}
                    {msg.role === 'assistant' && msg.links && msg.links.length > 0 && (
                      <div className="mt-6 flex flex-col gap-2">
                         {msg.links.map((link, li) => (
                            <Link key={li} href={link.url} target="_blank" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 text-xs font-bold text-blue-600 hover:border-blue-200 shadow-sm group">
                               {link.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                         ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start px-2">
                  <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-6 py-4 flex gap-3 overflow-x-auto bg-stone-50/30 border-t border-stone-50 scrollbar-hide">
               {['Find my Ikigai', 'Improve Resume', 'Build Portfolio', 'Job Sites'].map((txt) => (
                  <button key={txt} onClick={() => setInput(txt)} className="whitespace-nowrap px-4 py-2 bg-white border border-stone-100 text-stone-500 text-[11px] font-bold rounded-full hover:border-blue-200 hover:text-blue-600 shadow-sm transition-all active:scale-95">
                    {txt}
                  </button>
                ))}
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-white border-t border-stone-100">
              <div className="relative flex items-center bg-stone-50 rounded-2xl border border-stone-100 p-1 focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for advice..."
                  className="w-full bg-transparent p-4 pr-14 text-stone-800 text-[14px] font-medium placeholder:text-stone-300 focus:outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-1 w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-30 shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
