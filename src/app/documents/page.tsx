'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ExternalLink, FileText, Info, AlertTriangle,
  Code2, Database, GitBranch, Globe, Smartphone, Terminal,
  Shield, ChevronRight, Layers, CheckCircle2, ChevronDown, ChevronUp,
  Landmark, GraduationCap, Sparkles, Brain, ArrowRight, Star
} from 'lucide-react';

// --- Government Docs ---
const govDocs = [
  {
    title: "PAN Card",
    desc: "A matching identity is needed for salary, bank accounts, and professional tax compliance in India.",
    link: "https://www.protean-tinpan.com/",
    time: "15–20 days",
    fee: "₹107 (approx)",
    required: ["Aadhaar Card", "Date of Birth Proof", "Passport Size Photos"],
    type: "government",
    steps: [
      "Visit NSDL portal: onlineservices.nsdl.com",
      "Select 'New PAN – Indian Citizen (Form 49A)'",
      "Upload scanned photo, signature, and Aadhaar",
      "Pay ₹107 online via net banking / UPI",
      "Track with 15-digit Acknowledgment Number",
      "E-PAN delivered in 2–3 days via email",
    ],
    tips: "Ensure your name spelling matches exactly across Aadhaar and Class 10th marksheet.",
  },
  {
    title: "Aadhaar Update",
    desc: "Ensure your mobile number is linked for seamless multi-step online verification.",
    link: "https://myaadhaar.uidai.gov.in/",
    time: "5–15 days",
    fee: "₹50 (demographic)",
    required: ["Proof of Identity", "Proof of Address"],
    type: "government",
    steps: [
      "Log in at myaadhaar.uidai.gov.in with OTP",
      "Click 'Update Demographics' for name/address",
      "To link mobile: visit an Enrolment Centre in person",
      "Upload supporting documents (POI / POA)",
      "Pay ₹50 fee and track via URN number",
    ],
    tips: "Mobile linking requires physical biometrics at a center. Carry original documents for verification.",
  },
  {
    title: "UAN / EPF Number",
    desc: "Your Employee Provident Fund (EPF) is your primary career savings protocol.",
    link: "https://unifiedportal-mem.epfindia.gov.in/memberinterface/",
    time: "Instant (Digital)",
    fee: "Free",
    required: ["Aadhaar", "PAN", "Bank Account Details"],
    type: "career",
    steps: [
      "Employer generates UAN upon first salary deposit",
      "Receive UAN via SMS on your linked mobile number",
      "Activate at unifiedportal-mem.epfindia.gov.in",
      "Link PAN and bank account under 'KYC' section",
    ],
    tips: "Always verify your passbook monthly to ensure employer contributions are deposited.",
  },
  {
    title: "Passport",
    desc: "The gold standard of identity and essential for global career growth opportunities.",
    link: "https://www.passportindia.gov.in/",
    time: "30–45 days (Normal)",
    fee: "₹1,500 (36 pages)",
    required: ["Aadhaar", "10th Marksheet", "Birth Certificate"],
    type: "government",
    steps: [
      "Register at passportindia.gov.in",
      "Choose 'Fresh Passport' and fill the online form",
      "Pay fee and book appointment at nearest PSK",
      "Visit PSK with originals + standard photocopies",
      "Police verification occurs post-submission",
    ],
    tips: "Book 'Tatkal' if you need a passport within 14 days for urgent joining/travel.",
  },
  {
    title: "Savings Account",
    desc: "The foundation of financial independence and digital payment connectivity.",
    link: "https://www.jansamarth.in/",
    time: "Instant (e-KYC)",
    fee: "Free (Zero-Balance)",
    required: ["Aadhaar", "PAN", "Mobile Number"],
    type: "career",
    steps: [
      "Open online via SBI (YONO), Kotak 811, or HDFC",
      "Submit Aadhaar number for OTP-based e-KYC",
      "Complete video-KYC if prompted by the bank",
      "Account is activated within 24–48 hours",
    ],
    tips: "Ensure your name matches your PAN exactly to avoid bank verification failures.",
  },
  {
    title: "Tax Filing (ITR)",
    desc: "ITR filing builds your legal financial record for future loans and visa applications.",
    link: "https://www.incometax.gov.in/iec/foportal/",
    time: "Deadline: July 31st",
    fee: "Free (Self-Filing)",
    required: ["Form 16 from HR", "PAN", "Bank Details"],
    type: "career",
    steps: [
      "Collect Form 16 from HR/Finance by June 15",
      "Log in at incometax.gov.in with PAN",
      "Select ITR-1 (for most salaried employees)",
      "Import pre-filled data and e-verify with Aadhaar",
    ],
    tips: "Even if your income is below the tax limit, filing ITR is highly recommended for credit history.",
  },
];

