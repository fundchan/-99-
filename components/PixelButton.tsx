import React from 'react';
import { playClick } from '../utils/audio';

interface PixelButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const PixelButton: React.FC<PixelButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  disabled = false,
  className = ''
}) => {
  const baseColors = {
    primary: 'bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black',
    secondary: 'bg-white hover:bg-gray-100 active:bg-gray-200 text-black',
    accent: 'bg-green-500 hover:bg-green-400 active:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-400 active:bg-red-600 text-white',
  };

  const handleClick = () => {
    if (!disabled) {
      playClick();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative 
        border-[6px] border-black 
        px-6 py-4 
        font-bold tracking-widest text-xl
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        active:shadow-none active:translate-x-[6px] active:translate-y-[6px]
        transition-all duration-75
        disabled:opacity-50 disabled:cursor-not-allowed
        ${baseColors[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};