'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Globe, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'We couldn\'t find an account with that email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex items-center justify-center px-6 py-20 selection:bg-blue-100">
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
                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Account Recovery</h1>
                <p className="text-stone-400 font-medium">Get back into your DreamSync sanctuary.</p>
            </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-10">
          
          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-4">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Recovery Email Sent!</h2>
                <p className="text-stone-500 font-medium md:px-6">
                  Check your inbox for the link we sent to: <br />
                  <span className="text-blue-600 font-bold block mt-3 p-3 bg-blue-50 rounded-2xl break-all">{email}</span>
                </p>
              </div>
              <Link 
                href="/login" 
                className="btn-primary w-full !py-4 flex items-center justify-center gap-2"
              >
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-stone-500 max-w-[280px]">Enter your email and we'll send you a secure link to reset your password.</p>
              </div>

              <form onSubmit={handleReset} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Recovery Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field !pl-12"
                      placeholder="Arjun@example.com"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold">
                    {error}
                  </motion.div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full !py-4 text-lg flex items-center justify-center gap-3 shadow-xl"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-5 h-5" />}
                  Send Recovery Link
                </button>
              </form>

              <div className="pt-8 text-center border-t border-stone-50">
                <Link href="/login" className="text-stone-400 font-bold hover:text-blue-600 transition-colors inline-flex items-center gap-2 uppercase text-[10px] tracking-widest">
                  <ArrowLeft className="w-4 h-4" /> Go Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center items-center gap-6 text-stone-300">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase tracking-widest">Private Recovery Protocol</span>
          <Globe className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}
