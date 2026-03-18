import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Network, Map, Zap } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  const containerRef = useRef(null);

  // Track scroll progress from 0 to 1 over the 400vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress slightly for cinematic feel
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // === TIMELINE MAPPING ===
  // 0.0 - 0.4: Car drives in
  // 0.4 - 0.6: Car is stopped, text appears
  // 0.6 - 0.8: Door opens
  // 0.8 - 1.0: Camera zooms into the glowing door, transitioning to app

  // 1. Background Parallax (Moves opposite to car to create speed)
  const bgX = useTransform(smoothProgress, [0, 0.4], ["0%", "-20%"]);
  
  // 2. Car Movement & Wheels
  const carX = useTransform(smoothProgress, [0, 0.4], ["-120vw", "0vw"]);
  const wheelRotate = useTransform(smoothProgress, [0, 0.4], [0, 1440]); // 4 full spins
  
  // 3. Floating UI Cards (Opacity and Y position)
  const card1Opacity = useTransform(smoothProgress, [0.1, 0.15, 0.3, 0.35], [0, 1, 1, 0]);
  const card1Y = useTransform(smoothProgress, [0.1, 0.35], [50, -50]);
  
  const card2Opacity = useTransform(smoothProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const card2Y = useTransform(smoothProgress, [0.2, 0.45], [50, -50]);

  const card3Opacity = useTransform(smoothProgress, [0.45, 0.5, 0.6, 0.65], [0, 1, 1, 0]);
  
  // 4. Door Opening (3D Rotate on Y axis)
  const doorRotateY = useTransform(smoothProgress, [0.6, 0.75], [0, -75]);
  const doorGlow = useTransform(smoothProgress, [0.65, 0.8], [0, 1]);

  // 5. Final Transition (Zoom into the door)
  const sceneScale = useTransform(smoothProgress, [0.8, 1], [1, 50]);
  const sceneOpacity = useTransform(smoothProgress, [0.9, 1], [1, 0]);

  // Trigger completion when scrolled to the very bottom
  useEffect(() => {
    return smoothProgress.onChange((latest) => {
      if (latest > 0.99) {
        onComplete();
      }
    });
  }, [smoothProgress, onComplete]);

  return (
    <div ref={containerRef} className="h-[400vh] bg-[#030305] relative">
      {/* Scroll indicator for the user */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-[0.3em] uppercase animate-pulse z-50 pointer-events-none">
        Scroll Down to Initialize
      </div>

      <motion.div 
        style={{ scale: sceneScale, opacity: sceneOpacity }} 
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center transform-origin-center perspective-[1000px]"
      >
        {/* PARALLAX BACKGROUND */}
        <motion.div style={{ x: bgX }} className="absolute inset-0 w-[200vw] h-full flex items-center opacity-20">
          {/* Abstract City Grid Lines */}
          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
          {/* Glowing Horizon */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_30px_rgba(245,158,11,0.8)]"></div>
        </motion.div>

        {/* FLOATING UI CARDS */}
        <motion.div style={{ opacity: card1Opacity, y: card1Y }} className="absolute top-1/4 left-1/4 bg-surface/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4">
          <Network className="text-primary w-6 h-6" />
          <div>
            <p className="text-textMuted text-xs">Algorithm Active</p>
            <p className="text-textMain font-bold">Smart Matching (Dijkstra)</p>
          </div>
        </motion.div>

        <motion.div style={{ opacity: card2Opacity, y: card2Y }} className="absolute top-1/3 right-1/4 bg-surface/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4">
          <Map className="text-secondary w-6 h-6" />
          <div>
            <p className="text-textMuted text-xs">Telemetry</p>
            <p className="text-textMain font-bold">Real-time WebSocket Tracking</p>
          </div>
        </motion.div>

        <motion.div style={{ opacity: card3Opacity }} className="absolute top-20 left-1/2 -translate-x-1/2 text-center">
          <p className="text-primary tracking-widest uppercase text-sm font-bold mb-2">Driver Located</p>
          <p className="text-4xl text-textMain font-light">Fast Allocation Complete</p>
        </motion.div>

        {/* THE CAR (Abstract Silhouette) */}
        <motion.div style={{ x: carX }} className="relative z-20 flex items-center justify-center mt-32">
          
          {/* Car Body (Premium Glassmorphic) */}
          <div className="w-[600px] h-[160px] bg-gradient-to-b from-[#1a1a24] to-[#0a0a0f] border-t border-l border-white/20 rounded-[80px_150px_20px_20px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative flex items-end pb-4 px-12 justify-between backdrop-blur-md">
            
            {/* Front Headlight Glow */}
            <div className="absolute top-1/2 right-0 w-32 h-10 bg-white/10 blur-[20px] rounded-full"></div>
            <div className="absolute top-1/2 -right-10 w-4 h-4 bg-white shadow-[0_0_40px_rgba(255,255,255,1)] rounded-full"></div>

            {/* Tail light Glow */}
            <div className="absolute top-1/2 left-0 w-8 h-4 bg-red-500 shadow-[0_0_30px_rgba(239,68,68,1)] rounded-full"></div>

            {/* THE DOOR (With 3D Perspective) */}
            <motion.div 
              style={{ rotateY: doorRotateY, transformOrigin: "left" }}
              className="absolute top-4 left-[35%] w-[180px] h-[110px] bg-[#1f1f2e] border border-white/10 rounded-[20px_40px_10px_10px] shadow-inner z-30 flex items-center justify-center overflow-hidden"
            >
              {/* Window glass inside the door */}
              <div className="absolute top-2 left-2 right-2 h-10 bg-black/40 rounded-t-[10px_30px] border-b border-white/5"></div>
              {/* Door Handle */}
              <div className="absolute top-14 right-4 w-6 h-1.5 bg-white/20 rounded-full"></div>
            </motion.div>

            {/* GLOWING INTERIOR (Revealed when door opens) */}
            <motion.div 
              style={{ opacity: doorGlow }}
              className="absolute top-4 left-[35%] w-[180px] h-[110px] bg-gradient-to-r from-primary/40 to-secondary/40 blur-[10px] z-10 flex items-center justify-center"
            >
              <Zap className="text-white w-8 h-8 opacity-50" />
            </motion.div>

            {/* Wheels */}
            <motion.div style={{ rotate: wheelRotate }} className="relative -bottom-8 w-24 h-24 bg-[#050505] border-[4px] border-[#1f1f2e] rounded-full shadow-xl flex items-center justify-center z-40">
              <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(245,158,11,1)]"></div>
              </div>
            </motion.div>

            <motion.div style={{ rotate: wheelRotate }} className="relative -bottom-8 w-24 h-24 bg-[#050505] border-[4px] border-[#1f1f2e] rounded-full shadow-xl flex items-center justify-center z-40">
              <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}