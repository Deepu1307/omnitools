'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, Plus, Trash2, Receipt, ShieldCheck, Printer, CheckCircle2 } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

interface BillingItem {
  id: string;
  description: string;
  hours: number;
  minutes: number;
}

export default function BillableHoursCalculatorPage() {
  const [hourlyRate, setHourlyRate] = useState<number>(350);
  const [retainerPaid, setRetainerPaid] = useState<number>(1000);
  const [clientName, setClientName] = useState<string>('Acme Corporation');
  const [items, setItems] = useState<BillingItem[]>([
    { id: '1', description: 'Contract review & clause markup', hours: 2, minutes: 15 },
    { id: '2', description: 'Client consultation & discovery call', hours: 1, minutes: 30 },
    { id: '3', description: 'Drafting response to opposing counsel', hours: 0, minutes: 45 },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: 'Legal research & documentation', hours: 1, minutes: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BillingItem, val: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Convert minutes into standard 6-minute tenth-of-an-hour (0.1) legal increments
  const computeDecimalHours = (h: number, m: number) => {
    const roundedTenth = Math.ceil((m || 0) / 6) / 10;
    return (h || 0) + roundedTenth;
  };

  const totalDecimalHours = items.reduce(
    (sum, item) => sum + computeDecimalHours(item.hours, item.minutes),
    0
  );

  const totalBillableFee = totalDecimalHours * hourlyRate;
  const balanceDue = totalBillableFee - retainerPaid;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors print:hidden"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8 print:hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 mb-3">
          <Receipt className="w-3.5 h-3.5" />
          <span>Legal & Professional Services • Standard 0.1 Increment Billing</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Billable Hours & Legal Fee Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Calculate attorney, legal counsel, and consultant billable time with 6-minute increment rounding and retainer deductions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Inputs Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Hourly Rate ($/hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    value={hourlyRate || ''}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Retainer Paid ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    value={retainerPaid || ''}
                    onChange={(e) => setRetainerPaid(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Client / Matter Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Itemized Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Itemized Time Entries
                </span>
                <button
                  onClick={addItem}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all print:hidden"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Time Entry</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {items.map((item, idx) => {
                  const decimal = computeDecimalHours(item.hours, item.minutes);
                  const lineTotal = decimal * hourlyRate;

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Task description..."
                        className="flex-1 w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white"
                      />

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <input
                            type="number"
                            min="0"
                            value={item.hours}
                            onChange={(e) => updateItem(item.id, 'hours', parseInt(e.target.value) || 0)}
                            className="w-12 px-1.5 py-1 rounded border border-slate-300 text-center font-bold text-slate-800 bg-white"
                          />
                          <span>h</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            step="6"
                            value={item.minutes}
                            onChange={(e) => updateItem(item.id, 'minutes', parseInt(e.target.value) || 0)}
                            className="w-12 px-1.5 py-1 rounded border border-slate-300 text-center font-bold text-slate-800 bg-white"
                          />
                          <span>m</span>
                        </div>

                        <span className="text-xs font-bold text-slate-700 w-16 text-right font-mono">
                          {decimal.toFixed(1)} hrs
                        </span>

                        <span className="text-xs font-bold text-indigo-700 w-20 text-right font-mono">
                          ${lineTotal.toFixed(2)}
                        </span>

                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors print:hidden"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Fee Summary Slip */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Fee Statement
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Client: {clientName || 'General'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Billable Hours:</span>
                <span className="font-bold text-white text-base font-mono">
                  {totalDecimalHours.toFixed(1)} hrs
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Hourly Rate:</span>
                <span className="font-bold text-white font-mono">${hourlyRate.toFixed(2)}/hr</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Gross Legal Fees:</span>
                <span className="font-bold text-white font-mono">${totalBillableFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-400">
                <span>Less Retainer Applied:</span>
                <span className="font-bold font-mono">-${retainerPaid.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 block">Total Balance Due</span>
              <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
                ${Math.max(0, balanceDue).toFixed(2)}
              </div>
              {balanceDue < 0 && (
                <p className="text-xs text-emerald-400 mt-1">
                  Retainer Credit Remaining: ${Math.abs(balanceDue).toFixed(2)}
                </p>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Fee Slip PDF</span>
            </button>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs text-slate-600 print:hidden">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client Confidential</span>
            </h4>
            <p className="leading-relaxed">
              All client names, matter numbers, and time entries are calculated strictly in your local browser memory. Nothing is ever sent to or stored on external servers.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 print:hidden">
        <AdBanner slot="bottom-content" />
      </div>
    </div>
  );
}
