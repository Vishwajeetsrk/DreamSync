'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Coffee, LogOut, ShieldCheck, User as UserIcon, Menu, X, Sparkles, Orbit, Zap, LayoutDashboard, Fingerprint, ArrowRight, Settings, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const { user, userData } = useAuth();
  const { t } = useLanguage();
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      await nextAuthSignOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  const featureLinks = [
    { name: 'Career Roadmap', href: '/roadmap' },
    { name: 'AI Career Agent', href: '/career-agent' },
    { name: 'Resume Builder', href: '/resume-builder' },
    { name: 'ATS Score Check', href: '/ats-check' },
    { name: 'Ikigai Finder', href: '/ikigai' },
    { name: 'Web Portfolio', href: '/portfolio' },
    { name: 'LinkedIn Guide', href: '/linkedin' },
    { name: 'Mental Health AI', href: '/mental-health' },
    { name: 'Free Resources', href: '/documents' },
  ];

  const mainLinks = [
    { name: 'About', href: '/about' },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Support', href: '/donate' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Branding */}
        <Link href="/" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
           <Image 
             src="/DreamSynclogo.png" 
             alt="DreamSync Logo" 
             width={160} 
             height={40} 
             className="object-contain w-[130px] md:w-[160px]" 
             priority 
           />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-blue-600 transition-colors py-2">
              Features <ChevronDown className={`w-4 h-4 transition-transform duration-200 group-hover:rotate-180`} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
               <div className="grid gap-1">
                  {featureLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-stone-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
               </div>
            </div>
          </div>
          
          {mainLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${pathname === link.href ? 'text-blue-600' : 'text-stone-600 hover:text-blue-600'}`}
            >
              {link.name}
              {link.name === 'Community' && <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block text-sm font-semibold text-stone-600 hover:text-stone-900 px-4 py-2">
                Login
              </Link>
              <Link href="/signup" className="btn-primary text-sm !px-6 !py-2.5">
                Join Now
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full hover:bg-blue-100 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
               <div className="relative">
                 <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full border-2 border-stone-100 overflow-hidden flex items-center justify-center bg-stone-50 transition-all hover:ring-4 hover:ring-blue-50 focus:ring-4 focus:ring-blue-100"
                 >
                   {userData?.avatar_url ? (
                     <img src={userData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <UserIcon className="w-5 h-5 text-stone-500" />
                   )}
                 </button>

                 <AnimatePresence>
                   {isProfileOpen && (
                     <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 p-3 z-50 overflow-hidden"
                        >
                          <div className="px-3 py-3 border-b border-stone-50 mb-2">
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-0.5">Welcome</p>
                            <p className="text-sm font-bold text-stone-800 truncate">{userData?.name || 'User'}</p>
                          </div>
                          
                          <Link 
                             href="/profile" 
                             onClick={() => setIsProfileOpen(false)}
                             className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 rounded-xl transition-all"
                          >
                             <Settings className="w-4 h-4 text-stone-400" /> Account Settings
                          </Link>

                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all mt-1"
                          >
                             <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </motion.div>
                     </>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 bg-stone-100 rounded-xl text-stone-700 active:scale-90 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-stone-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-2">Tools & Guidance</p>
                <div className="grid grid-cols-1 gap-2">
                  {featureLinks.slice(0, 5).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3 bg-stone-50 rounded-2xl text-sm font-bold text-stone-700 active:bg-blue-50 active:text-blue-600 transition-all"
                    >
                      {link.name} <ArrowRight className="w-4 h-4 opacity-30" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-2">General</p>
                <div className="grid grid-cols-2 gap-3">
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 border border-stone-100 rounded-2xl text-center text-sm font-bold text-stone-700"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-4 btn-primary text-center font-bold"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
