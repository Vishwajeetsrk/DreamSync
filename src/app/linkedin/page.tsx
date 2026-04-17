'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, ChevronDown, ChevronUp,
  TrendingUp, Target, Star, MessageSquare, Key, AlertCircle,
  User, Briefcase, Award, RotateCcw, ExternalLink,
  PenLine, FileText, Wrench, Building2, GraduationCap, Trophy, Sliders,
  Upload, Loader2, CheckCircle2, ArrowRight, Zap, Globe, Layout, Search, Compass, Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { validateCareerInput } from '@/lib/aiGuard';

// --- Types ---
interface HeadlineOption { text: string; focus: string; }
interface ConnectionMessage { occasion: string; message: string; }
interface Improvement { area: string; priority: 'high' | 'medium' | 'low'; action: string; }
interface LinkedInResult {
  profileScore: number;
  scoreBreakdown: { headline: number; about: number; skills: number; experience: number; completeness: number; };
  headlines: HeadlineOption[];
  about: { optimized: string; tips: string[]; };
  skills: { recommended: string[]; toRemove: string[]; reason: string; };
  connectionMessages: ConnectionMessage[];
  keyImprovements: Improvement[];
  seoKeywords: string[];
  aiAnalysisSummary: string[];
  whatToAdd: { add: string[]; improve: string[] };
  freeResources: { label: string; links: { title: string; url: string; platform: string }[] }[];
  groupedSkills: { category: string; items: string[] }[];
}

// --- Copy Button ---
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-stone-100 hover:border-blue-200 text-stone-500 hover:text-blue-600 shadow-sm'}`}>
      {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
    </button>
  );
}

// --- Score Ring ---
function ScoreRing({ score, label, max = 100 }: { score: number; label: string; max?: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  const r = 28; const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#f5f5f4" strokeWidth="5" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-stone-800">{score}<span className="text-[9px] text-stone-400">/{max}</span></span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">{label}</span>
    </div>
  );
}

