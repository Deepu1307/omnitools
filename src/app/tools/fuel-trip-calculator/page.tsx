'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Fuel, DollarSign, Users, MapPin, Navigation, Car, Sparkles, ShieldCheck } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function FuelTripCalculatorPage() {
  const [distance, setDistance] = useState<number>(180);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(14); // km/l or mpg
  const [fuelPrice, setFuelPrice] = useState<number>(1.45); // price per liter or gallon
  const [tollsAndParking, setTollsAndParking] = useState<number>(15);
  const [passengers, setPassengers] = useState<number>(3);
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true);

  // Calculations
  const effectiveDistance = isRoundTrip ? distance * 2 : distance;
  const fuelNeeded = fuelEfficiency > 0 ? effectiveDistance / fuelEfficiency : 0;
  const totalFuelCost = fuelNeeded * fuelPrice;
  const totalTripCost = totalFuelCost + tollsAndParking;
  const costPerPassenger = passengers > 0 ? totalTripCost / passengers : totalTripCost;

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200/80 mb-3">
          <Car className="w-3.5 h-3.5" />
          <span>Drivers, Logistics & Road Trips • Instant Mileage Cost</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Fuel Cost & Trip Mileage Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Calculate trip fuel expenses, required fuel volume, toll add-ons, and fair passenger splits in km or miles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-slate-800 border-b border-slate-100 pb-3">
            Trip & Vehicle Parameters
          </h3>

          {/* Distance & Unit */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600">Trip One-Way Distance</label>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setDistanceUnit('km')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    distanceUnit === 'km' ? 'bg-cyan-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kilometers (km)
                </button>
                <button
                  type="button"
                  onClick={() => setDistanceUnit('miles')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    distanceUnit === 'miles' ? 'bg-cyan-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Miles
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0"
              value={distance || ''}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-800"
            />
          </div>

          {/* Round trip toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-bold text-slate-700">Calculate as Round Trip (2-way)</span>
            </div>
            <input
              type="checkbox"
              checked={isRoundTrip}
              onChange={(e) => setIsRoundTrip(e.target.checked)}
              className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500 cursor-pointer"
            />
          </div>

          {/* Fuel Efficiency & Fuel Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Vehicle Mileage ({distanceUnit === 'km' ? 'km / Liter' : 'MPG'})
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={fuelEfficiency || ''}
                onChange={(e) => setFuelEfficiency(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Fuel Price ($ / {distanceUnit === 'km' ? 'Liter' : 'Gallon'})
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fuelPrice || ''}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Tolls & Passengers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Tolls & Parking ($)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={tollsAndParking || ''}
                onChange={(e) => setTollsAndParking(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Total Passengers (for split)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={passengers || ''}
                onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-cyan-800/60 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Total Trip Cost Breakdown
              </span>
              <span className="text-[11px] font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-700 px-2 py-0.5 rounded-full">
                {effectiveDistance.toFixed(0)} {distanceUnit} Total
              </span>
            </div>

            <div>
              <span className="text-xs text-cyan-200 block">Total Out-of-Pocket Expense</span>
              <div className="text-4xl font-extrabold text-white mt-1">
                ${totalTripCost.toFixed(2)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-900/40 border border-cyan-700/60 space-y-1">
              <span className="text-xs font-semibold text-cyan-300">Cost Per Person ({passengers} passengers):</span>
              <div className="text-2xl font-bold text-cyan-100">
                ${costPerPassenger.toFixed(2)} <span className="text-xs font-normal text-cyan-300">each</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-cyan-800/60 text-xs">
              <div>
                <span className="text-cyan-300 block">Fuel Needed:</span>
                <span className="text-lg font-bold text-white">
                  {fuelNeeded.toFixed(1)} {distanceUnit === 'km' ? 'Liters' : 'Gallons'}
                </span>
              </div>
              <div>
                <span className="text-cyan-300 block">Pure Fuel Cost:</span>
                <span className="text-lg font-bold text-white">${totalFuelCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Tracking & Offline Ready</span>
            </h4>
            <p className="leading-relaxed">
              Plan your delivery routes, rideshare splits, and long-haul transport budgets without any app signups, GPS tracking, or location telemetry.
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
