import React, { useState } from "react";
import { CALDO_DRAGONES_COMBATE_SOLID_SRC, CALDO_DRAGONES_COMBATE_FALLBACK_URL } from "../assets/caldoDragonesSolidData";

interface DragonesSilhouettesBannerProps {
  className?: string;
  color?: string;
}

/**
 * Banner de silueta en color sólido #232e33 para la categoría Dragones.
 * Muestra el enfrentamiento panorámico completo que se extiende a lo largo de todo el banner:
 * A la izquierda, el dragón blanco sobre su enorme manto de tesoro exhalando aliento de hielo.
 * A la derecha, la partida de héroes lanzándose al combate, con el terreno y la ventisca
 * fusionándose naturalmente sin cortes rectangulares ni límites abruptos.
 */
export function DragonesSilhouettesBanner({
  className = "w-full h-44 sm:h-56 md:h-64 lg:h-72",
}: DragonesSilhouettesBannerProps) {
  const [imgSrc, setImgSrc] = useState<string>(CALDO_DRAGONES_COMBATE_SOLID_SRC);

  return (
    <div className={`relative w-full overflow-hidden select-none pointer-events-none flex items-end justify-center ${className}`}>
      <img
        src={imgSrc}
        alt="Silueta panorámica de combate contra el dragón blanco en Dragones"
        className="w-full h-full object-contain object-bottom select-none pointer-events-none"
        onError={() => {
          if (imgSrc !== CALDO_DRAGONES_COMBATE_FALLBACK_URL) {
            setImgSrc(CALDO_DRAGONES_COMBATE_FALLBACK_URL);
          }
        }}
      />
    </div>
  );
}
