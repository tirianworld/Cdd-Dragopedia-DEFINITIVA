import React, { useState, useEffect } from "react";

export interface CarriageLoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "fullscreen";
  text?: string;
  subtext?: string;
  className?: string;
  showRoad?: boolean;
}

// 4 distinct stationary trot cycle sprites, perfectly aligned with zero displacement
const CARRIAGE_STEPS = [
  "/images/carriage_steps/step_0.png",
  "/images/carriage_steps/step_1.png",
  "/images/carriage_steps/step_2.png",
  "/images/carriage_steps/step_3.png",
];

export function CarriageLoader({
  size = "md",
  text,
  subtext,
  className = "",
  showRoad = true,
}: CarriageLoaderProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Preload all 4 sprites in browser cache for instant flicker-free playback
  useEffect(() => {
    CARRIAGE_STEPS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Sprite alternating clock: 200ms per step = 800ms natural equine trot gait in place
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % CARRIAGE_STEPS.length);
    }, 200);
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
        {CARRIAGE_STEPS.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>

      {/* Frame-accurate Sprite: centered in place, zero displacement, alternating sprites */}
      <div className={`relative ${sizeClasses} flex flex-col items-center justify-center`}>
        <div className="w-full aspect-[480/180] relative flex items-center justify-center overflow-hidden">
          <img
            key={currentFrame}
            src={CARRIAGE_STEPS[currentFrame]}
            alt="Cargando..."
            className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] select-none pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Steady stationary ground line - no translation so vehicle feels completely anchored */}
        {showRoad && (
          <div className="w-full mt-[-2px] relative flex items-center justify-center px-4">
            <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#6ca3a0]/40 to-transparent" />
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
