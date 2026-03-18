import { motion } from 'framer-motion';
import { Car, MapPin, Navigation, TrendingUp, Wallet, ShieldCheck } from 'lucide-react';

export default function DrivePage() {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen pt-32 pb-20 px-6"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Massive Hero Dashboard */}
        <div className="bg-surfaceLight border border-white/5 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between overflow-hidden relative shadow-2xl">
          {/* Noise and Gradients */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
          
          <div className="relative z-10 max-w-xl text-center lg:text-left mb-16 lg:mb-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-white/10 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-textMain tracking-widest uppercase">Now Hiring Drivers</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-textMain mb-6">
              Drive with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">predictive intel.</span>
            </h1>
            <p className="text-xl text-textMuted mb-10 font-light">
              Stop guessing where the rides are. Our algorithmic heatmaps guide you directly into high-surge zones before the demand even hits.
            </p>
            <button className="px-8 py-4 bg-primary hover:bg-primaryHover text-background rounded-full font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 mx-auto lg:mx-0 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <Car size={20} /> Apply to Drive
            </button>
          </div>

          {/* Interactive Glowing Phone/Dashboard Mockup */}
          <div className="relative z-10 w-full max-w-md">
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full bg-background/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Mock App Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center border border-white/5">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Piyush`} alt="Driver" className="w-10 h-10 rounded-full" />
                  </div>
                  <div>
                    <p className="text-textMain font-semibold">Piyush</p>
                    <p className="text-textMuted text-xs flex items-center gap-1"><ShieldCheck size={12} className="text-green-400"/> Top Rated</p>
                  </div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                  <span className="text-green-400 text-sm font-bold">Online</span>
                </div>
              </div>

              {/* Earnings Card */}
              <div className="bg-gradient-to-br from-surfaceLight to-surface border border-white/5 rounded-2xl p-6 mb-6">
                <p className="text-textMuted text-sm mb-1">Today's Earnings</p>
                <div className="flex items-end gap-3 mb-4">
                  <h3 className="text-4xl font-bold text-textMain">$284.50</h3>
                  <span className="flex items-center text-primary text-sm font-semibold mb-1"><TrendingUp size={16} className="mr-1"/> +24%</span>
                </div>
                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                  <div className="w-[80%] h-full bg-primary rounded-full"></div>
                </div>
              </div>

              {/* Animated Heatmap View */}
              <div className="w-full h-48 bg-[#0a0a0f] rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                {/* Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                
                {/* Simulated Surge Heatmap Glows */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute w-32 h-32 bg-red-500/30 blur-[30px] rounded-full top-4 right-4"
                ></motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute w-40 h-40 bg-primary/20 blur-[40px] rounded-full bottom-0 left-0"
                ></motion.div>
                
                {/* Car Marker */}
                <div className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  <Navigation className="text-black w-6 h-6 transform rotate-45" />
                </div>
                
                <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg">
                  <p className="text-xs text-textMain font-medium"><span className="text-red-400">2.5x</span> Surge Nearby</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}