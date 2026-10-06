import React from "react";

export interface CarriageLoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "fullscreen";
  text?: string;
  subtext?: string;
  className?: string;
  silhouetteColor?: string;
  wheelSpokeColor?: string;
  showRoad?: boolean;
}

export function CarriageLoader({
  size = "md",
  text,
  subtext,
  className = "",
  silhouetteColor = "currentColor",
  showRoad = true,
}: CarriageLoaderProps) {
  // Dimensions based on size
  const sizeClasses = {
    xs: "w-36 h-auto",
    sm: "w-52 h-auto",
    md: "w-72 h-auto",
    lg: "w-96 h-auto",
    xl: "w-[480px] h-auto",
    fullscreen: "w-80 md:w-[440px] h-auto",
  }[size];

  const content = (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* SVG Carriage Silhouette with Animated Trot & Rotating Wheels */}
      <div className={`relative ${sizeClasses} overflow-hidden py-1`}>
        <svg
          viewBox="0 0 600 240"
          className="w-full h-auto drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Filter for subtle silhouette depth & fantasy glow */}
            <filter id="carriage-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00f2fe" floodOpacity="0.12" />
            </filter>

            {/* Gradient for subtle road depth */}
            <linearGradient id="road-fade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
              <stop offset="15%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="85%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>

            {/* Reusable Spoked Wheel Pattern */}
            <g id="spoked-wheel-front">
              <circle cx="0" cy="0" r="32" fill="none" stroke="currentColor" strokeWidth="5.5" opacity="0.95" />
              <circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
              <circle cx="0" cy="0" r="9" fill="currentColor" />
              <circle cx="0" cy="0" r="4.5" fill="#0f172a" />
              {/* 8 Spokes */}
              <line x1="0" y1="-28" x2="0" y2="28" stroke="currentColor" strokeWidth="2.8" />
              <line x1="-28" y1="0" x2="28" y2="0" stroke="currentColor" strokeWidth="2.8" />
              <line x1="-20" y1="-20" x2="20" y2="20" stroke="currentColor" strokeWidth="2.5" />
              <line x1="-20" y1="20" x2="20" y2="-20" stroke="currentColor" strokeWidth="2.5" />
            </g>

            <g id="spoked-wheel-rear">
              <circle cx="0" cy="0" r="42" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.95" />
              <circle cx="0" cy="0" r="37" fill="none" stroke="currentColor" strokeWidth="1.8" opacity="0.4" />
              <circle cx="0" cy="0" r="11" fill="currentColor" />
              <circle cx="0" cy="0" r="5.5" fill="#0f172a" />
              {/* 10 Spokes */}
              <line x1="0" y1="-37" x2="0" y2="37" stroke="currentColor" strokeWidth="3" />
              <line x1="-37" y1="0" x2="37" y2="0" stroke="currentColor" strokeWidth="3" />
              <line x1="-26" y1="-26" x2="26" y2="26" stroke="currentColor" strokeWidth="2.7" />
              <line x1="-26" y1="26" x2="26" y2="-26" stroke="currentColor" strokeWidth="2.7" />
              <line x1="-35" y1="-12" x2="35" y2="12" stroke="currentColor" strokeWidth="2.2" />
              <line x1="-12" y1="-35" x2="12" y2="35" stroke="currentColor" strokeWidth="2.2" />
            </g>
          </defs>

          {/* Embedded Styles for 60fps GPU Keyframe Animations */}
          <style>{`
            /* Front Wheel Rotation (Rolling to the Left -> Counter-Clockwise) */
            @keyframes wheel-rotate-front {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            .animate-wheel-front {
              transform-origin: 378px 182px;
              animation: wheel-rotate-front 1.05s linear infinite;
            }

            /* Rear Wheel Rotation (Larger Diameter -> Proportionate Slower Period) */
            @keyframes wheel-rotate-rear {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
            .animate-wheel-rear {
              transform-origin: 520px 172px;
              animation: wheel-rotate-rear 1.38s linear infinite;
            }

            /* Cart Chassis Rumble & Bounce */
            @keyframes cart-bounce {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              20% { transform: translateY(-1.5px) rotate(-0.35deg); }
              45% { transform: translateY(0.8px) rotate(0.25deg); }
              70% { transform: translateY(-1.2px) rotate(-0.2deg); }
              85% { transform: translateY(0.5px) rotate(0.15deg); }
            }
            .animate-cart-body {
              transform-origin: 450px 180px;
              animation: cart-bounce 0.52s ease-in-out infinite;
            }

            /* Driver Gentle Sway with Reins */
            @keyframes driver-sway {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-1px) rotate(-0.6deg); }
            }
            .animate-driver {
              transform-origin: 345px 125px;
              animation: driver-sway 0.52s ease-in-out infinite;
            }

            /* Horse Body Rhythmic Trotting Bob */
            @keyframes horse-bob {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25% { transform: translateY(-3px) rotate(-0.4deg); }
              50% { transform: translateY(0.8px) rotate(0deg); }
              75% { transform: translateY(-2.2px) rotate(0.3deg); }
            }
            .animate-horse-body {
              transform-origin: 195px 135px;
              animation: horse-bob 0.52s ease-in-out infinite;
            }

            /* Horse Tail Natural Sway */
            @keyframes horse-tail {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(8deg); }
            }
            .animate-horse-tail {
              transform-origin: 275px 105px;
              animation: horse-tail 0.7s ease-in-out infinite;
            }

            /* Front-Left Leg (Near Side) */
            @keyframes leg-fl-motion {
              0% { transform: rotate(-24deg); }
              25% { transform: rotate(6deg); }
              50% { transform: rotate(26deg); }
              75% { transform: rotate(-10deg); }
              100% { transform: rotate(-24deg); }
            }
            .animate-leg-fl {
              transform-origin: 145px 132px;
              animation: leg-fl-motion 0.52s ease-in-out infinite;
            }

            /* Front-Right Leg (Far Side / Opposite Phase) */
            @keyframes leg-fr-motion {
              0% { transform: rotate(26deg); }
              25% { transform: rotate(-10deg); }
              50% { transform: rotate(-24deg); }
              75% { transform: rotate(6deg); }
              100% { transform: rotate(26deg); }
            }
            .animate-leg-fr {
              transform-origin: 145px 132px;
              animation: leg-fr-motion 0.52s ease-in-out infinite;
            }

            /* Hind-Left Leg (Near Side) */
            @keyframes leg-bl-motion {
              0% { transform: rotate(22deg); }
              25% { transform: rotate(-6deg); }
              50% { transform: rotate(-24deg); }
              75% { transform: rotate(8deg); }
              100% { transform: rotate(22deg); }
            }
            .animate-leg-bl {
              transform-origin: 242px 130px;
              animation: leg-bl-motion 0.52s ease-in-out infinite;
            }

            /* Hind-Right Leg (Far Side / Opposite Phase) */
            @keyframes leg-br-motion {
              0% { transform: rotate(-24deg); }
              25% { transform: rotate(8deg); }
              50% { transform: rotate(22deg); }
              75% { transform: rotate(-6deg); }
              100% { transform: rotate(-24deg); }
            }
            .animate-leg-br {
              transform-origin: 242px 130px;
              animation: leg-br-motion 0.52s ease-in-out infinite;
            }

            /* Road Track / Dust Movement Beneath Wheels */
            @keyframes road-flow {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 48; }
            }
            .animate-road-line {
              animation: road-flow 0.4s linear infinite;
            }

            /* Dust Specks floating off back wheel */
            @keyframes dust-float {
              0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
              40% { opacity: 0.6; }
              100% { opacity: 0; transform: translate(30px, -8px) scale(1.4); }
            }
            .animate-dust-1 { animation: dust-float 0.8s ease-out infinite; }
            .animate-dust-2 { animation: dust-float 0.8s ease-out 0.4s infinite; }
          `}</style>

          {/* ============================================================ */}
          {/* 1. ROAD / GROUND BASE LINE & COBBLESTONES */}
          {/* ============================================================ */}
          {showRoad && (
            <g className="text-muted-foreground/60">
              {/* Solid base rail */}
              <line
                x1="20"
                y1="216"
                x2="580"
                y2="216"
                stroke="url(#road-fade)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Animated dashing indicating forward momentum */}
              <line
                x1="40"
                y1="216"
                x2="560"
                y2="216"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="8 16"
                className="animate-road-line opacity-40"
              />
              {/* Subtle cobblestone dots */}
              <circle cx="120" cy="221" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="210" cy="222" r="2" fill="currentColor" opacity="0.4" />
              <circle cx="340" cy="221" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="450" cy="222" r="2" fill="currentColor" opacity="0.4" />
              <circle cx="530" cy="221" r="1.5" fill="currentColor" opacity="0.3" />
            </g>
          )}

          {/* ============================================================ */}
          {/* 2. DUST PARTICLES BEHIND CARRIAGE WHEELS */}
          {/* ============================================================ */}
          <g className="text-primary/40">
            <circle cx="560" cy="214" r="2" fill="currentColor" className="animate-dust-1" />
            <circle cx="550" cy="212" r="1.5" fill="currentColor" className="animate-dust-2" />
          </g>

          {/* ============================================================ */}
          {/* 3. FAR LEGS OF HORSE (Right Side - Deeper in background) */}
          {/* ============================================================ */}
          <g fill={silhouetteColor} opacity="0.75">
            {/* Front-Right Leg (Far) */}
            <g className="animate-leg-fr">
              {/* Shoulder to knee, cannon, fetlock, hoof */}
              <path d="M 145 132 C 144 145, 142 165, 140 176 C 139 184, 137 198, 136 208 L 130 216 L 142 216 L 145 208 C 146 198, 148 184, 150 176 C 151 165, 152 145, 151 132 Z" />
            </g>

            {/* Hind-Right Leg (Far) */}
            <g className="animate-leg-br">
              {/* Gaskin, hock, cannon, fetlock, hoof */}
              <path d="M 238 132 C 244 148, 252 168, 250 182 C 248 194, 245 204, 242 214 L 235 216 L 246 216 L 249 214 C 253 204, 256 194, 258 182 C 260 168, 254 148, 246 132 Z" />
            </g>
          </g>

          {/* ============================================================ */}
          {/* 4. MAIN HORSE BODY, HEAD, NECK, HARNESS & TAIL */}
          {/* ============================================================ */}
          <g fill={silhouetteColor} className="animate-horse-body">
            {/* Animated Tail */}
            <g className="animate-horse-tail">
              <path
                d="M 270 102 C 278 112, 288 128, 288 150 C 288 168, 282 178, 276 182 C 278 172, 282 155, 280 142 C 278 130, 272 118, 266 108 Z"
                opacity="0.9"
              />
            </g>

            {/* Horse Torso, Barrel, Flank & Rump */}
            <path d="
              M 150 90
              C 170 94, 195 98, 225 96
              C 248 94, 265 98, 272 108
              C 278 118, 274 134, 268 144
              C 255 152, 235 154, 215 152
              C 185 150, 160 152, 142 145
              C 134 135, 134 115, 140 102
              Z
            " />

            {/* Horse Muscular Neck & Arched Crest */}
            <path d="
              M 150 90
              C 142 78, 134 62, 122 48
              C 118 42, 114 42, 112 46
              C 106 58, 102 78, 108 92
              C 114 104, 126 114, 138 118
              C 144 114, 148 102, 150 90
              Z
            " />

            {/* Horse Mane on Crest */}
            <path d="
              M 124 45
              C 127 50, 132 58, 136 68
              C 140 76, 144 84, 148 92
              C 152 90, 146 80, 142 72
              C 138 62, 132 52, 128 44
              Z
            " opacity="0.95" />

            {/* Horse Head, Ears & Muzzle (Facing Left) */}
            <path d="
              M 116 46
              C 114 36, 110 32, 108 34
              C 107 38, 110 44, 112 48
              C 104 54, 95 62, 88 74
              C 84 80, 78 88, 72 96
              C 68 102, 69 108, 75 110
              C 82 112, 90 108, 96 100
              C 104 94, 108 84, 112 78
              Z
            " />

            {/* Bridle & Bit details */}
            <path
              d="M 75 106 L 82 95 L 94 98"
              stroke="#0f172a"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />

            {/* Harness Collar (Petral / Collera) */}
            <path
              d="M 120 72 C 126 84, 134 102, 142 120"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Harness Back Pad & Surcingle */}
            <rect x="180" y="93" width="14" height="42" rx="3" fill="currentColor" opacity="0.9" />
            {/* Breeching strap around buttocks */}
            <path
              d="M 235 118 C 255 116, 270 120, 272 130"
              stroke="currentColor"
              strokeWidth="3.5"
              fill="none"
            />
          </g>

          {/* ============================================================ */}
          {/* 5. NEAR LEGS OF HORSE (Left Side - Foreground / Full Tone) */}
          {/* ============================================================ */}
          <g fill={silhouetteColor}>
            {/* Front-Left Leg (Near) */}
            <g className="animate-leg-fl">
              {/* Powerful shoulder, knee, cannon bone, fetlock and solid hoof */}
              <path d="
                M 140 132
                C 142 146, 146 162, 144 172
                C 142 180, 138 192, 136 206
                L 126 216
                L 142 216
                L 146 206
                C 149 192, 154 180, 156 172
                C 158 162, 154 146, 150 132
                Z
              " />
              {/* Fetlock feathering detail */}
              <path d="M 136 206 C 132 210, 130 214, 126 216 L 134 216 Z" opacity="0.7" />
            </g>

            {/* Hind-Left Leg (Near) */}
            <g className="animate-leg-bl">
              {/* Muscular hip, thigh, backward hock angle, cannon and hoof */}
              <path d="
                M 245 130
                C 254 146, 265 166, 262 180
                C 258 192, 252 202, 248 214
                L 238 216
                L 252 216
                L 256 214
                C 262 202, 268 192, 272 180
                C 275 166, 264 146, 255 130
                Z
              " />
            </g>
          </g>

          {/* ============================================================ */}
          {/* 6. SHAFT / TONGUE (Vara de madera entre carro y caballo) */}
          {/* ============================================================ */}
          <line
            x1="375"
            y1="180"
            x2="185"
            y2="135"
            stroke={silhouetteColor}
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* ============================================================ */}
          {/* 7. WAGON / CARRIAGE BODY & SEATED DRIVER */}
          {/* ============================================================ */}
          <g fill={silhouetteColor} className="animate-cart-body">
            {/* Heavy Chassis Bed Beam */}
            <rect x="330" y="152" width="245" height="12" rx="2" />

            {/* Wagon Side Wall - Solid baseboards */}
            <rect x="385" y="112" width="190" height="42" rx="2" />
            {/* Grooves in horizontal planks */}
            <line x1="385" y1="126" x2="575" y2="126" stroke="#070e14" strokeWidth="2.5" />
            <line x1="385" y1="140" x2="575" y2="140" stroke="#070e14" strokeWidth="2.5" />

            {/* Vertical Wooden Posts / Stakes (Railing as seen in image) */}
            <g>
              <rect x="400" y="82" width="7" height="42" rx="1" />
              <rect x="440" y="82" width="7" height="42" rx="1" />
              <rect x="480" y="82" width="7" height="42" rx="1" />
              <rect x="520" y="82" width="7" height="42" rx="1" />
              <rect x="560" y="82" width="7" height="42" rx="1" />
              {/* Horizontal top rail connecting the posts */}
              <rect x="395" y="84" width="180" height="6" rx="1.5" />
            </g>

            {/* Front Bench & Footrest */}
            <polygon points="325,152 355,152 355,130 325,138" />
            <rect x="335" y="126" width="45" height="8" rx="2" />
            {/* Bench Backrest */}
            <rect x="375" y="76" width="6" height="52" rx="1.5" />

            {/* Seated Driver Figure (Coat, Hat & Hands) */}
            <g className="animate-driver">
              {/* Legs / Lower Coat draped over the bench */}
              <path d="M 326 148 C 322 142, 324 132, 332 126 L 360 126 L 362 148 Z" />

              {/* Heavy Cloak / Body Torso */}
              <path d="
                M 334 126
                C 328 116, 330 95, 336 82
                C 342 72, 350 68, 362 68
                C 370 70, 376 80, 374 98
                C 372 112, 366 122, 358 126
                Z
              " />

              {/* Arms extended holding the reins */}
              <path d="
                M 346 84
                C 334 88, 318 92, 308 94
                C 305 96, 308 100, 314 98
                C 324 96, 338 92, 348 90
                Z
              " />

              {/* Driver's Head & Hood / Hat */}
              <path d="
                M 344 68
                C 342 58, 344 50, 352 46
                C 358 44, 366 46, 368 54
                C 370 62, 366 68, 360 70
                Z
              " />

              {/* Traditional Hat with Brim (as in image) */}
              <ellipse cx="355" cy="45" rx="14" ry="4" />
              <path d="M 346 44 L 348 34 L 364 34 L 366 44 Z" />

              {/* Reins (Riendas) extending from driver's hands to the horse */}
              <path
                d="M 308 96 C 240 106, 175 108, 92 100"
                stroke={silhouetteColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.95"
              />
              {/* Secondary rein line for authentic pair */}
              <path
                d="M 308 98 C 240 110, 180 112, 94 104"
                stroke={silhouetteColor}
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                opacity="0.75"
              />
            </g>
          </g>

          {/* ============================================================ */}
          {/* 8. ANIMATED ROTATING WHEELS (Front & Rear) */}
          {/* ============================================================ */}
          {/* Front Wheel (Diameter: ~64px, Center: 378, 182) */}
          <g className="animate-wheel-front text-foreground" style={{ color: silhouetteColor }}>
            <g transform="translate(378, 182)">
              <use href="#spoked-wheel-front" />
            </g>
          </g>

          {/* Rear Wheel (Diameter: ~84px, Center: 520, 172) */}
          <g className="animate-wheel-rear text-foreground" style={{ color: silhouetteColor }}>
            <g transform="translate(520, 172)">
              <use href="#spoked-wheel-rear" />
            </g>
          </g>
        </svg>
      </div>

      {/* Loading Text & Ambient Subtitle */}
      {(text || subtext) && (
        <div className="mt-3 text-center space-y-1 animate-pulse">
          {text && (
            <p className="font-heading font-extrabold text-xs md:text-sm tracking-widest uppercase text-foreground/90">
              {text}
            </p>
          )}
          {subtext && (
            <p className="font-serif italic text-[11px] text-muted-foreground/80">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (size === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md transition-all">
        {content}
      </div>
    );
  }

  return content;
}
