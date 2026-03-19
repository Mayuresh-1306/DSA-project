import { motion, useTransform } from "framer-motion";

const FloatingCard = ({ progress, rangeIn, rangeOut, title, description, position, children }) => {
  const opacity = useTransform(progress, [rangeIn[0], rangeIn[1], rangeOut[0], rangeOut[1]], [0, 1, 1, 0]);
  const y = useTransform(progress, [rangeIn[0], rangeIn[1]], [40, 0]);
  const scale = useTransform(progress, [rangeIn[0], rangeIn[1]], [0.95, 1]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`absolute z-10 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-[300px] shadow-2xl ${
        position === "left" ? "left-[8%] top-[15%]" : "right-[8%] top-[20%]"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
          <span className="font-mono text-xs text-primary tracking-wider uppercase">{title}</span>
        </div>
        <p className="text-sm text-textMuted leading-relaxed">{description}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  );
};

export default FloatingCard;