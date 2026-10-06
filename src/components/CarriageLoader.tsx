import React from "react";

export interface CarriageLoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "fullscreen";
  text?: string;
  subtext?: string;
  className?: string;
  showRoad?: boolean;
}

export function CarriageLoader({
  size = "md",
  text,
  subtext,
  className = "",
  showRoad = true,
}: CarriageLoaderProps) {
  // Dimensions based on size
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
      {/* Animated AI Sprite: Horse & Carriage Walking Cycle */}
      <div className={`relative ${sizeClasses} overflow-hidden flex flex-col items-center`}>
        <picture className="w-full h-auto block">
          <source srcSet="/images/carriage_loader_ai.webp" type="image/webp" />
          <img
            src="/images/carriage_loader_ai.gif"
            alt="Cargando..."
            className="w-full h-auto block object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
            loading="eager"
          />
        </picture>

        {/* Ambient Moving Ground Line */}
        {showRoad && (
          <div className="w-full mt-[-6px] relative flex items-center justify-center overflow-hidden">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent relative">
              <div 
                className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,rgba(203,247,245,0.4)_12px,rgba(203,247,245,0.4)_24px)] animate-[roadflow_0.5s_linear_infinite]" 
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

      {/* Embedded roadflow animation style */}
      <style>{`
        @keyframes roadflow {
          0% { transform: translateX(0); }
          100% { transform: translateX(24px); }
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
