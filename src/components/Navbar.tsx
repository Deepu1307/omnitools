'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Search, 
  Zap, 
  Briefcase, 
  Activity, 
  Image as ImageIcon, 
  FileText, 
  Calculator, 
  ShieldCheck 
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import CommandPalette from './CommandPalette';

export default function Navbar() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      setTimeout(() => {
        document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const navCategories = [
    {
      id: 'daily',
      label: 'Daily Essentials',
      icon: <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 shrink-0" />,
      activeClass: 'text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100',
    },
    {
      id: 'business',
      label: 'Business & Local',
      icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
      activeClass: 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100',
    },
    {
      id: 'health',
      label: 'Health & BMI',
      icon: <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
      activeClass: 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100',
    },
    {
      id: 'media',
      label: 'Image & Video',
      icon: <ImageIcon className="w-3.5 h-3.5 text-sky-500 shrink-0" />,
      activeClass: 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100',
    },
    {
      id: 'pdf',
      label: 'PDF Utilities',
      icon: <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
      activeClass: 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100',
    },
    {
      id: 'calculator',
      label: 'Finance & Calc',
      icon: <Calculator className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      activeClass: 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100',
    },
    {
      id: 'security',
      label: 'Security & Dev',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />,
      activeClass: 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Top Bar */}
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Unified Brand Logo - Pixel-perfect match with Favicon */}
            <Link 
              href="/" 
              className="group py-1 shrink-0"
              aria-label="OmniTools Home"
            >
              <BrandLogo />
            </Link>

            {/* Quick Search Bar (Cmd+K trigger) */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-400 text-xs font-medium transition-all shadow-2xs max-w-xs w-60 shrink-0 group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              <span className="flex-1 text-left text-slate-500 truncate">Quick search tools...</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-500 shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>

            {/* Right Action: Support Creator Button & Mobile Search */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsCommandOpen(true)}
                className="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 border border-slate-200"
                aria-label="Search tools"
              >
                <Search className="w-5 h-5" />
              </button>
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl transition-all shadow-2xs whitespace-nowrap group hover:scale-[1.02]"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Support Creator</span>
              </a>
            </div>
          </div>

          {/* Secondary Streamlined Category Bar with Crisp Vector Icons */}
          <div className="border-t border-slate-100 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth text-xs font-semibold whitespace-nowrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 shrink-0">
              Categories:
            </span>
            {navCategories.map((cat) => (
              <Link 
                key={cat.id}
                href={`/?category=${cat.id}#tools`}
                onClick={handleNavClick}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors shrink-0 ${cat.activeClass}`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}