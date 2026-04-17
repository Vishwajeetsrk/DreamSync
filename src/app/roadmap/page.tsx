'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Briefcase, ExternalLink, Book, Video, 
  GraduationCap, Box, CheckCircle, ArrowRight, ShieldCheck,
  Star, Download, Wrench, Zap, Globe, TrendingUp, Search, Loader2, FileText,
  Compass, Lightbulb, Target, AlertCircle
} from 'lucide-react';
import { validateCareerInput } from '@/lib/aiGuard';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export default function Roadmap() {
  const [steps, setSteps] = useState<any[]>([]);
  const [totalTimeline, setTotalTimeline] = useState<string>('');
  const [globalPrerequisites, setGlobalPrerequisites] = useState<any>(null);
  const [marketInsights, setMarketInsights] = useState<any>(null);
  const [realJobRoles, setRealJobRoles] = useState<any[]>([]);
  const [criticalIntelligence, setCriticalIntelligence] = useState<any>(null);
  const [targetRole, setTargetRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ role: 'Frontend Developer', experience: 'Beginner', goal: '' });
  const [safetyError, setSafetyError] = useState<{ message: string, alternatives: string[] } | null>(null);

  const generateRoadmap = async () => {
    if (!query.role) return;
    
    const safety = validateCareerInput(query.role);
    if (!safety.allowed) {
      setSafetyError({ 
        message: safety.message, 
        alternatives: ["Software Developer", "Data Scientist", "UI/UX Designer", "Sales Professional", "Accountant"] 
      });
      return;
    }

    setLoading(true);
    setSafetyError(null);

    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate roadmap");
      
      setSteps(data.timeline || []);
      setTotalTimeline(data.totalTimeline || '');
      setGlobalPrerequisites(data.globalPrerequisites || null);
      setMarketInsights(data.marketInsights || null);
      setRealJobRoles(data.realJobRoles || []);
      setCriticalIntelligence(data.criticalIntelligence || null);
      setTargetRole(data.targetRole || '');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => window.print();

  const handleDownloadDocx = async () => {
    if (steps.length === 0) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: "DREAMSYNC CAREER ROADMAP", heading: HeadingLevel.TITLE }),
          new Paragraph({ text: `Target Role: ${targetRole || query.role}`, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `Estimated Duration: ${totalTimeline}`, heading: HeadingLevel.HEADING_3 }),
          ...steps.flatMap((step) => [
            new Paragraph({ text: `${step.title} (${step.time})`, heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: step.desc }),
            new Paragraph({ text: `Project: ${step.build || 'N/A'}` })
          ]),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `DreamSync_Roadmap_${(targetRole || query.role).replace(/\s+/g, '_')}.docx`);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-24">
      
      <div className="pt-32 max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 items-center no-print">
           <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-widest">
                 <Compass className="w-4 h-4" /> Career Journey Planner
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  Map your path to <span className="text-blue-600">success.</span>
              </h1>
              <p className="text-lg text-stone-500 font-medium max-w-2xl">
                 Get a step-by-step guide to your dream job, including free courses, tools, and projects to build your portfolio.
              </p>
           </div>
           
           <div className="lg:col-span-5 w-full bg-white rounded-[2.5rem] p-8 md:p-10 border border-stone-100 shadow-sm space-y-8">
              <div className="space-y-4">
                 <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">What goal are you aiming for?</label>
                 <input type="text" value={query.role} onChange={e => setQuery({...query, role: e.target.value})} className="input-field" placeholder="e.g. Sales, Marketing, IT..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-400 ml-1">Experience</label>
                    <select value={query.experience} onChange={e => setQuery({...query, experience: e.target.value})} className="input-field appearance-none">
                       <option>Beginner</option>
                       <option>Intermediate</option>
                    </select>
                 </div>
                 <div className="flex items-end">
                    <button onClick={generateRoadmap} disabled={loading} className="btn-primary w-full !py-4 shadow-xl flex items-center justify-center gap-2">
                       {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
                       {loading ? 'Building...' : 'Create Guide'}
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {steps.length === 0 && !loading && !safetyError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 border-2 border-dashed border-stone-200 rounded-[3rem] space-y-6">
               <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-stone-300" />
               </div>
               <p className="text-xl font-bold text-stone-400">Tell us your career goal to generate a personalized guide.</p>
            </motion.div>
          )}

          {safetyError && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-50 border border-rose-100 rounded-[2.5rem] p-12 max-w-3xl mx-auto shadow-sm space-y-8">
              <div className="flex items-center gap-6 pb-6 border-b border-rose-200/50">
                <div className="p-4 bg-white rounded-2xl shadow-sm"><AlertCircle className="w-10 h-10 text-rose-500" /></div>
                <div>
                   <h2 className="text-2xl font-extrabold text-stone-900 leading-tight">Hmm, that role seems a bit unusual.</h2>
                   <p className="text-rose-600 font-bold uppercase text-[10px] tracking-widest mt-1">Safety Refusal Protocol</p>
                </div>
              </div>
              <p className="text-lg font-medium text-stone-600 leading-relaxed">{safetyError.message}</p>
              
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Try one of these professional paths:</p>
                <div className="flex flex-wrap gap-3">
                  {safetyError.alternatives.map(alt => (
                    <button key={alt} onClick={() => { setQuery({...query, role: alt}); setSafetyError(null); }} className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl font-bold text-stone-700 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm">
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-40 space-y-8">
               <div className="relative">
                  <div className="w-24 h-24 border-[8px] border-stone-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Map className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <p className="text-2xl font-extrabold text-stone-900">Designing your path...</p>
                  <p className="text-stone-500 font-medium">Looking up courses, projects, and salary trends.</p>
               </div>
            </motion.div>
          )}

          {steps.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
              
              {/* Journey Overview */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
                      <TrendingUp className="w-8 h-8" />
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Total Journey Time</span>
                      <h2 className="text-4xl font-extrabold text-stone-900">{totalTimeline}</h2>
                   </div>
                </div>
                 <div className="flex flex-wrap gap-4 no-print">
                    <button onClick={handleDownloadPDF} className="btn-secondary !py-4 flex items-center gap-2">
                       <Download className="w-4 h-4" /> Save as PDF
                    </button>
                    <button onClick={handleDownloadDocx} className="btn-secondary !py-4 flex items-center gap-2">
                       <FileText className="w-4 h-4" /> Save as Word
                    </button>
                 </div>
              </div>

              {/* Core Prerequisites */}
              {globalPrerequisites && (
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-stone-100 shadow-sm space-y-10">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-emerald-50 rounded-2xl"><GraduationCap className="w-8 h-8 text-emerald-600" /></div>
                     <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Before you start</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-12">
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Education Baseline</p>
                       <p className="text-lg font-bold text-stone-800 leading-snug">{globalPrerequisites.education}</p>
                    </div>
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Crucial Skills</p>
                       <div className="flex flex-wrap gap-2">
                         {globalPrerequisites.technicalSkills?.map((s: string) => (
                           <span key={s} className="px-3 py-1 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold text-stone-600 uppercase tracking-tighter">{s}</span>
                         ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Must-Have Knowledge</p>
                       <div className="space-y-1.5">
                         {globalPrerequisites.requiredKnowledge?.map((k: string) => (
                           <div key={k} className="flex items-center gap-2 text-xs font-bold text-stone-600 italic">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {k}
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Learning Timeline */}
              <div className="relative border-l-4 border-stone-100 ml-4 md:ml-12 pl-10 md:pl-20 space-y-20 py-10">
                {steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative bg-white rounded-[2.5rem] p-8 md:p-12 border border-stone-100 shadow-sm">
                    {/* Step bubble */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-[3.15rem] md:-left-[5.7rem] w-8 h-8 md:w-12 md:h-12 border-4 border-white bg-blue-600 rounded-full flex items-center justify-center text-white font-extrabold shadow-lg z-10">
                       {i + 1}
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                      <div className="lg:col-span-8 space-y-8">
                         <div className="space-y-4">
                            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                               Estimated Time: {step.time}
                            </div>
                            <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">{step.title}</h3>
                            <p className="text-lg font-medium text-stone-500 leading-relaxed">{step.desc}</p>
                         </div>

                         {step.build && (
                            <div className="p-8 bg-amber-50 rounded-[2.25rem] border border-amber-100 space-y-4 shadow-sm">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-lg"><Target className="w-5 h-5 text-amber-500" /></div>
                                  <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest">Recommended Project</span>
                               </div>
                               <p className="text-stone-700 font-bold leading-relaxed">{step.build}</p>
                            </div>
                         )}
                      </div>

                      {/* Resources */}
                      <div className="lg:col-span-4 space-y-8 lg:border-l lg:border-stone-50 lg:pl-10">
                         {step.studyMaterials?.slice(0, 1).map((link: any, idx: number) => (
                           <div key={idx} className="space-y-4">
                              <h4 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                                 <Book className="w-4 h-4" /> Top Course
                              </h4>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="group block p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-white hover:shadow-xl transition-all">
                                 <div className="flex justify-between items-start mb-2 gap-2">
                                    <h5 className="font-bold text-stone-800 group-hover:text-blue-600 transition-colors leading-tight">{link.label}</h5>
                                    <ExternalLink className="w-4 h-4 text-stone-300 shrink-0" />
                                 </div>
                                 <p className="text-[10px] text-stone-400 font-medium leading-relaxed">{link.summary}</p>
                              </a>
                           </div>
                         ))}

                         {step.videoLectures?.slice(0, 1).map((link: any, idx: number) => (
                           <div key={idx} className="space-y-4">
                              <h4 className="text-[10px] font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                                 <Video className="w-4 h-4" /> Watch & Learn
                              </h4>
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="group block p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-white hover:shadow-xl transition-all">
                                 <div className="flex justify-between items-start gap-2">
                                    <h5 className="font-bold text-stone-800 group-hover:text-rose-500 transition-colors leading-tight">{link.label}</h5>
                                    <PlayCircle className="w-5 h-5 text-rose-500 shrink-0" />
                                 </div>
                              </a>
                           </div>
                         ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Market Intelligence */}
              <div className="bg-white rounded-[2.5rem] p-10 md:p-12 border border-stone-100 shadow-sm space-y-12">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-2xl"><Globe className="w-8 h-8 text-blue-600" /></div>
                    <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Market Outlook</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-6">
                       <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest">Financial Future</h4>
                       <div className="space-y-4">
                          <div className="p-4 bg-stone-50 rounded-2xl">
                             <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Avg India Salary</p>
                             <p className="text-2xl font-extrabold text-stone-800">{marketInsights?.salaryIndia}</p>
                          </div>
                          <div className="p-4 bg-stone-50 rounded-2xl">
                             <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Global Ceiling</p>
                             <p className="text-2xl font-extrabold text-stone-800">{marketInsights?.salaryGlobal}</p>
                          </div>
                       </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                       <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest">Career Variations</h4>
                       <div className="grid sm:grid-cols-2 gap-4">
                          {realJobRoles.map((job, idx) => (
                            <div key={idx} className="p-6 border border-stone-50 rounded-2xl hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                               <h5 className="font-bold text-stone-800 mb-1">{job.title}</h5>
                               <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">@ {job.companies}</p>
                               <p className="text-[10px] font-medium text-stone-400 uppercase leading-snug">{job.skills}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Pro Tips / Hiring Intelligence */}
              {criticalIntelligence && (
                 <div className="bg-stone-900 rounded-[3rem] p-12 md:p-16 text-white space-y-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 opacity-10"><ShieldCheck className="w-32 h-32" /></div>
                    <div className="relative z-10 space-y-12">
                       <div className="flex items-center gap-6">
                          <h3 className="text-4xl font-extrabold tracking-tight">Success Advice</h3>
                       </div>
                       <div className="grid md:grid-cols-3 gap-12">
                          <div className="space-y-4">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">What Matters Most</div>
                             <p className="text-stone-300 font-medium leading-relaxed">{criticalIntelligence.whatMatters}</p>
                          </div>
                          <div className="space-y-4">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Mistakes to Avoid</div>
                             <p className="text-stone-300 font-medium leading-relaxed">{criticalIntelligence.mistakesToAvoid}</p>
                          </div>
                          <div className="space-y-4">
                             <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">How to get Hired</div>
                             <p className="text-stone-300 font-medium leading-relaxed">{criticalIntelligence.hiringTips}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @media print {
          .no-print, header, footer { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-white { box-shadow: none !important; border: 1px solid #eee !important; }
          .rounded-[2.5rem], .rounded-[3rem] { border-radius: 1rem !important; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}

function PlayCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
  );
}
