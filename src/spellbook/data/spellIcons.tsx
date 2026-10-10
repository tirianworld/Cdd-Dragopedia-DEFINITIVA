import React from 'react';
import { MagicSchool } from '../types';

export const SCHOOL_COLORS: Record<MagicSchool, {
  primary: string;
  glow: string;
  border: string;
  bgLight: string;
  badge: string;
  text: string;
}> = {
  Evocación: {
    primary: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.4)',
    border: 'border-red-500/50',
    bgLight: 'bg-red-500/10',
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    text: 'text-red-400',
  },
  Abjuración: {
    primary: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    border: 'border-cyan-500/50',
    bgLight: 'bg-cyan-500/10',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    text: 'text-cyan-400',
  },
  Nigromancia: {
    primary: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.4)',
    border: 'border-purple-500/50',
    bgLight: 'bg-purple-500/10',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    text: 'text-purple-400',
  },
  Conjuración: {
    primary: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    border: 'border-emerald-500/50',
    bgLight: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    text: 'text-emerald-400',
  },
  Encantamiento: {
    primary: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    border: 'border-pink-500/50',
    bgLight: 'bg-pink-500/10',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    text: 'text-pink-400',
  },
  Adivinación: {
    primary: '#eab308',
    glow: 'rgba(234, 179, 8, 0.4)',
    border: 'border-amber-400/50',
    bgLight: 'bg-amber-400/10',
    badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    text: 'text-amber-400',
  },
  Ilusión: {
    primary: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.4)',
    border: 'border-indigo-500/50',
    bgLight: 'bg-indigo-500/10',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    text: 'text-indigo-400',
  },
  Transmutación: {
    primary: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    border: 'border-orange-500/50',
    bgLight: 'bg-orange-500/10',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    text: 'text-orange-400',
  },
  Reflexión: {
    primary: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    border: 'border-sky-400/50',
    bgLight: 'bg-sky-400/10',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    text: 'text-sky-300',
  },
};

interface SpellIconProps {
  iconKey?: string;
  school?: MagicSchool;
  className?: string;
  size?: number;
}

