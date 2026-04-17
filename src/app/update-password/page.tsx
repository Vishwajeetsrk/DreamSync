'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { updatePassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck, AlertCircle, Sparkles, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No active session found. Please re-authenticate.');
      
      await updatePassword(user, password);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
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
                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Secure your account</h1>
                <p className="text-stone-400 font-medium tracking-tight">Update your password to keep your sanctuary safe.</p>
            </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-10">
          
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-10 py-4">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Security Updated!</h2>
                <p className="text-stone-500 font-medium md:px-6">
                  Your new password is now active. We're taking you back to your sanctuary in a moment...
                </p>
              </div>
              <div className="flex justify-center">
                 <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-stone-500 max-w-[280px]">Choose a strong, memorable password that only you know.</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field !pl-12"
                        placeholder="••••••••"
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field !pl-12"
                        placeholder="••••••••"
                        minLength={8}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </motion.div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full !py-4 text-lg flex items-center justify-center gap-3 shadow-xl"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-6 text-stone-300">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-extrabold tracking-[0.3em] uppercase tracking-widest">Encrypted Security Tunnel</span>
          <Globe className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}
