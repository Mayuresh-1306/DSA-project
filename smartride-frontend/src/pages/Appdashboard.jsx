import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Search, ShieldCheck, Zap, Terminal, Star, Car } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Custom Premium Map Markers ---
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: ${color}; 
      width: 32px; height: 32px; 
      border-radius: 50%; 
      border: 2px solid white; 
      box-shadow: 0 4px 12px ${color};
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    ">${emoji || ''}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const pickupIcon = createCustomIcon('#10b981', '📍'); // Emerald
const dropoffIcon = createCustomIcon('#f43f5e', '🏁'); // Rose
const carIcon = createCustomIcon('#0ea5e9', '🚕'); // Sky

// ── City Graph Nodes (Pune) ──
const CITY_NODES = [
  { id: 'N1_ShivajiNagar',      name: 'Shivaji Nagar',       lat: 18.5308, lng: 73.8475 },
  { id: 'N2_DeccanGymkhana',    name: 'Deccan Gymkhana',     lat: 18.5196, lng: 73.8411 },
  { id: 'N3_FCRoad',            name: 'FC Road',             lat: 18.5272, lng: 73.8400 },
  { id: 'N6_Koregaon',          name: 'Koregaon Park',       lat: 18.5362, lng: 73.8938 },
  { id: 'N8_Viman',             name: 'Viman Nagar',         lat: 18.5679, lng: 73.9143 },
  { id: 'N9_Kharadi',           name: 'Kharadi',             lat: 18.5523, lng: 73.9372 },
  { id: 'N10_Hadapsar',         name: 'Hadapsar',            lat: 18.5089, lng: 73.9260 },
  { id: 'N11_Kothrud',          name: 'Kothrud',             lat: 18.5074, lng: 73.8077 },
  { id: 'N14_Hinjewadi',        name: 'Hinjewadi IT Park',   lat: 18.5912, lng: 73.7380 },
  { id: 'N16_AundhIT',          name: 'Aundh',               lat: 18.5588, lng: 73.8073 },
  { id: 'N19_Baner',            name: 'Baner',               lat: 18.5590, lng: 73.7868 },
  { id: 'N22_Katraj',           name: 'Katraj',              lat: 18.4537, lng: 73.8578 },
  { id: 'N26_Magarpatta',       name: 'Magarpatta City',     lat: 18.5150, lng: 73.9270 },
  { id: 'N29_Airport',          name: 'Pune Airport',        lat: 18.5822, lng: 73.9197 },
  { id: 'N30_PuneStation',      name: 'Pune Station',        lat: 18.5285, lng: 73.8742 },
];

const getNodeCoords = (nodeId) => {
  const node = CITY_NODES.find(n => n.id === nodeId);
  return node ? [node.lat, node.lng] : null;
};

