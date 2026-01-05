import React from 'react';

export const PixelCharacter = ({ mood }: { mood: 'thinking' | 'happy' }) => {
  // A simple 8-bit style face
  return (
    <svg width="100" height="100" viewBox="0 0 24 24" className="inline-block animate-float">
      <rect x="2" y="4" width="20" height="16" fill="#fbbf24" stroke="black" strokeWidth="2" /> {/* Head */}
      
      {/* Eyes */}
      <rect x="6" y="8" width="2" height="2" fill="black" />
      <rect x="16" y="8" width="2" height="2" fill="black" />
      
      {/* Mouth */}
      {mood === 'thinking' ? (
         <rect x="10" y="14" width="4" height="2" fill="black" />
      ) : (
        <>
          <rect x="6" y="14" width="2" height="2" fill="black" />
          <rect x="8" y="16" width="8" height="2" fill="black" />
          <rect x="16" y="14" width="2" height="2" fill="black" />
        </>
      )}
      
      {/* Antenna */}
      <rect x="11" y="0" width="2" height="4" fill="black" />
    </svg>
  );
};