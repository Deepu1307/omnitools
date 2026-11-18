'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('OmniTools ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.error('OmniTools ServiceWorker registration failed:', err);
          });
      });
    }

    // 2. Check if already installed
    if (typeof window !== 'undefined') {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check iOS Safari
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isIos && isSafari && !sessionStorage.getItem('omnitools_ios_pwa_dismissed')) {
        setShowIosPrompt(true);
      }
    }

    // 3. Listen for Android / Chrome / Edge install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Chrome / Android / Desktop Install Banner Floating Notification */}
      {isInstallable && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center shrink-0 shadow-md">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">
                  Install OmniTools App
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  Use all 27+ tools offline directly from your home screen or desktop.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Free App</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari 'Add to Home Screen' Helper Modal */}
      {showIosPrompt && (
        <div className="fixed bottom-4 inset-x-4 sm:max-w-md sm:mx-auto z-50 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl text-slate-900 animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Install OmniTools on iOS</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Add to your Home Screen for instant offline access</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowIosPrompt(false);
                try {
                  sessionStorage.setItem('omnitools_ios_pwa_dismissed', '1');
                } catch (_) {}
              }}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-600">1.</span>
              <span>Tap the <strong className="inline-flex items-center gap-0.5 text-indigo-600">Share button <Share2 className="w-3 h-3 inline" /></strong> in Safari</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-600">2.</span>
              <span>Scroll down and select <strong className="inline-flex items-center gap-0.5 text-indigo-600">Add to Home Screen <PlusSquare className="w-3 h-3 inline" /></strong></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}