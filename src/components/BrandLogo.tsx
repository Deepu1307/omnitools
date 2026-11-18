import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function BrandLogo({ size = 'md', showText = true, className = '' }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const wrenchSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {/* Premium Squircle Icon with Inner Depth & Gradient */}
      <div className={`relative flex items-center justify-center ${iconSize} rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 text-white shadow-md shadow-indigo-500/25 border border-white/20 shrink-0 group-hover:scale-105 transition-all`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={wrenchSize}
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col whitespace-nowrap select-none">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
              OmniTools<span className="text-indigo-600">.io</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1 leading-none">
            100% Private • Zero Uploads
          </span>
        </div>
      )}
    </div>
  );
}