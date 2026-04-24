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
      
      {/* Treble Clef (음자리표) stylized SVG element */}
      <path 
        fill="currentColor" 
        d="M 9.5 2 C 8.67 2 8 2.67 8 3.5 C 8 4.6 8.8 5.4 10 6.6 C 11.2 7.8 12.5 9 12.5 11 C 12.5 13.5 10.5 15.6 8.5 16 C 8.5 16.5 8.5 17.5 8.5 18 C 7 18 6 17 6 15.5 C 6 14.67 6.67 14 7.5 14 C 8.33 14 9 14.67 9 15.5 C 9 15.7 8.9 15.9 8.8 16 C 10 15.8 11.5 14.1 11.5 11 C 11.5 9.5 10.5 8.5 9.2 7.2 C 8.1 6.1 7 4.9 7 3.5 C 7 2.1 8.1 1 9.5 1 C 10.9 1 12 2.1 12 3.5 C 12 5.1 10.4 6.7 8.8 8.1 L 8.4 8.5 C 7 9.8 6 11 6 12.5 C 6 14.4 7.2 16 9 16.8 L 9 19.5 C 9 20.3 8.3 21 7.5 21 C 6.7 21 6 20.3 6 19.5 C 6 19.2 6.2 19 6.5 19 C 6.8 19 7 19.2 7 19.5 C 7 19.8 7.2 20 7.5 20 C 7.8 20 8 19.8 8 19.5 L 8 17 C 5.2 16.1 3.5 13.5 3.5 10.5 C 3.5 7.5 5.5 5 8.5 4.1 C 8.9 3 9.4 2 9.5 2 Z" 
      />
    </svg>
  );
}
