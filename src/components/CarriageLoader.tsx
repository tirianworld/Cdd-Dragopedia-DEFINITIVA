import React, { useState, useEffect } from "react";

export interface CarriageLoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "fullscreen";
  text?: string;
  subtext?: string;
  className?: string;
  showRoad?: boolean;
}

// 16 solid locked-position frames (zero horizontal displacement, 1.84s cycle)
const CARRIAGE_FRAMES = Array.from({ length: 16 }, (_, i) => 
  `/images/carriage_solid_anim/frame_${String(i).padStart(2, "0")}.png`
);

export function CarriageLoader({
  size = "md",
  text,
  subtext,
  className = "",
  showRoad = true,
}: CarriageLoaderProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Preload all 16 frames immediately in browser cache
  useEffect(() => {
    CARRIAGE_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Steady, deliberate trot clock: 115ms * 16 frames = 1.84 seconds per cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % CARRIAGE_FRAMES.length);
    }, 115);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    xs: "w-36 max-w-[90vw]",
    sm: "w-52 max-w-[90vw]",
    md: "w-72 max-w-[90vw]",
    lg: "w-96 max-w-[90vw]",
    xl: "w-[480px] max-w-[90vw]",
    fullscreen: "w-80 md:w-[440px] max-w-[90vw]",
  }[size];

  const content = (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Hidden preloader */}
      <div className="hidden" aria-hidden="true">
        {CARRIAGE_FRAMES.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>

      {/* Frame-accurate Sprite: 1 single sprite rendered in place at all times (zero displacement) */}
      <div className={`relative ${sizeClasses} flex flex-col items-center justify-center`}>
        <div className="w-full aspect-[500/230] relative flex items-center justify-center overflow-hidden">
          <img
            key={currentFrame}
            src={CARRIAGE_FRAMES[currentFrame]}
            alt="Cargando..."
            className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Ambient Moving Road Track (Ground remains steady beneath wheels) */}
        {showRoad && (
          <div className="w-full mt-[-4px] relative flex items-center justify-center overflow-hidden px-2">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/35 to-transparent relative">
              <div 
                className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_16px,rgba(203,247,245,0.45)_16px,rgba(203,247,245,0.45)_32px)] animate-[roadflow_0.6s_linear_infinite]" 
              />
            </div>
          </div>
        )}
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

      {/* Road animation CSS */}
      <style>{`
        @keyframes roadflow {
          0% { transform: translateX(0); }
          100% { transform: translateX(32px); }
        }
      `}</style>
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
