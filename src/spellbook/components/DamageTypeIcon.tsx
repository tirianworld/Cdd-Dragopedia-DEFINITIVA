import React from 'react';
import fuegoImg from '../assets/images/damage/fuego.png';
import frioImg from '../assets/images/damage/frio.png';
import relampagoImg from '../assets/images/damage/relampago.png';
import truenoImg from '../assets/images/damage/trueno.png';
import acidoImg from '../assets/images/damage/acido.png';
import venenoImg from '../assets/images/damage/veneno.png';
import necroticoImg from '../assets/images/damage/necrotico.png';
import radianteImg from '../assets/images/damage/radiante.png';
import fuerzaImg from '../assets/images/damage/fuerza.png';
import psiquicoImg from '../assets/images/damage/psiquico.png';
import contundenteImg from '../assets/images/damage/contundente.png';
import cortanteImg from '../assets/images/damage/cortante.png';
import perforanteImg from '../assets/images/damage/perforante.png';

export const DAMAGE_IMAGE_MAP: Record<string, string> = {
  'Fuego': fuegoImg,
  'Frío': frioImg,
  'Relámpago': relampagoImg,
  'Trueno': truenoImg,
  'Ácido': acidoImg,
  'Veneno': venenoImg,
  'Necrótico': necroticoImg,
  'Radiante': radianteImg,
  'Fuerza': fuerzaImg,
  'Psíquico': psiquicoImg,
  'Contundente': contundenteImg,
  'Cortante': cortanteImg,
  'Perforante': perforanteImg,
};

export const DAMAGE_GLOW_MAP: Record<string, string> = {
  'Fuego': 'rgba(239, 68, 68, 0.75)',
  'Frío': 'rgba(56, 189, 248, 0.75)',
  'Relámpago': 'rgba(251, 191, 36, 0.75)',
  'Trueno': 'rgba(129, 140, 248, 0.75)',
  'Ácido': 'rgba(132, 204, 22, 0.75)',
  'Veneno': 'rgba(16, 185, 129, 0.75)',
  'Necrótico': 'rgba(168, 85, 247, 0.75)',
  'Radiante': 'rgba(250, 204, 21, 0.75)',
  'Fuerza': 'rgba(236, 72, 153, 0.75)',
  'Psíquico': 'rgba(244, 63, 94, 0.75)',
  'Contundente': 'rgba(148, 163, 184, 0.75)',
  'Cortante': 'rgba(203, 213, 225, 0.75)',
  'Perforante': 'rgba(226, 232, 240, 0.75)',
};

export interface DamageTypeIconProps {
  damageType: string;
  className?: string;
  alt?: string;
}

export const DamageTypeIcon: React.FC<DamageTypeIconProps> = ({
  damageType,
  className = 'w-5 h-5',
  alt,
}) => {
  const clean = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const target = clean(damageType);
  const matchedKey = Object.keys(DAMAGE_IMAGE_MAP).find((k) => clean(k) === target) || 'Fuego';
  const src = DAMAGE_IMAGE_MAP[matchedKey] || fuegoImg;
  const glow = DAMAGE_GLOW_MAP[matchedKey] || 'rgba(239, 68, 68, 0.6)';

  return (
    <img
      src={src}
      alt={alt || damageType}
      referrerPolicy="no-referrer"
      style={{
        filter: `brightness(1.4) contrast(1.2) drop-shadow(0 0 5px ${glow})`,
      }}
      className={`inline-block object-contain rounded-full select-none pointer-events-none ${className}`}
    />
  );
};

export const FireDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Fuego" className={className} />
);
export const ColdDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Frío" className={className} />
);
export const LightningDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Relámpago" className={className} />
);
export const ThunderDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Trueno" className={className} />
);
export const AcidDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Ácido" className={className} />
);
export const PoisonDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Veneno" className={className} />
);
export const NecroticDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Necrótico" className={className} />
);
export const RadiantDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Radiante" className={className} />
);
export const ForceDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Fuerza" className={className} />
);
export const PsychicDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Psíquico" className={className} />
);
export const BludgeoningDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Contundente" className={className} />
);
export const SlashingDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Cortante" className={className} />
);
export const PiercingDamageIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <DamageTypeIcon damageType="Perforante" className={className} />
);
