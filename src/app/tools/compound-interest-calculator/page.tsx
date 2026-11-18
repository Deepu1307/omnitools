'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ArrowLeft, 
  DollarSign, 
  Sparkles, 
  Percent, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function CompoundInterestCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState<number>(5000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(300);
  const [annualRate, setAnnualRate] = useState<number>(8.5);
  const [years, setYears] = useState<number>(15);

  // Calculate year by year breakdown
  const calculateGrowth = () => {
    let currentBalance = initialInvestment;
    let totalInvested = initialInvestment;
    const yearlyData = [];
    const monthlyRate = annualRate / 100 / 12;

    for (let yr = 1; yr <= years; yr++) {
      for (let m = 0; m < 12; m++) {
        currentBalance = (currentBalance + monthlyContribution) * (1 + monthlyRate);
        totalInvested += monthlyContribution;
      }
      yearlyData.push({
        year: yr,
        totalBalance: Math.round(currentBalance),
        totalInvested: Math.round(totalInvested),
        totalInterest: Math.round(currentBalance - totalInvested),
      });
    }

    const final = yearlyData[yearlyData.length - 1] || {
      totalBalance: initialInvestment,
      totalInvested: initialInvestment,
      totalInterest: 0,
    };

    return { yearlyData, final };
  };

  const { yearlyData, final } = calculateGrowth();
  const interestPercentage = final.totalBalance > 0
    ? Math.round((final.totalInterest / final.totalBalance) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>High CPM Finance Estimator • Monthly Compounding</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Compound Interest & Investment Calculator</h1>
        <p className="text-sm text-slate-500 mt-1">Simulate wealth accumulation with regular monthly investments and compound interest over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-3">Investment Parameters</h3>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Initial Investment ($)
            </label>
            <input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Expected Annual Return</span>
              <span className="text-emerald-600">{annualRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Time Horizon (Years)</span>
              <span className="text-emerald-600">{years} years</span>
            </div>
            <input
              type="range"
              min="1"
              max="40"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Results & Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Balance Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Total Future Wealth</span>
            <div className="mt-2 text-4xl sm:text-5xl font-black text-white tracking-tight">
              ${final.totalBalance.toLocaleString()}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Your Contributions</span>
                <p className="text-xl font-bold text-slate-200 mt-0.5">${final.totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[11px] text-emerald-400 uppercase font-semibold">Total Compound Returns</span>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">+${final.totalInterest.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Visual Percentage Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Invested Capital ({100 - interestPercentage}%)</span>
              <span className="text-emerald-600">Pure Interest Growth ({interestPercentage}%)</span>
            </div>
            <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${100 - interestPercentage}%` }}
                className="h-full bg-slate-400 transition-all duration-300"
              />
              <div
                style={{ width: `${interestPercentage}%` }}
                className="h-full bg-emerald-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Milestone Table Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm overflow-hidden">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">5-Year Growth Milestones</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Total Invested</th>
                    <th className="py-2.5 px-3">Interest Earned</th>
                    <th className="py-2.5 px-3 text-right">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {yearlyData
                    .filter((d) => d.year % 5 === 0 || d.year === years)
                    .map((d) => (
                      <tr key={d.year} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-800">Year {d.year}</td>
                        <td className="py-2.5 px-3 text-slate-600">${d.totalInvested.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-emerald-600 font-semibold">+${d.totalInterest.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">${d.totalBalance.toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AdBanner slot="in-tool" className="mt-8" />
    </div>
  );
}
