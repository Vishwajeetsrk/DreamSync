'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, ShieldCheck, Loader2, Zap, Star, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let friendlyMessage = "We couldn't find an account with that email. Please check and try again.";
      if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = "Too many requests. Please wait a few minutes before trying again.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50/50 flex items-center justify-center px-6 selection:bg-blue-100">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white border border-stone-100 p-10 md:p-12 rounded-[3rem] shadow-xl shadow-stone-200/50 space-y-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-8 overflow-hidden relative">
                 <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                    <CheckCircle2 className="w-10 h-10" />
                 </motion.div>
                 <div className="absolute inset-0 bg-emerald-100/20 animate-pulse" />
              </div>
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Email Sent! 🌸</h1>
              <p className="text-stone-500 font-medium mt-4 leading-relaxed">
                We've sent a recovery link to: <br/>
                <span className="text-blue-600 font-bold block mt-2 p-3 bg-blue-50 rounded-2xl break-all">{email}</span>
              </p>
            </div>
            
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-4 text-left">
               <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
               <p className="text-xs font-bold text-stone-400 leading-relaxed uppercase tracking-widest">Check your spam folder if you don't see it in a few minutes. The link expires soon.</p>
            </div>

            <Link href="/login" className="btn-primary w-full !py-4 flex items-center justify-center gap-2">
               <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/50 flex items-center justify-center px-6 selection:bg-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] space-y-10"
      >
        <div className="text-center space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image 
                src="/DreamSynclogo.png" 
                alt="DreamSync Logo" 
                width={160} 
                height={40} 
                className="object-contain" 
                priority 
              />
            </Link>
            <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Need help logging in?</h1>
                <p className="text-stone-400 font-medium tracking-tight">No worries! We'll help you get back in.</p>
            </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-stone-500 max-w-[200px]">Enter your email for a secure recovery link.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  required
                  className="input-field !pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Arjun@example.com"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full !py-4 text-lg flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
              {loading ? 'Sending...' : 'Send Recovery Link'} 
            </button>
          </form>

          <div className="pt-8 text-center border-t border-stone-50">
            <Link href="/login" className="text-stone-400 font-bold hover:text-blue-600 transition-colors inline-flex items-center gap-2 uppercase text-[10px] tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Go Back to Login
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 text-stone-300">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase tracking-widest">Secure Recovery Channel</span>
          <Globe className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}
