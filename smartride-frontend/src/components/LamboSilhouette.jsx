import { motion } from "framer-motion";

const LamboSilhouette = ({ doorRotate }) => {
  return (
    <div className="relative w-[600px] h-[220px]">
      <div
        className="absolute right-[-80px] top-[35%] w-[300px] h-[60px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at left center, hsla(38, 92%, 50%, 0.25) 0%, hsla(38, 92%, 50%, 0.08) 40%, transparent 70%)",
          transform: "skewY(-2deg)",
        }}
      />

      <div
        className="absolute bottom-[-20px] left-[10%] right-[10%] h-[40px] opacity-30"
        style={{
          background: "radial-gradient(ellipse at center top, hsla(38, 92%, 50%, 0.15) 0%, transparent 70%)",
        }}
      />

      <svg viewBox="0 0 600 220" className="w-full h-full" style={{ filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.9))" }}>
        <defs>
          <linearGradient id="lamboBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(220, 10%, 15%)" />
            <stop offset="30%" stopColor="hsl(220, 10%, 10%)" />
            <stop offset="70%" stopColor="hsl(220, 10%, 5%)" />
            <stop offset="100%" stopColor="hsl(220, 10%, 2%)" />
          </linearGradient>

          <linearGradient id="lamboGlass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(38, 50%, 15%)" stopOpacity="0.7" />
            <stop offset="50%" stopColor="hsl(38, 40%, 10%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(220, 30%, 5%)" stopOpacity="0.95" />
          </linearGradient>

          <filter id="lightGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(0, 0%, 15%)" />
            <stop offset="60%" stopColor="hsl(0, 0%, 5%)" />
            <stop offset="85%" stopColor="hsl(0, 0%, 2%)" />
            <stop offset="100%" stopColor="hsl(0, 0%, 8%)" />
          </radialGradient>
        </defs>

        <ellipse cx="300" cy="185" rx="250" ry="14" fill="rgba(0,0,0,0.8)" />

        <path
          d="
            M 55 162
            Q 50 155 52 145
            L 65 138
            L 100 128
            L 140 115
            Q 165 102 200 92
            L 240 84
            Q 270 72 300 65
            L 350 60
            Q 380 58 400 62
            L 430 72
            Q 455 80 470 92
            L 500 108
            L 530 120
            Q 548 128 552 138
            Q 555 148 553 158
            L 550 165
            Q 545 170 530 170
            L 460 172
            Q 440 172 435 168
            Q 428 162 415 162
            L 190 164
            Q 175 164 168 168
            Q 162 172 155 172
            L 70 170
            Q 58 168 55 162
            Z
          "
          fill="url(#lamboBody)"
          stroke="hsla(38, 92%, 50%, 0.1)"
          strokeWidth="0.5"
        />

        <path
          d="
            M 225 92
            Q 240 70 280 60
            L 340 56
            Q 370 56 395 64
            L 420 78
            Q 435 86 440 95
            L 430 95
            Q 410 82 380 78
            L 300 75
            Q 260 78 240 88
            Z
          "
          fill="url(#lamboBody)"
          stroke="hsla(0, 0%, 100%, 0.04)"
          strokeWidth="0.5"
        />

        <path
          d="M 243 88 Q 258 72 290 64 L 335 61 L 335 82 L 260 86 Z"
          fill="url(#lamboGlass)"
        />

        <path
          d="M 340 61 Q 368 60 390 68 L 415 80 L 420 88 L 340 82 Z"
          fill="url(#lamboGlass)"
        />

        <motion.g style={{ transformOrigin: "335px 165px", rotateY: doorRotate }}>
          <line
            x1="335" y1="62" x2="335" y2="163"
            stroke="hsla(38, 92%, 50%, 0.2)"
            strokeWidth="1"
          />
        </motion.g>

        <path
          d="M 120 125 Q 250 100 400 88 Q 470 95 530 118"
          stroke="hsla(0, 0%, 100%, 0.1)"
          strokeWidth="0.8"
          fill="none"
        />

        <path
          d="M 80 145 L 200 128 Q 300 118 420 115 L 535 128"
          stroke="hsla(0, 0%, 100%, 0.07)"
          strokeWidth="0.6"
          fill="none"
        />

        <path
          d="M 70 158 L 180 150 Q 300 144 420 146 L 540 155"
          stroke="hsla(38, 92%, 50%, 0.3)"
          strokeWidth="1"
          fill="none"
        />

        <path
          d="M 60 152 L 100 140 L 140 135 L 140 145 L 100 148 Z"
          fill="hsl(0, 0%, 3%)"
          stroke="hsla(0, 0%, 100%, 0.04)"
          strokeWidth="0.5"
        />

        <path
          d="M 530 145 L 548 140 L 550 155 L 535 158 Z"
          fill="hsl(0, 0%, 3%)"
        />

        <g filter="url(#lightGlow)">
          <path
            d="M 545 125 L 555 122 L 555 132 L 545 130 Z"
            fill="hsl(38, 92%, 60%)"
          />
          <line x1="530" y1="120" x2="552" y2="123" stroke="hsl(38, 92%, 50%)" strokeWidth="2" />
          <line x1="540" y1="132" x2="553" y2="128" stroke="hsl(38, 92%, 50%)" strokeWidth="1.5" />
        </g>

        <g filter="url(#softGlow)">
          <path
            d="M 55 135 L 62 132 L 62 148 L 55 145 Z"
            fill="hsl(0, 85%, 50%)"
            opacity="0.9"
          />
          <line x1="62" y1="138" x2="75" y2="136" stroke="hsl(0, 85%, 50%)" strokeWidth="1" opacity="0.6" />
        </g>

        <g>
          <circle cx="168" cy="168" r="28" fill="url(#wheelGrad)" stroke="hsl(0, 0%, 10%)" strokeWidth="4" />
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
            <line
              key={i}
              x1="168" y1="168"
              x2={168 + 16 * Math.cos((angle * Math.PI) / 180)}
              y2={168 + 16 * Math.sin((angle * Math.PI) / 180)}
              stroke="hsl(0, 0%, 25%)"
              strokeWidth="1.5"
            />
          ))}
          <circle cx="168" cy="168" r="6" fill="hsl(0, 0%, 10%)" />
          <circle cx="168" cy="168" r="3" fill="hsl(0, 0%, 20%)" />
          <circle cx="168" cy="168" r="12" fill="none" stroke="hsla(38, 92%, 50%, 0.3)" strokeWidth="2" />
        </g>

        <g>
          <circle cx="435" cy="168" r="28" fill="url(#wheelGrad)" stroke="hsl(0, 0%, 10%)" strokeWidth="4" />
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
            <line
              key={i}
              x1="435" y1="168"
              x2={435 + 16 * Math.cos((angle * Math.PI) / 180)}
              y2={168 + 16 * Math.sin((angle * Math.PI) / 180)}
              stroke="hsl(0, 0%, 25%)"
              strokeWidth="1.5"
            />
          ))}
          <circle cx="435" cy="168" r="6" fill="hsl(0, 0%, 10%)" />
          <circle cx="435" cy="168" r="3" fill="hsl(0, 0%, 20%)" />
          <circle cx="435" cy="168" r="12" fill="none" stroke="hsla(38, 92%, 50%, 0.3)" strokeWidth="2" />
        </g>

        <circle cx="58" cy="158" r="3" fill="hsl(0, 0%, 5%)" stroke="hsl(0, 0%, 20%)" strokeWidth="1" />
        <circle cx="68" cy="160" r="3" fill="hsl(0, 0%, 5%)" stroke="hsl(0, 0%, 20%)" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default LamboSilhouette;