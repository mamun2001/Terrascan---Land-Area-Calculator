/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Ruler, 
  Maximize2, 
  Copy, 
  Check, 
  Map as MapIcon, 
  RefreshCw,
  Info 
} from 'lucide-react';

type InputUnit = 'Meters' | 'Feet' | 'Yards' | 'Inches' | 'Feet & Inches';

interface Results {
  sqMeters: number;
  sqFeet: number;
  acres: number;
  decimals: number;
  hectares: number;
  kathas: number;
  bighas: number;
}

const UNIT_LABELS: Record<InputUnit, string> = {
  Meters: 'm',
  Feet: 'ft',
  Yards: 'yd',
  Inches: 'in',
  'Feet & Inches': 'ft/in'
};

export default function App() {
  const [length, setLength] = useState<string>('');
  const [lengthInches, setLengthInches] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [widthInches, setWidthInches] = useState<string>('');
  const [unit, setUnit] = useState<InputUnit>('Meters');
  const [results, setResults] = useState<Results | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const calculateArea = useCallback(() => {
    const lFeet = parseFloat(length) || 0;
    const lInches = parseFloat(lengthInches) || 0;
    const wFeet = parseFloat(width) || 0;
    const wInches = parseFloat(widthInches) || 0;

    // Validation
    if (unit !== 'Feet & Inches') {
        if (isNaN(parseFloat(length)) || isNaN(parseFloat(width))) return;
    } else {
        if (!length && !lengthInches && !width && !widthInches) return;
    }

    let lInMeters = 0;
    let wInMeters = 0;

    switch (unit) {
      case 'Meters':
        lInMeters = parseFloat(length);
        wInMeters = parseFloat(width);
        break;
      case 'Feet':
        lInMeters = parseFloat(length) * 0.3048;
        wInMeters = parseFloat(width) * 0.3048;
        break;
      case 'Yards':
        lInMeters = parseFloat(length) * 0.9144;
        wInMeters = parseFloat(width) * 0.9144;
        break;
      case 'Inches':
        lInMeters = parseFloat(length) * 0.0254;
        wInMeters = parseFloat(width) * 0.0254;
        break;
      case 'Feet & Inches':
        lInMeters = (lFeet + lInches / 12) * 0.3048;
        wInMeters = (wFeet + wInches / 12) * 0.3048;
        break;
    }

    const sqMeters = lInMeters * wInMeters;
    const sqFeet = sqMeters / 0.09290304;

    setResults({
      sqMeters,
      sqFeet,
      acres: sqMeters / 4046.856,
      hectares: sqMeters / 10000,
      decimals: sqMeters / 40.46856, 
      kathas: sqFeet / 720,
      bighas: sqFeet / 14400,
    });
  }, [length, lengthInches, width, widthInches, unit]);

  const copyValue = async (val: number, label: string) => {
    try {
      await navigator.clipboard.writeText(val.toString());
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const reset = () => {
    setLength('');
    setLengthInches('');
    setWidth('');
    setWidthInches('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 h-full">
        {/* Navigation */}
        <nav className="flex flex-col sm:flex-row justify-between items-center px-2 gap-4">
          <div className="text-2xl font-bold text-indigo-600 tracking-tighter flex items-center gap-2">
            <MapIcon className="w-6 h-6" />
            <span>Terrascan<span className="text-slate-400 font-light">.io</span></span>
          </div>
          <div className="text-[13px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-4">
            <span>v2.4 Professional Suite</span>
            <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
            <span className="text-indigo-500">Live Precision</span>
          </div>
        </nav>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          
          {/* Input Side Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Input Parameters</h2>
              </div>

              <div className="space-y-6">
                {/* Length Input */}
                <div className="space-y-2">
                  <label htmlFor="length" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Length</label>
                  {unit === 'Feet & Inches' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Feet"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-base font-medium outline-none text-slate-900"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">FT</div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Inches"
                          value={lengthInches}
                          onChange={(e) => setLengthInches(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-base font-medium outline-none text-slate-900"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">IN</div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id="length"
                        type="number"
                        placeholder="0.00"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-base font-medium outline-none text-slate-900"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {UNIT_LABELS[unit]}
                      </div>
                    </div>
                  )}
                </div>

                {/* Width Input */}
                <div className="space-y-2">
                  <label htmlFor="width" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Width</label>
                  {unit === 'Feet & Inches' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Feet"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-base font-medium outline-none text-slate-900"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">FT</div>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Inches"
                          value={widthInches}
                          onChange={(e) => setWidthInches(e.target.value)}
                          className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-base font-medium outline-none text-slate-900"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">IN</div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id="width"
                        type="number"
                        placeholder="0.00"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-base font-medium outline-none text-slate-900"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {UNIT_LABELS[unit]}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Input Unit</label>
                  <select 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as InputUnit)}
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-base font-medium outline-none text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2364748b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat"
                  >
                    {(['Meters', 'Feet', 'Yards', 'Inches', 'Feet & Inches'] as InputUnit[]).map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3 pt-6 mt-auto">
                  <button
                    onClick={calculateArea}
                    disabled={(!length && !lengthInches) || (!width && !widthInches)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                  >
                    Calculate Area
                  </button>
                  <button
                    onClick={reset}
                    className="w-full py-3 text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset Form
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Side Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-800">Calculated Results</h2>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full tracking-tighter shadow-sm">Live</span>
                </div>
                {!results && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Info className="w-4 h-4" />
                    <span className="text-[11px] font-medium italic">Pending calculation...</span>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!results ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[400px] text-center"
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Ruler className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 text-sm max-w-[240px] leading-relaxed">
                      Enter length and width dimensions to see the processed land area metrics.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-5"
                  >
                    <div className="col-span-2">
                      <ResultTile 
                        label="Square Meters" 
                        value={results.sqMeters} 
                        unit="m²" 
                        isPrimary 
                        onCopy={() => copyValue(results.sqMeters, 'sqm')}
                        isCopied={copied === 'sqm'}
                      />
                    </div>
                    <ResultTile 
                      label="Square Feet" 
                      value={results.sqFeet} 
                      unit="ft²" 
                      onCopy={() => copyValue(results.sqFeet, 'sqf')}
                      isCopied={copied === 'sqf'}
                    />
                    <ResultTile 
                      label="Decimals" 
                      value={results.decimals} 
                      unit="dec" 
                      onCopy={() => copyValue(results.decimals, 'dec')}
                      isCopied={copied === 'dec'}
                    />
                    <ResultTile 
                      label="Acres" 
                      value={results.acres} 
                      unit="ac" 
                      precision={6}
                      onCopy={() => copyValue(results.acres, 'acres')}
                      isCopied={copied === 'acres'}
                    />
                    <ResultTile 
                      label="Hectares" 
                      value={results.hectares} 
                      unit="ha" 
                      precision={6}
                      onCopy={() => copyValue(results.hectares, 'hectares')}
                      isCopied={copied === 'hectares'}
                    />
                    <ResultTile 
                      label="Kathas" 
                      value={results.kathas} 
                      unit="katha" 
                      onCopy={() => copyValue(results.kathas, 'kathas')}
                      isCopied={copied === 'kathas'}
                    />
                    <ResultTile 
                      label="Bighas" 
                      value={results.bighas} 
                      unit="bigha" 
                      onCopy={() => copyValue(results.bighas, 'bighas')}
                      isCopied={copied === 'bighas'}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[11px] leading-relaxed text-slate-400 font-medium text-center">
                Precision engineering for architectural and agricultural measurement calculations. 
                <br className="hidden sm:block" />
                Standard conversion factors: 1 Decimal = 1/100 Acre, 1 Katha = 720 sq ft, 1 Bigha = 20 Kathas.
              </p>
            </div>
          </section>

        </main>

        <footer className="text-center mt-auto md:mt-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300">
            Powered by Terrascan Precision Engine
          </p>
        </footer>
      </div>
    </div>
  );
}

function ResultTile({ 
  label, 
  value, 
  unit, 
  isPrimary = false, 
  precision = 4,
  onCopy,
  isCopied
}: { 
  label: string; 
  value: number; 
  unit: string; 
  isPrimary?: boolean;
  precision?: number;
  onCopy: () => void;
  isCopied: boolean;
}) {
  return (
    <div className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
      isPrimary 
        ? 'bg-[#eef2ff] border-[#c7d2fe] p-8' 
        : 'bg-[#f8fafc] border-slate-200 hover:border-indigo-200 hover:bg-white shadow-sm hover:shadow-md'
    }`}>
      <button 
        onClick={onCopy}
        className="absolute top-4 right-4 bg-white border border-slate-200 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:border-indigo-600 text-slate-400 hover:text-indigo-600"
        title="Copy value"
      >
        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>

      <span className={`block text-[10px] font-bold uppercase tracking-[0.1em] mb-2 ${isPrimary ? 'text-indigo-600' : 'text-slate-500'}`}>
        {label}
      </span>
      <div className="flex items-baseline gap-2 overflow-hidden">
        <span className={`font-bold tracking-tighter truncate ${isPrimary ? 'text-4xl text-indigo-600' : 'text-2xl text-slate-900'}`}>
          {value.toLocaleString(undefined, { maximumFractionDigits: precision })}
        </span>
        <span className={`text-[12px] font-semibold text-slate-400 shrink-0 ${isPrimary ? 'text-indigo-400' : ''}`}>
          ({unit})
        </span>
      </div>
    </div>
  );
}
