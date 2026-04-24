import React from 'react';

export default function SheetMusicIcon({ size = 24, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={size} 
      height={size} 
      className={className} 
    >
      {/* 5 Staff lines (오선지) */}
      <path 
        fill="currentColor" 
        opacity="0.3" 
        d="M2 6h20v1H2zm0 3h20v1H2zm0 3h20v1H2zm0 3h20v1H2zm0 3h20v1H2z" 
      />
      
      {/* Barline at the start */}
      <path 
        fill="currentColor" 
        opacity="0.5" 
        d="M2 6h1v13H2z" 
      />
      
      {/* Treble Clef (음자리표) using elegant system serif font */}
      <text 
        x="6" 
        y="17" 
        fontSize="16" 
        fontFamily="Georgia, serif" 
        fill="currentColor"
      >
        𝄞
      </text>
    </svg>
  );
}
