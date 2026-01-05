import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  className = '', 
  color = 'bg-white' 
}) => {
  return (
    <div className={`
      relative 
      border-[6px] border-black 
      shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]
      p-6
      ${color}
      ${className}
    `}>
      {/* Decorative Pixel Corners - Chunky Style */}
      <div className="absolute top-3 left-3 w-3 h-3 bg-black opacity-20"></div>
      <div className="absolute top-3 right-3 w-3 h-3 bg-black opacity-20"></div>
      <div className="absolute bottom-3 left-3 w-3 h-3 bg-black opacity-20"></div>
      <div className="absolute bottom-3 right-3 w-3 h-3 bg-black opacity-20"></div>
      
      {children}
    </div>
  );
};