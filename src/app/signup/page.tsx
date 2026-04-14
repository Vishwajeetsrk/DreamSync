'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Database, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Zap, Globe, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        created_at: new Date().toISOString(),
        onboarding_complete: false,
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    try {
      const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;

      // Check if user exists, if not create
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
      console.error(`${provider} signup error:`, err);
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
            <div className="inline-block p-4 bg-[#FACC15] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
               <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-black">Create Identity_</h1>
            <p className="text-gray-400 text-xs tracking-[0.2em]">Synchronize with the Grid</p>
          </div>

          {error && (
            <div className="p-5 bg-red-100 border-4 border-black text-red-600 text-xs font-black flex items-center gap-4 animate-shake shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="w-6 h-6 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6 text-black">
            <div className="space-y-3">
              <label className="text-xs font-black tracking-widest ml-1">FULL_SIGNATURE</label>
              <input 
                type="text" 
                required 
                className="neo-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="YOUR NAME"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black tracking-widest ml-1">NETWORK_ADDRESS</label>
              <input 
                type="email" 
                required 
                className="neo-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="NAME@EMAIL.COM"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black tracking-widest ml-1">SECRET_CIPHER</label>
              <input 
                type="password" 
                required 
                className="neo-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="neo-btn-primary w-full h-16 text-lg mt-4 flex items-center justify-center gap-4"
            >
              {loading ? (
                 <div className="w-8 h-8 border-4 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Establish Node <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </form>

          <div className="pt-10 border-t-4 border-dashed border-black/10 space-y-8">
            <div className="text-center">
              <span className="bg-white px-4 text-xs font-black text-gray-400 uppercase tracking-widest relative -top-[52px]">Bridge Connections</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 -mt-8">
              <button 
                type="button"
                onClick={() => handleSocialSignup('google')}
                disabled={loading}
                className="flex items-center justify-center gap-3 p-4 border-4 border-black font-black text-xs uppercase hover:bg-red-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google Auth
              </button>
              <button 
                type="button"
                onClick={() => handleSocialSignup('github')}
                disabled={loading}
                className="flex items-center justify-center gap-3 p-4 border-4 border-black font-black text-xs uppercase hover:bg-gray-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              >
                <Github className="w-4 h-4" /> GitHub Node
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-xs font-black uppercase tracking-widest text-[#2563EB] hover:underline">
                 Existing Node ID? Access Terminal Here →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-4 opacity-30 grayscale">
           <ShieldCheck className="w-5 h-5" />
           <span className="text-[10px] font-black tracking-[0.6em]">SOVEREIGN SECURITY LAYER 4.0</span>
           <Globe className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  );
}
