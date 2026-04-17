'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Users, Linkedin, X, Info, Star, Heart, GraduationCap } from 'lucide-react';
import Image from 'next/image';

const team = [
  {
    name: "Anand Biniya",
    dept: "Leadership",
    link: "https://www.linkedin.com/in/anandbin/",
    image: "/Anand.jpeg",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    intro: "Strategic visionary leading DreamSync's AI evolution. Dedicated to bridging the gap between talent and opportunity for 10M+ Indian students."
  },
  {
    name: "Ayush Bajpai",
    dept: "Operations",
    link: "https://www.linkedin.com/in/ayush-bajpai25/",
    image: "/Ayush.jpeg",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    intro: "Execution powerhouse ensuring platform reliability. Specializes in optimizing organizational workflows and scaling intelligence clusters."
  },
  {
    name: "Vishwajeet",
    dept: "CE Training",
    link: "https://www.linkedin.com/in/vishwajeetsrk/",
    image: "/vishwajeet.jpeg",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    intro: "Chief architect of the CE Training protocol. Developing high-fidelity learning pathways for complex technical ecosystems."
  },
  {
    name: "Chaitanya Khaleja",
    dept: "Programme",
    link: "https://www.linkedin.com/in/chaitanya-khaleja-975502255/",
    image: "/Chaitanya.jpeg",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    intro: "Community engagement specialist focused on empowerment. Building support nodes for care-experienced individuals across the platform."
  },
  {
    name: "Nisha Das",
    dept: "Resources",
    link: "https://www.linkedin.com/in/nisha-das-ab9bb5246/",
    image: "/Nisha.jpeg",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    intro: "Resource pipeline manager optimizing document verification and global guidance nodes for professional success."
  },
  {
    name: "Hrithik Kumar",
    dept: "Project Management",
    link: "https://www.linkedin.com/in/kumar-hrithik/",
    image: "/Hrithik.jpg",
    bgColor: "bg-violet-50",
    textColor: "text-violet-600",
    intro: "Strategic project lead focused on scaling AI-driven career intelligence nodes across the DreamSync ecosystem."
  },
];

export default function Team() {
  const [activeMember, setActiveMember] = useState<null | typeof team[0]>(null);

  return (
    <div className="min-h-screen bg-stone-50/50 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-24">

        {/* Introduction Modal */}
        <AnimatePresence>
          {activeMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-6"
              onClick={() => setActiveMember(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white p-8 md:p-12 max-w-2xl w-full rounded-[3rem] shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveMember(null)}
                  className="absolute top-6 right-6 p-3 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                  <div className={`w-40 h-40 rounded-[2.5rem] p-1 ${activeMember.bgColor} shrink-0 shadow-xl`}>
                    <img src={activeMember.image} alt={activeMember.name} className="w-full h-full object-cover rounded-[2.2rem]" />
                  </div>
                  
                  <div className="text-center md:text-left space-y-6 flex-1">
                    <div className="space-y-2">
                      <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${activeMember.bgColor} ${activeMember.textColor}`}>
                        {activeMember.dept}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                        {activeMember.name}
                      </h2>
                    </div>
                    
                    <p className="text-lg font-medium text-stone-500 leading-relaxed italic">
                      "{activeMember.intro}"
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <a
                        href={activeMember.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary !py-4 flex-1 flex items-center justify-center gap-3"
                      >
                        <Linkedin className="w-5 h-5 fill-current" /> LinkedIn Profile
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Header */}
        <header className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-bold"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Meet your career mentors</span>
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Our Core <span className="text-blue-600">Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 font-medium leading-relaxed italic">
              A dedicated team of experts helping Indian students build successful careers and reach their dreams through inclusive intelligence.
            </p>
          </div>
        </header>

        {/* Section Title */}
        <div className="flex items-center gap-6">
           <div className="h-px bg-stone-200 flex-1" />
           <h2 className="text-sm font-extrabold text-stone-400 px-4 whitespace-nowrap">The collective</h2>
           <div className="h-px bg-stone-200 flex-1" />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveMember(member)}
              className="group cursor-pointer space-y-6"
            >
              <div className={`relative aspect-square rounded-[3rem] p-1.5 ${member.bgColor} shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 overflow-hidden`}>
                 <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-[2.7rem] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors" />
              </div>

              <div className="text-center space-y-2 px-2">
                <p className={`text-[9px] font-bold uppercase tracking-widest ${member.textColor}`}>{member.dept}</p>
                <h3 className="text-lg font-extrabold text-stone-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Callout */}
        <div className="bg-white border border-stone-100 rounded-[3rem] p-12 shadow-xl shadow-stone-200/50 flex flex-col md:flex-row items-center justify-between gap-10">
           <div className="space-y-4 text-center md:text-left">
              <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">Support nodes for 10M+ seekers.</h3>
              <p className="text-stone-500 font-medium max-w-xl underline decoration-blue-100 underline-offset-4">We're building more than a platform; we're building a sanctuary for talent that just needs a chance.</p>
           </div>
           <div className="flex gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl">
                 <Heart className="w-8 h-8 text-rose-500 fill-current" />
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl">
                 <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
