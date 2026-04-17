'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download, 
  ExternalLink, ChevronDown, ChevronUp, Briefcase, BarChart3, Globe, 
  Printer, FileDown, Zap, ShieldCheck, ArrowRight, TrendingUp, Search, Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface CompanyResult {
  company: string;
  eligibility: 'Eligible' | 'Partially Eligible' | 'Not Eligible';
  score: number;
  reasons: string[];
  missing_skills: string[];
  suggestions: string[];
}

interface AnalysisResult {
  ats_score: number;
  keyword_match: number;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  improvement_suggestions: string[];
  company_eligibility: CompanyResult[];
  improved_resume_markdown: string;
  _provider?: string;
}

export default function AdvancedATS() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File is too large (max 5MB)');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const analyzeResume = async () => {
    if (!file || !jobRole) {
      setError('Please upload a resume and enter a job role.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobRole', jobRole);
    formData.append('jobDescription', jobDescription);
    formData.append('experienceLevel', experienceLevel);

    try {
      const res = await fetch('/api/ats-advanced', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Check failed');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Partially Eligible': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Not Eligible': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      
      <div className="pt-32 max-w-7xl mx-auto px-6">
        
        {/* Friendly Header */}
        <div className="text-center space-y-4 mb-20">
           <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-widest mb-4">
              <Zap className="w-4 h-4" /> AI-Powered Resume Scoring
           </div>
           <h1 className="text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight">
              Resume <span className="text-blue-600">Score Check</span>
           </h1>
           <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
              Check if your resume is ready for the jobs you want. We&apos;ll tell you how companies see your profile.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Input Panel */}
          <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-stone-100 space-y-10">
            <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-3">
              <Upload className="w-6 h-6 text-blue-600" /> Let&apos;s get started
            </h2>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-400 ml-1 uppercase tracking-widest">1. Upload your resume (PDF)</label>
                <div className="relative group">
                  <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className={`p-10 rounded-3xl border-2 border-dashed transition-all ${file ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-200 bg-stone-50/30 hover:border-blue-300'}`}>
                    <div className="flex flex-col items-center justify-center">
                      <div className={`p-4 rounded-2xl mb-4 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-stone-400'}`}>
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="text-base font-bold text-stone-800">
                        {file ? file.name : 'Choose or drop your PDF'}
                      </p>
                      <p className="text-xs text-stone-400 mt-2 font-medium">PDF only · Max 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-400 ml-1 uppercase tracking-widest">2. What job are you targeting?</label>
                <input type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="e.g. Sales Executive, Web Developer..." className="input-field" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-stone-400 ml-1 uppercase tracking-widest">3. Your Experience</label>
                  <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="input-field appearance-none">
                    <option>Fresher</option>
                    <option>1-3 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years</option>
                  </select>
                </div>
                <button onClick={analyzeResume} disabled={loading || !file || !jobRole} className="btn-primary !py-4 shadow-xl">
                  {loading ? <div className="flex items-center gap-2"><Loader2 className="animate-spin w-5 h-5" /> Checking...</div> : 'Check my score'}
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-stone-50">
                <label className="text-sm font-bold text-stone-400 ml-1 uppercase tracking-widest">Bonus: Paste job description (Optional)</label>
                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job requirements here for a more precise check..." rows={4} className="input-field min-h-[120px] text-sm" />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-50 text-rose-600 p-5 rounded-2xl border border-rose-100 flex gap-4 items-center">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Right: Analysis Output */}
          <div className="space-y-8">
            {!result && !loading && (
              <div className="h-full bg-stone-100/50 rounded-[2.5rem] border-2 border-dashed border-stone-200 p-20 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-white rounded-3xl mb-6 shadow-sm">
                   <BarChart3 className="w-12 h-12 text-stone-300" />
                </div>
                <p className="text-xl font-bold text-stone-400 tracking-tight">Your score will appear here</p>
                <p className="text-sm text-stone-400 mt-2 font-medium">Complete the form to evaluate your profile</p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 mb-10">
                   <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20" />
                   <Loader2 className="w-20 h-20 animate-spin text-blue-600 relative z-10" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800 mb-3">Analyzing your resume...</h2>
                <p className="text-stone-400 font-medium">Our AI is checking your skills against job requirements.</p>
                <div className="mt-10 w-full max-w-xs h-2 bg-stone-50 rounded-full overflow-hidden relative">
                  <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="bg-blue-600 h-full w-1/2 rounded-full" />
                </div>
              </div>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Score Panel */}
                <div className="bg-stone-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <ShieldCheck className="w-48 h-48" />
                   </div>
                   <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-8">
                      <div className="space-y-6 text-center sm:text-left">
                         <h2 className="text-sm font-bold text-stone-400 uppercase tracking-[0.3em]">Your Results</h2>
                         <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                            <span className="bg-white/10 px-4 py-1.5 rounded-full text-[11px] font-bold border border-white/10 uppercase">Match: {result.keyword_match}%</span>
                            <span className="bg-white/10 px-4 py-1.5 rounded-full text-[11px] font-bold border border-white/10 uppercase">Exp: {experienceLevel}</span>
                         </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`text-6xl md:text-8xl font-black ${result.ats_score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                           {result.ats_score}<span className="text-3xl font-bold">%</span>
                        </div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest tracking-[0.2em]">Overall Score</p>
                      </div>
                   </div>
                </div>

                {/* Company Fit */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100 space-y-8">
                   <h2 className="text-xl font-bold text-stone-800 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-amber-500" /> Are you eligible?
                   </h2>
                   <div className="space-y-4">
                      {result.company_eligibility.map((comp) => (
                        <div key={comp.company} className="rounded-3xl border border-stone-100 overflow-hidden bg-stone-50/30">
                           <button onClick={() => setExpandedCompany(expandedCompany === comp.company ? null : comp.company)} className="w-full flex items-center justify-between p-6 hover:bg-stone-100 transition-all">
                              <div className="flex items-center gap-5">
                                 <span className="text-lg font-bold text-stone-800">{comp.company}</span>
                                 <div className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusColor(comp.eligibility)}`}>
                                    {comp.eligibility}
                                 </div>
                              </div>
                              <div className="p-1.5 bg-white rounded-full shadow-sm">
                                {expandedCompany === comp.company ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                              </div>
                           </button>
                           <AnimatePresence>
                             {expandedCompany === comp.company && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-8 pt-0 border-t border-stone-50 overflow-hidden space-y-8">
                                   <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                      <div className="space-y-4">
                                         <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Why this score?</h4>
                                         <ul className="space-y-3">
                                            {comp.reasons.map((r, i) => (
                                               <li key={i} className="flex gap-3 text-sm font-medium text-stone-600 leading-relaxed">
                                                  <div className="w-1.5 h-1.5 mt-2 shrink-0 bg-emerald-400 rounded-full" /> {r}
                                               </li>
                                            ))}
                                         </ul>
                                      </div>
                                      <div className="space-y-6">
                                         <div>
                                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Improve these skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                               {comp.missing_skills.map((s, i) => (
                                                  <span key={i} className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-full text-[11px] font-bold">
                                                     {s}
                                                  </span>
                                               ))}
                                            </div>
                                         </div>
                                         <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                                            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Smart Strategy</p>
                                            <p className="text-sm text-amber-800 font-medium leading-relaxed">{comp.suggestions[0]}</p>
                                         </div>
                                      </div>
                                   </div>
                                </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
