'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Plus, Trash2, Download, ChevronRight, ChevronLeft,
  Sparkles, Monitor, Eye, Code2, Check, ArrowRight, Palette,
  User, Briefcase, BookOpen, FolderKanban, Award,
  Upload, Loader2, Linkedin, Github, ExternalLink, Zap, Layout
} from 'lucide-react';
import { validateCareerInput } from '@/lib/aiGuard';

// ---------- TYPES ----------
interface Project { topic: string; points: string; website: string; }
interface Course { topic: string; points: string; link: string; }
interface WorkExp { title: string; company: string; points: string; startDate: string; endDate: string; isInternship: boolean; }

// ---------- THEME CONFIG ----------
const THEMES = [
  {
    id: 'minimal-dev',
    name: 'Minimal Dev',
    desc: 'Clean & Professional',
    preview: { bg: '#FFFFFF', accent: '#3B82F6', text: '#1E293B', card: '#F8FAFC' },
    gradient: 'from-blue-50 to-white',
    border: 'border-blue-100',
  },
  {
    id: 'soft-warm',
    name: 'Soft Warm',
    desc: 'Empathetic & Caring',
    preview: { bg: '#FFFBF5', accent: '#F43F5E', text: '#451A03', card: '#FFF1F2' },
    gradient: 'from-stone-50 to-rose-50',
    border: 'border-rose-100',
  },
  {
    id: 'glass-light',
    name: 'Glass Light',
    desc: 'Modern & Futuristic',
    preview: { bg: '#F1F5F9', accent: '#8B5CF6', text: '#0F172A', card: '#FFFFFF80' },
    gradient: 'from-violet-50 to-slate-50',
    border: 'border-violet-100',
  },
  {
    id: 'emerald-pro',
    name: 'Emerald Pro',
    desc: 'Success & Growth',
    preview: { bg: '#F0FDF4', accent: '#10B981', text: '#064E3B', card: '#FFFFFF' },
    gradient: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
  },
];

const STEPS = [
  { id: 1, label: 'About You', icon: User },
  { id: 2, label: 'Style', icon: Palette },
  { id: 3, label: 'Experience', icon: FolderKanban },
  { id: 4, label: 'Generate', icon: Sparkles },
];

