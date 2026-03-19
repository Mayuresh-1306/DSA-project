import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* ============================================================
 *  RideBooking — Premium Ride Booking Dashboard
 * ============================================================
 *  Features:
 *  • Live Leaflet map showing Pune city
 *  • Source / Destination picker (from city graph nodes)
 *  • Animated ride request flow
 *  • Route visualization on map after matching
 *  • Driver info card with score, rating, ETA
 *  • Smooth Framer Motion transitions
 * ============================================================ */

// ── City Graph Nodes (matching Java GraphSeeder) ──
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
  { id: 'N25_NIBM',             name: 'NIBM',                lat: 18.4630, lng: 73.9080 },
  { id: 'N26_Magarpatta',       name: 'Magarpatta City',     lat: 18.5150, lng: 73.9270 },
  { id: 'N29_Airport',          name: 'Pune Airport',        lat: 18.5822, lng: 73.9197 },
  { id: 'N30_PuneStation',      name: 'Pune Station',        lat: 18.5285, lng: 73.8742 },
];

// ── Custom Map Markers ──
const createIcon = (color, emoji) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background:${color};
      width:36px;height:36px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);
      border:2px solid white;">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

const pickupIcon  = createIcon('#10B981', '📍');
const dropoffIcon = createIcon('#EF4444', '🏁');
const driverIcon  = createIcon('#3B82F6', '🚗');

// ── Map Fit Component ──
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

// ── Node coordinate lookup ──
const getNodeCoords = (nodeId) => {
  const node = CITY_NODES.find(n => n.id === nodeId);
  return node ? [node.lat, node.lng] : null;
};

