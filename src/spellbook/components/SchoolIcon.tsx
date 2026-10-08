import React from 'react';
import abjuracionImg from '../assets/images/schools/abjuracion.png';
import adivinacionImg from '../assets/images/schools/adivinacion.png';
import conjuracionImg from '../assets/images/schools/conjuracion.png';
import encantamientoImg from '../assets/images/schools/encantamiento.png';
import evocacionImg from '../assets/images/schools/evocacion.png';
import ilusionImg from '../assets/images/schools/ilusion.png';
import nigromanciaImg from '../assets/images/schools/nigromancia.png';
import transmutacionImg from '../assets/images/schools/transmutacion.png';
import reflexionImg from '../assets/images/schools/reflexion.png';
import { MagicSchool } from '../types';

export const SCHOOL_IMAGE_MAP: Record<MagicSchool, string> = {
  'Abjuración': abjuracionImg,
  'Adivinación': adivinacionImg,
  'Conjuración': conjuracionImg,
  'Encantamiento': encantamientoImg,
  'Evocación': evocacionImg,
  'Ilusión': ilusionImg,
  'Nigromancia': nigromanciaImg,
  'Transmutación': transmutacionImg,
  'Reflexión': reflexionImg,
};

export const SCHOOL_GLOW_MAP: Record<MagicSchool, string> = {
  'Abjuración': 'rgba(56,189,248,0.7)',
  'Adivinación': 'rgba(251,191,36,0.7)',
  'Conjuración': 'rgba(52,211,153,0.7)',
  'Encantamiento': 'rgba(244,114,182,0.7)',
  'Evocación': 'rgba(249,115,22,0.7)',
  'Ilusión': 'rgba(192,132,252,0.7)',
  'Nigromancia': 'rgba(168,85,247,0.7)',
  'Transmutación': 'rgba(16,185,129,0.7)',
  'Reflexión': 'rgba(186,250,253,0.8)',
};

export interface SchoolIconProps {
  school: MagicSchool;
  className?: string;
  alt?: string;
}

export const SchoolIcon: React.FC<SchoolIconProps> = ({
  school,
  className = 'w-5 h-5',
  alt,
}) => {
  const src = SCHOOL_IMAGE_MAP[school] || SCHOOL_IMAGE_MAP['Evocación'];
  const glow = SCHOOL_GLOW_MAP[school] || 'rgba(186,250,253,0.6)';

  return (
    <img
      src={src}
      alt={alt || school}
      referrerPolicy="no-referrer"
      style={{
        filter: `brightness(1.4) contrast(1.2) drop-shadow(0 0 5px ${glow})`,
      }}
      className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
    />
  );
};

export const AbjurationIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Abjuración" className={className} />
);
export const DivinationIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Adivinación" className={className} />
);
export const ConjurationIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Conjuración" className={className} />
);
export const EnchantmentIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Encantamiento" className={className} />
);
export const EvocationIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Evocación" className={className} />
);
export const IllusionIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Ilusión" className={className} />
);
export const NecromancyIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Nigromancia" className={className} />
);
export const TransmutationIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Transmutación" className={className} />
);
export const ReflectionIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <SchoolIcon school="Reflexión" className={className} />
);
