'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Lock, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setFeedbackMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedbackMessage(data.message || 'Thank you! You are on the OmniTools VIP update list.');
        try {
          localStorage.setItem('omnitools_subscribed_email', email);
        } catch (_) {}
        setEmail('');
      } else {
        setStatus('error');
        setFeedbackMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setFeedbackMessage('Network error. Please try again later.');
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      {/* Trust & Privacy Highlights */}
      <div className="border-b border-slate-100 py-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 text-sm">100% Privacy Focused</h5>
              <p className="text-xs text-slate-500">Files and inputs are processed locally in your browser. Never uploaded to servers.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 text-sm">Blazing Fast Speed</h5>
              <p className="text-xs text-slate-500">Zero queue time, no bandwidth limits, and instant results on any device.</p>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-slate-800 text-sm">Always Free & No Watermarks</h5>
              <p className="text-xs text-slate-500">Supported by non-intrusive sponsorships and developer contributions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-block">
              <BrandLogo size="sm" />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Curated suite of free, high-speed, client-side tools designed for creators, developers, students, and everyday internet users.
            </p>
          </div>

          <div>
            <h6 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">Consumer & Media</h6>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/tools/jpg-to-pdf" className="hover:text-indigo-600">JPG to PDF Converter</Link></li>
              <li><Link href="/tools/sign-pdf" className="hover:text-indigo-600">Sign PDF Online Free</Link></li>
              <li><Link href="/tools/image-resizer" className="hover:text-indigo-600">Image Resizer & Compressor</Link></li>
              <li><Link href="/tools/background-remover" className="hover:text-indigo-600">Background Remover</Link></li>
              <li><Link href="/tools/pdf-splitter" className="hover:text-indigo-600">PDF Splitter & Extractor</Link></li>
              <li><Link href="/tools/video-clipper" className="hover:text-indigo-600">Video Clipper & Trimmer</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">Business & Dev</h6>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/tools/invoice-generator" className="hover:text-indigo-600">Instant Invoice Maker</Link></li>
              <li><Link href="/tools/whatsapp-link-generator" className="hover:text-indigo-600">WhatsApp Direct Chat Maker</Link></li>
              <li><Link href="/tools/profit-margin-calculator" className="hover:text-indigo-600">Profit Margin Calculator</Link></li>
              <li><Link href="/tools/json-to-types" className="hover:text-indigo-600">JSON to Types (TS/Python/Go)</Link></li>
              <li><Link href="/tools/cloud-cost-calculator" className="hover:text-indigo-600">Cloud Storage & Egress Estimator</Link></li>
            </ul>
          </div>

          {/* Interactive Newsletter Subscription */}
          <div>
            <h6 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">Stay Updated</h6>
            <p className="text-xs text-slate-500 mb-3">
              Get notified when we launch new free tools and productivity utilities.
            </p>

            {status === 'success' ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You&apos;re Subscribed!</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-snug">
                  {feedbackMessage}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-2 text-[10px] font-semibold text-emerald-800 underline hover:text-emerald-900"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="footer-newsletter-email"
                    name="email"
                    aria-label="Email address for updates"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    disabled={status === 'loading'}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    aria-label="Subscribe to newsletter"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 disabled:opacity-50 transition-all whitespace-nowrap"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <span>Join</span>
                    )}
                  </button>
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{feedbackMessage}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} OmniTools. Built with privacy and speed in mind.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}