// Map Autofit Tool
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function AppDashboard() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideState, setRideState] = useState('IDLE');
  const [matchData, setMatchData] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [carPosition, setCarPosition] = useState(null);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const mapCenter = [18.5204, 73.8567]; // Pune

  // Fetch all nearby drivers on mount to populate map
  useEffect(() => {
    fetch('http://localhost:5000/api/drivers')
      .then(res => res.json())
      .then(data => {
        if (data.drivers) setNearbyDrivers(data.drivers);
      })
      .catch(err => console.error("Could not fetch drivers:", err));
  }, []);

  // Activate moving car animation when matched and route exists
  useEffect(() => {
    if (rideState === 'MATCHED' && routeCoords.length > 0) {
      let currentIdx = 0;
      setCarPosition(routeCoords[0]);
      
      const interval = setInterval(() => {
        currentIdx++;
        if (currentIdx < routeCoords.length) {
          setCarPosition(routeCoords[currentIdx]);
        } else {
          clearInterval(interval); // Arrived at destination
        }
      }, 50); // Frame interval for speed
      
      return () => clearInterval(interval);
    } else {
      setCarPosition(null);
    }
  }, [rideState, routeCoords]);

  const addLog = (msg) => setLogs(prev => [...prev, msg].slice(-6));

  const handleBooking = async () => {
    if (!pickup || !dropoff) return;
    setRideState('SEARCHING');
    setLogs([]);
    setMatchData(null);
    setRouteCoords([]);
    
    addLog("> Node.js: Gateway received request...");

    const pickupCoords = getNodeCoords(pickup);
    setTimeout(() => addLog("> MongoDB: 2dsphere $near query executing..."), 600);
    
    try {
      const response = await fetch(`http://localhost:5000/api/rides/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riderId: 'user_' + Date.now(),
          pickupCoords: [pickupCoords[1], pickupCoords[0]], // [lng, lat]
          pickupNode: pickup,
          dropoffNode: dropoff
        })
      });

      setTimeout(() => addLog("> Java Engine: Graph nodes loaded. Executing MinHeap & A*..."), 1200);

      const data = await response.json();

      if (data.success) {
        setMatchData(data);
        setTimeout(() => addLog(`> Java Engine: Match successful (Driver ${data.ride.driverId}).`), 1800);
        
        const path = data.ride.routePath || [];
        const rawPathCoords = path.map(id => getNodeCoords(id)).filter(Boolean);
        
        if (rawPathCoords.length >= 2) {
          addLog("> Frontend: Fetching real road geometry via OSRM...");
          
          const osrmStr = rawPathCoords.map(c => `${c[1]},${c[0]}`).join(';');
          try {
            const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${osrmStr}?overview=full&geometries=geojson`);
            const osrmData = await osrmRes.json();
            if (osrmData.routes?.[0]) {
               const roadCoords = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
               setRouteCoords(roadCoords);
               addLog("> Frontend: Polylines snapped to road successfully.");
            } else {
               setRouteCoords(rawPathCoords);
            }
          } catch(e) {
            setRouteCoords(rawPathCoords);
          }
        } else {
          setRouteCoords(rawPathCoords);
        }

        setTimeout(() => setRideState('MATCHED'), 2200);
      } else {
        addLog("> Error: " + (data.error || "Matching failed"));
        setRideState('IDLE');
      }
    } catch(err) {
      addLog("> Error: Server connection failed!");
      setTimeout(() => setRideState('IDLE'), 2000);
    }
  };

  const getBounds = () => {
    const points = [];
    const p = getNodeCoords(pickup);
    const d = getNodeCoords(dropoff);
    if (p) points.push(p);
    if (d) points.push(d);
    if (routeCoords.length > 0) points.push(...routeCoords);
    return points.length >= 2 ? points : null;
  };

  const RIDE_OPTIONS = [
    { id: 'smart-economy', name: 'Smart Economy', basePrice: matchData?.ride?.price || 140, multiplier: 1, time: '3 mins', icon: <Car className="w-6 h-6" /> },
    { id: 'smart-premium', name: 'Smart Premium', basePrice: (matchData?.ride?.price || 140) * 1.5, multiplier: 1.5, time: '5 mins', icon: <Zap className="w-6 h-6" /> },
    { id: 'smart-xl', name: 'Smart XL', basePrice: (matchData?.ride?.price || 140) * 2.1, multiplier: 2.1, time: '8 mins', icon: <ShieldCheck className="w-6 h-6" /> }
  ];
  const [selectedOpt, setSelectedOpt] = useState('smart-economy');

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden flex pt-16">
      
      {/* ================= LIVE INTERACTIVE MAP ================= */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0f]">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          zoomControl={false}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
        >
          {/* Default Dark Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM'
          />

          {/* Idle Nearby Drivers */}
          {rideState === 'IDLE' && nearbyDrivers && nearbyDrivers.map((driver) => {
            if (!driver.location || !driver.location.coordinates) return null;
            return (
              <Marker 
                key={driver._id} 
                position={[driver.location.coordinates[1], driver.location.coordinates[0]]} 
                icon={carIcon}
              >
                <Popup className="premium-popup">
                  <div className="font-bold">🚕 {driver.name}</div>
                  <div className="text-sm text-gray-500">{driver.vehicleType} • {driver.rating} ★</div>
                </Popup>
              </Marker>
            );
          })}

          {pickup && getNodeCoords(pickup) && (
            <Marker position={getNodeCoords(pickup)} icon={pickupIcon}>
              <Popup className="premium-popup">Pickup Location</Popup>
            </Marker>
          )}

          {dropoff && getNodeCoords(dropoff) && (
            <Marker position={getNodeCoords(dropoff)} icon={dropoffIcon}>
              <Popup className="premium-popup">Dropoff Location</Popup>
            </Marker>
          )}

          {/* OSRM Route Snapped to Roads */}
          {routeCoords.length > 1 && rideState === 'MATCHED' && (
            <>
              {/* Outer glow line */}
              <Polyline 
                positions={routeCoords} 
                pathOptions={{ color: '#0ea5e9', weight: 8, opacity: 0.3 }} 
              />
              {/* Inner core line */}
              <Polyline 
                positions={routeCoords} 
                pathOptions={{ color: '#38bdf8', weight: 4, opacity: 1 }} 
              />
            </>
          )}

          {/* Animated Moving Car Tracking the Path */}
          {carPosition && (
             <Marker position={carPosition} icon={carIcon}>
               <Popup className="premium-popup">🚕 Driver en route</Popup>
             </Marker>
          )}

          {getBounds() && <FitBounds bounds={getBounds()} />}
        </MapContainer>

        {/* Radar Overlay */}
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
      <div className="relative z-10 w-full md:w-[450px] h-full bg-[#18181b]/90 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto hidden-scrollbar pointer-events-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-black/40 to-transparent">
          <h2 className="text-2xl font-bold text-white">Book a Ride</h2>
          <p className="text-sm text-gray-400">Powered by India's Pure Java Engine.</p>
        </div>

        {/* Input Section */}
        <div className="p-6 relative">
          <div className="absolute left-[39px] top-[48px] bottom-[48px] w-px bg-gray-600/50"></div>
          
          <div className="flex items-center gap-4 mb-5 relative z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            <select 
              value={pickup} onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-[#27272a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              disabled={rideState !== 'IDLE'}
            >
              <option value="">Select Pickup Location</option>
              {CITY_NODES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-sm bg-rose-400"></div>
            </div>
            <select 
              value={dropoff} onChange={(e) => setDropoff(e.target.value)}
              className="w-full bg-[#27272a] border border-gray-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20"
              disabled={rideState !== 'IDLE'}
            >
              <option value="">Select Dropoff Destination</option>
              {CITY_NODES.filter(n => n.id !== pickup).map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            
            {/* STATE: IDLE */}
            {rideState === 'IDLE' && pickup && dropoff && (
              <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Choose Service</p>
                {RIDE_OPTIONS.map((ride) => (
                  <button 
                    key={ride.id} onClick={() => setSelectedOpt(ride.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-[1.2rem] border transition-all duration-300 ${selectedOpt === ride.id ? 'bg-[#3b82f6]/10 border-[#3b82f6]/50 shadow-[0_4px_20px_rgba(59,130,246,0.15)] ring-1 ring-[#3b82f6]/30' : 'bg-transparent border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOpt === ride.id ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'bg-gray-800 text-gray-300'}`}>
                        {ride.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white tracking-wide">{ride.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={12} /> {ride.time}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-white">~ ₹{ride.basePrice.toFixed(0)}</p>
                  </button>
                ))}

                <button 
                  onClick={handleBooking}
                  className="mt-6 w-full py-4 rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2 bg-gradient-to-r from-[#3b82f6] to-[#0ea5e9] hover:from-[#2563eb] hover:to-[#0284c7] text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-0.5"
                >
                  Confirm SmartRide
                </button>
              </motion.div>
            )}

            {/* STATE: SEARCHING */}
            {rideState === 'SEARCHING' && (
              <motion.div key="searching" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-[#0ea5e9] border-r-2 border-transparent"></motion.div>
                  <Search className="text-[#0ea5e9] w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Executing Dijkstra</h3>
                <p className="text-gray-400 text-sm max-w-[250px] leading-relaxed">Running spatial algorithms across the city graph to find your optimal driver.</p>
              </motion.div>
            )}

            {/* STATE: MATCHED */}
            {rideState === 'MATCHED' && matchData && (
              <motion.div key="matched" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-6 mb-5 text-center shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                  <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <ShieldCheck className="text-emerald-400 w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Driver Assigned</h3>
                  <p className="text-emerald-400 text-sm font-medium mt-1">Arriving in exactly {matchData.ride.estimatedTime?.toFixed(1) || 4.2} minutes!</p>
                </div>

                <div className="bg-[#27272a] border border-gray-700/50 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#0ea5e9]/50 overflow-hidden">
                      <span className="text-2xl">👨🏽‍✈️</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-base tracking-wide">Driver {matchData.ride.driverId.split('_')[1] || matchData.ride.driverId}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Star size={12} className="text-[#eab308] fill-[#eab308]"/> 4.9 Rating</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0ea5e9]">MH-12 AB-9021</p>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">Surge: {matchData.ride.surgeMultiplier?.toFixed(1)}x</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3.5 rounded-xl font-semibold text-white transition-colors">Contact</button>
                  <button onClick={() => {setRideState('IDLE'); setPickup(''); setDropoff(''); setLogs([])}} className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 py-3.5 rounded-xl font-semibold text-rose-400 transition-colors">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= BACKEND LOGS VISUALIZER ================= */}
        <div className="mt-auto bg-[#09090b] border-t border-white/5 p-5 min-h-[160px]">
          <div className="flex items-center gap-2 mb-3 opacity-80">
            <Terminal size={14} className="text-[#0ea5e9]" />
            <span className="text-xs font-bold text-[#0ea5e9] tracking-widest uppercase">Live Engine Logs</span>
          </div>
          <div className="font-mono text-[11px] text-gray-400 space-y-2 flex flex-col justify-end h-[90px] overflow-hidden">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.p 
                  key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`${log.includes("Error") ? "text-rose-400" : log.includes("Java Engine") ? "text-emerald-400 font-semibold" : "text-gray-400"}`}
                >
                  {log}
                </motion.p>
              ))}
              {logs.length === 0 && <p className="opacity-40 italic">Waiting for interaction events...</p>}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}