import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-glow-gradient">
      {/* Subtle noise texture for a premium matte finish */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Refined Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 backdrop-blur-sm border border-white/5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-semibold text-textMuted tracking-widest uppercase">Algorithmic Routing</span>
        </motion.div>

        {/* Stark, High-Contrast Typography without cheap gradients */}
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.05] mb-6 text-textMain">
          The new standard for <br className="hidden md:block" />
          <span className="text-textMuted">intelligent transit.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl text-textMuted mb-10 leading-relaxed font-light">
          Hyper-optimized cab matching powered by advanced spatial algorithms. 
          Scalable, instantaneous, and engineered for the modern metropolis.
        </motion.p>

        {/* Premium Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primaryHover text-background rounded-full font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            Request a Ride <ArrowRight size={18} strokeWidth={2.5} />
          </button>
          
          <button className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-surface border border-white/10 text-textMain rounded-full font-medium flex items-center justify-center gap-2 transition-all">
            <MapPin size={18} className="text-primary" /> Explore the Map
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}