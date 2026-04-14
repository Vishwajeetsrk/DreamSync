'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Binary, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Zap, Globe, Fingerprint, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    try {
      const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      // Ensure user document exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0],
          email: user.email,
          avatar_url: user.photoURL || '',
          created_at: new Date().toISOString(),
          onboarding_complete: false,
          provider: provider
        });
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error(`${provider} login error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-6 selection:bg-[#FACC15]/40 font-bold">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="neo-box p-12 bg-white space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-[#2563EB] text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
               <Fingerprint className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-black">Hub Authentication_</h1>
            <p className="text-gray-400 text-xs tracking-[0.2em]">Secure Access Required</p>
          </div>

          {error && (
            <div className="p-5 bg-red-100 border-4 border-black text-red-600 text-xs font-black flex items-center gap-4 animate-shake shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-6 h-6 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8 text-black">
            <div className="space-y-4">
              <label className="text-xs font-black tracking-widest ml-1">IDENTITY_MAIL</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required 
                  className="neo-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="NAME@EMAIL.COM"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black tracking-widest">SECRET_PROTOCOL</label>
                <Link href="/forgot-password" title="Forgot Password" className="text-[10px] text-[#2563EB] hover:underline">RECOVER ACCESS?</Link>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  required 
                  className="neo-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="neo-btn-primary w-full h-16 text-lg flex items-center justify-center gap-4"
            >
              {loading ? (
                 <div className="w-8 h-8 border-4 border-white/30 border-t-white animate-spin" />
              ) : (
                <>AUTHENTICATE NODE <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </form>

          <div className="pt-10 border-t-4 border-dashed border-black/10 space-y-8">
            <div className="text-center">
              <span className="bg-white px-4 text-xs font-black text-gray-400 uppercase tracking-widest relative -top-[52px]">Alternative Ports</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-8">
              <button 
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-3 p-4 border-4 border-black font-black text-xs uppercase hover:bg-red-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google Access
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
                className="flex items-center justify-center gap-3 p-4 border-4 border-black font-black text-xs uppercase hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <Github className="w-4 h-4" /> GitHub Node
              </button>
            </div>

            <div className="text-center">
              <Link href="/signup" className="text-xs font-black uppercase tracking-widest text-[#2563EB] hover:underline">
                 No Node ID? Register Here →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-4 opacity-30 grayscale">
           <Zap className="w-5 h-5" />
           <span className="text-[10px] font-black tracking-[0.6em]">SOVEREIGN ACCESS TERMINAL v4.0</span>
           <Globe className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}
