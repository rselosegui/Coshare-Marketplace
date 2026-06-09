import React from 'react';

export const CoshareLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="100" fill="#0B132B" />
    
    <g transform="translate(100, 80)">
      {/* 4 loops like an Irish knot or command icon, with gradients. */}
      {/* Top Left - White */}
      <path d="M -10,-10 L -20,-20 C -35,-35 -15,-50 0,-35 L 10,-25" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom Right - White */}
      <path d="M 10,10 L 20,20 C 35,35 15,50 0,35 L -10,25" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Top Right - Blue */}
      <path d="M 10,-10 L 20,-20 C 35,-35 50,-15 35,0 L 25,10" stroke="url(#blueGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom Left - Blue */}
      <path d="M -10,10 L -20,20 C -35,35 -50,15 -35,0 L -25,-10" stroke="url(#blueGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    <text x="100" y="155" textAnchor="middle" fill="white" fontSize="32" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">
      Coshare<tspan fill="#3b82f6">.</tspan>
    </text>

    <defs>
      <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
  </svg>
);
