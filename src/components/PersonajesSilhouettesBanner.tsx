import React, { useState } from "react";
import { CALDO_PERSONAJES_SOLID_SRC, CALDO_PERSONAJES_FALLBACK_URL } from "../assets/caldoPersonajesSolidData";

interface PersonajesSilhouettesBannerProps {
  className?: string;
  color?: string;
}

/**
 * Banner de siluetas dibujadas en color sólido #232e33
 * de los personajes de Caldo de Dragón con distribución centrada en pirámide heroica.
 * Los 10 personajes originales se mantienen intactos en sus posiciones y escalas,
 * con los 6 nuevos personajes flanqueando los extremos de forma simétrica y equilibrada.
 */
export function PersonajesSilhouettesBanner({
  className = "w-full h-28 sm:h-36 md:h-44",
}: PersonajesSilhouettesBannerProps) {
  const [imgSrc, setImgSrc] = useState<string>(CALDO_PERSONAJES_SOLID_SRC);

  return (
    <div className={`relative w-full overflow-hidden select-none pointer-events-none flex items-end justify-center ${className}`}>
      <img
        src={imgSrc}
        alt="Siluetas de personajes de Caldo de Dragón"
        className="w-auto h-full max-h-48 object-contain object-bottom select-none pointer-events-none mx-auto"
        style={{
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))"
        }}
        onError={() => {
          if (imgSrc !== CALDO_PERSONAJES_FALLBACK_URL) {
            setImgSrc(CALDO_PERSONAJES_FALLBACK_URL);
          }
        }}
      />
    </div>
  );
}
