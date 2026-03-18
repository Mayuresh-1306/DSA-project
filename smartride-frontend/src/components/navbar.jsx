import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation(); // Gets current path to highlight active link

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-50 bg-surface/50 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <span className="font-bold text-background tracking-tighter">S</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-textMain">
            SmartRide
          </span>
        </Link>
        
        {/* CENTER NAVIGATION */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/features" className={`transition-colors ${location.pathname === '/features' ? 'text-primary' : 'text-textMuted hover:text-textMain'}`}>Features</Link>
          <Link to="/technology" className={`transition-colors ${location.pathname === '/technology' ? 'text-primary' : 'text-textMuted hover:text-textMain'}`}>Technology</Link>
          <Link to="/drive" className={`transition-colors ${location.pathname === '/drive' ? 'text-primary' : 'text-textMuted hover:text-textMain'}`}>Drive</Link>
        </div>

        {/* RIGHT SIDE CTAs */}
        <div className="flex items-center gap-6">
          <Link to="/signin" className="hidden md:block text-sm font-medium text-textMuted hover:text-textMain transition-colors">
            Sign In
          </Link>
          <Link to="/app" className="px-5 py-2.5 text-sm font-semibold bg-textMain text-background rounded-full hover:bg-gray-300 transition-colors">
            Open App
          </Link>
        </div>

      </div>
    </motion.nav>
  );
}