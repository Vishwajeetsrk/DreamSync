'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Sparkles, TrendingUp, MapPin,
  ExternalLink, Briefcase, ChevronRight, RotateCcw,
  IndianRupee, Building2, Zap, MessageSquare, BookOpen, Globe, Search, ArrowRight, Loader2, User, Star
} from 'lucide-react';
import CareerPathCard from '@/components/CareerPathCard';
import { graphicDesignPath } from '@/data/careerPaths';
import { validateCareerInput } from '@/lib/aiGuard';

// --- Types ---
interface Role {
  title: string;
  salary: string;
  demand: 'High' | 'Medium' | 'Low';
  skills: string[];
  companies: string[];
}

interface RoadmapNode {
  id: number;
  label: string;
  sublabel: string;
  next: number[];
}

interface JobLink {
  platform: string;
  url: string;
  label: string;
  summary?: string;
}

interface AgentResponse {
  reply: string;
  roles: Role[];
  roadmapNodes: RoadmapNode[];
  jobLinks: JobLink[];
  quickTips: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: AgentResponse;
}

const suggestions = [
  "Improve My LinkedIn",
  "Check Resume Score",
  "Higher Salary Roles",
  "Career Roadmap 2026"
];

// --- Flowchart ---
function Flowchart({ nodes }: { nodes: RoadmapNode[] }) {
  if (!nodes || nodes.length === 0) return null;
  const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="bg-white border border-stone-100 rounded-[2rem] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="font-extrabold text-stone-900 tracking-tight uppercase text-xs tracking-[0.2em]">Visual Progression</h3>
      </div>
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-start gap-0 min-w-max px-2">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center w-[140px]">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg border-4 border-white ${colors[i % colors.length]}`}>
                   {i + 1}
                </div>
                <div className="mt-4 text-center">
                   <p className="text-xs font-extrabold text-stone-800 leading-tight">{node.label}</p>
                   <p className="text-[10px] font-bold text-stone-400 mt-1 uppercase tracking-wider">{node.sublabel}</p>
                </div>
              </motion.div>
              {i < nodes.length - 1 && (
                <div className="flex items-center mb-10 mx-2">
                   <div className="w-8 h-0.5 bg-stone-100" />
                   <ChevronRight className="w-4 h-4 -ml-1 text-stone-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Role Card ---
function RoleCard({ role }: { role: Role }) {
  return (
    <div className="bg-white border border-stone-100 p-6 rounded-[1.75rem] space-y-4 hover:border-blue-100 shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-extrabold text-lg text-stone-800 leading-tight group-hover:text-blue-600 transition-colors">{role.title}</h4>
        <span className="px-2 py-1 text-[9px] font-bold bg-stone-50 border border-stone-100 text-stone-400 rounded-lg uppercase tracking-widest">
          {role.demand} Demand
        </span>
      </div>
      <div className="flex items-center gap-2 text-md font-extrabold text-emerald-600">
        <IndianRupee className="w-4 h-4" /> {role.salary}
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {role.skills.slice(0, 3).map(s => (
          <span key={s} className="px-2 py-1 bg-stone-50 border border-stone-100 text-stone-400 text-[9px] font-bold uppercase rounded-lg">{s}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold border-t border-stone-50 pt-4 uppercase tracking-tight">
         <Building2 className="w-3.5 h-3.5 opacity-40" />
         {role.companies.slice(0, 3).join(' · ')}
      </div>
    </div>
  );
}

// --- Chat Bubble ---
function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-2`}>
      <div className="flex items-center gap-2 px-1">
          {msg.role === 'assistant' && <div className="p-1 bg-blue-50 rounded-lg"><Brain className="w-3 h-3 text-blue-600" /></div>}
          <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">{isUser ? 'You' : 'Guide'}</span>
          {isUser && <div className="p-1 bg-stone-50 rounded-lg"><User className="w-3 h-3 text-stone-400" /></div>}
      </div>

      <div className="max-w-[85%] space-y-6">
        <div className={`p-6 md:p-8 rounded-[2rem] text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap shadow-sm border ${
          isUser 
            ? 'bg-stone-900 text-white border-stone-800 rounded-tr-none' 
            : 'bg-white text-stone-700 border-stone-100 rounded-tl-none'
        }`}>
            {isUser ? msg.content : (
              <div className="space-y-8">
                {(msg.data?.reply || msg.content).split('###').map((section, si) => {
                  if (si === 0 && section.trim()) return <p key={si}>{section.trim()}</p>;
                  if (!section.trim()) return null;

                  const lines = section.trim().split('\n');
                  const rawTitle = lines[0].trim();
                  const cleanedTitle = rawTitle.replace(/\*\*/g, '').replace(/###/g, '');
                  const bodyLines = lines.slice(1);

                  return (
                    <div key={si} className="space-y-4 pt-8 border-t border-stone-50 mt-8 first:mt-0 first:border-0 first:pt-0">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                         <div className="p-1.5 bg-blue-50 rounded-lg">
                           <TrendingUp className="w-4 h-4" />
                         </div>
                         {cleanedTitle}
                      </h3>
                      <div className="space-y-4">
                         {bodyLines.map((line, li) => {
                           const cleanLine = line.trim().replace(/\*\*/g, '');
                           if (!cleanLine) return <div key={li} className="h-2" />;
                           
                           if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
                             return (
                               <div key={li} className="flex gap-4 p-4 bg-stone-50 border border-stone-100 rounded-2xl shadow-sm">
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                                 <span className="text-stone-700 font-medium">{cleanLine.replace(/^-/, '').replace(/^\*/, '').trim()}</span>
                               </div>
                             );
                           }
                           return <p key={li}>{cleanLine}</p>;
                         })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        {!isUser && msg.data && (
          <div className="space-y-10">
            {msg.data.roadmapNodes?.length > 0 && <Flowchart nodes={msg.data.roadmapNodes} />}
            {msg.data.roles?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 pl-2">Node Suggestions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {msg.data.roles.map((r, i) => <RoleCard key={i} role={r} />)}
                </div>
              </div>
            )}
            {msg.data.quickTips?.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2rem] shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700 mb-6 flex items-center gap-2">
                   <Zap className="w-4 h-4" /> Growth Intelligence
                </p>
                <ul className="space-y-4">
                  {msg.data.quickTips.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-900 font-bold flex gap-3">
                       <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {msg.data.jobLinks?.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 pl-2">Live Portals</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {msg.data.jobLinks.map((j, i) => (
                    <a key={i} href={j.url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-white border border-stone-100 rounded-[1.75rem] hover:border-blue-200 shadow-sm group">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">{j.platform}</span>
                          <ExternalLink className="w-4 h-4 text-stone-300 group-hover:text-blue-600 transition-colors" />
                       </div>
                       <h5 className="font-extrabold text-stone-800 text-base mb-1 group-hover:text-blue-600 transition-colors">{j.label}</h5>
                       {j.summary && <p className="text-[10px] font-medium text-stone-400">{j.summary}</p>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

// --- Main Page ---
export default function CareerAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const safety = validateCareerInput(userText);
    if (!safety.allowed) {
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: userText },
        { 
          role: 'assistant', 
          content: `🌸 I want to help you, but I need to keep our conversation focused on careers and professional growth. ${safety.message}` 
        }
      ]);
      setInput('');
      return;
    }

    const userMsg: Message = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.role === 'user' ? m.content : (m.data?.reply || m.content),
      }));

      const res = await fetch('/api/career-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data: AgentResponse = await res.json();
      if (!res.ok) throw new Error((data as any).error || 'Failed');

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        data,
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'm sorry, I'm having a little trouble connecting. Could you please try again?`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 text-stone-900 selection:bg-blue-100 pt-24 pb-48">
      
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                <Brain className="w-8 h-8" />
             </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-stone-400">Personal career guide</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight">AI Job Guide</h1>
              </div>
          </div>
          <p className="text-lg font-medium text-stone-500 max-w-2xl">
            Ask me anything about job hunting, salaries, or skills. I'm here to help you build your future, step by step.
          </p>
        </header>

        {/* Main Interface Area */}
        <div className="space-y-12">
           {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 bg-white rounded-[3rem] border border-stone-100 shadow-sm p-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                   <Sparkles className="w-8 h-8" />
                </div>
                 <div className="space-y-4">
                    <h2 className="text-2xl font-extrabold text-stone-800 tracking-tight">How can I help you grow today?</h2>
                    <p className="text-stone-400 font-medium max-w-sm mx-auto">Explore salary info, get job suggestions, or build your 2026 roadmap with me.</p>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg px-2">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s)} className="p-5 bg-stone-50 border border-stone-100 rounded-2xl text-xs font-bold text-stone-600 hover:border-blue-200 hover:text-blue-600 transition-all text-center shadow-sm">
                        {s}
                      </button>
                    ))}
                 </div>
             </div>
           ) : (
             <div className="space-y-12 min-h-[400px]">
                {messages.map((msg, i) => (
                  <ChatBubble key={i} msg={msg} />
                ))}
                {loading && (
                  <div className="flex gap-4">
                     <div className="w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center">
                        <Brain className="w-5 h-5" />
                     </div>
                     <div className="bg-white border border-stone-100 p-6 rounded-[1.75rem] shadow-sm flex items-center gap-4">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        <p className="text-sm font-bold text-stone-400 animate-pulse uppercase tracking-widest">Searching 2026 Job Data...</p>
                     </div>
                  </div>
                )}
                <div ref={bottomRef} />
             </div>
           )}
        </div>

        {/* Featured Section */}
        {messages.length === 0 && (
          <div className="space-y-8 pt-10 border-t border-stone-100">
             <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-amber-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">Popular Career Path</p>
             </div>
             <CareerPathCard path={graphicDesignPath} />
          </div>
        )}
      </div>

      {/* Input Architecture */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 no-print">
         <div className="bg-white border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 rounded-[2.5rem] flex items-end gap-2 group focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your future..."
              className="flex-1 p-6 text-base font-medium rounded-[2rem] resize-none focus:outline-none bg-transparent placeholder:text-stone-300 min-h-[72px]"
              disabled={loading}
              rows={1}
            />
            <div className="flex gap-2 p-2">
              {messages.length > 0 && (
                <button onClick={() => setMessages([])} className="p-4 bg-stone-50 border border-stone-100 text-stone-400 rounded-2xl hover:bg-stone-100 transition-all">
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="p-5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-30"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
