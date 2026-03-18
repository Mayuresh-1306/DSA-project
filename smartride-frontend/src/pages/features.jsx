import { motion } from 'framer-motion';
import { Globe, Zap, Activity, Database } from 'lucide-react';

export default function FeaturesPage() {
  // Page Transition Animation
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
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-white/5 mb-6"
          >
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">System Capabilities</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-textMain mb-6">Engineered for Scale</h1>
          <p className="text-textMuted text-xl max-w-2xl mx-auto font-light">
            SmartRide isn't just a CRUD app. We use advanced spatial quadtrees and graph logic to solve real-world logistical bottlenecks.
          </p>
        </div>

        {/* The Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-2 bg-surfaceLight border border-white/5 rounded-3xl p-10 flex flex-col justify-between group hover:border-primary/30 transition-all overflow-hidden relative cursor-crosshair"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                <Globe className="text-primary w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold text-textMain mb-3">Spatial Quadtrees</h3>
              <p className="text-textMuted text-lg max-w-md">We partition the city grid into zones. When you request a ride, we only query drivers in your quadrant, dropping search time complexity to near constant.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="bg-surfaceLight border border-white/5 rounded-3xl p-10 flex flex-col justify-between group hover:border-secondary/30 transition-all relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Zap className="text-secondary w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-textMain mb-3">WebSockets</h3>
              <p className="text-textMuted">Bi-directional telemetry streams driver coordinates to your app at 60Hz.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="bg-surfaceLight border border-white/5 rounded-3xl p-10 flex flex-col justify-between group hover:border-primary/30 transition-all relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Activity className="text-primary w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-textMain mb-3">Dynamic Pricing</h3>
              <p className="text-textMuted">Surge multipliers calculated in real-time based on local node density.</p>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="md:col-span-2 bg-surfaceLight border border-white/5 rounded-3xl p-10 flex flex-col justify-between group hover:border-white/20 transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 flex items-center gap-8">
              <div className="flex-1">
                <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Database className="text-textMain w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-textMain mb-3">Geospatial MongoDB</h3>
                <p className="text-textMuted text-lg max-w-xl">Leveraging 2dsphere indexes natively in our database layer to perform highly optimized `$near` queries before data even hits the Java microservice.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}