'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle2, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feedback / Suggest a Tool');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    // In a real client-side tool, trigger mailto or simulate instant confirmation
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feedback, Bug Reports & Tool Requests</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Have an idea for a profession-specific tool or spotted a bug? We build tools based directly on user feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out, <strong>{name || 'Friend'}</strong>. Your feedback helps shape the next batch of LocalKit releases.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Subject / Inquiry Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option>Feedback / Suggest a Tool</option>
                  <option>Report a Bug</option>
                  <option>Profession Tool Request</option>
                  <option>Partnership & Sponsorship</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your suggestion or issue in detail..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Info Box */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Direct Developer Inquiries</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              OmniTools is actively maintained by <strong>Deepu Kumar</strong>. For contract or engineering inquiries, visit the portfolio:
            </p>
            <a
              href="https://deepukumar.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-indigo-600 hover:border-indigo-400 transition-all shadow-2xs"
            >
              <span>Visit deepukumar.netlify.app</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Suggesting a Profession Tool?</span>
            </h4>
            <p className="leading-relaxed text-emerald-800">
              Tell us your profession (e.g. Architect, Dentist, Pilot, Accountant) and the math or document workflow you find most repetitive!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
