import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Search, ShieldCheck, Zap, Terminal, Star, Car, CreditCard } from 'lucide-react';

// Mock Data for Ride Options
const RIDE_OPTIONS = [
  { id: 'smart-economy', name: 'Smart Economy', price: '$14.20', time: '3 mins', icon: <Car className="w-6 h-6" /> },
  { id: 'smart-premium', name: 'Smart Premium', price: '$22.50', time: '5 mins', icon: <Zap className="w-6 h-6" /> },
  { id: 'smart-xl', name: 'Smart XL', price: '$28.00', time: '8 mins', icon: <ShieldCheck className="w-6 h-6" /> }
];

export default function AppDashboard() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideState, setRideState] = useState('IDLE'); // IDLE, SEARCHING, MATCHED
  const [selectedRide, setSelectedRide] = useState('smart-economy');
  const [logs, setLogs] = useState([]);

  // Simulate the backend logging process
  const addLog = (msg) => setLogs(prev => [...prev, msg].slice(-4));

  const handleBooking = () => {
    if (!pickup || !dropoff) return;
    setRideState('SEARCHING');
    setLogs([]);
    
    // Simulate Backend Microservice Flow
    setTimeout(() => addLog("> Node.js: Gateway received request."), 500);
    setTimeout(() => addLog("> MongoDB: 2dsphere $near query executing..."), 1200);
    setTimeout(() => addLog("> Java Engine: Min-Heap sorting 45 drivers..."), 2200);
    setTimeout(() => addLog("> Java Engine: Dijkstra optimal path found (12ms)."), 3500);
    
    setTimeout(() => {
      setRideState('MATCHED');
    }, 4500);
  };

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden flex pt-20">
      
      {/* ================= SIMULATED MAP BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0f] overflow-hidden flex items-center justify-center">
        {/* Abstract City Grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        
        {/* Dynamic Map Elements based on State */}
        <AnimatePresence>
          {rideState === 'SEARCHING' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div animate={{ scale: [1, 3], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-32 h-32 bg-primary/20 rounded-full blur-[20px] -left-16 -top-16" />
              <motion.div animate={{ scale: [1, 2], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute w-32 h-32 border border-primary/50 rounded-full -left-16 -top-16" />
              <div className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(245,158,11,1)] -left-2 -top-2" />
            </motion.div>
          )}

          {rideState === 'MATCHED' && (
            <motion.svg 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {/* Dijkstra Route Path */}
              <motion.path 
                d="M 30% 70% Q 40% 40% 60% 50% T 80% 30%" 
                fill="none" stroke="#f59e0b" strokeWidth="4" 
                strokeDasharray="10 10"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
                className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              />
              <circle cx="30%" cy="70%" r="6" fill="#fafafa" className="shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
              <circle cx="80%" cy="30%" r="6" fill="#fafafa" />
              
              {/* Moving Car Node */}
              <motion.circle 
                r="8" fill="#06b6d4" 
                className="filter drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                animate={{ offsetDistance: ["0%", "100%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ offsetPath: 'path("M 30% 70% Q 40% 40% 60% 50% T 80% 30%")' }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>

      {/* ================= FLOATING DASHBOARD PANEL ================= */}
      <div className="relative z-10 w-full md:w-[450px] h-full bg-surface/80 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-2xl overflow-y-auto hidden-scrollbar">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-background to-transparent">
          <h2 className="text-2xl font-bold text-textMain">Book a Ride</h2>
          <p className="text-sm text-textMuted">Algorithmically optimized routing.</p>
        </div>

        {/* Input Section */}
        <div className="p-6 relative">
          <div className="absolute left-[39px] top-[48px] bottom-[48px] w-0.5 bg-white/10"></div>
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-surfaceLight border border-white/10 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-textMain"></div>
            </div>
            <input 
              type="text" placeholder="Current Location" value={pickup} onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-surfaceLight border border-white/10 rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
              disabled={rideState !== 'IDLE'}
            />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-surfaceLight border border-white/10 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-sm bg-primary"></div>
            </div>
            <input 
              type="text" placeholder="Destination" value={dropoff} onChange={(e) => setDropoff(e.target.value)}
              className="w-full bg-surfaceLight border border-white/10 rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
              disabled={rideState !== 'IDLE'}
            />
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            
            {/* STATE: IDLE (Choose Ride) */}
            {rideState === 'IDLE' && (
              <motion.div key="idle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Recommended Vehicles</p>
                {RIDE_OPTIONS.map((ride) => (
                  <button 
                    key={ride.id} onClick={() => setSelectedRide(ride.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedRide === ride.id ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-surfaceLight border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedRide === ride.id ? 'bg-primary/20 text-primary' : 'bg-surface text-textMain'}`}>
                        {ride.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-textMain">{ride.name}</p>
                        <p className="text-xs text-textMuted flex items-center gap-1"><Clock size={12} /> {ride.time} away</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-textMain">{ride.price}</p>
                  </button>
                ))}

                <button 
                  onClick={handleBooking}
                  className={`mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${pickup && dropoff ? 'bg-primary hover:bg-primaryHover text-background shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'bg-surfaceLight text-textMuted cursor-not-allowed'}`}
                >
                  Confirm Ride
                </button>
              </motion.div>
            )}

            {/* STATE: SEARCHING */}
            {rideState === 'SEARCHING' && (
              <motion.div key="searching" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-primary border-r-2 border-transparent"></motion.div>
                  <Search className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-textMain mb-2">Executing Dijkstra</h3>
                <p className="text-textMuted max-w-[250px]">Running spatial algorithms across the city graph to find your optimal driver.</p>
              </motion.div>
            )}

            {/* STATE: MATCHED */}
            {rideState === 'MATCHED' && (
              <motion.div key="matched" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                <div className="bg-gradient-to-br from-green-500/20 to-surface border border-green-500/30 rounded-2xl p-6 mb-6 text-center shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <ShieldCheck className="text-green-400 w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-textMain">Driver Assigned</h3>
                  <p className="text-textMuted text-sm">Arriving in exactly 3.2 minutes.</p>
                </div>

                {/* Driver Card */}
                <div className="bg-surfaceLight border border-white/10 rounded-2xl p-5 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Adarsh" alt="Driver" className="w-14 h-14 rounded-full border-2 border-primary/50" />
                    <div>
                      <p className="font-bold text-textMain text-lg">Adarsh M.</p>
                      <p className="text-xs text-textMuted flex items-center gap-1"><Star size={12} className="text-primary fill-primary"/> 4.98 Rating</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-textMain">MH-12 AB-9021</p>
                    <p className="text-xs text-textMuted">Tesla Model 3</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-surfaceLight hover:bg-surface border border-white/10 py-3 rounded-xl font-medium text-textMain transition-colors">Call Driver</button>
                  <button onClick={() => {setRideState('IDLE'); setPickup(''); setDropoff('');}} className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 py-3 rounded-xl font-medium text-red-400 transition-colors">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= BACKEND LOGS VISUALIZER ================= */}
        <div className="mt-auto bg-[#050508] border-t border-white/5 p-4 min-h-[140px]">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={14} className="text-textMuted" />
            <span className="text-xs font-semibold text-textMuted tracking-wider uppercase">Live Engine Logs</span>
          </div>
          <div className="font-mono text-[11px] text-textMuted space-y-1.5 flex flex-col justify-end h-[80px] overflow-hidden">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.p 
                  key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={log.includes("Dijkstra") ? "text-primary font-bold" : ""}
                >
                  {log}
                </motion.p>
              ))}
              {logs.length === 0 && <p className="opacity-50">Waiting for interaction events...</p>}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}