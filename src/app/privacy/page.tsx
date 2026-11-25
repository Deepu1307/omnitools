import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, EyeOff, Server, HardDrive } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — 100% Private, Zero Cloud Uploads',
  description: 'LocalKit.online is architected with complete client-side privacy. Your files, images, PDFs, and calculations never leave your browser.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Architectural Privacy Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Effective Date: January 1, 2026 • Last updated: November 2026
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        {/* Core Architecture */}
        <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <span>1. Zero-Upload Architecture (Privacy by Design)</span>
          </h2>
          <p>
            Unlike traditional web utilities that upload your documents, images, and sensitive financial records to remote cloud servers for processing, <strong>LocalKit.online operates entirely inside your local web browser</strong>.
          </p>
          <p>
            When you convert a JPG to PDF, sign a legal contract, calculate stock averaging, or format text, all binary transformations and mathematical logic execute directly via your computer&apos;s WebAssembly (Wasm) and JavaScript sandbox. <strong>Your files never reach our servers, because we do not have a backend storage database.</strong>
          </p>
        </section>

        {/* What Information We Process */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Information We Process</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Your Files & Inputs:</strong> Images, PDF files, financial metrics, time tracking notes, and text strings remain strictly in your browser&apos;s volatile RAM and are cleared upon closing or refreshing the tab.
            </li>
            <li>
              <strong>Local Storage:</strong> If you pin/favorite a tool or save an email subscription preference, this is stored exclusively on your device using HTML5 LocalStorage. You can clear this anytime through your browser settings.
            </li>
            <li>
              <strong>Analytics & Telemetry:</strong> We do not use third-party invasive trackers, fingerprinters, or persistent tracking cookies. Any web telemetry is aggregated, privacy-preserving, and does not identify individual users.
            </li>
          </ul>
        </section>

        {/* Third-Party Embeds */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Social Media & External Embeds</h2>
          <p>
            In tools such as the Social Media Downloader, official iframe embed widgets (e.g., from Instagram, YouTube, or Twitter) may be used to display authentic video previews directly from their respective origins. Those external platforms are governed by their own privacy policies.
          </p>
        </section>

        {/* GDPR & CCPA Compliance */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. GDPR & CCPA Compliance</h2>
          <p>
            Because OmniTools does not collect, sell, rent, or store personal data, we comply with the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA) by architectural default.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-3 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-bold text-slate-900">5. Questions & Contact</h2>
          <p>
            If you have questions regarding this privacy policy or our open client-side architecture, visit our <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">Contact Page</Link> or reach out directly to the developer at <a href="https://deepukumar.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline">Deepu Kumar&apos;s Portfolio</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
