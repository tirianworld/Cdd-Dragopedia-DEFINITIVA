import React from 'react';
import invocarImg from '../assets/images/functionality/invocar.png';
import atacarImg from '../assets/images/functionality/atacar.png';
import defenderseImg from '../assets/images/functionality/defenderse.png';
import utilidadImg from '../assets/images/functionality/utilidad.png';
import transporteImg from '../assets/images/functionality/transporte.png';
import cambioplanarImg from '../assets/images/functionality/cambioplanar.png';
import curacionImg from '../assets/images/functionality/curacion.png';
import { SpellFunctionality } from '../types';

export const FUNCTIONALITY_IMAGE_MAP: Record<SpellFunctionality, string> = {
  'invocar': invocarImg,
  'atacar': atacarImg,
  'defenderse': defenderseImg,
  'utilidad': utilidadImg,
  'transporte': transporteImg,
  'cambio planar': cambioplanarImg,
  'curación': curacionImg,
};

export const FUNCTIONALITY_GLOW_MAP: Record<SpellFunctionality, string> = {
  'invocar': 'rgba(168, 85, 247, 0.75)',
  'atacar': 'rgba(239, 68, 68, 0.75)',
  'defenderse': 'rgba(59, 130, 246, 0.75)',
  'utilidad': 'rgba(234, 179, 8, 0.75)',
  'transporte': 'rgba(6, 182, 212, 0.75)',
  'cambio planar': 'rgba(236, 72, 153, 0.75)',
  'curación': 'rgba(16, 185, 129, 0.75)',
};

export interface FunctionalityIconProps {
  functionality: SpellFunctionality | string;
  className?: string;
  alt?: string;
}

export const FunctionalityIcon: React.FC<FunctionalityIconProps> = ({
  functionality,
  className = 'w-5 h-5',
  alt,
}) => {
  const clean = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const target = clean(functionality);
  const matchedKey = (Object.keys(FUNCTIONALITY_IMAGE_MAP) as SpellFunctionality[]).find(
    (k) => clean(k) === target
  ) || 'utilidad';

  const src = FUNCTIONALITY_IMAGE_MAP[matchedKey] || utilidadImg;
  const glow = FUNCTIONALITY_GLOW_MAP[matchedKey] || 'rgba(234, 179, 8, 0.6)';

  return (
    <img
      src={src}
      alt={alt || functionality}
      referrerPolicy="no-referrer"
      style={{
        filter: `brightness(1.4) contrast(1.2) drop-shadow(0 0 5px ${glow})`,
      }}
      className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
    />
  );
};

export const SummonIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <FunctionalityIcon functionality="invocar" className={className} />
);
export const AttackIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <FunctionalityIcon functionality="atacar" className={className} />
);
export const DefenseIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <FunctionalityIcon functionality="defenderse" className={className} />
);
export const UtilityIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <FunctionalityIcon functionality="utilidad" className={className} />
);
export const TransportIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <FunctionalityIcon functionality="transporte" className={className} />
);
export const PlanarShiftIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <FunctionalityIcon functionality="cambio planar" className={className} />
);
export const HealingIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <FunctionalityIcon functionality="curación" className={className} />
);
