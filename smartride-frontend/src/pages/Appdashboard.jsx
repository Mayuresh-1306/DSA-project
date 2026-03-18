import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Search, ShieldCheck, Zap, Terminal, Star, Car } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // CRITICAL: Leaflet CSS

// --- Custom Premium Map Markers ---
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #18181b; box-shadow: 0 0 15px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const pickupIcon = createCustomIcon('#fafafa'); // White
const dropoffIcon = createCustomIcon('#f59e0b'); // Amber
const carIcon = createCustomIcon('#06b6d4'); // Cyan

// Mock Data
const RIDE_OPTIONS = [
  { id: 'smart-economy', name: 'Smart Economy', price: '$14.20', time: '3 mins', icon: <Car className="w-6 h-6" /> },
  { id: 'smart-premium', name: 'Smart Premium', price: '$22.50', time: '5 mins', icon: <Zap className="w-6 h-6" /> },
  { id: 'smart-xl', name: 'Smart XL', price: '$28.00', time: '8 mins', icon: <ShieldCheck className="w-6 h-6" /> }
];

export default function AppDashboard() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideState, setRideState] = useState('IDLE');
  const [selectedRide, setSelectedRide] = useState('smart-economy');
  const [logs, setLogs] = useState([]);

  // Mock Coordinates (Centered roughly on Mumbai for context, but you can change these)
  const mapCenter = [19.0760, 72.8777];
  const pickupCoords = [19.0810, 72.8820];
  const dropoffCoords = [19.0650, 72.8650];
  const routePath = [
    pickupCoords,
    [19.0780, 72.8790],
    [19.0720, 72.8750],
    [19.0680, 72.8700],
    dropoffCoords
  ];

  const addLog = (msg) => setLogs(prev => [...prev, msg].slice(-4));

  const handleBooking = () => {
    if (!pickup || !dropoff) return;
    setRideState('SEARCHING');
    setLogs([]);
    
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
      
      {/* ================= LIVE INTERACTIVE MAP ================= */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0f]">
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          zoomControl={false}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
        >
          {/* CartoDB Dark Matter Tiles for Premium Vibe */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* Render markers only when a ride is matched or searching */}
          {rideState !== 'IDLE' && (
            <>
              <Marker position={pickupCoords} icon={pickupIcon}>
                <Popup className="premium-popup">Pickup Location</Popup>
              </Marker>
              <Marker position={dropoffCoords} icon={dropoffIcon}>
                <Popup className="premium-popup">Dropoff Location</Popup>
              </Marker>
            </>
          )}

          {/* Render the calculated Dijkstra Route */}
          {rideState === 'MATCHED' && (
            <>
              <Polyline 
                positions={routePath} 
                pathOptions={{ color: '#f59e0b', weight: 4, dashArray: '10, 10', opacity: 0.8 }} 
              />
              <Marker position={routePath[2]} icon={carIcon} /> {/* Mock Driver Location */}
            </>
          )}
        </MapContainer>

        {/* Searching Radar Overlay (Sits on top of the map) */}
        <AnimatePresence>
          {rideState === 'SEARCHING' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <motion.div animate={{ scale: [1, 4], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-32 h-32 bg-primary/20 rounded-full blur-[20px] -left-16 -top-16" />
              <motion.div animate={{ scale: [1, 3], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute w-32 h-32 border border-primary/50 rounded-full -left-16 -top-16" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= FLOATING DASHBOARD PANEL ================= */}
      <div className="relative z-10 w-full md:w-[450px] h-full bg-surface/90 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-2xl overflow-y-auto hidden-scrollbar pointer-events-auto">
        
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
              type="text" placeholder="Current Location (e.g. Airport)" value={pickup} onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-surfaceLight border border-white/10 rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
              disabled={rideState !== 'IDLE'}
            />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-surfaceLight border border-white/10 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-sm bg-primary"></div>
            </div>
            <input 
              type="text" placeholder="Destination (e.g. Downtown)" value={dropoff} onChange={(e) => setDropoff(e.target.value)}
              className="w-full bg-surfaceLight border border-white/10 rounded-xl px-4 py-3 text-textMain placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
              disabled={rideState !== 'IDLE'}
            />
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            
            {/* STATE: IDLE */}
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
                  <button onClick={() => {setRideState('IDLE'); setPickup(''); setDropoff(''); setLogs([])}} className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 py-3 rounded-xl font-medium text-red-400 transition-colors">Cancel</button>
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