// ---------- COMPONENT ----------
export default function PortfolioGenerator() {
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState('minimal-dev');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [genError, setGenError] = useState('');
  const [genProgress, setGenProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activePreview, setActivePreview] = useState(false);

  // Basic Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState('');
  const [languages, setLanguages] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [summary, setSummary] = useState('');
  const [achievements, setAchievements] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Dynamic arrays
  const [projects, setProjects] = useState<Project[]>([{ topic: '', points: '', website: '' }]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [workExp, setWorkExp] = useState<WorkExp[]>([]);

  // Helpers
  const addProject = () => setProjects(p => [...p, { topic: 'New Project', points: '', website: '' }]);
  const removeProject = (i: number) => setProjects(p => p.filter((_, idx) => idx !== i));
  const updateProject = (i: number, f: keyof Project, v: string) => setProjects(p => p.map((x, idx) => idx === i ? { ...x, [f]: v } : x));

  const addCourse = () => setCourses(c => [...c, { topic: '', points: '', link: '' }]);
  const removeCourse = (i: number) => setCourses(c => c.filter((_, idx) => idx !== i));
  const updateCourse = (i: number, f: keyof Course, v: string) => setCourses(c => c.map((x, idx) => idx === i ? { ...x, [f]: v } : x));

  const addWork = () => setWorkExp(w => [...w, { title: '', company: '', points: '', startDate: '', endDate: '', isInternship: false }]);
  const removeWork = (i: number) => setWorkExp(w => w.filter((_, idx) => idx !== i));
  const updateWork = (i: number, f: keyof WorkExp, v: string | boolean) => setWorkExp(w => w.map((x, idx) => idx === i ? { ...x, [f]: v } : x));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generatePortfolio = async () => {
    const safetyInput = `${targetRole} ${summary}`;
    const safety = validateCareerInput(safetyInput);
    if (!safety.allowed) {
      setGenError(safety.message);
      return;
    }

    setIsGenerating(true);
    setGenError('');
    try {
      const projectsStr = projects.filter(p => p.topic).map(p =>
        `${p.topic}: ${p.points}${p.website ? ` | Link: ${p.website}` : ''}`).join('\n');
      const coursesStr = courses.filter(c => c.topic).map(c =>
        `${c.topic}: ${c.points}${c.link ? ` | Certificate: ${c.link}` : ''}`).join('\n');
      const expStr = workExp.filter(w => w.title).map(w =>
        `${w.isInternship ? '[Internship]' : '[Work]'} ${w.title} @ ${w.company} (${w.startDate}–${w.endDate || 'Present'}): ${w.points}`).join('\n');

      const progressInterval = setInterval(() => {
        setGenProgress(p => p < 90 ? p + 2 : p);
      }, 500);

      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedTheme,
          data: {
            fullName, email, phone, targetRole, skills, education,
            languages, linkedin, github, summary, achievements, hobbies,
            projects: projectsStr,
            courses: coursesStr,
            experience: expStr,
            profileImage,
          },
        }),
      });
      clearInterval(progressInterval);
      setGenProgress(100);
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Generation failed');
      setGeneratedHtml(resData.html);
      setStep(4);
    } catch (err: any) {
      setGenError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

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
      setFullName(d.personalInfo?.fullName || '');
      setTargetRole(d.personalInfo?.role || '');
      setEmail(d.personalInfo?.email || '');
      setPhone(d.personalInfo?.phone || '');
      setLinkedin(d.personalInfo?.linkedin || '');
      setGithub(d.personalInfo?.github || '');
      setSummary(d.summary || '');
      setEducation(d.education?.[0]?.school + ' — ' + d.education?.[0]?.degree || '');
      setSkills(d.skills?.map((s:any) => s.items).join(', ') || '');
      setWorkExp(d.experience?.map((e:any) => ({
        title: e.role, company: e.company, points: e.bullets.join('\n'),
        startDate: e.date?.split('–')[0]?.trim() || '',
        endDate: e.date?.split('–')[1]?.trim() || '',
        isInternship: e.role.toLowerCase().includes('intern')
      })) || []);
      setProjects(d.projects?.map((p:any) => ({ topic: p.name, points: p.description, website: p.link || '' })) || []);
      setStep(2);
    } catch (err: any) {
      setGenError("Parsing failed: " + err.message);
    } finally { setIsParsing(false); }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName || 'portfolio'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---- GENERATED STATE ----
  if (generatedHtml && step === 4) {
    return (
      <div className="max-w-6xl mx-auto pt-32 pb-20 px-6 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-600 rounded-[2.5rem] p-10 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Check className="w-32 h-32" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Your portfolio is ready! 🎉</h2>
              <p className="text-emerald-50 text-lg font-medium max-w-2xl">
                We&apos;ve built a professional website for you. You can download the code and show it to employers right away.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-lg text-sm">
                <Download className="w-5 h-5" /> Download Website
              </button>
              <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-8 py-4 bg-emerald-700/50 text-white font-bold rounded-2xl border border-emerald-400/30 hover:bg-emerald-700 transition-all text-sm">
                <Eye className="w-5 h-5" /> {showPreview ? 'Hide' : 'See'} Live Preview
              </button>
              <button onClick={() => { setGeneratedHtml(''); setStep(1); }} className="text-emerald-100 font-bold hover:underline px-4 text-sm">
                Start Again
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showPreview && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
              <div className="bg-stone-900 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Live Portfolio Simulator</div>
                <div className="w-12 h-1" />
              </div>
              <iframe srcDoc={generatedHtml} className="w-full bg-white min-h-[70vh]" title="Portfolio Preview" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm">
          <h3 className="text-xl font-bold text-stone-800 mb-8 flex items-center gap-2"><Layout className="w-6 h-6 text-blue-600" /> How to go live</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Vercel', color: 'bg-stone-900', desc: 'The easiest way. Drop your file and be live in 10 seconds.' },
              { name: 'Github', color: 'bg-stone-800', desc: 'Host it for free on Github Pages and link it to your profile.' },
              { name: 'Netlify', color: 'bg-emerald-600', desc: 'Secure and fast hosting for simple websites.' }
            ].map(host => (
              <div key={host.name} className="space-y-3">
                <div className={`w-full py-3 ${host.color} text-white text-center font-bold rounded-xl`}>{host.name}</div>
                <p className="text-sm text-stone-500 font-medium leading-relaxed">{host.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      
      <div className="pt-32 max-w-6xl mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> Auto Portfolio
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight">
              A website that <span className="text-blue-600">represents you.</span>
           </h1>
           <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
              Tell your story professionally. Build a stunning one-page portfolio in minutes.
           </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-4xl mx-auto relative px-4">
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-stone-200 -z-10" />
          {STEPS.map((s) => {
            const isDone = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDone ? 'bg-emerald-100 text-emerald-600 shadow-sm' : isCurrent ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-white border border-stone-200 text-stone-300'}`}>
                  {isDone ? <Check className="w-6 h-6 font-bold" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isCurrent ? 'text-stone-900' : 'text-stone-300'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Form area */}
          <div className={`lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                
                {step === 1 && (
                  <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-stone-100 space-y-10">
                    {/* Resume Upload Module */}
                    <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm">
                             <Zap className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                             <h3 className="text-xl font-bold text-stone-900">Fast Forward</h3>
                             <p className="text-sm font-medium text-stone-500">Upload your resume to fill most details automatically.</p>
                          </div>
                       </div>
                       <label className="w-full h-14 flex items-center justify-center gap-3 bg-blue-600 text-white font-bold rounded-2xl cursor-pointer hover:bg-blue-700 transition-all shadow-lg">
                          {isParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                          {isParsing ? "Reading Resume..." : "Upload Resume (PDF)"}
                          <input type="file" hidden accept=".pdf" onChange={handleImportResume} />
                       </label>
                    </div>

                    <div className="space-y-8">
                       <div className="flex items-center gap-3">
                          <User className="w-6 h-6 text-blue-600" />
                          <h2 className="text-2xl font-bold text-stone-900">Personal Details</h2>
                       </div>
                       
                       <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 border-dashed">
                          <div className="relative group">
                             <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                                {profileImage ? (
                                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-200">
                                     <User className="w-12 h-12" />
                                  </div>
                                )}
                             </div>
                             <label className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:scale-110 transition-all border-2 border-white shadow-lg">
                                <Plus className="w-4 h-4" />
                                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                             </label>
                          </div>
                          <div className="flex-1 space-y-1 text-center md:text-left">
                             <h4 className="font-bold text-stone-800">Add a Profile Picture</h4>
                             <p className="text-xs text-stone-400 font-medium">A friendly photo helps employers trust you more. Use a clean background!</p>
                             {profileImage && (
                               <button onClick={() => setProfileImage(null)} className="text-xs font-bold text-rose-500 hover:underline mt-2">Remove Photo</button>
                             )}
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Full Name</label>
                           <input value={fullName} onChange={e => setFullName(e.target.value)} className="input-field" placeholder="e.g. Rahul Kumar" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Current Role</label>
                           <input value={targetRole} onChange={e => setTargetRole(e.target.value)} className="input-field" placeholder="e.g. Sales Executive" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
                           <input value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="rahul@example.com" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Phone Number</label>
                           <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="+91 90000 00000" />
                         </div>
                         <div className="col-span-2 space-y-2">
                           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Key Skills</label>
                           <input value={skills} onChange={e => setSkills(e.target.value)} className="input-field" placeholder="e.g. Communication, MS Excel, Tally..." />
                         </div>
                         <div className="col-span-2 space-y-2">
                           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Education</label>
                           <input value={education} onChange={e => setEducation(e.target.value)} className="input-field" placeholder="e.g. B.Com - Delhi University (2024)" />
                         </div>
                         <div className="col-span-2 space-y-2">
                           <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">Bio / Small Summary</label>
                           <textarea value={summary} onChange={e => setSummary(e.target.value)} className="input-field min-h-[100px]" placeholder="Tell companies what motivates you..." />
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-sm border border-stone-100 space-y-10">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-stone-900">Choose a look & feel</h2>
                      <p className="text-stone-400 font-medium">Select a color theme that fits your personality.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {THEMES.map(theme => (
                        <button key={theme.id} onClick={() => setSelectedTheme(theme.id)} className={`relative text-left p-6 rounded-[2rem] border-2 transition-all duration-300 ${selectedTheme === theme.id ? `${theme.border} bg-blue-50/20 ring-4 ring-blue-100` : 'border-stone-100 hover:border-stone-200 bg-white'}`}>
                          <div className={`h-32 rounded-2xl bg-gradient-to-br ${theme.gradient} mb-6 p-4 flex flex-col justify-between overflow-hidden shadow-inner`}>
                            <div className="w-8 h-1.5 rounded-full" style={{ background: theme.preview.accent }} />
                            <div className="space-y-1">
                              <div className="w-16 h-2 rounded-sm" style={{ background: theme.preview.text, opacity: 0.6 }} />
                              <div className="w-10 h-1.5 rounded-sm" style={{ background: theme.preview.accent }} />
                            </div>
                          </div>
                          <div className="flex justify-between items-center px-1">
                             <div>
                                <h3 className="text-base font-bold text-stone-800">{theme.name}</h3>
                                <p className="text-xs text-stone-400 font-medium">{theme.desc}</p>
                             </div>
                             {selectedTheme === theme.id && <div className="p-1.5 bg-blue-600 rounded-full text-white"><Check className="w-4 h-4" /></div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    {/* Work Experience */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                          <h3 className="text-2xl font-bold text-stone-900">Experience</h3>
                        </div>
                        <button onClick={addWork} className="p-3 bg-stone-50 rounded-2xl text-blue-600 hover:bg-stone-100 transition-all">
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        {workExp.map((w, i) => (
                          <div key={i} className="p-8 rounded-[2rem] border border-stone-100 bg-stone-50/50 space-y-6">
                            <div className="flex justify-between">
                              <label className="flex items-center gap-2 text-sm font-bold text-stone-800">
                                <input type="checkbox" checked={w.isInternship} onChange={e => updateWork(i, 'isInternship', e.target.checked)} className="w-4 h-4 accent-blue-600" />
                                This was an internship
                              </label>
                              <button onClick={() => removeWork(i)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-5 h-5" /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <input value={w.title} onChange={e => updateWork(i, 'title', e.target.value)} className="input-field bg-white" placeholder="Role Title" />
                              <input value={w.company} onChange={e => updateWork(i, 'company', e.target.value)} className="input-field bg-white" placeholder="Company Name" />
                              <input value={w.startDate} onChange={e => updateWork(i, 'startDate', e.target.value)} className="input-field bg-white" placeholder="Start Date" />
                              <input value={w.endDate} onChange={e => updateWork(i, 'endDate', e.target.value)} className="input-field bg-white" placeholder="End Date (or 'Present')" />
                              <textarea value={w.points} onChange={e => updateWork(i, 'points', e.target.value)} className="col-span-2 input-field bg-white min-h-[80px]" placeholder="What did you do there?" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FolderKanban className="w-6 h-6 text-amber-500" />
                          <h3 className="text-2xl font-bold text-stone-900">Projects</h3>
                        </div>
                        <button onClick={addProject} className="p-3 bg-stone-50 rounded-2xl text-amber-600 hover:bg-stone-100 transition-all">
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((p, i) => (
                          <div key={i} className="p-6 rounded-[2rem] border border-stone-100 bg-stone-50/50 space-y-4">
                            <div className="flex justify-end"><button onClick={() => removeProject(i)} className="text-rose-500"><Trash2 className="w-4 h-4" /></button></div>
                            <input value={p.topic} onChange={e => updateProject(i, 'topic', e.target.value)} className="input-field bg-white" placeholder="Project Name" />
                            <textarea value={p.points} onChange={e => updateProject(i, 'points', e.target.value)} className="input-field bg-white" placeholder="Description" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-stone-100 text-center space-y-10">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
                      <Sparkles className="w-10 h-10" />
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Ready to build?</h2>
                      <p className="text-stone-500 font-medium max-w-sm mx-auto">
                        Click the button below to generate your professional code. This will take about 20-30 seconds.
                      </p>
                    </div>

                    {isGenerating ? (
                      <div className="space-y-6">
                        <div className="w-full h-3 bg-stone-50 rounded-full overflow-hidden relative">
                          <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 15, ease: "linear" }} className="bg-blue-600 h-full w-full rounded-full" />
                        </div>
                        <p className="text-sm font-bold text-blue-600 animate-pulse">Designing your website now...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <button onClick={generatePortfolio} className="btn-primary w-full !py-6 text-xl shadow-2xl flex items-center justify-center gap-3">
                           <Code2 className="w-6 h-6" /> Create My Portfolio
                        </button>
                        {genError && <p className="text-rose-500 font-bold">{genError}</p>}
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Takes about 30 seconds</p>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between items-center px-4">
                <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="text-stone-400 font-bold hover:text-stone-900 disabled:opacity-0 flex items-center gap-2">
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button onClick={() => setStep(s => Math.min(4, s + 1))} className="flex items-center gap-2 px-10 py-4 bg-white text-stone-800 font-bold border border-stone-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-sm">
                  {step === 3 ? 'Review & Build' : 'Next Step'} <ChevronRight className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Mini Preview */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 hidden lg:block">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
               <div className="bg-stone-50 p-5 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Real-time Preview</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
               </div>
               
               <div className="flex-1 p-8 space-y-10">
                  <div className="space-y-4">
                     {profileImage ? <img src={profileImage} className="w-16 h-16 rounded-2xl border-2 border-stone-100 object-cover" /> : <div className="w-16 h-16 rounded-2xl bg-stone-50" />}
                     <div className="space-y-1">
                        <div className="text-xl font-bold text-stone-900 truncate">{fullName || "Your Name"}</div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">{targetRole || "Job Role"}</div>
                     </div>
                     <div className="h-px bg-stone-50" />
                     <p className="text-[10px] text-stone-400 font-medium leading-relaxed italic line-clamp-3">
                        {summary || "A brief bio about who you are and your career goals..."}
                     </p>
                  </div>

                  <div className="space-y-3">
                     <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Skills Preview</span>
                     <div className="flex flex-wrap gap-1.5">
                        {skills ? skills.split(',').slice(0, 4).map((s: any, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-stone-50 text-[9px] font-bold text-stone-500 rounded-full">{s.trim()}</span>
                        )) : [1,2,3].map(i => <div key={i} className="w-12 h-3 bg-stone-50 rounded-full" />)}
                     </div>
                  </div>

                  <div className="space-y-4 pt-10 border-t border-stone-50">
                     <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        <div className="flex-1 h-3 bg-stone-50 rounded-full" />
                     </div>
                     <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-stone-400" />
                        <div className="flex-1 h-3 bg-stone-50 rounded-full" />
                     </div>
                  </div>
               </div>
               
               <div className="p-6 bg-stone-50 text-center">
                  <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Theme: {selectedTheme}</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