// --- Collapsible Section ---
function Section({ title, icon: Icon, badge, children, defaultOpen = false }: { title: string; icon: any; badge?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between p-8 hover:bg-stone-50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Icon className="w-5 h-5" /></div>
          <div className="text-left">
             <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">{title}</h3>
             {badge && <span className="inline-block mt-1 px-3 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-widest">{badge}</span>}
          </div>
        </div>
        {open ? <ChevronUp className="w-6 h-6 text-stone-300" /> : <ChevronDown className="w-6 h-6 text-stone-300" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="p-10 pt-0 border-t border-stone-50">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main Page ---
export default function LinkedInOptimizer() {
  const [form, setForm] = useState({
    targetRole: '',
    currentRole: '',
    currentHeadline: '',
    currentAbout: '',
    skills: '',
    experience: '',
    education: '',
    achievements: '',
    tone: 'professional' as 'professional' | 'creative' | 'technical' | 'friendly',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [error, setError] = useState('');
  const [selectedHeadline, setSelectedHeadline] = useState(0);

  const setK = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImportResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/resume-parse', { method: 'POST', body: formData });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setForm({
        targetRole: d.personalInfo?.role || '',
        currentRole: d.experience?.[0]?.role || '',
        currentHeadline: `${d.personalInfo?.role} | ${d.skills?.map((s:any) => s.items).slice(0,3).join(' | ')}`,
        currentAbout: d.summary || '',
        skills: d.skills?.map((s:any) => s.items).join(', ') || '',
        experience: d.experience?.map((e:any) => `${e.role} @ ${e.company} - ${e.bullets[0]}`).join('\n') || '',
        education: d.education?.[0]?.school || '',
        achievements: d.achievements?.join(', ') || '',
        tone: 'professional'
      });
    } catch (err: any) {
      setError("Parsing failed: " + err.message);
    } finally { setIsParsing(false); }
  };

  const handleGenerate = async () => {
    if (!form.targetRole.trim()) { setError('Please enter your target role.'); return; }
    
    const safetyInput = `${form.targetRole} ${form.currentAbout}`;
    const safety = validateCareerInput(safetyInput);
    if (!safety.allowed) { setError(safety.message); return; }

    setIsGenerating(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-24">
      
      <div className="pt-32 max-w-6xl mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-widest mb-2">
              <Star className="w-4 h-4" /> Profile Enhancement
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Get noticed by <span className="text-blue-600">recruiters.</span>
           </h1>
           <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
              Tell your professional story with confidence. We help you optimize your LinkedIn profile for maximum impact and visibility.
           </p>
        </div>

        {/* Form area */}
        {!result && (
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-stone-100 space-y-12">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-stone-50">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-blue-600 rounded-[1.5rem] shadow-lg shadow-blue-500/20 text-white"><User className="w-8 h-8" /></div>
                 <div className="text-left">
                    <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Profile Details</h2>
                    <p className="text-stone-400 font-medium">Auto-fill with resume or enter manually.</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <label className="flex items-center justify-center gap-2 px-6 py-4 bg-stone-50 text-stone-600 font-bold rounded-2xl cursor-pointer hover:bg-stone-100 transition-all border border-stone-100 shadow-sm text-sm">
                    {isParsing ? <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> : <Upload className="w-4 h-4 text-blue-600" />}
                    {isParsing ? "Reading..." : "Upload Resume"}
                    <input type="file" hidden accept=".pdf" onChange={handleImportResume} />
                 </label>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Target Role <span className="text-rose-500">*</span></label>
                <input value={form.targetRole} onChange={setK('targetRole')} className="input-field" placeholder="e.g. Sales Executive, Data Entry, IT Support" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Current Role</label>
                <input value={form.currentRole} onChange={setK('currentRole')} className="input-field" placeholder="e.g. Student at DTU" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Current Headline</label>
                <input value={form.currentHeadline} onChange={setK('currentHeadline')} className="input-field" placeholder="e.g. Student | Python Enthusiast | Hardworking" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">About Section</label>
                <textarea value={form.currentAbout} onChange={setK('currentAbout')} className="input-field min-h-[140px]" placeholder="Paste your current LinkedIn bio here..." />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Experience (Work/Internships)</label>
                <textarea value={form.experience} onChange={setK('experience')} className="input-field min-h-[100px]" placeholder="Tell us what you did at your last role..." />
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Choose a tone</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['professional', 'technical', 'creative', 'friendly'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, tone: t }))}
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${form.tone === t ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm' : 'border-stone-50 bg-white hover:border-stone-100 text-stone-400'}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
           </div>

           {error && <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-bold text-sm flex items-center gap-3"><AlertCircle className="w-5 h-5" /> {error}</div>}

           <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary w-full !py-6 text-xl shadow-2xl flex items-center justify-center gap-4">
              {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing profile...</> : <><Sparkles className="w-6 h-6" /> Optimize My Profile</>}
           </button>
        </div>
        )}

        {/* RESULTS area */}
        {result && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
           
           {/* Analysis Header Card */}
           <div className="bg-stone-900 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10"><Zap className="w-32 h-32" /></div>
              <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
                 <div className="md:col-span-4 text-center space-y-4">
                    <div className="text-7xl font-extrabold text-blue-400">{result.profileScore}</div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Profile Optimization Score</div>
                    <div className={`px-4 py-1.5 rounded-full inline-block text-[10px] font-bold uppercase tracking-widest border ${result.profileScore >= 70 ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-400' : 'bg-amber-500/20 border-amber-400/30 text-amber-400'}`}>
                       {result.profileScore >= 70 ? '🌟 Industry Standard' : '🛠 Room to grow'}
                    </div>
                 </div>
                 <div className="md:col-span-8 space-y-8">
                    <div className="space-y-2">
                       <h2 className="text-3xl font-extrabold tracking-tight">Optimization Report</h2>
                       <p className="text-stone-400 font-medium">We&apos;ve analyzed your profile against 2026 hiring trends.</p>
                    </div>
                    <div className="flex flex-wrap gap-8 justify-start">
                       {Object.entries(result.scoreBreakdown).map(([k, v]) => (
                         <div key={k} className="flex flex-col items-center gap-2">
                            <div className="text-xl font-bold">{v}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">{k}</div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Action Plan */}
           <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-stone-100 shadow-sm space-y-10">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-amber-50 rounded-2xl"><Target className="w-8 h-8 text-amber-600" /></div>
                 <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">Immediate Actions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {result.keyImprovements?.map((item, i) => (
                   <div key={i} className={`p-6 rounded-[2rem] border transition-all flex items-start gap-4 ${item.priority === 'high' ? 'bg-rose-50/50 border-rose-100' : 'bg-stone-50 border-stone-100'}`}>
                      <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 ${item.priority === 'high' ? 'bg-rose-500' : 'bg-stone-300'}`} />
                      <div className="space-y-1">
                         <p className="text-stone-800 font-bold leading-tight">{item.area}</p>
                         <p className="text-xs font-medium text-stone-500 leading-relaxed">{item.action}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Detailed Sections */}
           <div className="space-y-8">
              <Section title="Headline Variants" icon={PenLine} badge="3 Options" defaultOpen>
                 <div className="grid grid-cols-1 gap-4 pt-4">
                    {result.headlines?.map((h, i) => (
                      <div key={i} onClick={() => setSelectedHeadline(i)} className={`group relative p-8 rounded-[2rem] border transition-all text-left ${selectedHeadline === i ? 'border-blue-500 bg-blue-50/20' : 'border-stone-100 bg-white hover:border-blue-100'}`}>
                         <div className="flex justify-between items-start gap-10">
                            <div className="space-y-2">
                               <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest opacity-60">Focus: {h.focus}</div>
                               <p className="text-lg font-bold text-stone-800 leading-tight">{h.text}</p>
                            </div>
                            <div className="shrink-0"><CopyButton text={h.text} /></div>
                         </div>
                         {selectedHeadline === i && <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />}
                      </div>
                    ))}
                 </div>
              </Section>

              <Section title="Optimized Bio (About)" icon={MessageSquare} defaultOpen>
                 <div className="space-y-8 pt-4">
                    <div className="relative group p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100 min-h-[200px]">
                       <pre className="whitespace-pre-wrap font-sans text-stone-700 font-medium leading-relaxed">{result.about?.optimized}</pre>
                       <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyButton text={result.about?.optimized || ''} />
                       </div>
                    </div>
                    <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50 space-y-6">
                       <h4 className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" /> Advice for your Bio
                       </h4>
                       <div className="grid md:grid-cols-2 gap-4">
                          {result.about.tips.map((tip, i) => (
                            <div key={i} className="flex gap-3 text-sm font-bold text-stone-500">
                               <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> {tip}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </Section>

              <Section title="Search Keywords & Skills" icon={TrendingUp}>
                 <div className="space-y-10 pt-4">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                          <Search className="w-3.5 h-3.5" /> High-Traffic Keywords
                       </h4>
                       <div className="flex flex-wrap gap-2">
                          {result.seoKeywords?.map((k, i) => (
                            <span key={i} className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 font-bold text-xs">#{k}</span>
                          ))}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {result.groupedSkills?.map((group, idx) => (
                         <div key={idx} className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100 space-y-4">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">{group.category}</h4>
                            <div className="flex flex-wrap gap-2">
                               {group.items.map((item, i) => (
                                 <span key={i} className="px-3 py-1.5 bg-white border border-stone-100 rounded-xl text-[10px] font-bold text-stone-600 shadow-sm">{item}</span>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </Section>

              <Section title="Next steps for growth" icon={Award}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {result.freeResources?.map((res, i) => (
                      <div key={i} className="bg-white rounded-[2rem] border border-stone-100 p-8 space-y-6 shadow-sm">
                         <h4 className="text-xl font-bold text-stone-900 border-b border-stone-50 pb-4">{res.label}</h4>
                         <div className="space-y-3">
                            {res.links.map((l, li) => (
                              <Link key={li} href={l.url} target="_blank" className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl font-bold text-xs text-stone-600 hover:bg-stone-100 hover:text-blue-600 transition-all border border-transparent hover:border-stone-200">
                                 {l.title} <ExternalLink className="w-4 h-4" />
                              </Link>
                            ))}
                         </div>
                      </div>
                    ))}
                    <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-center items-center text-center gap-6 shadow-xl">
                       <div className="p-4 bg-white/20 rounded-[1.5rem]"><Globe className="w-10 h-10" /></div>
                       <div className="space-y-2">
                          <h4 className="text-2xl font-bold tracking-tight">Ready for work</h4>
                          <p className="text-stone-300 font-medium">Your profile now meets the 2026 industry standards for professional readiness.</p>
                       </div>
                       <button onClick={() => { setResult(null); window.scrollTo({top:0, behavior:'smooth'}); }} className="w-full py-4 bg-white text-blue-600 font-extrabold rounded-2xl hover:bg-blue-50 transition-all text-sm">
                          Start Over
                       </button>
                    </div>
                 </div>
              </Section>
           </div>
        </motion.div>
        )}
      </div>
    </div>
  );
}
