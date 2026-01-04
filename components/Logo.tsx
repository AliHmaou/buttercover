
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
      {/* Background Crest */}
      <circle cx="50" cy="50" r="48" fill="#eab308" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#0a1120" strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#0a1120" strokeWidth="4" />
      
      {/* Butter Block (The Body) */}
      {/* Main block with a slight organic melt at the bottom */}
      <path 
        d="M32 35 Q50 32 68 35 L72 65 Q50 72 28 65 Z" 
        fill="#fef08a" 
        stroke="#eab308" 
        strokeWidth="1"
      />
      {/* Side shadow for 3D effect */}
      <path d="M68 35 L72 65 Q55 68 50 64 L50 33 Z" fill="#facc15" opacity="0.4" />
      
      {/* The Malicious Face */}
      {/* The Spy Mask - Sharper and more aggressive */}
      <path 
        d="M25 45 Q50 38 75 45 L78 55 Q50 50 22 55 Z" 
        fill="#0a1120" 
        className="drop-shadow-md"
      />
      
      {/* Cunning Eyes */}
      <g transform="translate(40, 48) rotate(-10)">
        <path d="M0 0 Q5 2 10 0" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g transform="translate(52, 46) rotate(10)">
        <path d="M0 0 Q5 2 10 0" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      
      {/* The Smirk (Mouth) */}
      <path 
        d="M55 60 Q60 62 65 60" 
        fill="none" 
        stroke="#0a1120" 
        strokeWidth="2" 
        strokeLinecap="round" 
        opacity="0.8"
      />
      
      {/* The Fedora (Hat) */}
      <g className="drop-shadow-lg">
        {/* Brim */}
        <path d="M25 35 Q50 28 75 35 L72 38 Q50 32 28 38 Z" fill="#1e293b" />
        {/* Top */}
        <path d="M38 30 L42 18 Q50 15 58 18 L62 30" fill="#0a1120" />
        {/* Hat Band */}
        <rect x="40" y="25" width="20" height="3" fill="#eab308" opacity="0.8" />
      </g>

      {/* Glossy highlight on the butter corner */}
      <path d="M35 38 Q38 40 35 42" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      
      {/* Confidential Stamp Effect Snippet */}
      <path d="M70 70 L85 85 M75 70 L90 85" stroke="#0a1120" strokeWidth="1" opacity="0.2" />
    </svg>
  </div>
);

export default Logo;
