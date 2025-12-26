
import React from 'react';
import { PokemonType } from '../types';
import { TYPE_COLORS, TYPE_NAME_JP } from '../constants';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`${TYPE_COLORS[type]} ${sizeClasses[size]} rounded-full text-white font-bold shadow-sm uppercase tracking-wider inline-block`}>
      {TYPE_NAME_JP[type]}
    </span>
  );
};

export default TypeBadge;
