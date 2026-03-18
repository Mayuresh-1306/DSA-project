import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Database } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const navigate = useNavigate();
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  const handleAuth = (e) => {
    e.preventDefault();
    localStorage.setItem('smartride_user_token', 'authenticated');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden perspective-[2000px] order-2 lg:order-1">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
          className="w-full max-w-md bg-surfaceLight/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 cursor-crosshair"
        >
          <motion.div style={{ translateZ: 50 }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-textMain mb-2">Create an account</h2>
              <p className="text-sm text-textMuted">Join the most advanced transit network.</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-textMuted" />
                </div>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  className="w-full bg-background border border-white/5 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder:text-textMuted focus:outline-none focus:border-secondary/50 transition-colors"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-textMuted" />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full bg-background border border-white/5 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder:text-textMuted focus:outline-none focus:border-secondary/50 transition-colors"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-textMuted" />
                </div>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  className="w-full bg-background border border-white/5 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder:text-textMuted focus:outline-none focus:border-secondary/50 transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-secondary hover:bg-[#0891b2] text-background rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                Initialize Account <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-textMuted">
                Already optimized?{' '}
                <Link to="/signin" className="text-secondary hover:text-[#0891b2] font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center order-1 lg:order-2">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-background/80 via-background/40 to-background"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10 p-16 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold tracking-tighter text-textMain mb-6 leading-tight">
              Scale without <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">friction.</span>
            </h1>
            <p className="text-lg text-textMuted max-w-md font-light">
              Create an account to deploy your coordinates into our spatial quadtrees. Your driver is already being calculated.
            </p>
          </motion.div>

          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="mt-16 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 w-max shadow-2xl"
          >
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/30">
              <Database className="text-secondary w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-textMain">Storage Layer</p>
              <p className="text-xs text-secondary flex items-center gap-1">
                2dsphere indexing active
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}