import React, { useState } from "react";

interface PersonajesSilhouettesBannerProps {
  className?: string;
  color?: string;
}

export function PersonajesSilhouettesBanner({
  className = "w-full h-full",
  color = "#232e33",
}: PersonajesSilhouettesBannerProps) {
  const [imgSrc, setImgSrc] = useState("/images/banners/banner_personajes_cristales.jpg");

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none flex items-center justify-center p-0 m-0 ${className}`}
    >
      <img
        src={imgSrc}
        alt="Banner de Dominio de los Personajes - Entrando por el Espejo al Laberinto de los Cristales"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-500 origin-center group-hover/banner:scale-[1.02] block m-0 p-0"
        onError={() => setImgSrc("/images/caldo_personajes_drawn_solid.png")}
      />
      {/* Sutil overlay degradado para contraste y legibilidad con el tema místico de cristales */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent pointer-events-none z-30" />
    </div>
  );
}
