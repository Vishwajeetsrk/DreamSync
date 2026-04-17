'use client';

import Link from 'next/link';
import { Coffee, Globe, Shield, Zap, Sparkles, Linkedin, Mail, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-stone-100 pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
        
        {/* Brand Identity */}
        <div className="space-y-6">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image 
              src="/DreamSynclogo.png" 
              alt="DreamSync Logo" 
              width={160} 
              height={40} 
              className="object-contain" 
            />
          </Link>
          <p className="text-sm font-medium leading-relaxed text-stone-400 max-w-xs">
            Helping students build bright careers with friendly guidance, professional resumes, and life support tools.
          </p>
        </div>
        
        {/* Features column */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest">Our Tools</h4>
          <ul className="space-y-4 text-sm font-semibold text-stone-500">
            <li><Link href="/resume-builder" className="hover:text-blue-600 transition-colors">Resume Builder</Link></li>
            <li><Link href="/ats-check" className="hover:text-blue-600 transition-colors">ATS Score Check</Link></li>
            <li><Link href="/roadmap" className="hover:text-blue-600 transition-colors">Career Roadmap</Link></li>
            <li><Link href="/portfolio" className="hover:text-blue-600 transition-colors">Web Portfolio</Link></li>
            <li><Link href="/mental-health" className="hover:text-blue-600 transition-colors">Mental Wellbeing</Link></li>
          </ul>
        </div>
        
        {/* Community column */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest">Connect</h4>
          <ul className="space-y-4 text-sm font-semibold text-stone-500">
            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Story</Link></li>
            <li><Link href="/community" className="hover:text-blue-600 transition-colors">Join Community</Link></li>
            <li><Link href="/team" className="hover:text-blue-600 transition-colors">Meet the Team</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            <li><Link href="/donate" className="hover:text-blue-600 transition-colors font-bold text-blue-600">Support Our Mission</Link></li>
          </ul>
        </div>

        {/* Social column */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-widest">Follow Us</h4>
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://www.instagram.com/dream_sync_hub?igsh=MW50dHk3Znh5eTczcg==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all shadow-sm"
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a 
              href="https://x.com/ADreamsync" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all shadow-sm"
            >
              <Twitter className="w-5 h-5" />
            </a>

            <a 
              href="https://www.linkedin.com/company/dreamsync-community/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            
            <a 
              href="mailto:dreamsyncbangalore@gmail.com"
              className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-block">
            Made with ❤️ for Indian Students
          </p>
        </div>
      </div>
      
      {/* Bottom Meta */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-stone-400">
        <p>© {currentYear} Dream Sync. Empowering Care-Experienced Youth.</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-200">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-200">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
