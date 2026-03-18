import { motion } from 'framer-motion';
import { Server, Cpu, Database, Terminal, Code, ArrowRight } from 'lucide-react';

export default function TechnologyPage() {
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
      className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden"
    >
      {/* Background Tech Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-white/5 mb-6"
          >
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">System Architecture</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-textMain mb-6">The Microservice Stack</h1>
          <p className="text-textMuted text-xl max-w-2xl mx-auto font-light">
            Decoupled by design. We separate high-concurrency I/O operations from CPU-intensive graph processing to achieve zero-latency matching.
          </p>
        </div>

        {/* Animated Architecture Pipeline */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 max-w-5xl mx-auto mt-20">
          
          {/* Node.js Node */}
          <motion.div whileHover={{ scale: 1.05 }} className="w-full md:w-72 bg-surfaceLight border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#339933]/10 rounded-full blur-[50px] group-hover:bg-[#339933]/20 transition-all"></div>
            <div className="w-16 h-16 bg-[#339933]/10 border border-[#339933]/30 rounded-2xl flex items-center justify-center mb-6">
              <Server className="text-[#339933] w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-textMain mb-2">Node.js API</h3>
            <p className="text-textMuted text-sm">Express.js API Gateway handling WebSockets, Auth, and 10k+ concurrent rider requests.</p>
          </motion.div>

          {/* Animated Flow Line 1 */}
          <div className="hidden md:block absolute top-1/2 left-[20%] right-[50%] h-0.5 -translate-y-1/2 overflow-hidden bg-white/5 z-0">
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
            />
          </div>

          {/* Java Node (Core) */}
          <motion.div whileHover={{ scale: 1.05 }} className="w-full md:w-80 bg-surface border border-primary/30 rounded-3xl p-8 relative z-10 shadow-[0_0_50px_rgba(245,158,11,0.1)] overflow-hidden group transform md:scale-110">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="w-16 h-16 bg-primary/20 border border-primary/50 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Cpu className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-textMain mb-2">Java Core Engine</h3>
            <p className="text-textMuted text-sm">Dedicated CPU-heavy microservice running Dijkstra's Algorithm and Min-Heap priority queues entirely in-memory.</p>
          </motion.div>

          {/* Animated Flow Line 2 */}
          <div className="hidden md:block absolute top-1/2 left-[50%] right-[20%] h-0.5 -translate-y-1/2 overflow-hidden bg-white/5 z-0">
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#47A248] to-transparent"
            />
          </div>

          {/* MongoDB Node */}
          <motion.div whileHover={{ scale: 1.05 }} className="w-full md:w-72 bg-surfaceLight border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#47A248]/10 rounded-full blur-[50px] group-hover:bg-[#47A248]/20 transition-all"></div>
            <div className="w-16 h-16 bg-[#47A248]/10 border border-[#47A248]/30 rounded-2xl flex items-center justify-center mb-6">
              <Database className="text-[#47A248] w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-textMain mb-2">MongoDB</h3>
            <p className="text-textMuted text-sm">Geospatial 2dsphere indexes allowing hyper-fast `$near` queries to filter drivers before algorithmic routing.</p>
          </motion.div>

        </div>

        {/* Mock Terminal Window */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl mx-auto bg-[#0d0d12] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-2 text-xs text-textMuted font-mono">smartride-java-engine ~ zsh</span>
          </div>
          <div className="p-6 font-mono text-sm text-textMuted overflow-x-auto">
            <p><span className="text-primary">INFO</span> 18:24:01 - Initializing CityGraph with 45,201 nodes...</p>
            <p><span className="text-primary">INFO</span> 18:24:02 - Min-Heap allocated for driver pooling.</p>
            <p className="text-textMain mt-2"> Request received: RiderID=892 Lat=19.07 Lon=72.87</p>
            <p> Applying Quadtree spatial filter... 142 drivers in zone.</p>
            <p> Running Dijkstra shortest path...</p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="text-green-400 mt-2"
            >
              SUCCESS: Driver assigned (ID: 441). Route computation: 14ms.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}