export default function RideBooking() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideState, setRideState] = useState('idle'); // idle | searching | matched | error
  const [matchData, setMatchData] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [carPosition, setCarPosition] = useState(null);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${API_BASE}/drivers`)
      .then(res => res.json())
      .then(data => {
        if (data.drivers) setNearbyDrivers(data.drivers);
      })
      .catch(err => console.error("Could not fetch drivers:", err));
  }, []);

  useEffect(() => {
    if (rideState === 'matched' && routeCoords.length > 0) {
      let currentIdx = 0;
      setCarPosition(routeCoords[0]);
      
      const interval = setInterval(() => {
        currentIdx++;
        if (currentIdx < routeCoords.length) {
          setCarPosition(routeCoords[currentIdx]);
        } else {
          clearInterval(interval);
        }
      }, 50); 
      
      return () => clearInterval(interval);
    } else {
      setCarPosition(null);
    }
  }, [rideState, routeCoords]);

  // ── Request Ride ──
  const handleRequestRide = async () => {
    if (!pickup || !dropoff || pickup === dropoff) return;

    setRideState('searching');
    setMatchData(null);
    setRouteCoords([]);
    setErrorMsg('');

    const pickupCoords = getNodeCoords(pickup);

    try {
      const response = await fetch(`${API_BASE}/rides/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riderId: 'user_' + Date.now(),
          pickupCoords: [pickupCoords[1], pickupCoords[0]], // [lng, lat]
          pickupNode: pickup,
          dropoffNode: dropoff
        })
      });

      const data = await response.json();

      if (data.success) {
        setMatchData(data);
        
        // Build route based on path nodes
        const path = data.ride.routePath || [];
        const coords = path
          .map(nodeId => getNodeCoords(nodeId))
          .filter(Boolean);
          
        if (coords.length >= 2) {
          // Fetch real road geometry using OSRM APIs
          const osrmCoords = coords.map(c => `${c[1]},${c[0]}`).join(';');
          try {
            const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${osrmCoords}?overview=full&geometries=geojson`);
            const osrmData = await osrmRes.json();
            
            if (osrmData.routes && osrmData.routes[0]) {
               // GeoJSON returns [lng, lat], map requires [lat, lng]
               const roadCoords = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
               setRouteCoords(roadCoords);
            } else {
               setRouteCoords(coords); // fallback to straight lines
            }
          } catch(e) {
            console.error('OSRM fail', e);
            setRouteCoords(coords); // fallback
          }
        } else {
          setRouteCoords(coords);
        }

        setRideState('matched');
      } else {
        setErrorMsg(data.error || 'No drivers found');
        setRideState('error');
      }
    } catch (err) {
      setErrorMsg('Could not connect to server. Is Node.js + Java running?');
      setRideState('error');
    }
  };

  // ── Map Bounds ──
  const getBounds = () => {
    const points = [];
    const p = getNodeCoords(pickup);
    const d = getNodeCoords(dropoff);
    if (p) points.push(p);
    if (d) points.push(d);
    if (routeCoords.length > 0) points.push(...routeCoords);
    return points.length >= 2 ? points : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🚀 SmartRide — Book a Ride
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Powered by Dijkstra, A*, MinHeap & Greedy Matching</p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Booking Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-5"
        >
          {/* Source/Dest Selectors */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">📍</span>
              Route Selection
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Pickup Location</label>
                <select
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-gray-900/70 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all"
                >
                  <option value="">Select pickup...</option>
                  {CITY_NODES.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 text-lg">↓</div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Drop-off Location</label>
                <select
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full bg-gray-900/70 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500/30 outline-none transition-all"
                >
                  <option value="">Select drop-off...</option>
                  {CITY_NODES.filter(n => n.id !== pickup).map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestRide}
              disabled={!pickup || !dropoff || pickup === dropoff || rideState === 'searching'}
              className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all
                ${rideState === 'searching'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
            >
              {rideState === 'searching' ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="inline-block"
                  >⏳</motion.span>
                  Finding best driver...
                </span>
              ) : '🚕  Request SmartRide'}
            </motion.button>
          </div>

          {/* ── Match Result Card ── */}
          <AnimatePresence>
            {rideState === 'matched' && matchData && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-gradient-to-br from-emerald-900/40 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h3 className="text-lg font-bold text-emerald-400">Driver Matched!</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <InfoRow label="Driver ID" value={matchData.ride?.driverId || 'N/A'} />
                  <InfoRow label="Route Distance" value={`${matchData.ride?.routeDistance?.toFixed(2)} km`} />
                  <InfoRow label="ETA" value={`${matchData.ride?.estimatedTime?.toFixed(1)} min`} />
                  <InfoRow label="Price" value={`₹${matchData.ride?.price?.toFixed(2)}`} highlight />
                  <InfoRow label="Surge" value={`${matchData.ride?.surgeMultiplier?.toFixed(1)}x`} />
                  <InfoRow label="Algorithm" value={matchData.matchDetails?.algorithm || 'A* + MinHeap'} />

                  {matchData.ride?.routePath && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Route Path</p>
                      <p className="text-cyan-300 text-xs font-mono break-all">
                        {matchData.ride.routePath.join(' → ')}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {rideState === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5 text-red-300 text-sm"
              >
                ❌ {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── DSA Info Panel ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/40 backdrop-blur rounded-2xl p-5 border border-gray-700/30"
          >
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">🧠 DSA Behind the Scenes</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <p>• <span className="text-gray-300">Graph:</span> Adjacency List (40 nodes, 55+ edges)</p>
              <p>• <span className="text-gray-300">Pathfinding:</span> A* with Haversine heuristic</p>
              <p>• <span className="text-gray-300">Driver Matching:</span> MinHeap + Greedy (composite score)</p>
              <p>• <span className="text-gray-300">Pricing:</span> Dynamic surge (demand/supply ratio)</p>
              <p>• <span className="text-gray-300">Complexity:</span> O((V+E) log V) pathfinding</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: Map ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl"
          style={{ minHeight: '600px' }}
        >
          <MapContainer
            center={[18.52, 73.86]}
            zoom={12}
            className="w-full h-full"
            style={{ minHeight: '600px', background: '#111827' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Idle Nearby Drivers */}
            {rideState === 'idle' && nearbyDrivers && nearbyDrivers.map((driver) => {
              if (!driver.location || !driver.location.coordinates) return null;
              return (
                <Marker 
                  key={driver._id} 
                  position={[driver.location.coordinates[1], driver.location.coordinates[0]]} 
                  icon={driverIcon}
                >
                  <Popup>🚕 {driver.name} ({driver.rating} ★)</Popup>
                </Marker>
              );
            })}

            {/* Pickup Marker */}
            {pickup && getNodeCoords(pickup) && (
              <Marker position={getNodeCoords(pickup)} icon={pickupIcon}>
                <Popup>📍 Pickup: {CITY_NODES.find(n => n.id === pickup)?.name}</Popup>
              </Marker>
            )}

            {/* Animated Driver Marker */}
            {carPosition && (
              <Marker position={carPosition} icon={driverIcon}>
                <Popup>🚕 Driver en route! ETA: {matchData?.ride?.estimatedTime?.toFixed(1) || 5} mins</Popup>
              </Marker>
            )}

            {/* Dropoff Marker */}
            {dropoff && getNodeCoords(dropoff) && (
              <Marker position={getNodeCoords(dropoff)} icon={dropoffIcon}>
                <Popup>🏁 Drop-off: {CITY_NODES.find(n => n.id === dropoff)?.name}</Popup>
              </Marker>
            )}

            {/* Route Polyline (snapped to roads) */}
            {routeCoords.length > 1 && (
              <>
                {/* Outer glow line */}
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: '#0d9488',
                    weight: 8,
                    opacity: 0.4,
                  }}
                />
                {/* Inner solid path */}
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: '#34d399',
                    weight: 4,
                    opacity: 1,
                  }}
                />
              </>
            )}

            {/* Fit bounds when we have markers */}
            {getBounds() && <FitBounds bounds={getBounds()} />}
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
}

// ── Info Row Component ──
function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-400">{label}</span>
      <span className={highlight
        ? 'text-emerald-400 font-bold text-lg'
        : 'text-white font-medium'
      }>{value}</span>
    </div>
  );
}
