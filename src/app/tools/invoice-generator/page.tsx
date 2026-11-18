'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Receipt, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Sparkles, 
  Building, 
  User, 
  DollarSign 
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGeneratorPage() {
  const [currency, setCurrency] = useState<string>('$');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-001');
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Business info
  const [businessName, setBusinessName] = useState<string>('Apex Studio & Services');
  const [businessEmail, setBusinessEmail] = useState<string>('contact@apexstudio.com');
  const [businessAddress, setBusinessAddress] = useState<string>('124 Market Street, Suite 400\nCity, State, 10001');

  // Client info
  const [clientName, setClientName] = useState<string>('Acme Corp');
  const [clientEmail, setClientEmail] = useState<string>('billing@acmecorp.com');
  const [clientAddress, setClientAddress] = useState<string>('500 Enterprise Way\nTech Park, CA 94016');

  // Items
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', description: 'Brand Identity & Web Design', quantity: 1, price: 1200 },
    { id: '2', description: 'Monthly Cloud Infrastructure Maintenance', quantity: 2, price: 350 },
  ]);

  const [taxRate, setTaxRate] = useState<number>(10);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('Thank you for your business! Please remit payment within 14 days.');

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(), description: 'New Service or Item', quantity: 1, price: 100 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 print:p-0 print:max-w-none">
      {/* Hide on Print */}
      <div className="print:hidden">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
              <Receipt className="w-3.5 h-3.5" />
              <span>Small Business Essential • 100% Free & Printable</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Instant Professional Invoice Maker</h1>
            <p className="text-sm text-slate-500 mt-1">Generate, customize, and print clean client invoices with auto-calculated taxes and line items.</p>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Document Canvas */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0 space-y-8">
        {/* Header: Business & Invoice Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2 flex-1">
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight w-full border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
              placeholder="Your Business Name"
            />
            <input
              type="text"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="text-xs text-slate-500 w-full border-b border-transparent hover:border-slate-300 focus:outline-none"
              placeholder="Email / Phone"
            />
            <textarea
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              rows={2}
              className="text-xs text-slate-400 w-full border-b border-transparent hover:border-slate-300 focus:outline-none resize-none"
              placeholder="Business Address"
            />
          </div>

          <div className="sm:text-right space-y-2 shrink-0">
            <span className="text-3xl font-black text-indigo-600 uppercase tracking-wider block">INVOICE</span>
            <div className="text-xs space-y-1">
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-400">Invoice #:</span>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="font-bold text-slate-800 text-right w-28 border-b border-transparent hover:border-slate-300 focus:outline-none"
                />
              </div>
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-400">Date:</span>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="text-slate-800 text-right border-b border-transparent hover:border-slate-300 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex sm:justify-end items-center gap-2">
                <span className="text-slate-400">Due Date:</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-slate-800 text-right border-b border-transparent hover:border-slate-300 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Billed To (Client):</span>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="text-sm font-bold text-slate-900 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none"
              placeholder="Client or Company Name"
            />
            <input
              type="text"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="text-xs text-slate-500 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none"
              placeholder="client@company.com"
            />
            <textarea
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              rows={2}
              className="text-xs text-slate-400 w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none resize-none"
              placeholder="Client Address"
            />
          </div>

          <div className="flex sm:justify-end items-end gap-3 print:hidden">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
                <option value="C$">CAD (C$)</option>
                <option value="A$">AUD (A$)</option>
                <option value="¥">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] text-left">
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 w-20 text-center">Qty</th>
                <th className="py-3 px-2 w-28 text-right">Price</th>
                <th className="py-3 px-2 w-28 text-right">Total</th>
                <th className="py-3 px-2 w-10 text-center print:hidden"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="group">
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full text-xs font-medium text-slate-800 border-b border-transparent hover:border-slate-300 focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                      className="w-16 text-center text-xs font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>{currency}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', Math.max(0, Number(e.target.value)))}
                        className="w-20 text-right text-xs font-semibold text-slate-800 border-b border-transparent hover:border-slate-300 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">
                    {currency}{(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-center print:hidden">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="text-slate-300 hover:text-rose-500 disabled:opacity-0 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors print:hidden"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Totals & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Notes & Payment Instructions:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full text-xs text-slate-600 p-3 rounded-xl border border-slate-200 bg-slate-50 resize-none focus:outline-none"
            />
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">{currency}{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="flex items-center gap-1">
                Discount (%):
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-12 text-center border rounded px-1 text-xs print:hidden"
                />
              </span>
              <span className="font-semibold text-slate-800">-{currency}{discountAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="flex items-center gap-1">
                Tax / GST ({taxRate}%):
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-12 text-center border rounded px-1 text-xs print:hidden"
                />
              </span>
              <span className="font-semibold text-slate-800">+{currency}{taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-t-2 border-slate-900 text-sm sm:text-base font-black text-slate-900">
              <span>Total Due:</span>
              <span>{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <AdBanner slot="in-tool" className="mt-8" />
      </div>
    </div>
  );
}
