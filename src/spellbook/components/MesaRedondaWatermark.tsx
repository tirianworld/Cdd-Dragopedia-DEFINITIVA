import React from 'react';

interface MesaRedondaWatermarkProps {
  className?: string;
  size?: number | string;
  opacity?: number;
}

export const MesaRedondaWatermark: React.FC<MesaRedondaWatermarkProps> = ({
  className = '',
  size,
  opacity,
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size || '100%'}
      height={size || '100%'}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={opacity !== undefined ? { opacity } : undefined}
      aria-hidden="true"
    >
      <defs>
        {/* Silla individual de la Mesa Redonda */}
        <g id="mesa-chair">
          {/* Postes laterales del respaldo */}
          <path d="M 222 135 L 221 72" strokeWidth="4.5" />
          <rect x="218" y="66" width="7" height="7" rx="1.5" fill="currentColor" />

          <path d="M 278 135 L 279 72" strokeWidth="4.5" />
          <rect x="275" y="66" width="7" height="7" rx="1.5" fill="currentColor" />

          {/* Listón superior del respaldo */}
          <path
            d="M 221 82 C 238 86 262 86 279 82 L 279 92 C 262 96 238 96 221 92 Z"
            fill="currentColor"
            fillOpacity="0.15"
            strokeWidth="3.5"
          />

          {/* Listón inferior del respaldo */}
          <path
            d="M 222 105 C 238 109 262 109 278 105 L 278 114 C 262 118 238 118 222 114 Z"
            fill="currentColor"
            fillOpacity="0.15"
            strokeWidth="3.5"
          />

          {/* Asiento contorneado */}
          <path
            d="M 224 124 C 238 127 262 127 276 124 L 274 166 C 262 169 238 169 226 166 Z"
            fill="currentColor"
            fillOpacity="0.1"
            strokeWidth="4.5"
          />

          {/* Soportes curvos decorativos bajo el asiento */}
          <path d="M 234 168 C 231 176 242 178 245 170" strokeWidth="3" />
          <path d="M 266 168 C 269 176 258 178 255 170" strokeWidth="3" />
        </g>

        {/* Adorno entre sillas */}
        <g id="mesa-flourish">
          <path d="M 241 169 C 246 171 254 171 259 169" strokeWidth="3" />
          <circle cx="250" cy="157" r="3.2" fill="currentColor" stroke="none" />
          <circle cx="242" cy="160" r="2.2" fill="currentColor" stroke="none" />
          <circle cx="258" cy="160" r="2.2" fill="currentColor" stroke="none" />
        </g>
      </defs>

      {/* Mesa Redonda Central con anillos concéntricos y motivos heráldicos */}
      <circle cx="250" cy="250" r="78" strokeWidth="5" fill="currentColor" fillOpacity="0.04" />
      <circle cx="250" cy="250" r="56" strokeWidth="2.5" strokeDasharray="5 4" opacity="0.65" />
      <circle cx="250" cy="250" r="24" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
      <circle cx="250" cy="250" r="7" fill="currentColor" stroke="none" opacity="0.5" />

      {/* Rayos heráldicos a las 8 posiciones de los caballeros */}
      <path
        d="M 250 196 L 250 224 M 250 276 L 250 304 M 196 250 L 224 250 M 276 250 L 304 250 M 212 212 L 232 232 M 268 268 L 288 288 M 212 288 L 232 268 M 268 232 L 288 212"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* 8 Sillas */}
      <use href="#mesa-chair" transform="rotate(0 250 250)" />
      <use href="#mesa-chair" transform="rotate(45 250 250)" />
      <use href="#mesa-chair" transform="rotate(90 250 250)" />
      <use href="#mesa-chair" transform="rotate(135 250 250)" />
      <use href="#mesa-chair" transform="rotate(180 250 250)" />
      <use href="#mesa-chair" transform="rotate(225 250 250)" />
      <use href="#mesa-chair" transform="rotate(270 250 250)" />
      <use href="#mesa-chair" transform="rotate(315 250 250)" />

      {/* 8 Adornos entre sillas */}
      <use href="#mesa-flourish" transform="rotate(22.5 250 250)" />
      <use href="#mesa-flourish" transform="rotate(67.5 250 250)" />
      <use href="#mesa-flourish" transform="rotate(112.5 250 250)" />
      <use href="#mesa-flourish" transform="rotate(157.5 250 250)" />
      <use href="#mesa-flourish" transform="rotate(202.5 250 250)" />
      <use href="#mesa-flourish" transform="rotate(247.5 250 250)" />
      <use href="#mesa-flourish" transform="rotate(292.5 250 250)" />
      <use href="#mesa-flourish" transform="rotate(337.5 250 250)" />
    </svg>
  );
};
