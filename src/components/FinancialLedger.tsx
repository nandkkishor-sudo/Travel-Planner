import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, Landmark, HelpCircle, Edit2, Check, RefreshCw, 
  ChevronRight, Sparkles, TrendingDown, Plane, Hotel, Coffee, Eye 
} from 'lucide-react';
import { LedgerItem } from '../types';

interface FinancialLedgerProps {
  ledger: LedgerItem[];
  grandTotal: number;
  onUpdateCost?: (updatedLedger: LedgerItem[]) => void;
}

export default function FinancialLedger({ ledger, grandTotal, onUpdateCost }: FinancialLedgerProps) {
  const [items, setItems] = useState<LedgerItem[]>(ledger);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    setItems(ledger);
  }, [ledger]);

  const startEditing = (idx: number, currentVal: number) => {
    setEditingIndex(idx);
    setEditValue(currentVal.toString());
  };

  const saveCost = (idx: number) => {
    const val = parseFloat(editValue) || 0;
    const updated = [...items];
    updated[idx] = {
      ...updated[idx],
      totalCost: val,
    };
    setItems(updated);
    setEditingIndex(null);
    if (onUpdateCost) {
      onUpdateCost(updated);
    }
  };

  const calculatedTotal = items.reduce((acc, curr) => acc + curr.totalCost, 0);

  const getCategoryIcon = (cat: string) => {
    const name = cat.toLowerCase();
    if (name.includes('transit') || name.includes('flight')) return '✈️';
    if (name.includes('accommodation') || name.includes('hotel') || name.includes('stay')) return '🏨';
    if (name.includes('food') || name.includes('cafe') || name.includes('dining')) return '🍔';
    if (name.includes('sightseeing') || name.includes('adventure') || name.includes('ticket')) return '🎟️';
    if (name.includes('bus')) return '🚌';
    if (name.includes('train')) return '🚂';
    if (name.includes('intra-city') || name.includes('transport') || name.includes('cab')) return '🚖';
    return '🛍️';
  };

  return (
    <div className="bg-[#0D1220]/80 border border-[#1F293D]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-[#1F293D]/60 pb-4">
        <div>
          <h2 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-1 italic font-mono">
            Module 4: Financial Ledger
          </h2>
          <h3 className="text-lg font-light text-white font-sans">Interactive Budget Spreadsheet</h3>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full font-bold">
          LEDGER TABLE
        </span>
      </div>

      {/* Interactive Table Container */}
      <div className="overflow-x-auto border border-[#1F293D]/60 rounded-xl bg-[#070B13]/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#070B13] border-b border-[#1F293D]/60 text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
              <th className="p-4">Expense Category</th>
              <th className="p-4 text-right">Est. Cost Per Day (₹)</th>
              <th className="p-4 text-right">Total Est. Cost (₹)</th>
              <th className="p-4">Money-Saving Strategy / Booking Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F293D]/40 text-xs text-zinc-300">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#111827]/40 transition-colors">
                <td className="p-4 font-semibold text-white flex items-center gap-2">
                  <span className="text-base select-none shrink-0">{getCategoryIcon(item.category)}</span>
                  <span className="font-sans text-xs">{item.category}</span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-zinc-400">
                  {item.costPerDay > 0 ? `₹${item.costPerDay.toLocaleString('en-IN')}` : '—'}
                </td>
                <td className="p-4 text-right font-mono font-bold text-white">
                  {editingIndex === idx ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-zinc-500 font-sans font-normal text-[10px]">₹</span>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 px-1.5 py-0.5 border border-sky-500 rounded focus:outline-none focus:ring-1 focus:ring-sky-500/20 text-right font-mono text-xs bg-[#070B13] text-white"
                        autoFocus
                        id={`input_edit_cost_${idx}`}
                      />
                      <button
                        onClick={() => saveCost(idx)}
                        className="p-1 rounded bg-sky-500 hover:bg-sky-600 text-white cursor-pointer shadow-md"
                        id={`btn_save_cost_${idx}`}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1.5 group">
                      <span>₹{item.totalCost.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => startEditing(idx, item.totalCost)}
                        className="p-0.5 rounded text-zinc-500 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Edit Cost"
                        id={`btn_edit_cost_${idx}`}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-4 text-zinc-400 font-sans leading-relaxed text-xs">
                  {item.strategy}
                </td>
              </tr>
            ))}
            {/* Grand Total Row */}
            <tr className="bg-[#070B13] font-bold border-t border-[#1F293D]/60 text-white">
              <td className="p-4 font-sans text-xs uppercase tracking-wider text-zinc-400" colSpan={2}>
                Grand Total Estimated Trip Cost
              </td>
              <td className="p-4 text-right font-mono text-sm text-sky-450 font-extrabold whitespace-nowrap">
                ₹{calculatedTotal.toLocaleString('en-IN')}
              </td>
              <td className="p-4 text-zinc-500 font-mono text-[9px] tracking-wide uppercase italic">
                *Verified calculation
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Platform Strategy Callout */}
      <div className="bg-[#070B13]/60 border border-[#1F293D]/60 p-4 rounded-xl flex items-start gap-3">
        <TrendingDown className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 leading-relaxed font-sans">
          <span className="text-[9px] uppercase font-mono text-sky-400 block mb-0.5">Premium Budgeting Protocol:</span>
          Expenses are optimized using real pricing bands from popular networks like Agoda, Skyscanner, and Klook. Hover over any total item cost and click the edit pencil icon to input your confirmed local quotes; the ledger recalculates instantly.
        </div>
      </div>
    </div>
  );
}
