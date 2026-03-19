import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import LamboSilhouette from "./LamboSilhouette";
import FloatingCard from "./FloatingCard";

const ScrollIntro = ({ onComplete }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const carX = useTransform(smoothProgress, [0, 0.8], ["-40%", "35%"]);
  const carScale = useTransform(smoothProgress, [0.6, 0.85], [1, 1.15]);
  const carSkew = useTransform(smoothProgress, [0, 0.2, 0.7, 0.85], [0, -2.5, -1.5, 0]);

  const doorRotate = useTransform(smoothProgress, [0.85, 0.95], [0, -65]);

  const introOpacity = useTransform(smoothProgress, [0.92, 1], [1, 0]);
  const introScale = useTransform(smoothProgress, [0.92, 1], [1, 0.95]);
  const introBlur = useTransform(smoothProgress, [0.92, 1], [0, 12]);

  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "25%"]);
  const gridOpacity = useTransform(smoothProgress, [0, 0.5], [0.12, 0.22]);

  const pathLength = useTransform(smoothProgress, [0.25, 0.65], [0, 1]);
  const roadX = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (latest >= 0.98) {
        onComplete();
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, onComplete]);

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#030305]">
      <motion.div
        style={{
          opacity: introOpacity,
          scale: introScale,
          filter: useTransform(introBlur, (v) => `blur(${v}px)`),
        }}
        className="fixed inset-0 z-50 overflow-hidden bg-[#030305]"
      >
        <motion.div
          style={{ y: bgY, opacity: gridOpacity, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          className="absolute inset-[-20%]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-[#030305]/80 to-[#030305]" />

        <div
          className="absolute left-0 right-0 h-[200px]"
          style={{
            bottom: "25%",
            background: "linear-gradient(to top, rgba(245,158,11, 0.05) 0%, transparent 100%)",
          }}
        />

        <motion.div style={{ x: roadX }} className="absolute bottom-[25%] left-[-5%] right-[-5%]">
          <div className="h-px bg-white/20" />
          <div className="h-[2px] mt-[2px] bg-white/10" />
          <div className="mt-[-12px] h-px border-t border-dashed border-white/10" />
        </motion.div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1920 1080" preserveAspectRatio="none">
          <motion.path
            d="M 50 720 C 300 710 400 690 600 670 S 900 640 1100 620 S 1400 590 1600 570 S 1800 555 1900 550"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="10 5"
            style={{
              pathLength,
              opacity: useTransform(pathLength, [0, 0.05, 0.9, 1], [0, 0.8, 0.8, 0.2]),
            }}
          />
          {[
            { cx: 350, cy: 700 },
            { cx: 650, cy: 670 },
            { cx: 1000, cy: 635 },
            { cx: 1350, cy: 585 },
            { cx: 1700, cy: 560 },
          ].map((node, i) => (
            <motion.g key={i}>
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="6"
                fill="#f59e0b"
                style={{
                  opacity: useTransform(smoothProgress, [0.25 + i * 0.08, 0.3 + i * 0.08], [0, 1]),
                }}
              />
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="15"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                style={{
                  opacity: useTransform(smoothProgress, [0.25 + i * 0.08, 0.3 + i * 0.08], [0, 0.4]),
                }}
              />
            </motion.g>
          ))}
        </svg>

        <FloatingCard
          progress={smoothProgress}
          rangeIn={[0.08, 0.18]}
          rangeOut={[0.32, 0.42]}
          title="Request Instantly"
          description="One tap to request. Our system processes your location in milliseconds."
          position="right"
        >
          <div className="bg-surfaceLight/50 rounded-lg p-3 space-y-2 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-textMuted">Pickup</span>
              <div className="w-20 h-1.5 rounded-full bg-primary/50" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-textMuted">Drop-off</span>
              <div className="w-16 h-1.5 rounded-full bg-secondary/50" />
            </div>
            <div className="h-8 rounded-md bg-primary/20 flex items-center justify-center mt-1 border border-primary/30">
              <span className="font-mono text-xs text-primary font-bold">REQUEST RIDE →</span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          progress={smoothProgress}
          rangeIn={[0.28, 0.38]}
          rangeOut={[0.52, 0.62]}
          title="Dijkstra Optimization"
          description="Graph-based shortest path finds optimal routes in O(V log V)."
          position="left"
        >
          <div className="bg-surfaceLight/50 rounded-lg p-3 border border-white/5">
            <div className="font-mono text-xs space-y-1">
              <div className="text-primary font-semibold">dist[v] = min(dist[v], dist[u] + w)</div>
              <div className="text-textMuted/60">{"// Priority Queue — O(V + E log V)"}</div>
              <div className="flex gap-1 mt-2">
                {[47, 82, 31, 95, 66, 23].map((v, i) => (
                  <div key={i} className="w-7 h-5 rounded bg-surface border border-white/10 flex items-center justify-center text-[10px] text-textMuted">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          progress={smoothProgress}
          rangeIn={[0.48, 0.58]}
          rangeOut={[0.72, 0.82]}
          title="Smart Driver Matching"
          description="Priority queue assigns the nearest available driver in real-time."
          position="right"
        >
          <div className="bg-surfaceLight/50 rounded-lg p-3 space-y-2 border border-white/5">
            {["Driver A — 0.3 km", "Driver B — 0.8 km", "Driver C — 1.4 km"].map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-white/20"}`} />
                <span className="font-mono text-xs text-textMuted">{d}</span>
                {i === 0 && <span className="ml-auto font-mono text-[10px] text-primary font-bold">MATCHED ✓</span>}
              </div>
            ))}
          </div>
        </FloatingCard>

        <FloatingCard
          progress={smoothProgress}
          rangeIn={[0.63, 0.73]}
          rangeOut={[0.87, 0.93]}
          title="Real-Time Tracking"
          description="Live WebSocket streams driver positions at 60fps."
          position="left"
        >
          <div className="bg-surfaceLight/50 rounded-lg p-3 border border-white/5">
            <div className="relative h-16">
              {[
                { x: 15, y: 10 }, { x: 50, y: 40 }, { x: 75, y: 15 }, { x: 35, y: 55 }, { x: 85, y: 50 },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-2.5 h-2.5 rounded-full bg-secondary/50 animate-pulse"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, animationDelay: `${i * 0.3}s` }}
                />
              ))}
              <div
                className="absolute w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(245,158,11,1)]"
                style={{ left: "50%", top: "30%", transform: "translate(-50%, -50%)" }}
              />
            </div>
          </div>
        </FloatingCard>

        <motion.div
          style={{
            x: carX,
            scale: carScale,
            skewX: carSkew,
          }}
          className="absolute top-[42%] left-1/2 -translate-y-1/2 will-change-transform"
        >
          <LamboSilhouette doorRotate={doorRotate} />
        </motion.div>

        <motion.div
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.08, 0.88, 0.95], [1, 1, 1, 0]),
          }}
        >
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tighter">SmartRide</h1>
          <p className="text-textMuted text-sm tracking-[0.2em] uppercase mt-3 font-mono">
            Efficiency, optimized by geometry
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: useTransform(smoothProgress, [0, 0.12], [1, 0]) }}
        >
          <span className="text-textMuted text-xs tracking-widest uppercase">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-2 rounded-full bg-primary"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScrollIntro;