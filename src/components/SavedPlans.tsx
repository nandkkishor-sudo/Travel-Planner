import React from 'react';
import { History, Calendar, Compass, Trash2, ArrowRight, MapPin } from 'lucide-react';
import { SavedPlan } from '../types';

interface SavedPlansProps {
  plans: SavedPlan[];
  onSelectPlan: (plan: SavedPlan) => void;
  onDeletePlan: (id: string) => void;
  onClearAll: () => void;
  currentPlanId?: string;
}

export default function SavedPlans({ plans, onSelectPlan, onDeletePlan, onClearAll, currentPlanId }: SavedPlansProps) {
  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0D1220]/80 border border-[#1F293D]/60 backdrop-blur-md rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#1F293D]/60 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs uppercase tracking-wider text-white font-bold font-mono">YOUR PLANNING VAULT</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-[10px] text-zinc-500 hover:text-rose-400 transition-colors font-mono uppercase font-bold cursor-pointer"
          id="btn_clear_all_history"
        >
          Clear Vault
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
        {plans.map((p) => {
          const isActive = currentPlanId === p.id;
          const destination = p.blueprint.selectedOptionName;
          const originCity = p.params.origin.split(',')[0];

          return (
            <div 
              key={p.id}
              className={`group flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                isActive 
                  ? 'bg-[#070B13] border-sky-400 shadow-md border-l-4' 
                  : 'bg-[#070B13]/40 border-[#1F293D]/50 hover:bg-[#070B13] hover:border-[#1F293D]'
              }`}
            >
              <button
                onClick={() => onSelectPlan(p)}
                className="flex-1 text-left space-y-1 cursor-pointer mr-2"
                id={`btn_load_vault_plan_${p.id}`}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-white text-xs font-sans">{destination}</span>
                  <span className="text-[9px] bg-[#070B13] border border-[#1F293D]/60 text-sky-400 px-1.5 py-0.5 rounded-md font-mono">
                    {p.params.duration}D
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-sans">
                  <MapPin className="w-2.5 h-2.5 text-zinc-650" />
                  <span>From {originCity} • {p.params.vibe}</span>
                </div>
              </button>
              <button
                onClick={() => onDeletePlan(p.id)}
                className="text-zinc-600 hover:text-sky-400 p-1.5 rounded transition-colors cursor-pointer shrink-0"
                title="Delete from vault"
                id={`btn_delete_vault_plan_${p.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
