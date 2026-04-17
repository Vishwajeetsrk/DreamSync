'use client';

import { motion } from 'framer-motion';
import { Heart, Zap, Shield, Star, Copy, Check, Coffee, Pizza, PartyPopper, Rocket, HeartHandshake, Lock, Sparkles, IndianRupee, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const upiId = 'vishwajeetsrk-1@okhdfcbank';

const amounts = [
  { icon: Coffee, label: 'Buy a Chai', amount: '₹20', desc: 'A small token of love', color: 'bg-amber-50', text: 'text-amber-600' },
  { icon: Pizza, label: 'Buy a Snack', amount: '₹50', desc: 'Fuel for our journey', color: 'bg-rose-50', text: 'text-rose-600' },
  { icon: PartyPopper, label: 'Super Support', amount: '₹100', desc: "You're truly amazing!", color: 'bg-emerald-50', text: 'text-emerald-600' },
  { icon: Rocket, label: 'Impact Legend', amount: '₹250', desc: 'Hall of fame support', color: 'bg-violet-50', text: 'text-violet-600' },
];

const whyItems = [
  { 
    title: 'AI Intelligence', 
    desc: 'Every resume scan and roadmap step uses real AI credits. Your support keeps these tools free for everyone.', 
    icon: Brain, 
    color: 'bg-blue-50', 
    text: 'text-blue-600' 
  },
  { 
    title: 'Server Stability', 
    desc: 'Reliable hosting and infrastructure ensure DreamSync is always available when a student needs it.', 
    icon: ShieldCheck, 
    color: 'bg-emerald-50', 
    text: 'text-emerald-600' 
  },
  { 
    title: 'New Horizons', 
    desc: 'Mock Interviews, GitHub analysis, and automated paths — we build faster with your community support.', 
    icon: Star, 
    color: 'bg-amber-50', 
    text: 'text-amber-600' 
  },
];

function Brain({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.248 4 4 0 0 0 4.153 2.857 4 4 0 0 0 7.697-1.125 4 4 0 0 0 2.526-5.77 4 4 0 0 0-.52-8.248 4 4 0 0 0-4.153-2.857 4 4 0 0 0-1.7 3.95Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 12.001 5"/><path d="M15.001 8a4.5 4.5 0 0 1-3 4"/></svg>
  );
}

export default function DonatePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-24">

        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-full text-rose-600 text-[10px] font-bold uppercase tracking-widest"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Support Our Mission</span>
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Gift a <span className="text-blue-600">Future</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 font-medium leading-relaxed max-w-3xl mx-auto italic">
              DreamSync is 100% free for students. If we've helped your journey, consider supporting us—every contribution keeps the sanctuary open.
            </p>
          </div>
        </section>

        {/* Mission Banner */}
        <section className="bg-stone-900 text-white p-10 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             <Heart className="w-48 h-48 fill-current" />
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="shrink-0 p-8 bg-white/10 backdrop-blur-md rounded-[3rem] border border-white/10 shadow-xl">
                 <HeartHandshake className="w-16 h-16 text-rose-400" />
              </div>
              <div className="space-y-6 text-center md:text-left">
                 <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Why we need your light.</h2>
                 <p className="text-lg md:text-xl text-stone-400 font-medium leading-relaxed max-w-2xl">
                    We don't charge subscriptions or sell data. DreamSync thrives on passion and community love. Your support directly funds the AI that powers growth for millions.
                 </p>
              </div>
           </div>
        </section>

        {/* QR + UPI Card */}
        <section className="bg-white rounded-[4rem] border border-stone-100 shadow-2xl shadow-stone-200/50 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Secure UPI Transfer</h2>
            <p className="text-blue-100 font-medium mt-1 opacity-80 uppercase text-[10px] tracking-widest font-bold">GPay · PhonePe · Paytm · BHIM</p>
          </div>

          <div className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-16">
            {/* QR Code Architecture */}
            <div className="shrink-0 flex flex-col items-center gap-6">
              <div className="relative p-6 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200 shadow-inner group transition-all">
                <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-3 shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src="/qr-code.jpeg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=DreamSync&cu=INR`)}`;
                    }}
                    alt="UPI QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-bold px-4 py-1.5 rounded-full shadow-lg">SCAN TO GIFT</div>
              </div>
              <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest flex items-center gap-2">
                 <Lock className="w-3.5 h-3.5" /> Secure Channel
              </p>
            </div>

            {/* UPI Details */}
            <div className="flex-1 space-y-10 text-center md:text-left">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">UPI Identity</p>
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  <div className="bg-stone-50 border border-stone-100 px-6 py-4 rounded-3xl font-extrabold text-xl text-stone-900 shadow-inner break-all">
                    {upiId}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`p-4 rounded-2xl transition-all shadow-sm flex items-center gap-2 border ${copied ? 'bg-emerald-500 text-white border-emerald-400 scale-95' : 'bg-white text-stone-400 border-stone-100 hover:text-blue-600'}`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <p className="font-extrabold text-stone-900 text-lg">Simple 3-Step Process</p>
                <div className="space-y-4">
                  {[
                    'Open any UPI payment app on your device', 
                    'Scan our specialized QR or paste our UPI ID', 
                    'Gift any amount—your light keeps our servers active 🌟'
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-stone-500 font-medium leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Amounts */}
        <section className="space-y-12">
          <div className="flex items-center gap-6">
             <div className="h-px bg-stone-200 flex-1" />
             <h2 className="text-xs font-extrabold text-stone-300 uppercase tracking-[0.4em] px-4">Suggested Gifts</h2>
             <div className="h-px bg-stone-200 flex-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {amounts.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={handleCopy}
                className="bg-white border border-stone-100 p-10 rounded-[3rem] text-center space-y-6 hover:shadow-xl hover:-translate-y-2 transition-all group"
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl ${item.color} ${item.text} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                   <div className="text-3xl font-extrabold text-stone-900 tracking-tight">{item.amount}</div>
                   <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{item.label}</p>
                </div>
                <p className="text-[10px] font-bold text-stone-300 uppercase tracking-tighter italic">{item.desc}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Impact Transparency */}
        <section className="space-y-12">
          <div className="flex items-center gap-6">
             <div className="h-px bg-stone-200 flex-1" />
             <h2 className="text-xs font-extrabold text-stone-300 uppercase tracking-[0.4em] px-4">Transparency</h2>
             <div className="h-px bg-stone-200 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-6 relative group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} ${item.text} flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">{item.title}</h3>
                  <p className="text-stone-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-10 py-12">
          <div className="flex justify-center flex-col items-center gap-4">
            <HeartHandshake className="w-12 h-12 text-rose-500" />
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">The community is grateful.</h2>
          </div>
          <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Even if you can't gift a contribution today, simply sharing DreamSync with friends helps us more than you know. 🌸
          </p>
          <div className="pt-6">
            <Link
              href="/dashboard"
              className="btn-primary !px-12 !py-5 text-xl flex items-center gap-3 w-fit mx-auto shadow-2xl"
            >
              Back to Dashboard <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
