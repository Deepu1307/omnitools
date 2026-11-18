'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BadgePercent, 
  ArrowLeft, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  ShoppingBag,
  Info
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function ProfitMarginCalculatorPage() {
  const [costPrice, setCostPrice] = useState<number>(40);
  const [sellingPrice, setSellingPrice] = useState<number>(100);

  // Calculations
  const grossProfit = sellingPrice - costPrice;
  const profitMarginPercent = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const markupPercent = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <BadgePercent className="w-3.5 h-3.5" />
          <span>Retail & Small Business Essential • Instant Pricing Math</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profit Margin & Markup Calculator</h1>
        <p className="text-sm text-slate-500 mt-1">Calculate your gross profit, profit margin percentage, and markup rate for products and services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-3">Cost & Revenue Inputs</h3>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Cost of Goods / Service Cost ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-lg font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">What it costs you to manufacture, buy, or deliver.</span>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Selling Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-lg font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">What you charge your client or customer.</span>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Profit Breakdown</span>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Gross Profit</span>
              <span className="text-3xl font-black text-emerald-950 mt-1 block">
                ${grossProfit.toFixed(2)}
              </span>
              <span className="text-[11px] text-emerald-700">Net revenue remaining after product cost</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <span className="text-[11px] font-bold text-indigo-800 uppercase block">Profit Margin</span>
                <span className="text-2xl font-black text-indigo-950 mt-0.5 block">
                  {profitMarginPercent.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400">Profit as % of revenue</span>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">Markup Rate</span>
                <span className="text-2xl font-black text-amber-950 mt-0.5 block">
                  {markupPercent.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400">Profit as % of your cost</span>
              </div>
            </div>
          </div>

          {/* Quick Pricing Rule of Thumb */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600">
            <strong>Pro Tip:</strong> Margin can never exceed 100%, whereas Markup can be 200%, 300% or higher. For healthy retail, aim for at least <strong>50%–60% margin</strong>.
          </div>
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
