'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, DollarSign, Plus, Trash2, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

interface PurchaseTranche {
  id: string;
  shares: number;
  price: number;
}

export default function StockAverageDownCalculatorPage() {
  const [tranches, setTranches] = useState<PurchaseTranche[]>([
    { id: '1', shares: 50, price: 150 },
    { id: '2', shares: 50, price: 110 },
  ]);
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(125);

  const addTranche = () => {
    setTranches((prev) => [
      ...prev,
      { id: Date.now().toString(), shares: 25, price: 100 },
    ]);
  };

  const removeTranche = (id: string) => {
    if (tranches.length <= 1) return;
    setTranches((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTranche = (id: string, field: 'shares' | 'price', value: number) => {
    setTranches((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: Math.max(0, value) } : t))
    );
  };

  // Calculations
  const totalShares = tranches.reduce((sum, t) => sum + (t.shares || 0), 0);
  const totalCost = tranches.reduce((sum, t) => sum + (t.shares || 0) * (t.price || 0), 0);
  const averagePrice = totalShares > 0 ? totalCost / totalShares : 0;
  const initialPrice = tranches[0]?.price || 0;
  const initialAverageDropPercent =
    initialPrice > 0 ? ((averagePrice - initialPrice) / initialPrice) * 100 : 0;

  // Current market valuation
  const currentPortfolioValue = totalShares * (currentMarketPrice || 0);
  const totalProfitLoss = currentPortfolioValue - totalCost;
  const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Trader & Investor Essential • 100% Client-Side Math</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Stock Average Down & Position Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Calculate your new weighted average share price when buying stock dips, ETF pullbacks, or crypto positions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Purchase Tranches Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-800">Purchases & Dips</h3>
            <button
              onClick={addTranche}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dip / Tranche</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {tranches.map((tranche, idx) => (
              <div
                key={tranche.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {idx === 0 ? 'Initial Buy #1' : `Buy #${idx + 1} (Averaging Down)`}
                  </span>
                  {tranches.length > 1 && (
                    <button
                      onClick={() => removeTranche(tranche.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Remove purchase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Shares / Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={tranche.shares || ''}
                      onChange={(e) => updateTranche(tranche.id, 'shares', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Price per Share ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={tranche.price || ''}
                      onChange={(e) => updateTranche(tranche.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Market Price Benchmark */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Current Market Price ($) <span className="text-slate-400 font-normal">(Optional P&L view)</span>
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={currentMarketPrice || ''}
              onChange={(e) => setCurrentMarketPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Results & Breakeven Analytics */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                New Position Summary
              </span>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                Zero Cloud Uploads
              </span>
            </div>

            <div>
              <span className="text-xs text-indigo-200 block">New Average Cost per Share</span>
              <div className="text-4xl font-extrabold text-white mt-1">
                ${averagePrice.toFixed(2)}
              </div>
              {tranches.length > 1 && (
                <p className="text-xs text-indigo-300 mt-1">
                  {initialAverageDropPercent < 0 ? (
                    <span className="text-emerald-400 font-semibold">
                      Decreased average by {Math.abs(initialAverageDropPercent).toFixed(2)}% from original ${initialPrice}
                    </span>
                  ) : (
                    <span>Original buy: ${initialPrice.toFixed(2)}</span>
                  )}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-900/60 text-xs">
              <div>
                <span className="text-indigo-300 block">Total Shares Owned</span>
                <span className="text-lg font-bold text-white">{totalShares.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-indigo-300 block">Total Capital Invested</span>
                <span className="text-lg font-bold text-white">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {currentMarketPrice > 0 && (
              <div className="pt-4 border-t border-indigo-900/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-300">Current Valuation:</span>
                  <span className="font-bold text-white">
                    ${currentPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-300">Unrealized P&L:</span>
                  <span
                    className={`font-bold ${
                      totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)} ({totalProfitLossPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Strategic Averaging Insight</span>
            </h4>
            <p className="leading-relaxed">
              When averaging down, your new breakeven target is reduced to <strong>${averagePrice.toFixed(2)}</strong>. You no longer need the stock to return to your initial purchase price of <strong>${initialPrice.toFixed(2)}</strong> to be profitable.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <AdBanner slot="bottom-content" />
      </div>
    </div>
  );
}
