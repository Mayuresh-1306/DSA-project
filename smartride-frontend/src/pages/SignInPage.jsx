import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Lock, ArrowRight, Activity, User, Car } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('rider'); // 'rider' | 'driver'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const endpoint = role === 'rider' ? '/api/auth/user/login' : '/api/auth/driver/login';
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('smartride_jwt_token', data.token);
        localStorage.setItem('smartride_user_role', role);
        navigate('/app');
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch (err) {
      setErrorMsg('Could not connect to authentication server');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>

        <div className="relative z-10 p-16 w-full max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <span className="font-bold text-background text-xl tracking-tighter">S</span>
            </div>
            <span className="text-2xl font-semibold tracking-tight text-textMain">SmartRide</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold tracking-tighter text-textMain mb-6 leading-tight">
              Access the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">routing matrix.</span>
            </h1>
            <p className="text-lg text-textMuted max-w-md font-light">
              Authenticate to securely connect with our Java microservices and experience real-time geospatial cab matching.
            </p>
          </motion.div>

          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mt-16 bg-surface/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 w-max shadow-2xl"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
              <Activity className="text-primary w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-textMain">System Status</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Dijkstra Engine Online
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden perspective-[2000px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
          className="w-full max-w-md bg-surfaceLight/80 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 cursor-crosshair"
        >
          <motion.div style={{ translateZ: 50 }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-textMain mb-2">Welcome back</h2>
              <p className="text-sm text-textMuted">Enter your credentials to access the dashboard.</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {/* Role Toggle */}
              <div className="flex bg-background border border-white/10 rounded-xl p-1 mb-6">
                <button 
                  type="button" 
                  onClick={() => setRole('rider')}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg font-semibold transition-all ${role === 'rider' ? 'bg-primary text-background shadow-lg' : 'text-textMuted hover:text-white'}`}
                >
                  <User size={16} /> Rider
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole('driver')}
                  className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg font-semibold transition-all ${role === 'driver' ? 'bg-primary text-background shadow-lg' : 'text-textMuted hover:text-white'}`}
                >
                  <Car size={16} /> Driver
                </button>
              </div>

              {errorMsg && <p className="text-red-400 text-sm italic text-center">{errorMsg}</p>}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-textMuted" />
                </div>
                <input 
                  type="email" 
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  required
                  className="w-full bg-background border border-white/5 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-textMuted" />
                </div>
                <input 
                  type="password" 
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" 
                  required
                  className="w-full bg-background border border-white/5 rounded-xl py-3 pl-12 pr-4 text-textMain placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-primary hover:bg-primaryHover text-background rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              >
                Sign In <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-textMuted">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:text-primaryHover font-semibold transition-colors">
                  Initialize one
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}