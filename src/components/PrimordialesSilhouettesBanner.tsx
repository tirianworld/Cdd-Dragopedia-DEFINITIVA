import React, { useState } from "react";
import {
  CALDO_PRIMORDIAL_SOL_SOLID_SRC,
  CALDO_PRIMORDIAL_SOL_FALLBACK_URL,
  CALDO_PRIMORDIAL_HIELO_SOLID_SRC,
  CALDO_PRIMORDIAL_HIELO_FALLBACK_URL,
  CALDO_PRIMORDIAL_NATURALEZA_SOLID_SRC,
  CALDO_PRIMORDIAL_NATURALEZA_FALLBACK_URL,
  CALDO_PRIMORDIAL_SOMBRA_SOLID_SRC,
  CALDO_PRIMORDIAL_SOMBRA_FALLBACK_URL,
} from "../assets/caldoPrimordialesSolidData";

interface PrimordialesSilhouettesBannerProps {
  className?: string;
  color?: string;
}

interface PrimordialFigure {
  id: string;
  name: string;
  title: string;
  element: string;
  auraColor: string;
  auraGlow: string;
  bgGlow: string;
  src: string;
  fallback: string;
}

const PRIMORDIALS: PrimordialFigure[] = [
  {
    id: "sol",
    name: "Primordial del Sol y la Luz",
    title: "Señor de la Luz y el Fuego Solar",
    element: "Luz / Sol",
    auraColor: "#f59e0b",
    auraGlow: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.55)) drop-shadow(0 0 22px rgba(245, 158, 11, 0.28)) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.55))",
    bgGlow: "radial-gradient(circle at 50% 60%, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.04) 50%, transparent 75%)",
    src: CALDO_PRIMORDIAL_SOL_SOLID_SRC,
    fallback: CALDO_PRIMORDIAL_SOL_FALLBACK_URL,
  },
  {
    id: "hielo",
    name: "Primordial del Hielo y la Escarcha",
    title: "Monarca Invernal de los Glaciares",
    element: "Hielo / Escarcha",
    auraColor: "#38bdf8",
    auraGlow: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.55)) drop-shadow(0 0 22px rgba(56, 189, 248, 0.28)) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.55))",
    bgGlow: "radial-gradient(circle at 50% 60%, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0.04) 50%, transparent 75%)",
    src: CALDO_PRIMORDIAL_HIELO_SOLID_SRC,
    fallback: CALDO_PRIMORDIAL_HIELO_FALLBACK_URL,
  },
  {
    id: "naturaleza",
    name: "Primordial de la Naturaleza y el Bosque",
    title: "Anciano Arbóreo de la Floresta y la Vida",
    element: "Naturaleza / Bosque",
    auraColor: "#22c55e",
    auraGlow: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.55)) drop-shadow(0 0 22px rgba(34, 197, 94, 0.28)) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.55))",
    bgGlow: "radial-gradient(circle at 50% 60%, rgba(34, 197, 94, 0.16) 0%, rgba(34, 197, 94, 0.04) 50%, transparent 75%)",
    src: CALDO_PRIMORDIAL_NATURALEZA_SOLID_SRC,
    fallback: CALDO_PRIMORDIAL_NATURALEZA_FALLBACK_URL,
  },
  {
    id: "sombra",
    name: "Primordial de la Sombra y el Vacío",
    title: "Místico del Cuervo y la Magia Sombría",
    element: "Sombra / Vacío",
    auraColor: "#a855f7",
    auraGlow: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.55)) drop-shadow(0 0 22px rgba(168, 85, 247, 0.28)) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.55))",
    bgGlow: "radial-gradient(circle at 50% 60%, rgba(168, 85, 247, 0.16) 0%, rgba(168, 85, 247, 0.04) 50%, transparent 75%)",
    src: CALDO_PRIMORDIAL_SOMBRA_SOLID_SRC,
    fallback: CALDO_PRIMORDIAL_SOMBRA_FALLBACK_URL,
  },
];

/**
 * Banner de siluetas de los 4 Primordiales para la categoría Primordiales.
 * Muestra a los 4 seres por separado en el centro del banner,
 * con su silueta sólida en #232e33 y un sutil aura resplandeciente del color elemental que les rodea:
 * - Sol: Dorado / Ámbar (#f59e0b)
 * - Hielo: Azul Glacial (#38bdf8)
 * - Naturaleza: Verde Esmeralda (#22c55e)
 * - Sombra: Púrpura / Violeta Vacío (#a855f7)
 */
export function PrimordialesSilhouettesBanner({
  className = "w-full h-32 sm:h-40 md:h-48",
}: PrimordialesSilhouettesBannerProps) {
  const [sources, setSources] = useState<Record<string, string>>({
    sol: CALDO_PRIMORDIAL_SOL_SOLID_SRC,
    hielo: CALDO_PRIMORDIAL_HIELO_SOLID_SRC,
    naturaleza: CALDO_PRIMORDIAL_NATURALEZA_SOLID_SRC,
    sombra: CALDO_PRIMORDIAL_SOMBRA_SOLID_SRC,
  });

  const handleError = (id: string, fallback: string) => {
    setSources((prev) => ({ ...prev, [id]: fallback }));
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none flex items-end justify-center ${className}`}
    >
      {/* Centered Lineup of the 4 Primordials with individual subtle auras */}
      <div className="relative z-10 flex items-end justify-center gap-5 sm:gap-9 md:gap-14 lg:gap-16 px-4 pb-0 h-full max-w-4xl mx-auto">
        {PRIMORDIALS.map((p) => (
          <div
            key={p.id}
            className="relative group flex flex-col items-center justify-end h-full"
            title={`${p.name} (${p.element})`}
          >
            {/* Subtle soft ambient glow behind the figure */}
            <div
              className="absolute -inset-4 sm:-inset-6 pointer-events-none rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: p.bgGlow }}
            />

            {/* Individual Silhouette with subtle colored aura drop-shadow */}
            <img
              src={sources[p.id]}
              alt={`Silueta de ${p.name}`}
              className="relative z-10 w-auto h-full max-h-36 sm:max-h-44 md:max-h-48 object-contain object-bottom select-none pointer-events-none transition-transform duration-300 group-hover:scale-[1.03]"
              style={{
                filter: p.auraGlow,
              }}
              onError={() => handleError(p.id, p.fallback)}
            />

            {/* Subtle grounded light reflection under each figure */}
            <div
              className="h-1.5 w-16 sm:w-20 rounded-full blur-sm opacity-60 -mt-1 pointer-events-none"
              style={{
                backgroundColor: p.auraColor,
                boxShadow: `0 0 12px 2px ${p.auraColor}`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