// --- Skill Guides ---
const skillGuides = [
  {
    title: "Generative AI",
    icon: Sparkles,
    color: "bg-blue-50",
    text: "text-blue-600",
    level: "2026 Core Demand",
    duration: "2–3 months",
    skills: ["Prompt Engineering", "Fine-tuning LLMs", "RAG Systems", "Vector DBs"],
    jobs: "https://www.naukri.com/generative-ai-jobs",
    salary: "₹8L – ₹25L (FY)",
  },
  {
    title: "Agentic AI Developer",
    icon: Brain,
    color: "bg-violet-50",
    text: "text-violet-600",
    level: "Cutting Edge",
    duration: "3–4 months",
    skills: ["LangGraph", "Multi-Agent Systems", "Stateful Agents", "AI Orchestration"],
    jobs: "https://www.naukri.com/ai-agent-jobs",
    salary: "₹12L – ₹35L+",
  },
  {
    title: "Product Design (UI/UX)",
    icon: Layers,
    color: "bg-pink-50",
    text: "text-pink-600",
    level: "Creative Focus",
    duration: "3–4 months",
    skills: ["Figma Mastery", "User Research", "Design Systems", "Prototyping"],
    jobs: "https://www.naukri.com/ux-designer-jobs",
    salary: "₹4L – ₹20L",
  },
  {
    title: "Full-Stack Web (Next.js)",
    icon: Globe,
    color: "bg-emerald-50",
    text: "text-emerald-600",
    level: "High Employment",
    duration: "4–6 months",
    skills: ["TypeScript", "Next.js 15", "Server Components", "Tailwind CSS"],
    jobs: "https://www.naukri.com/frontend-developer-jobs",
    salary: "₹3L – ₹15L",
  },
  {
    title: "Cloud & DevSecOps",
    icon: Shield,
    color: "bg-rose-50",
    text: "text-rose-600",
    level: "Systems Infrastructure",
    duration: "6–8 months",
    skills: ["AWS / Azure", "Docker & K8s", "CI/CD Pipelines", "Terraform"],
    jobs: "https://www.naukri.com/devops-jobs",
    salary: "₹6L – ₹22L",
  },
  {
    title: "Data Intelligence",
    icon: Database,
    color: "bg-amber-50",
    text: "text-amber-600",
    level: "Enterprise Strategy",
    duration: "5–7 months",
    skills: ["Python", "Pandas", "SQL", "PowerBI / Tableau"],
    jobs: "https://www.naukri.com/data-science-jobs",
    salary: "₹5L – ₹18L",
  },
];

