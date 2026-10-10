import React from 'react';
import { MagicSchool } from '../types';

interface SchoolEmbroideryWatermarkProps {
  school?: MagicSchool | string;
  className?: string;
  size?: number | string;
  color?: string;
  opacity?: number;
}

export const SchoolEmbroideryWatermark: React.FC<SchoolEmbroideryWatermarkProps> = ({
  school = '',
  className = '',
  size = 80,
  color,
  opacity,
}) => {
  // Normalize school name to handle accents and casing
  const normalized = (school || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const renderSchoolMotif = () => {
    switch (normalized) {
      case 'evocacion':
      case 'evocation':
        return (
          <g>
            {/* Llama arcana central estilizada */}
            <path
              d="M 50 20 C 58 32, 65 42, 63 56 C 61 68, 48 74, 42 65 C 38 59, 40 52, 46 48 C 50 45, 52 38, 50 20 Z"
              fill="currentColor"
              fillOpacity="0.12"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            {/* Lengüetas de fuego laterales bordadas */}
            <path
              d="M 37 60 C 31 53, 33 42, 39 35 C 37 43, 40 48, 38 55"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M 63 60 C 69 53, 67 42, 61 35 C 63 43, 60 48, 62 55"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            {/* Chispas y astros de energía */}
            <circle cx="50" cy="14" r="1.5" fill="currentColor" />
            <circle cx="33" cy="28" r="1.2" fill="currentColor" />
            <circle cx="67" cy="28" r="1.2" fill="currentColor" />
            <path d="M 50 68 L 50 74 M 45 71 L 55 71" stroke="currentColor" strokeWidth="1.2" />
          </g>
        );

      case 'abjuracion':
      case 'abjuration':
        return (
          <g>
            {/* Broquel heráldico con lazo protector */}
            <path
              d="M 50 22 L 68 29 C 68 49, 58 64, 50 73 C 42 64, 32 49, 32 29 Z"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            {/* Ribete interior */}
            <path
              d="M 50 28 L 63 33 C 63 48, 55 59, 50 66 C 45 59, 37 48, 37 33 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeDasharray="2.5 2"
            />
            {/* Runa de bastión central */}
            <path d="M 50 33 L 50 59" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 42 43 L 58 43" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="43" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </g>
        );

      case 'nigromancia':
      case 'necromancy':
        return (
          <g>
            {/* Calavera / Sigilo espectral estilizado */}
            <path
              d="M 35 45 C 35 32, 65 32, 65 45 C 65 52, 60 56, 58 63 L 42 63 C 40 56, 35 52, 35 45 Z"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            {/* Cuencas oculares místicas */}
            <circle cx="44" cy="45" r="3" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="56" cy="45" r="3" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
            {/* Runa nasal */}
            <path d="M 50 51 L 48 55 L 52 55 Z" fill="currentColor" stroke="none" />
            {/* Dientes / sutura inferior */}
            <path d="M 45 63 L 45 68 M 50 63 L 50 68 M 55 63 L 55 68" stroke="currentColor" strokeWidth="1.2" />
            {/* Volutas de ánimas laterales */}
            <path d="M 28 47 C 25 38, 32 28, 42 26" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 72 47 C 75 38, 68 28, 58 26" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </g>
        );

      case 'adivinacion':
      case 'divination':
        return (
          <g>
            {/* Ojo de la Providencia / Visión astral */}
            <path
              d="M 28 50 C 35 37, 65 37, 72 50 C 65 63, 35 63, 28 50 Z"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            {/* Iris y pupila astral */}
            <circle cx="50" cy="50" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="50" cy="50" r="3.5" fill="currentColor" stroke="none" />
            {/* Destellos y pestañas de profecía */}
            <path d="M 50 26 L 50 33 M 50 67 L 50 74" stroke="currentColor" strokeWidth="1.4" />
            <path d="M 37 32 L 41 37 M 63 32 L 59 37" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 37 68 L 41 63 M 63 68 L 59 63" stroke="currentColor" strokeWidth="1.2" />
            {/* Media luna superior */}
            <path d="M 43 23 C 48 25, 52 25, 57 23" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </g>
        );

      case 'conjuracion':
      case 'conjuration':
        return (
          <g>
            {/* Portal planar y vórtice dimensional */}
            <circle cx="50" cy="50" r="19" fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="4 3" />
            <path
              d="M 50 34 C 59 34, 66 41, 66 50 C 66 57, 61 63, 54 65 C 47 67, 40 62, 38 55 C 36 49, 41 43, 47 42 C 52 41, 56 45, 55 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {/* 4 Glifos de anclaje planar cardinales */}
            <path d="M 50 20 L 50 27 M 50 73 L 50 80" stroke="currentColor" strokeWidth="1.6" />
            <path d="M 20 50 L 27 50 M 73 50 L 80 50" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="50" cy="50" r="2.5" fill="currentColor" />
          </g>
        );

      case 'encantamiento':
      case 'enchantment':
        return (
          <g>
            {/* Lazo de encanto hipnótico en forma de corazón / flor aureolada */}
            <path
              d="M 50 67 C 32 52, 30 38, 41 30 C 47 25, 50 32, 50 35 C 50 32, 53 25, 59 30 C 70 38, 68 52, 50 67 Z"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            {/* Espirales interiores de sugestión */}
            <path
              d="M 44 38 C 42 45, 47 49, 50 53 C 53 49, 58 45, 56 38"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            {/* Zarcillos de corona superiores */}
            <path d="M 41 30 C 36 24, 29 27, 33 33" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 59 30 C 64 24, 71 27, 67 33" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="50" cy="22" r="1.5" fill="currentColor" />
          </g>
        );

      case 'ilusion':
      case 'illusion':
        return (
          <g>
            {/* Máscara veneciana de espejismo / Prisma de engaño */}
            <path
              d="M 28 44 C 36 38, 44 42, 50 46 C 56 42, 64 38, 72 44 C 74 54, 62 62, 50 58 C 38 62, 26 54, 28 44 Z"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            {/* Ranuras de los ojos */}
            <path
              d="M 34 46 C 37 43, 41 45, 43 48 C 41 50, 36 50, 34 46 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M 66 46 C 63 43, 59 45, 57 48 C 59 50, 64 50, 66 46 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            {/* Destello prismático superior */}
            <path d="M 50 25 L 52 33 L 50 41 L 48 33 Z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="50" cy="65" r="1.5" fill="currentColor" />
          </g>
        );

      case 'transmutacion':
      case 'transmutation':
        return (
          <g>
            {/* Ouroboros / Círculo alquímico de transmutación */}
            <circle cx="50" cy="50" r="21" fill="none" stroke="currentColor" strokeWidth="1.4" />
            {/* Triángulos entrelazados de la Gran Obra */}
            <polygon
              points="50,26 69,60 31,60"
              fill="currentColor"
              fillOpacity="0.08"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <polygon
              points="50,74 31,40 69,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeDasharray="3 2"
            />
            {/* Nodo central de quintaesencia */}
            <circle cx="50" cy="50" r="3.5" fill="currentColor" stroke="none" />
          </g>
        );

      case 'reflexion':
      case 'reflection':
        return (
          <g>
            {/* Diamante facetado y espejo de azogue */}
            <polygon
              points="50,20 74,50 50,80 26,50"
              fill="currentColor"
              fillOpacity="0.1"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
            <line x1="26" y1="50" x2="74" y2="50" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" />
            <polygon points="50,32 64,50 50,68 36,50" fill="none" stroke="currentColor" strokeWidth="1.1" />
          </g>
        );

      default:
        return (
          <g>
            {/* Sello arcano universal con octagrama bordado */}
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <polygon points="50,24 68,68 24,40 76,40 32,68" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="3.5" fill="currentColor" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        color: color || 'currentColor',
        opacity: opacity !== undefined ? opacity : undefined,
      }}
      aria-hidden="true"
    >
      {/* Marco de bordado exterior con puntadas discontinuas */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeDasharray="3 2"
        opacity="0.65"
      />
      {/* Filete fino interior */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />

      {/* 4 Nodos cardinales de bordado / remate */}
      <circle cx="50" cy="4" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="50" cy="96" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="4" cy="50" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="96" cy="50" r="1.5" fill="currentColor" opacity="0.8" />

      {/* 4 Acentos diagonales de encaje */}
      <path d="M 19 19 L 22 22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M 81 19 L 78 22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M 19 81 L 22 78" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M 81 81 L 78 78" stroke="currentColor" strokeWidth="1" opacity="0.5" />

      {/* Motivo heráldico / arcano propio de la escuela */}
      {renderSchoolMotif()}
    </svg>
  );
};