export const SpellIcon: React.FC<SpellIconProps> = ({
  iconKey = 'default',
  school = 'Evocación',
  className = '',
  size = 40,
}) => {
  const schoolColor = SCHOOL_COLORS[school] || SCHOOL_COLORS.Evocación;
  const primaryColor = schoolColor.primary;

  const renderIcon = () => {
    switch (iconKey) {
      case 'fireball':
        return (
          <g>
            <circle cx="20" cy="20" r="14" fill="url(#fireGradient)" opacity="0.3" />
            <path
              d="M20 5C17 12 12 14 12 21C12 25.4 15.6 29 20 29C24.4 29 28 25.4 28 21C28 14 23 12 20 5Z"
              fill={primaryColor}
            />
            <path
              d="M20 12C18.5 15.5 16 17 16 21.5C16 23.7 17.8 25.5 20 25.5C22.2 25.5 24 23.7 24 21.5C24 17 21.5 15.5 20 12Z"
              fill="#fef08a"
            />
            <circle cx="20" cy="22" r="2.5" fill="#ffffff" />
            <path d="M10 18L7 16M30 18L33 16M14 9L11 6M26 9L29 6M20 33V37" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'magic_missile':
        return (
          <g>
            {/* 3 homing crystalline darts */}
            <path d="M7 31C10 24 14 18 28 10L27 15L32 10L27 5L28 10" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 25C12 20 17 17 26 18L23 21L29 19L25 15" fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 35C15 28 20 25 31 24L28 27L34 25L30 21" fill="none" stroke="#a5f3fc" strokeWidth="2" strokeLinecap="round" />
            <polygon points="28,8 35,10 28,12 29,10" fill="#ffffff" />
            <circle cx="8" cy="30" r="1.5" fill={primaryColor} />
            <circle cx="6" cy="24" r="1.5" fill="#67e8f9" />
          </g>
        );

      case 'cure_wounds':
      case 'healing_word':
        return (
          <g>
            <circle cx="20" cy="20" r="15" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            {/* Radiant Cross with heart & laurel */}
            <path
              d="M17 9H23V16H30V22H23V31H17V22H10V16H17V9Z"
              fill={primaryColor}
            />
            <path
              d="M18.5 11H21.5V17.5H28V20.5H21.5V29.5H18.5V20.5H12V17.5H18.5V11Z"
              fill="#fef08a"
            />
            <circle cx="20" cy="19" r="2.5" fill="#ffffff" />
            <path d="M20 4V7M20 33V36M4 20H7M33 20H36" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'shield':
        return (
          <g>
            {/* Arcane aegis */}
            <path
              d="M20 5L32 10V20C32 27.5 26.8 33.5 20 35C13.2 33.5 8 27.5 8 20V10L20 5Z"
              fill={primaryColor}
              opacity="0.3"
            />
            <path
              d="M20 5L32 10V20C32 27.5 26.8 33.5 20 35C13.2 33.5 8 27.5 8 20V10L20 5Z"
              fill="none"
              stroke={primaryColor}
              strokeWidth="2.5"
            />
            {/* Inner wards */}
            <polygon points="20,11 28,16 28,24 20,29 12,24 12,16" fill="none" stroke="#a5f3fc" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="3" fill="#ffffff" />
          </g>
        );

      case 'mage_armor':
        return (
          <g>
            <path d="M12 9L20 5L28 9L29 16C29 24 25 31 20 34C15 31 11 24 11 16L12 9Z" fill="none" stroke={primaryColor} strokeWidth="2" />
            <path d="M16 14C17.5 17 22.5 17 24 14" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M15 19H25M17 24H23M19 28H21" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="20,7 22,11 18,11" fill="#38bdf8" />
          </g>
        );

      case 'eldritch_blast':
        return (
          <g>
            {/* Violet eldritch void eye & twisting crackling beam */}
            <circle cx="20" cy="20" r="14" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="20" cy="20" r="7" fill="#2e1065" stroke={primaryColor} strokeWidth="2" />
            <path d="M20 8L20 3M20 37L20 32M8 20L3 20M37 20L32 20" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M11 11L7 7M29 29L33 33M11 29L7 33M29 11L33 7" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="20" cy="20" rx="3" ry="5" fill="#f3e8ff" />
          </g>
        );

      case 'misty_step':
        return (
          <g>
            {/* Dimensional portal vortex */}
            <path d="M20 6C27.7 6 34 12.3 34 20C34 27.7 27.7 34 20 34C12.3 34 6 27.7 6 20C6 12.3 12.3 6 20 6" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="5 3" />
            <path d="M20 10C24 10 28 13.5 28 18C28 23 22 25 18 28C15 30 11 26 12 22C13 17 17 14 20 14" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="4" fill="#a7f3d0" />
            <circle cx="20" cy="20" r="1.5" fill="#ffffff" />
            {/* Sparkles */}
            <path d="M10 11L12 11M11 10L11 12M29 29L31 29M30 28L30 30" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'counterspell':
        return (
          <g>
            <circle cx="20" cy="20" r="14" fill="none" stroke={primaryColor} strokeWidth="2" />
            {/* Broken magic circle */}
            <path d="M9 9L31 31" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
            <path d="M12 17C14 13 18 11 22 12" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M28 23C26 27 22 29 18 28" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            <polygon points="17,11 20,8 20,14" fill="#38bdf8" />
            <polygon points="23,29 20,26 20,32" fill="#38bdf8" />
          </g>
        );

      case 'lightning_bolt':
      case 'chain_lightning':
        return (
          <g>
            <polygon
              points="22,4 12,18 20,18 16,36 28,18 20,18"
              fill={primaryColor}
              stroke="#fef08a"
              strokeWidth="1.5"
            />
            <path d="M12 18L6 22M24 16L32 12M17 26L11 30M22 24L30 27" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'ray_of_frost':
      case 'cone_of_cold':
        return (
          <g>
            {/* Snowflake rune & crystal blast */}
            <path d="M20 6V34M6 20H34M10 10L30 30M10 30L30 10" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M17 9L20 6L23 9M17 31L20 34L23 31M9 17L6 20L9 23M31 17L34 20L31 23" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="20" cy="20" r="3.5" fill="#bae6fd" stroke={primaryColor} strokeWidth="1.5" />
          </g>
        );

      case 'thunderwave':
        return (
          <g>
            {/* Sonic ripples and horn crest */}
            <circle cx="20" cy="20" r="6" fill={primaryColor} />
            <path d="M12 12C7.5 16.5 7.5 23.5 12 28" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M28 12C32.5 16.5 32.5 23.5 28 28" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M8 8C1.5 14.5 1.5 25.5 8 32" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 8C38.5 14.5 38.5 25.5 32 32" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'invisibility':
        return (
          <g>
            {/* Fading shrouded eye */}
            <path d="M6 20C10 13 15 9 20 9C25 9 30 13 34 20C30 27 25 31 20 31C15 31 10 27 6 20Z" fill="none" stroke={primaryColor} strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="20" cy="20" r="6" fill={primaryColor} opacity="0.4" />
            <circle cx="20" cy="20" r="3" fill="#ffffff" />
            <path d="M8 8L32 32" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        );

      case 'fly':
        return (
          <g>
            {/* Radiant feathered wings */}
            <path d="M20 22C17 18 10 13 5 15C4 20 8 26 18 25" fill={primaryColor} opacity="0.8" />
            <path d="M20 22C23 18 30 13 35 15C36 20 32 26 22 25" fill={primaryColor} opacity="0.8" />
            <path d="M20 24C16 20 11 17 7 18M20 24C24 20 29 17 33 18" stroke="#ffffff" strokeWidth="1.5" />
            <polygon points="20,12 22,17 18,17" fill="#fef08a" />
            <path d="M20 26V34" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'haste':
        return (
          <g>
            {/* Hourglass & lightning motion */}
            <path d="M13 8H27M13 32H27M14 9L26 31M26 9L14 31" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
            <polygon points="20,15 22,20 18,20" fill="#fef08a" />
            <polygon points="20,25 23,28 17,28" fill="#fef08a" />
            <path d="M30 15L34 19L31 20L35 25" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'sacred_flame':
        return (
          <g>
            {/* Descending divine beam */}
            <polygon points="20,4 23,16 21,34 19,34 17,16" fill={primaryColor} />
            <polygon points="20,8 21.5,17 20,28 18.5,17" fill="#fef08a" />
            <circle cx="20" cy="34" r="3" fill="#ffffff" />
            <path d="M12 28C14 26 16 28 20 28C24 28 26 26 28 28" stroke="#fef08a" strokeWidth="2" fill="none" />
            <path d="M15 6L25 6" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'guiding_bolt':
        return (
          <g>
            <polygon points="20,5 24,19 35,20 25,26 29,36 20,29 11,36 15,26 5,20 16,19" fill={primaryColor} />
            <polygon points="20,11 22,19 28,20 23,24 25,30 20,26 15,30 17,24 12,20 18,19" fill="#fef08a" />
            <circle cx="20" cy="20" r="2.5" fill="#ffffff" />
          </g>
        );

      case 'toll_the_dead':
      case 'animate_dead':
        return (
          <g>
            {/* Mourning bell with skull spirit */}
            <path d="M20 7C14 7 12 15 11 23H29C28 15 26 7 20 7Z" fill={primaryColor} opacity="0.8" />
            <path d="M9 23C9 23 8 26 10 27H30C32 26 31 23 31 23H9Z" fill={primaryColor} />
            <circle cx="20" cy="29" r="2.5" fill="#fef08a" />
            <circle cx="17" cy="16" r="1.5" fill="#000000" />
            <circle cx="23" cy="16" r="1.5" fill="#000000" />
            <path d="M18 20H22" stroke="#000000" strokeWidth="1.5" />
          </g>
        );

      case 'spiritual_weapon':
        return (
          <g>
            {/* Floating radiant warhammer/blade */}
            <rect x="18" y="14" width="4" height="20" rx="1" fill={primaryColor} />
            <rect x="11" y="8" width="18" height="8" rx="2" fill={primaryColor} />
            <rect x="13" y="10" width="14" height="4" fill="#fef08a" />
            <circle cx="20" cy="35" r="2" fill="#fef08a" />
            <path d="M7 12H9M31 12H33M20 4V6" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'spirit_guardians':
        return (
          <g>
            {/* Orbiting spectral cherubs / protective shield */}
            <circle cx="20" cy="20" r="15" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="4 2" />
            <circle cx="20" cy="20" r="4" fill="#ffffff" />
            <circle cx="20" cy="8" r="3" fill={primaryColor} />
            <circle cx="30" cy="24" r="3" fill={primaryColor} />
            <circle cx="10" cy="24" r="3" fill={primaryColor} />
            <path d="M19 12C20 14 20 16 20 16M26 21C24 21 22 21 22 21M14 21C16 21 18 21 18 21" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'hold_person':
        return (
          <g>
            {/* Paralytic spectral chains binding figure */}
            <circle cx="20" cy="12" r="4" fill={primaryColor} />
            <path d="M20 16V28M15 21H25M16 34L20 28L24 34" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
            {/* Chains wrapping */}
            <ellipse cx="20" cy="19" rx="8" ry="3" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
            <ellipse cx="20" cy="25" rx="7" ry="2.5" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />
          </g>
        );

      case 'polymorph':
      case 'true_polymorph':
        return (
          <g>
            {/* Shapeshifting beast head */}
            <path d="M12 10L16 16H24L28 10L27 20C27 26 23 31 20 32C17 31 13 26 13 20L12 10Z" fill={primaryColor} opacity="0.8" />
            <polygon points="12,10 16,16 13,20" fill="#f59e0b" />
            <polygon points="28,10 24,16 27,20" fill="#f59e0b" />
            <circle cx="17" cy="19" r="1.5" fill="#ffffff" />
            <circle cx="23" cy="19" r="1.5" fill="#ffffff" />
            <path d="M19 25L20 27L21 25" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'revivify':
        return (
          <g>
            {/* Resurrecting heart & golden diamond */}
            <path d="M20 32C20 32 10 25 10 18C10 13.5 13.5 10 18 10C19.5 10 20 11 20 11C20 11 20.5 10 22 10C26.5 10 30 13.5 30 18C30 25 20 32 20 32Z" fill={primaryColor} opacity="0.4" />
            <polygon points="20,8 26,16 20,26 14,16" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="20,11 24,16 20,23 16,16" fill="#e0f2fe" />
            <path d="M20 3V6M20 28V31M8 16H11M29 16H32" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'banishment':
        return (
          <g>
            {/* Planar rift banishing into portal */}
            <ellipse cx="20" cy="20" rx="14" ry="7" fill={primaryColor} opacity="0.3" transform="rotate(-30 20 20)" />
            <ellipse cx="20" cy="20" rx="14" ry="7" fill="none" stroke={primaryColor} strokeWidth="2" transform="rotate(-30 20 20)" />
            <path d="M20 7L20 33" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <polygon points="20,4 23,9 17,9" fill="#ffffff" />
          </g>
        );

      case 'wall_of_fire':
        return (
          <g>
            <rect x="6" y="27" width="28" height="4" rx="1" fill="#78350f" />
            <path d="M8 27C8 18 13 14 13 8C15 14 18 17 18 27" fill={primaryColor} />
            <path d="M15 27C15 15 21 11 22 5C24 12 28 17 28 27" fill="#f97316" />
            <path d="M25 27C25 19 29 16 30 12C32 17 33 21 33 27" fill="#fef08a" />
          </g>
        );

      case 'disintegrate':
        return (
          <g>
            {/* Emerald ray dissolving to particles */}
            <line x1="6" y1="20" x2="24" y2="20" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <circle cx="24" cy="20" r="3" fill="#6ee7b7" />
            {/* Ash disintegrating particles */}
            <circle cx="28" cy="16" r="1.5" fill="#a7f3d0" />
            <circle cx="31" cy="22" r="1" fill="#a7f3d0" />
            <circle cx="33" cy="18" r="1.5" fill="#a7f3d0" />
            <circle cx="29" cy="25" r="1.2" fill="#a7f3d0" />
            <circle cx="35" cy="24" r="1" fill="#a7f3d0" />
          </g>
        );

      case 'teleport':
      case 'dimension_door':
        return (
          <g>
            {/* Arcane teleportation circle */}
            <circle cx="20" cy="20" r="14" fill="none" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="3 2" />
            <polygon points="20,7 32,27 8,27" fill="none" stroke={primaryColor} strokeWidth="1.5" />
            <polygon points="20,33 8,13 32,13" fill="none" stroke={primaryColor} strokeWidth="1.5" />
            <circle cx="20" cy="20" r="4" fill="#ffffff" />
          </g>
        );

      case 'finger_of_death':
        return (
          <g>
            {/* Skeletal pointed finger with necrotic aura */}
            <path d="M8 26C11 23 15 21 19 21L30 13L32 15L23 23L23 26" fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="31" cy="14" r="3" fill="#a855f7" />
            <circle cx="31" cy="14" r="1.5" fill="#f3e8ff" />
            <path d="M28 8L34 10M35 17L37 20M25 11L28 6" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'dominate_monster':
        return (
          <g>
            {/* Mind-controlling psychic eye & crown */}
            <path d="M6 20C10 14 15 10 20 10C25 10 30 14 34 20C30 26 25 30 20 30C15 30 10 26 6 20Z" fill={primaryColor} opacity="0.3" stroke={primaryColor} strokeWidth="2" />
            <circle cx="20" cy="20" r="5" fill="#f43f5e" />
            <circle cx="20" cy="20" r="2" fill="#ffffff" />
            {/* Crown */}
            <path d="M14 8L16 11L20 7L24 11L26 8" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'meteor_swarm':
        return (
          <g>
            {/* Raining blazing meteors */}
            <line x1="8" y1="6" x2="16" y2="18" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            <circle cx="16" cy="18" r="3.5" fill="#ef4444" />
            <line x1="20" y1="4" x2="28" y2="22" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="28" cy="22" r="4.5" fill="#dc2626" />
            <line x1="12" y1="18" x2="19" y2="32" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="19" cy="32" r="3" fill="#b91c1c" />
          </g>
        );

      case 'wish':
        return (
          <g>
            {/* Cosmic star of reality warping */}
            <circle cx="20" cy="20" r="15" fill="none" stroke="url(#cosmicGradient)" strokeWidth="1.5" />
            <polygon points="20,4 24,15 36,20 24,25 20,36 16,25 4,20 16,15" fill="url(#cosmicGradient)" />
            <circle cx="20" cy="20" r="4" fill="#ffffff" />
            <circle cx="20" cy="20" r="2" fill="#fef08a" />
          </g>
        );

      case 'time_stop':
        return (
          <g>
            {/* Clock frozen with crack */}
            <circle cx="20" cy="20" r="14" fill="none" stroke={primaryColor} strokeWidth="2.5" />
            <line x1="20" y1="20" x2="20" y2="10" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="20" x2="27" y2="20" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="2.5" fill="#ffffff" />
            <path d="M12 8L15 14L13 18L17 25" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'power_word_kill':
        return (
          <g>
            {/* Death skull crowned with ruby */}
            <path d="M13 15C13 10.5 16 7 20 7C24 7 27 10.5 27 15C27 18 25 20 24 23H16C15 20 13 18 13 15Z" fill={primaryColor} />
            <rect x="16" y="23" width="8" height="5" rx="1" fill={primaryColor} />
            <circle cx="17" cy="15" r="2" fill="#0f1117" />
            <circle cx="23" cy="15" r="2" fill="#0f1117" />
            <polygon points="20,18 21,20 19,20" fill="#0f1117" />
            <line x1="18" y1="25" x2="18" y2="28" stroke="#0f1117" strokeWidth="1" />
            <line x1="22" y1="25" x2="22" y2="28" stroke="#0f1117" strokeWidth="1" />
          </g>
        );

      case 'sleep':
        return (
          <g>
            {/* Crescent moon and sleeping stars */}
            <path d="M24 8C17 8 12 13.5 12 20.5C12 27.5 17 33 24 33C21 30 19 25 19 20.5C19 16 21 11 24 8Z" fill={primaryColor} />
            <polygon points="27,10 28,12 30,12 28.5,13.5 29,15.5 27,14 25,15.5 25.5,13.5 24,12 26,12" fill="#fef08a" />
            <polygon points="30,19 30.5,20.5 32,20.5 30.8,21.5 31.2,23 30,22 28.8,23 29.2,21.5 28,20.5 29.5,20.5" fill="#fef08a" />
          </g>
        );

      case 'web':
        return (
          <g>
            {/* Spider web */}
            <path d="M6 6L34 34M6 34L34 6M20 4V36M4 20H36" stroke={primaryColor} strokeWidth="1.2" opacity="0.6" />
            <polygon points="20,10 27,13 30,20 27,27 20,30 13,27 10,20 13,13" fill="none" stroke={primaryColor} strokeWidth="1.5" />
            <polygon points="20,15 23.5,16.5 25,20 23.5,23.5 20,25 16.5,23.5 15,20 16.5,16.5" fill="none" stroke="#e0f2fe" strokeWidth="1.2" />
          </g>
        );

      case 'darkness':
        return (
          <g>
            {/* Inky dark orb with tendrils */}
            <circle cx="20" cy="20" r="10" fill="#090a0f" stroke={primaryColor} strokeWidth="2" />
            <path d="M20 6C18 10 22 12 20 16M34 20C30 18 28 22 24 20M20 34C22 30 18 28 20 24M6 20C10 22 12 18 16 20" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      // Default fallback by magic school
      default:
        return renderSchoolRune(school, primaryColor);
    }
  };

  const renderSchoolRune = (s: MagicSchool, color: string) => {
    switch (s) {
      case 'Evocación':
        return (
          <g>
            {/* Blazing flame burst */}
            <path d="M20 6C15 13 12 17 12 23C12 27.5 15.5 31 20 31C24.5 31 28 27.5 28 23C28 17 25 13 20 6Z" fill={color} opacity="0.8" />
            <path d="M20 13C17.5 17 16 19 16 23C16 25.5 17.8 27.5 20 27.5C22.2 27.5 24 25.5 24 23C24 19 22.5 17 20 13Z" fill="#fef08a" />
          </g>
        );
      case 'Abjuración':
        return (
          <g>
            {/* Protective crest */}
            <path d="M20 6L31 11V21C31 27.5 26.2 32.5 20 34C13.8 32.5 9 27.5 9 21V11L20 6Z" fill="none" stroke={color} strokeWidth="2.5" />
            <circle cx="20" cy="20" r="4" fill={color} />
          </g>
        );
      case 'Nigromancia':
        return (
          <g>
            {/* Skull visage */}
            <path d="M13 16C13 11 16 8 20 8C24 8 27 11 27 16C27 19.5 25 21.5 24 24H16C15 21.5 13 19.5 13 16Z" fill={color} opacity="0.85" />
            <rect x="16" y="24" width="8" height="5" rx="1" fill={color} opacity="0.85" />
            <circle cx="17" cy="16" r="1.8" fill="#18181b" />
            <circle cx="23" cy="16" r="1.8" fill="#18181b" />
          </g>
        );
      case 'Conjuración':
        return (
          <g>
            {/* Portal / summoning rift */}
            <ellipse cx="20" cy="20" rx="13" ry="7" fill="none" stroke={color} strokeWidth="2" transform="rotate(-30 20 20)" />
            <polygon points="20,10 24,18 20,26 16,18" fill={color} />
            <circle cx="20" cy="18" r="2" fill="#ffffff" />
          </g>
        );
      case 'Encantamiento':
        return (
          <g>
            {/* Heart of charm & spiral */}
            <path d="M20 31C20 31 11 24.5 11 18C11 14 14 11 18 11C19.5 11 20 11.8 20 11.8C20 11.8 20.5 11 22 11C26 11 29 14 29 18C29 24.5 20 31 20 31Z" fill={color} opacity="0.85" />
            <circle cx="20" cy="19" r="3" fill="#ffffff" />
          </g>
        );
      case 'Adivinación':
        return (
          <g>
            {/* All-seeing eye */}
            <path d="M7 20C11 14 15 10 20 10C25 10 29 14 33 20C29 26 25 30 20 30C15 30 11 26 7 20Z" fill="none" stroke={color} strokeWidth="2.5" />
            <circle cx="20" cy="20" r="5" fill={color} />
            <circle cx="20" cy="20" r="2" fill="#ffffff" />
          </g>
        );
      case 'Ilusión':
        return (
          <g>
            {/* Mirage mask / eye */}
            <circle cx="20" cy="20" r="12" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 3" />
            <path d="M12 17C14 14 17 13 20 13C23 13 26 14 28 17C26 20 23 21 20 21C17 21 14 20 12 17Z" fill={color} />
            <circle cx="20" cy="26" r="2" fill="#ffffff" />
          </g>
        );
      case 'Transmutación':
        return (
          <g>
            {/* Alchemical Ouroboros / Triquetra */}
            <circle cx="20" cy="20" r="12" fill="none" stroke={color} strokeWidth="2" />
            <polygon points="20,10 29,25 11,25" fill="none" stroke={color} strokeWidth="2" />
            <circle cx="20" cy="20" r="3" fill="#fef08a" />
          </g>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={`inline-block select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="fireGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      {renderIcon()}
    </svg>
  );
};
