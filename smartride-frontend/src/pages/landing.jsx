import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Activity, Zap, Search, Route, ShieldCheck } from 'lucide-react';
import Navbar from '../components/navbar';

// --- 1. HERO 3D TILT CARD COMPONENT ---
const TiltCard = () => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-md aspect-square rounded-2xl bg-surfaceLight border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col cursor-crosshair"
    >
      <motion.div style={{ translateZ: 50 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-5 h-5" />
          <span className="text-sm font-medium text-textMain">Live Routing Engine</span>
        </div>
        <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded border border-secondary/20">Dijkstra Active</span>
      </motion.div>

      <motion.div style={{ translateZ: 80 }} className="flex-1 relative border border-white/5 rounded-xl overflow-hidden bg-background/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-textMain rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
        <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-secondary rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse"></div>
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="25%" y1="25%" x2="33%" y2="75%" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="33%" y1="75%" x2="75%" y2="50%" stroke="rgba(245,158,11,0.5)" strokeWidth="2" />
        </svg>

        <div className="absolute bottom-4 left-4 right-4 bg-surface/80 backdrop-blur-md p-3 rounded-lg border border-white/5 flex justify-between items-center">
          <div>
            <p className="text-xs text-textMuted">Optimized Path</p>
            <p className="text-sm font-semibold text-textMain">3.2km • 8 mins</p>
          </div>
          <Zap className="text-primary w-4 h-4" />
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- 2. SCROLLYTELLING DATA ---
const steps = [
  {
    id: 1,
    title: "Request a Ride",
    desc: "Enter your destination. Our node-based spatial index instantly maps your coordinates to the nearest city graph intersection.",
    icon: <MapPin className="text-primary w-6 h-6" />
  },
  {
    id: 2,
    title: "Min-Heap Driver Search",
    desc: "We don't scan every driver. Our Java engine uses a Min-Heap priority queue to evaluate only the drivers within a 3km GeoHash radius.",
    icon: <Search className="text-secondary w-6 h-6" />
  },
  {
    id: 3,
    title: "Dijkstra Route Optimization",
    desc: "Before assigning, the system calculates the absolute shortest path factoring in real-time edge weights (traffic multipliers).",
    icon: <Route className="text-primary w-6 h-6" />
  },
  {
    id: 4,
    title: "Instant Assignment",
    desc: "The mathematically optimal driver is assigned. Data is written to MongoDB and streamed to your client via WebSockets in milliseconds.",
    icon: <ShieldCheck className="text-secondary w-6 h-6" />
  }
];

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Track which step is currently active in the scrollytelling section
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <motion.section style={{ opacity: heroOpacity }} className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-glow-gradient">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-sm border border-white/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold text-textMuted tracking-widest uppercase">Node.js + Java Microservices</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 text-textMain">
              Smarter Rides. <br />
              <span className="text-textMuted">Faster Matches.</span>
            </h1>

            <p className="text-lg md:text-xl text-textMuted mb-10 leading-relaxed font-light max-w-lg">
              Experience hyper-optimized routing engineered for the modern metropolis. Powered by real-time graph algorithms and predictive availability.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/app" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primaryHover text-background rounded-full font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                Book Now <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <motion.div style={{ y: heroY }} className="relative flex justify-center lg:justify-end perspective-[2000px]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
             <TiltCard />
          </motion.div>
        </div>
      </motion.section>

      {/* ================= SCROLLYTELLING SECTION ================= */}
      <section className="relative max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-textMain mb-4">Under the Hood</h2>
          <p className="text-textMuted text-lg max-w-2xl mx-auto">How our microservice architecture processes a ride request in under 200ms.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 relative items-start">
          
          {/* Left: Scrollable Text Blocks */}
          <div className="flex-1 space-y-32 py-32">
            {steps.map((step) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-50% 0px -50% 0px" }}
                onViewportEnter={() => setActiveStep(step.id)}
                transition={{ duration: 0.5 }}
                className={`transition-all duration-500 ${activeStep === step.id ? 'opacity-100' : 'opacity-30 blur-[2px]'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-3xl font-bold text-textMain mb-4">{step.title}</h3>
                <p className="text-lg text-textMuted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Right: Sticky Visualizer */}
          <div className="flex-1 sticky top-32 h-[500px] bg-surface border border-white/5 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Background Map Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <AnimatePresence mode="wait">
              {activeStep === 1 && (
                <motion.div key="1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-bounce">
                    <MapPin className="text-primary w-8 h-8" />
                  </div>
                  <div className="w-32 h-2 bg-surfaceLight rounded-full overflow-hidden"><div className="w-full h-full bg-primary animate-pulse"></div></div>
                </motion.div>
              )}
              {activeStep === 2 && (
                <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-64 h-64 border border-secondary/30 rounded-full animate-ping"></div>
                  <div className="absolute w-48 h-48 border border-secondary/50 rounded-full"></div>
                  <Search className="text-secondary w-10 h-10 relative z-10" />
                  {/* Mock Driver Nodes */}
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white rounded-full"></div>
                </motion.div>
              )}
              {activeStep === 3 && (
                <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full p-12 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100">
                    <motion.path d="M 10 90 L 40 50 L 90 10" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="100" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 2, repeat: Infinity }} />
                    <circle cx="10" cy="90" r="3" fill="#fafafa" />
                    <circle cx="40" cy="50" r="3" fill="#fafafa" />
                    <circle cx="90" cy="10" r="3" fill="#fafafa" />
                  </svg>
                </motion.div>
              )}
              {activeStep === 4 && (
                <motion.div key="4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-surfaceLight border border-primary/30 p-6 rounded-2xl flex items-center gap-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center border border-white/10">
                    <ShieldCheck className="text-primary w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl">Driver Matched</h4>
                    <p className="text-textMuted text-sm">Arriving in 3 mins</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
    </div>
  );
}