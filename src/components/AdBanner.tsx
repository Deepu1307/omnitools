'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdBannerProps {
  slot?: 'top-banner' | 'in-tool' | 'sidebar' | 'footer-banner' | 'bottom-content';
  className?: string;
}

export default function AdBanner({ slot = 'in-tool', className = '' }: AdBannerProps) {
  // If you have Google AdSense enabled in environment variables or scripts,
  // this component can render the real <ins class="adsbygoogle" ...></ins>.
  // Until AdSense or Carbon Ads are approved, it displays an engaging, clean sponsorship banner
  // that can be pointed to high-converting affiliate programs or digital products.

  return (
    <div className={`w-full my-6 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1 px-1">
        <span className="uppercase tracking-wider font-semibold">Advertisement / Partner</span>
        <span className="hover:underline cursor-pointer">Why this ad?</span>
      </div>
      
      {/* High-Converting Ad Slot / Affiliate Container */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-5 text-white shadow-sm transition-all hover:border-indigo-500/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Recommended Productivity Stack</span>
            </div>
            <h4 className="font-semibold text-base sm:text-lg text-white">
              Supercharge Your Workflow with High-Speed Cloud Infrastructure
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Deploy apps, databases, and microservices in seconds. Claim $200 in free cloud hosting credits today.
            </p>
          </div>

          <a
            href="https://digitalocean.com"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
          >
            <span>Claim Free Credits</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
