import React, { useState } from "react";
import { CALDO_LUGARES_CARROZA_SOLID_SRC, CALDO_LUGARES_CARROZA_FALLBACK_URL } from "../assets/caldoLugaresSolidData";

interface LugaresSilhouettesBannerProps {
  className?: string;
  color?: string;
}

/**
 * Banner de silueta dibujada en color sólido #232e33 para la categoría Lugares.
 * Muestra la carreta/carroza medieval con caballo y cochero/conductor al frente,
 * con la caja de la carroza despejada (sin los pasajeros), centrada en el banner oscuro.
 */
export function LugaresSilhouettesBanner({
  className = "w-full h-28 sm:h-36 md:h-44",
}: LugaresSilhouettesBannerProps) {
  const [imgSrc, setImgSrc] = useState<string>(CALDO_LUGARES_CARROZA_SOLID_SRC);

  return (
    <div className={`relative w-full overflow-hidden select-none pointer-events-none flex items-end justify-center ${className}`}>
      <img
        src={imgSrc}
        alt="Silueta de carroza con caballo y conductor en Lugares"
        className="w-auto h-full max-h-48 object-contain object-bottom select-none pointer-events-none mx-auto"
        style={{
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))"
        }}
        onError={() => {
          if (imgSrc !== CALDO_LUGARES_CARROZA_FALLBACK_URL) {
            setImgSrc(CALDO_LUGARES_CARROZA_FALLBACK_URL);
          }
        }}
      />
    </div>
  );
}
