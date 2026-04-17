'use client';

import { motion } from 'framer-motion';

interface IkigaiDiagramProps {
  activeZone?: 'passion' | 'profession' | 'mission' | 'vocation' | 'ikigai' | null;
  onHoverZone?: (zone: string | null) => void;
}

export function IkigaiDiagram({ activeZone, onHoverZone }: IkigaiDiagramProps) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } },
  };

  const circleVariants = (colorClass: string, isActive: boolean) => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: isActive ? 0.9 : 0.6, 
      scale: isActive ? 1.05 : 1, 
      transition: { duration: 0.5, type: "spring" as const } 
    },
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center p-12 overflow-visible"
    >
      {/* 4 Overlapping Circles */}
      
      {/* LOVE (Top-Right) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border border-white/20 bg-rose-400 backdrop-blur-sm flex items-center justify-center cursor-help shadow-xl`}
        style={{ top: '10%', right: '10%', zIndex: 1 }}
        animate={activeZone === 'passion' ? "visible" : "visible"}
        variants={circleVariants("bg-rose-400", activeZone === 'passion')}
        onMouseEnter={() => onHoverZone?.('passion')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-extrabold text-white text-[10px] md:text-sm tracking-widest uppercase pb-12 pl-12">What you<br/>Love</div>
      </motion.div>

      {/* SKILLS (Top-Left) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border border-white/20 bg-emerald-400 backdrop-blur-sm flex items-center justify-center cursor-help shadow-xl`}
        style={{ top: '10%', left: '10%', zIndex: 1 }}
        animate={activeZone === 'profession' ? "visible" : "visible"}
        variants={circleVariants("bg-emerald-400", activeZone === 'profession')}
        onMouseEnter={() => onHoverZone?.('profession')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-extrabold text-white text-[10px] md:text-sm tracking-widest uppercase pb-12 pr-12">What you are<br/>Good at</div>
      </motion.div>

      {/* MARKET (Bottom-Left) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border border-white/20 bg-indigo-400 backdrop-blur-sm flex items-center justify-center cursor-help shadow-xl`}
        style={{ bottom: '10%', left: '10%', zIndex: 1 }}
        animate={activeZone === 'mission' ? "visible" : "visible"}
        variants={circleVariants("bg-indigo-400", activeZone === 'mission')}
        onMouseEnter={() => onHoverZone?.('mission')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-extrabold text-white text-[10px] md:text-sm tracking-widest uppercase pt-12 pr-12">What the<br/>World needs</div>
      </motion.div>

      {/* INCOME (Bottom-Right) */}
      <motion.div
        className={`absolute w-3/5 h-3/5 rounded-full border border-white/20 bg-amber-400 backdrop-blur-sm flex items-center justify-center cursor-help shadow-xl`}
        style={{ bottom: '10%', right: '10%', zIndex: 1 }}
        animate={activeZone === 'vocation' ? "visible" : "visible"}
        variants={circleVariants("bg-amber-400", activeZone === 'vocation')}
        onMouseEnter={() => onHoverZone?.('vocation')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center font-extrabold text-white text-[10px] md:text-sm tracking-widest uppercase pt-12 pl-12">What you can<br/>be paid for</div>
      </motion.div>

      {/* IKIGAI - The Center Intersection */}
      <motion.div
        className="absolute w-28 h-28 rounded-full bg-white border-4 border-stone-900 text-stone-900 flex items-center justify-center cursor-pointer z-50 shadow-2xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1, 
          scale: activeZone === 'ikigai' ? 1.15 : 1, 
          rotate: activeZone === 'ikigai' ? 180 : 0,
          transition: { delay: 0.5, type: "spring" } 
        }}
        onMouseEnter={() => onHoverZone?.('ikigai')}
        onMouseLeave={() => onHoverZone?.(null)}
      >
        <div className="text-center">
          <div className={`font-black text-xs tracking-[0.2em] transition-all ${activeZone === 'ikigai' ? 'rotate-180 scale-110' : ''}`}>IKIGAI</div>
        </div>
      </motion.div>
    </motion.div>
  );
}
