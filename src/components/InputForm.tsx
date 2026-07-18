import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, MapPin, Calendar, Sparkles, DollarSign, Users, 
  ChevronRight, ArrowRight, Shield, RefreshCw 
} from 'lucide-react';
import { TravelParams } from '../types';

interface InputFormProps {
  onSubmit: (params: TravelParams) => void;
  isLoading: boolean;
}

const VIBE_PRESETS = [
  { id: 'heritage', label: 'Heritage & Architecture', icon: '🏛️', desc: 'Ancient monuments, palaces, and historical wonders' },
  { id: 'adventure', label: 'Thrill-seeking adventure', icon: '⛰️', desc: 'Trekking, water sports, and adrenaline-pumping exploits' },
  { id: 'luxury', label: 'Slow luxury', icon: '🥂', desc: 'Indulgent resorts, spa retreats, and fine dining' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🐅', desc: 'National parks, dense forests, and pristine scenic views' },
  { id: 'culinary', label: 'Culinary Exploration', icon: '🍛', desc: 'Local food walks, spice markets, and gourmet experiences' },
  { id: 'beach', label: 'Coastal Escape', icon: '🏖️', desc: 'Unwinding on sandy shores with sunset cruises' },
];

const COMPANION_PRESETS = [
  { id: 'Solo', label: 'Solo Traveler', icon: '🎒' },
  { id: 'Friends', label: 'With Friends', icon: '🍻' },
  { id: 'Couple', label: 'As a Couple', icon: '👩‍❤️‍👨' },
  { id: 'Family', label: 'With Family', icon: '🏡' },
];

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [origin, setOrigin] = useState('Mumbai, India');
  const [customVibe, setCustomVibe] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('Heritage & Architecture');
  const [duration, setDuration] = useState(5);
  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Mid-range' | 'Luxury'>('Mid-range');
  const [companions, setCompanions] = useState('Solo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVibe = selectedVibe === 'custom' ? customVibe : selectedVibe;
    onSubmit({
      origin,
      vibe: finalVibe || 'General Exploration',
      duration,
      budgetTier,
      companions,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#0D1220]/80 border border-[#1F293D]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl">
      {/* Origin & Duration Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-2 flex items-center gap-2 italic font-mono">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            Home Location / Origin City
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full px-4 py-3 bg-[#070B13] border border-[#1F293D]/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-white transition-all font-sans text-sm placeholder-zinc-600"
              id="input_origin"
            />
            <div className="absolute right-3 top-3 flex gap-1.5">
              {['Mumbai', 'Delhi', 'Bengaluru'].map((city) => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setOrigin(`${city}, India`)}
                  className="text-[9px] font-mono uppercase bg-[#111827] hover:bg-[#1F293D] text-zinc-300 px-2 py-0.5 rounded transition-all cursor-pointer border border-[#1F293D]/40"
                  id={`btn_origin_${city.toLowerCase()}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1.5">Used to calculate exact visa constraints, transport, and flights.</p>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-2 flex items-center gap-2 italic font-mono">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            Trip Duration
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="14"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1 accent-sky-400 cursor-pointer h-1 bg-[#111827] rounded-lg appearance-none"
              id="slider_duration"
            />
            <span className="w-16 text-center font-mono text-xs bg-[#070B13] border border-[#1F293D]/80 rounded-lg px-2.5 py-1.5 font-bold text-white">
              {duration} {duration === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1.5">Exhaustive itineraries will be planned for all {duration} days.</p>
        </div>
      </div>

      {/* Vibe Presets Selector */}
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-3 flex items-center gap-2 italic font-mono">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          Choose Your Travel Vibe
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {VIBE_PRESETS.map((v) => {
            const isSelected = selectedVibe === v.label;
            return (
              <button
                type="button"
                key={v.id}
                onClick={() => {
                  setSelectedVibe(v.label);
                }}
                className={`flex items-start text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-sky-500/10 border-sky-400 shadow-sm text-white' 
                    : 'bg-[#070B13]/40 border-[#1F293D]/50 hover:border-[#1F293D] text-zinc-300'
                }`}
                id={`vibe_preset_${v.id}`}
              >
                <span className="text-xl mr-3 select-none">{v.icon}</span>
                <div className="space-y-0.5">
                  <div className={`text-xs font-semibold ${isSelected ? 'text-sky-300' : 'text-zinc-300'}`}>{v.label}</div>
                  <div className="text-[10px] text-zinc-500 line-clamp-2 leading-tight">{v.desc}</div>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSelectedVibe('custom')}
            className={`flex items-start text-left p-4 rounded-xl border transition-all cursor-pointer ${
              selectedVibe === 'custom' 
                ? 'bg-sky-500/10 border-sky-400 shadow-sm text-white' 
                : 'bg-[#070B13]/40 border-[#1F293D]/50 hover:border-[#1F293D] text-zinc-300'
            }`}
            id="vibe_preset_custom"
          >
            <span className="text-xl mr-3 select-none">✍️</span>
            <div className="space-y-0.5 w-full">
              <div className={`text-xs font-semibold ${selectedVibe === 'custom' ? 'text-sky-300' : 'text-zinc-300'}`}>Custom Vibe</div>
              <div className="text-[10px] text-zinc-500 leading-tight">Describe your own tailored vibe</div>
            </div>
          </button>
        </div>

        {selectedVibe === 'custom' && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <input
              type="text"
              required
              value={customVibe}
              onChange={(e) => setCustomVibe(e.target.value)}
              placeholder="e.g. Vintage vinyl hunting, forest bathing and quiet reading cafes"
              className="w-full px-4 py-3 bg-[#070B13] border border-[#1F293D]/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-white text-sm placeholder-zinc-600 font-sans"
              id="input_custom_vibe"
            />
          </motion.div>
        )}
      </div>

      {/* Budget Tier & Companions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Selector */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-3 flex items-center gap-2 italic font-mono">
            <DollarSign className="w-3.5 h-3.5 text-sky-400" />
            Total Budget Tier
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[#070B13] p-1 rounded-xl border border-[#1F293D]/85">
            {(['Budget', 'Mid-range', 'Luxury'] as const).map((tier) => {
              const isActive = budgetTier === tier;
              return (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setBudgetTier(tier)}
                  className={`py-2 px-1.5 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                    isActive
                      ? 'bg-[#111827] text-white shadow-sm border border-[#1F293D]'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  id={`btn_budget_${tier.toLowerCase().replace('-', '')}`}
                >
                  <div className={`font-bold ${isActive ? 'text-sky-400' : 'text-zinc-450'}`}>
                    {tier === 'Budget' && '₹'}
                    {tier === 'Mid-range' && '₹₹'}
                    {tier === 'Luxury' && '₹₹₹'}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-mono font-bold">{tier}</div>
                  <div className="text-[9px] text-zinc-500 font-mono mt-0.5 whitespace-nowrap">
                    {tier === 'Budget' && '< ₹3,000 /day'}
                    {tier === 'Mid-range' && '₹3k - 8k /day'}
                    {tier === 'Luxury' && '> ₹8,000 /day'}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 font-mono">
            {budgetTier === 'Budget' && 'Economy stays, public transport, and free sights. (Avg. < ₹3,000 / day)'}
            {budgetTier === 'Mid-range' && 'Boutique hotels, guided excursions, and highly-rated dining. (Avg. ₹3,000 - ₹8,000 / day)'}
            {budgetTier === 'Luxury' && '5-star resorts, private transfers, and fine-dining experiences. (Avg. > ₹8,000 / day)'}
          </p>
        </div>

        {/* Companions Selector */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-3 flex items-center gap-2 italic font-mono">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            Travel Companions
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COMPANION_PRESETS.map((c) => {
              const isActive = companions === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCompanions(c.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/10 border-sky-400 text-white shadow-sm'
                      : 'bg-[#070B13]/40 border-[#1F293D]/50 text-zinc-400 hover:border-zinc-700'
                  }`}
                  id={`btn_companion_${c.id.toLowerCase()}`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-500 mt-2 font-mono">We will adjust activities and recommendations to match your group dynamic.</p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#1F293D]/60 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-zinc-500" />
          <span>REAL-TIME CURATION • ZERO HALLUCINATIONS</span>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-500/10 text-xs uppercase tracking-wider"
          id="btn_submit_generate"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Building Travel Blueprint...</span>
            </>
          ) : (
            <>
              <span>Generate Premium Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