function DocCard({ doc, i }: { doc: typeof govDocs[0]; i: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col group overflow-hidden"
    >
      <div className="p-8 md:p-10 space-y-6 flex-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight group-hover:text-blue-600 transition-colors">{doc.title}</h3>
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${doc.type === 'government' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {doc.type}
          </span>
        </div>
        <p className="text-stone-500 font-medium leading-relaxed">{doc.desc}</p>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-stone-50 rounded-2xl">
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Timeframe</p>
              <p className="text-sm font-bold text-stone-700">{doc.time}</p>
           </div>
           <div className="p-4 bg-stone-50 rounded-2xl">
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Standard Fee</p>
              <p className="text-sm font-bold text-stone-700">{doc.fee}</p>
           </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Mandatory Tools:</p>
          <div className="flex flex-wrap gap-2">
            {doc.required.map(req => (
              <span key={req} className="px-3 py-1 bg-stone-50 border border-stone-100 rounded-lg text-xs font-bold text-stone-500">{req}</span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-6 space-y-6 border-t border-stone-50 mt-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ChevronRight className="w-3.5 h-3.5" /> Step-by-Step Pathway
                  </p>
                  <div className="space-y-4">
                    {doc.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</div>
                        <p className="text-sm font-medium text-stone-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-900 leading-relaxed"><span className="uppercase text-[10px] tracking-widest block mb-1">Critical Insight:</span> {doc.tips}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-stone-50 grid grid-cols-2 p-4 gap-2 bg-stone-50/50">
        <button
          onClick={() => setExpanded(e => !e)}
          className={`py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${expanded ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-400 border border-stone-100 hover:text-stone-900 shadow-sm'}`}
        >
          {expanded ? <><ChevronUp className="w-4 h-4" /> Close Steps</> : <><ChevronDown className="w-4 h-4" /> View How-To</>}
        </button>
        <a href={doc.link} target="_blank" rel="noopener noreferrer" className="py-3 bg-white border border-stone-100 rounded-2xl font-bold text-xs text-stone-400 hover:text-blue-600 shadow-sm flex items-center justify-center gap-2 transition-all">
          Direct Portal <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

function SkillCard({ guide, i }: { guide: typeof skillGuides[0]; i: number }) {
  const Icon = guide.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05 }}
      className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 p-10 space-y-8 flex flex-col group hover:border-blue-100 transition-colors"
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl ${guide.color} ${guide.text} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
           <Icon className="w-7 h-7" />
        </div>
        <div className="space-y-1">
           <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">{guide.level}</p>
           <h3 className="text-xl font-extrabold text-stone-900 tracking-tight leading-none">{guide.title}</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
         <div className="p-3 bg-stone-50 rounded-xl">
            <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mb-1">Timeline</p>
            <p className="text-[11px] font-extrabold text-stone-700 uppercase tracking-widest">{guide.duration}</p>
         </div>
         <div className="p-3 bg-emerald-50 rounded-xl">
            <p className="text-[8px] font-bold text-emerald-300 uppercase tracking-widest mb-1">India Salary</p>
            <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest">{guide.salary}</p>
         </div>
      </div>

      <div className="flex flex-wrap gap-2">
         {guide.skills.map(s => (
           <span key={s} className="px-3 py-1 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold text-stone-400">{s}</span>
         ))}
      </div>

      <div className="pt-6 border-t border-stone-50 flex items-center justify-between gap-4">
         <a href={guide.jobs} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-stone-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest text-center shadow-lg hover:shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            Find Opportunities <ArrowRight className="w-4 h-4" />
         </a>
      </div>
    </motion.div>
  );
}

export default function Documents() {
  const [tab, setTab] = useState<'skills' | 'docs'>('skills');

  return (
    <div className="min-h-screen bg-stone-50/50 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <header className="space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl">
               <BookOpen className="w-8 h-8" />
            </div>
            <p className="text-[10px] font-bold text-stone-400">Resources & protocol</p>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Roadmaps & <span className="text-blue-600 underline underline-offset-8 decoration-stone-200">Docs</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-500 font-medium leading-relaxed">
              Step-by-step skill guides and essential government documentation frameworks, optimized for Indian career seekers.
            </p>
          </div>
        </header>

        {/* Tab Control */}
        <div className="flex bg-white p-2 border border-stone-100 rounded-[2.5rem] shadow-xl shadow-stone-200/50 w-fit">
          <button
            onClick={() => setTab('skills')}
            className={`px-8 py-4 rounded-[1.75rem] font-bold text-xs transition-all flex items-center gap-3 ${tab === 'skills' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-stone-400 hover:bg-stone-50'}`}
          >
            <GraduationCap className="w-4 h-4" /> Career skill roadmaps
          </button>
          <button
            onClick={() => setTab('docs')}
            className={`px-8 py-4 rounded-[1.75rem] font-bold text-xs transition-all flex items-center gap-3 ${tab === 'docs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-stone-400 hover:bg-stone-50'}`}
          >
            <Landmark className="w-4 h-4" /> Government document path
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'skills' ? (
            <motion.div key="skills" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-12">
              <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-8 group">
                <div className="p-5 bg-white rounded-3xl text-blue-600 shadow-sm group-hover:scale-105 transition-transform"><Star className="w-8 h-8 fill-current" /></div>
                <div className="text-center md:text-left space-y-2">
                  <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight leading-none">India-Focused Growth Guides</h3>
                  <p className="text-stone-500 font-medium leading-relaxed max-w-2xl">Each protocol includes real-world expected timelines, localized salary intelligence, and direct connectivity to Naukri job nodes.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {skillGuides.map((guide, i) => <SkillCard key={i} guide={guide} i={i} />)}
              </div>
            </motion.div>
          ) : (
            <motion.div key="docs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-12">
              <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-center gap-8 group">
                <div className="p-5 bg-white rounded-3xl text-amber-500 shadow-sm group-hover:scale-105 transition-transform"><AlertTriangle className="w-8 h-8 fill-current" /></div>
                <div className="text-center md:text-left space-y-2">
                  <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight leading-none">Critical Identity Checklist</h3>
                  <p className="text-stone-500 font-medium leading-relaxed max-w-2xl">
                    Crucial: Your name, DOB, and guardian name must match <span className="text-stone-900 font-extrabold underline decoration-amber-200 decoration-4">exactly</span> across all protocols to avoid verification failures.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {govDocs.map((doc, i) => <DocCard key={i} doc={doc} i={i} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
