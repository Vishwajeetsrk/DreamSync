'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Zap, Globe, DollarSign, ArrowRight, ArrowLeft, 
  Sparkles, TrendingUp, CheckCircle2,
  RefreshCcw, Rocket, Star, Target, AlertCircle, ExternalLink,
  Brain, Lightbulb, Compass, Award
} from 'lucide-react';
import { IkigaiDiagram } from '@/components/IkigaiDiagram';
import { validateCareerInput } from '@/lib/aiGuard';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────
interface IkigaiResult {
  ikigaiSummary: string;
  ikigaiMatchScore: number;
  primaryPath: {
    title: string;
    description: string;
    whyFits: string[];
    salaryRange: string;
    marketDemand: string;
  };
  multipleCareerOptions: string[];
  skillGaps: string[];
  freeResources: Array<{ title: string; url: string; platform: string }>;
  nextActionSteps: string[];
  zones: {
    passion: string; profession: string; mission: string; vocation: string;
  };
  recommendedRoles: Array<{ title: string; match: string; reason: string }>;
  roadmap: Array<{ step: string; focus: string; duration: string }>;
  strengths: string[];
  weaknesses: string[];
  nextAction: string;
}

const steps = [
  { 
    id: 'passions', 
    title: 'What You Love', 
    desc: 'List your passions, interests, and things that make you happy.',
    icon: Heart,
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    placeholder: 'e.g. Design, writing, coding, public speaking...'
  },
  { 
    id: 'skills', 
    title: 'What You Are Good At', 
    desc: 'List your practical skills and natural talents.',
    icon: Star,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    placeholder: 'e.g. Leadership, problem solving, creative thinking...'
  },
  { 
    id: 'marketNeeds', 
    title: 'What The World Needs', 
    desc: 'Think about problems you want to help solve.',
    icon: Globe,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    placeholder: 'e.g. Health support, sustainable tech, education...'
  },
  { 
    id: 'incomeGoals', 
    title: 'Your Future Goals', 
    desc: 'Mention your career expectations and life goals.',
    icon: DollarSign,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    placeholder: 'e.g. Remote role, financial security, teaching others...'
  }
];

