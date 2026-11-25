import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — LocalKit.online',
  description: 'Terms and conditions for utilizing the free, client-side web tools provided by LocalKit.online.',
};

export default function TermsPage() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Usage Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Effective Date: January 1, 2026 • Last updated: November 2026
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using LocalKit.online (&quot;LocalKit&quot; or the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, you should discontinue using our website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Description of Service</h2>
          <p>
            LocalKit provides a curated suite of browser-based utilities for personal, educational, and commercial workflows (including PDF modification, image transformations, calculators, and media utilities). All tools execute locally on your device without server-side file transmission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Permitted & Lawful Use</h2>
          <p>
            You agree to use OmniTools only for lawful purposes. You may not use the tools to process copyright-infringing media, maliciously decrypt proprietary assets, or automate denial-of-service disruptions against any host infrastructure.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Disclaimer of Warranties</h2>
          <p>
            The tools and calculated outputs (such as legal billable hour calculations, stock averaging math, or tax invoice totals) are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. Users are encouraged to verify important financial, legal, or health calculations independently.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            Because all file handling occurs locally within your own web browser environment, OmniTools and its developers shall not be liable for any device data loss, corrupted downloads, or hardware resource utilization incurred while operating client-side scripts.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-bold text-slate-900">6. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, add, or discontinue tools at any time. For questions regarding these terms, visit our <Link href="/contact" className="text-indigo-600 font-semibold hover:underline">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
