import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Clock, Search, ShieldCheck, Zap, Terminal, Star, Car, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// --- Custom Premium Map Markers ---
const createCustomIcon = (color, emoji = '') => {
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
    ">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const pickupIcon = createCustomIcon('#fafafa', '📍'); 
const dropoffIcon = createCustomIcon('#f59e0b', '🏁'); 
const carIcon = createCustomIcon('#0ea5e9', '🚕'); 

const MapUpdater = ({ pickupCoords, dropoffCoords, routePath }) => {
  const map = useMap();
  useEffect(() => {
    if (routePath && routePath.length > 0) {
      const bounds = L.latLngBounds(routePath);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickupCoords) {
      map.flyTo(pickupCoords, 14);
    }
  }, [pickupCoords, dropoffCoords, routePath, map]);
  return null;
};

export default function AppDashboard() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  
  // State variables for map coordinates
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]);
  
  const [rideState, setRideState] = useState('IDLE');
  const [matchData, setMatchData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState('smart-economy');

  const addLog = (msg) => setLogs(prev => [...prev, msg].slice(-4));

  // --- Geolocation & Geocoding ---
  const getUserLocation = () => {
    if (navigator.geolocation) {
      addLog("> System: Requesting GPS coordinates...");
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setPickupCoords([lat, lon]);
        setMapCenter([lat, lon]);
        
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (res.data && res.data.display_name) {
            const shortName = res.data.display_name.split(',').slice(0, 2).join(',');
            setPickup(shortName);
            addLog("> System: Geolocation secured.");
          }
        } catch (error) {
          setPickup(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        }
      }, () => {
        addLog("> Error: Geolocation permission denied.");
      });
    }
  };

  const geocodeAddress = async (address, isPickup) => {
    if (!address) return;
    try {
      addLog(`> Node.js: Geocoding ${address}...`);
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}&limit=1`);
      if (res.data && res.data.length > 0) {
        const coords = [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
        if (isPickup) {
          setPickupCoords(coords);
          setMapCenter(coords);
        } else {
          setDropoffCoords(coords);
        }
      }
    } catch (error) {
      addLog("> Error: Geocoding failed.");
    }
  };

  // --- OSRM Routing ---
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupCoords && dropoffCoords) {
        addLog("> System: Fetching optimized road geometry...");
        try {
          const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?overview=full&geometries=geojson`);
          if (res.data && res.data.routes.length > 0) {
            const coordinates = res.data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRoutePath(coordinates);
            addLog("> System: Route mapped successfully.");
          }
        } catch (error) {
          addLog("> Error: Routing engine offline.");
        }
      }
    };
    fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  // --- Mock Backend Flow ---
  const handleBooking = () => {
    if (!pickupCoords || !dropoffCoords) return;
    setRideState('SEARCHING');
    setLogs([]);
    setMatchData(null);
    
    addLog("> Node.js: Gateway received request...");
    setTimeout(() => addLog("> MongoDB: 2dsphere $near query executing..."), 600);
    setTimeout(() => addLog("> Java Engine: Graph nodes loaded. Executing MinHeap & A*..."), 1200);
    
    setTimeout(() => {
      setMatchData({
        ride: { price: 140, estimatedTime: 4.2, driverId: "user_89912", surgeMultiplier: 1.2 }
      });
      addLog(`> Java Engine: Match successful (Driver 89912).`);
      setRideState('MATCHED');
    }, 2500);
  };

  const RIDE_OPTIONS = [
    { id: 'smart-economy', name: 'Smart Economy', basePrice: matchData?.ride?.price || 140, multiplier: 1, time: '3 mins', icon: <Car className="w-6 h-6" /> },
    { id: 'smart-premium', name: 'Smart Premium', basePrice: (matchData?.ride?.price || 140) * 1.5, multiplier: 1.5, time: '5 mins', icon: <Zap className="w-6 h-6" /> },
    { id: 'smart-xl', name: 'Smart XL', basePrice: (matchData?.ride?.price || 140) * 2.1, multiplier: 2.1, time: '8 mins', icon: <ShieldCheck className="w-6 h-6" /> }
  ];

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden flex pt-16">
      
      {/* Map Section */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0f]">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          zoomControl={false}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          <MapUpdater pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} routePath={routePath} />

          {rideState !== 'IDLE' && (
            <>
              {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon}><Popup>Pickup</Popup></Marker>}
              {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon}><Popup>Dropoff</Popup></Marker>}
            </>
          )}

          {rideState === 'MATCHED' && routePath.length > 0 && (
            <>
              <Polyline positions={routePath} pathOptions={{ color: '#0ea5e9', weight: 4, dashArray: '10, 10', opacity: 0.8 }} />
              <Marker position={routePath[Math.floor(routePath.length / 2)]} icon={carIcon} />
            </>
          )}
        </MapContainer>

        <AnimatePresence>
          {rideState === 'SEARCHING' && pickupCoords && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute pointer-events-none z-10"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <motion.div animate={{ scale: [1, 4], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-32 h-32 bg-[#0ea5e9]/20 rounded-full blur-[20px] -left-16 -top-16" />
              <motion.div animate={{ scale: [1, 3], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute w-32 h-32 border border-[#0ea5e9]/50 rounded-full -left-16 -top-16" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dashboard Section */}
      <div className="relative z-10 w-full md:w-[450px] h-full bg-surface/90 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-2xl overflow-y-auto hidden-scrollbar pointer-events-auto">
        
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-background to-transparent">
          <h2 className="text-2xl font-bold text-white">Book a Ride</h2>
          <p className="text-sm text-gray-400">Algorithmically optimized routing.</p>
        </div>

        <div className="p-6 relative">
          <div className="absolute left-[39px] top-[48px] bottom-[48px] w-px bg-gray-600/50"></div>
          
          <div className="flex items-center gap-4 mb-5 relative z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            <div className="relative w-full">
              <input 
                type="text" placeholder="Current Location" value={pickup} 
                onChange={(e) => setPickup(e.target.value)}
                onBlur={(e) => geocodeAddress(e.target.value, true)}
                className="w-full bg-[#18181b] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0ea5e9]/50 transition-colors"
                disabled={rideState !== 'IDLE'}
              />
              <button onClick={getUserLocation} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0ea5e9] hover:text-[#0284c7] transition-colors">
                <LocateFixed size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 rounded-sm bg-rose-400"></div>
            </div>
            <input 
              type="text" placeholder="Destination" value={dropoff} 
              onChange={(e) => setDropoff(e.target.value)}
              onBlur={(e) => geocodeAddress(e.target.value, false)}
              className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0ea5e9]/50 transition-colors"
              disabled={rideState !== 'IDLE'}
            />
          </div>
        </div>

        <div className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            
            {rideState === 'IDLE' && (
              <motion.div key="idle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended Vehicles</p>
                {RIDE_OPTIONS.map((ride) => (
                  <button 
                    key={ride.id} onClick={() => setSelectedOpt(ride.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-[1.2rem] border transition-all duration-300 ${selectedOpt === ride.id ? 'bg-[#0ea5e9]/10 border-[#0ea5e9]/50 shadow-[0_4px_20px_rgba(14,165,233,0.15)] ring-1 ring-[#0ea5e9]/30' : 'bg-transparent border-gray-700 hover:border-gray-500'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedOpt === ride.id ? 'bg-[#0ea5e9]/20 text-[#0ea5e9]' : 'bg-gray-800 text-gray-300'}`}>
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
                  className={`mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${pickupCoords && dropoffCoords ? 'bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-[0_0_30px_rgba(14,165,233,0.3)]' : 'bg-[#27272a] text-gray-500 cursor-not-allowed'}`}
                >
                  Confirm SmartRide
                </button>
              </motion.div>
            )}

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

            {rideState === 'MATCHED' && (
              <motion.div key="matched" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-2xl p-6 mb-6 text-center shadow-[0_0_30px_rgba(52,211,153,0.1)]">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                    <ShieldCheck className="text-emerald-400 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Driver Assigned</h3>
                  <p className="text-emerald-400 text-sm font-medium mt-1">Arriving in exactly {matchData?.ride?.estimatedTime || 4.2} minutes!</p>
                </div>

                <div className="bg-[#27272a] border border-gray-700/50 rounded-2xl p-5 mb-6 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border-2 border-[#0ea5e9]/50 overflow-hidden">
                      <span className="text-2xl">👨🏽‍✈️</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-base tracking-wide">Driver {matchData?.ride?.driverId || "89912"}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Star size={12} className="text-[#eab308] fill-[#eab308]"/> 4.9 Rating</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0ea5e9]">MH-12 AB-9021</p>
                    <p className="text-xs text-gray-400 font-medium tracking-wide">Surge: {matchData?.ride?.surgeMultiplier || 1.2}x</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-[#27272a] hover:bg-[#3f3f46] border border-white/10 py-3 rounded-xl font-medium text-white transition-colors">Call Driver</button>
                  <button onClick={() => {setRideState('IDLE'); setPickup(''); setDropoff(''); setPickupCoords(null); setDropoffCoords(null); setRoutePath([]); setLogs([])}} className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 py-3 rounded-xl font-medium text-rose-400 transition-colors">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto bg-[#050508] border-t border-white/5 p-4 min-h-[140px]">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={14} className="text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Live Engine Logs</span>
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