export default function IkigaiPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    passions: [] as string[],
    skills: [] as string[],
    marketNeeds: [] as string[],
    incomeGoals: ''
  });
  const [tempInput, setTempInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IkigaiResult | null>(null);
  const [error, setError] = useState('');
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAddItem = () => {
    if (!tempInput.trim()) return;
    const stepId = steps[currentStep].id as keyof typeof form;
    if (Array.isArray(form[stepId])) {
      setForm(f => ({ ...f, [stepId]: [...(f[stepId] as string[]), tempInput.trim()] }));
      setTempInput('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const stepId = steps[currentStep].id as keyof typeof form;
    setForm(f => ({ ...f, [stepId]: (f[stepId] as string[]).filter((_, i) => i !== index) }));
  };

  const handleNext = () => {
    if (isLastStep) {
      analyzeIkigai();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const analyzeIkigai = async () => {
    const combinedInput = `${form.passions.join(' ')} ${form.skills.join(' ')} ${form.marketNeeds.join(' ')} ${form.incomeGoals}`;
    const safety = validateCareerInput(combinedInput);
    if (!safety.allowed) {
      setError(safety.message);
      return;
    }

    setIsAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/ikigai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze Ikigai');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentStepData = steps[currentStep];

  if (result) {
    return (
      <div className="max-w-6xl mx-auto pt-32 pb-24 px-6 space-y-12">
        {/* Results Header */}
        <header className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4" /> Discovery Complete
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Your Personal <span className="text-blue-600">Career Vibe.</span>
           </h1>
           <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
             A clear path built from your passions, skills, and the world&apos;s needs.
           </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Visual Diagram Area */}
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-sm">
              <IkigaiDiagram activeZone={hoveredZone as any} />
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button onMouseEnter={() => setHoveredZone('passion')} onMouseLeave={() => setHoveredZone(null)} className="p-4 bg-rose-50 rounded-2xl text-[10px] font-bold text-rose-600 uppercase tracking-widest border border-rose-100 transition-all hover:shadow-md">Passion</button>
                <button onMouseEnter={() => setHoveredZone('profession')} onMouseLeave={() => setHoveredZone(null)} className="p-4 bg-emerald-50 rounded-2xl text-[10px] font-bold text-emerald-600 uppercase tracking-widest border border-emerald-100 transition-all hover:shadow-md">Profession</button>
                <button onMouseEnter={() => setHoveredZone('mission')} onMouseLeave={() => setHoveredZone(null)} className="p-4 bg-indigo-50 rounded-2xl text-[10px] font-bold text-indigo-600 uppercase tracking-widest border border-indigo-100 transition-all hover:shadow-md">Mission</button>
                <button onMouseEnter={() => setHoveredZone('vocation')} onMouseLeave={() => setHoveredZone(null)} className="p-4 bg-amber-50 rounded-2xl text-[10px] font-bold text-amber-600 uppercase tracking-widest border border-amber-100 transition-all hover:shadow-md">Vocation</button>
              </div>
            </div>
            
            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg"><Rocket className="w-5 h-5 text-white" /></div>
                  <div className="text-xs font-bold uppercase tracking-widest opacity-80">Top Recommendation</div>
               </div>
               <h3 className="text-2xl font-bold mb-4">{result.primaryPath.title}</h3>
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <div className="text-[10px] font-bold uppercase opacity-60 mb-1">Market Demand</div>
                    <div className="text-xl font-bold">{result.primaryPath.marketDemand}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase opacity-60 mb-1">Growth Score</div>
                    <div className="text-xl font-bold">{result.ikigaiMatchScore}%</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Detailed Content area */}
          <div className="lg:col-span-7 space-y-10">
            {/* Why this fits */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-10 md:p-12 shadow-sm space-y-8">
               <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                     <Lightbulb className="w-6 h-6 text-amber-500" /> Why this fits you
                  </h3>
                  <p className="text-stone-400 font-medium">Based on your interests and skills, this path offers the best balance.</p>
               </div>
               <div className="space-y-4">
                  {result.primaryPath.whyFits?.map((point, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                       <p className="text-stone-700 font-medium leading-relaxed">{point}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-stone-50 rounded-[2.5rem] p-8 border border-stone-100 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-100 rounded-xl"><Star className="w-4 h-4 text-emerald-600" /></div>
                     <h3 className="text-lg font-bold text-stone-900">Your Strengths</h3>
                  </div>
                  <div className="space-y-3">
                     {result.strengths.map((s, i) => (
                       <div key={i} className="px-4 py-2 bg-white rounded-xl border border-stone-100 text-sm font-bold text-stone-600 shadow-sm">{s}</div>
                     ))}
                  </div>
               </div>
               <div className="bg-rose-50/30 rounded-[2.5rem] p-8 border border-rose-100/50 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-rose-100 rounded-xl"><Target className="w-4 h-4 text-rose-600" /></div>
                     <h3 className="text-lg font-bold text-stone-900">Areas to Grow</h3>
                  </div>
                  <div className="space-y-3">
                     {result.weaknesses.map((w, i) => (
                       <div key={i} className="px-4 py-2 bg-white rounded-xl border border-stone-100 text-sm font-bold text-stone-600 shadow-sm">{w}</div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-10 md:p-12 shadow-sm space-y-10">
               <div className="flex items-center justify-between border-b border-stone-50 pb-6">
                  <div className="space-y-1">
                     <h3 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-blue-600" /> What to do next
                     </h3>
                     <p className="text-stone-400 text-sm font-medium">Simple steps to start moving towards this path today.</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  {result.nextActionSteps?.map((step, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                       <div className="w-10 h-10 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center font-bold text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">{i + 1}</div>
                       <p className="text-stone-700 font-bold leading-relaxed pt-2">{step}</p>
                    </div>
                  ))}
               </div>

               <div className="pt-6 border-t border-stone-50 space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Helpful Free Resources</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {result.freeResources?.map((res, i) => (
                       <Link key={i} href={res.url} target="_blank" className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all shadow-sm">
                          {res.title} <ExternalLink className="w-3 h-3" />
                       </Link>
                     ))}
                  </div>
               </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Link href="/resume-builder" className="btn-primary !py-5 flex items-center justify-center gap-3 text-lg">
                 Update My Resume <ArrowRight className="w-5 h-5" />
               </Link>
               <Link href="/roadmap" className="btn-secondary !py-5 flex items-center justify-center gap-3 text-lg">
                 See Career Roadmap <ArrowRight className="w-5 h-5 text-blue-600" />
               </Link>
            </div>

            <button onClick={() => setResult(null)} className="w-full text-center py-6 text-stone-400 font-bold hover:text-stone-900 transition-colors flex items-center justify-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Start discovery again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 pb-24">
      <div className="pt-32 max-w-4xl mx-auto px-6 space-y-12">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 bg-white rounded-[3rem] shadow-sm border border-stone-100 p-12">
              <div className="relative">
                <motion.div className="w-32 h-32 border-[10px] border-stone-100 border-t-blue-600 rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Brain className="w-10 h-10 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Exploring your path...</h2>
                <p className="text-lg text-stone-500 font-medium">Looking at the world and how your heart fits in it.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-widest mb-2">
                   <Award className="w-4 h-4" /> Career Discovery
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
                   Find what <span className="text-blue-600">truly fits</span> you.
                </h1>
                <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
                  Ikigai is a Japanese concept meaning &quot;a reason for being.&quot; We&apos;ll help you find yours.
                </p>
              </header>

              {/* Progress Bar */}
              <div className="max-w-xl mx-auto space-y-3">
                 <div className="flex justify-between text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                    <span>Your Journey</span>
                    <span>{Math.round(progress)}% Complete</span>
                 </div>
                 <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                   <motion.div className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
                 </div>
              </div>

              {/* Form Step */}
              <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-sm border border-stone-100 space-y-10">
                <div className="flex flex-col md:flex-row items-center gap-6 pb-10 border-b border-stone-50">
                  <div className={`p-6 ${currentStepData.color} rounded-[2rem] border transition-colors shadow-sm`}>
                    <currentStepData.icon className="w-8 h-8" />
                  </div>
                  <div className="text-center md:text-left space-y-1">
                    <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight leading-tight">{currentStepData.title}</h2>
                    <p className="text-stone-400 font-medium">{currentStepData.desc}</p>
                  </div>
                </div>

                {/* Input Area */}
                <div className="space-y-6">
                  {currentStepData.id === 'incomeGoals' ? (
                    <textarea
                      value={form.incomeGoals}
                      onChange={e => setForm(f => ({ ...f, incomeGoals: e.target.value }))}
                      className="input-field min-h-[180px] p-6 text-lg font-bold"
                      placeholder={currentStepData.placeholder}
                    />
                  ) : (
                    <div className="space-y-8">
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={tempInput}
                          onChange={e => setTempInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                          placeholder={currentStepData.placeholder}
                          className="flex-1 input-field !py-5 px-6 text-lg font-bold"
                        />
                        <button onClick={handleAddItem} className="px-10 py-5 bg-blue-600 text-white font-bold rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-lg text-sm">
                          Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {(form[currentStepData.id as keyof typeof form] as string[]).map((item, i) => (
                          <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-3 px-5 py-2.5 bg-stone-50 rounded-[1.25rem] border border-stone-100 font-bold text-stone-600 shadow-sm text-sm">
                            {item}
                            <button onClick={() => handleRemoveItem(i)} className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors leading-none">×</button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center pt-10 border-t border-stone-50">
                  <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0} className="flex items-center gap-2 px-6 py-3 font-bold text-stone-400 hover:text-stone-900 disabled:opacity-0 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentStepData.id !== 'incomeGoals' && (form[currentStepData.id as keyof typeof form] as string[]).length === 0) ||
                      (currentStepData.id === 'incomeGoals' && !form.incomeGoals.trim())
                    }
                    className="btn-primary !px-12 !py-5 flex items-center gap-3 text-lg"
                  >
                    {isLastStep ? 'Find My Path' : 'Continue'} <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 text-rose-700 font-bold flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5" /> {error}
            <button onClick={analyzeIkigai} className="underline ml-auto hover:text-rose-900 transition-colors">Retry</button>
          </div>
        )}
      </div>
    </div>
  );
}
