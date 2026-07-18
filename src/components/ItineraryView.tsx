import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Sunrise, Sun, Sunset, Moon, Map, MapPin, 
  Utensils, Coffee, Beer, Navigation, ChevronDown, ChevronUp, Eye, EyeOff 
} from 'lucide-react';
import { DayPlan } from '../types';

interface ItineraryViewProps {
  itinerary: DayPlan[];
}

export default function ItineraryView({ itinerary }: ItineraryViewProps) {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  return (
    <div className="bg-[#0D1220]/80 border border-[#1F293D]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative">
      <div className="absolute top-4 right-5 text-[10px] font-mono text-zinc-600 hidden md:block">HYPER-DETAILED ITINERARY</div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1F293D]/60 pb-4 gap-4">
        <div>
          <h2 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-1 italic font-mono">
            Module 3: Day-Wise Itinerary
          </h2>
          <h3 className="text-lg font-light text-white font-sans">Sequential Route Optimization</h3>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-[#070B13] p-1 rounded-xl shrink-0 self-start sm:self-auto border border-[#1F293D]/75">
          <button
            onClick={() => setViewMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-[#111827] text-white shadow-sm font-bold border border-[#1F293D]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            id="btn_itinerary_single"
          >
            Day-by-Day Tab
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === 'all'
                ? 'bg-[#111827] text-white shadow-sm font-bold border border-[#1F293D]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            id="btn_itinerary_all"
          >
            Show All Days
          </button>
        </div>
      </div>

      {/* Day Selector Buttons (for single day view) */}
      {viewMode === 'single' && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {itinerary.map((day) => (
            <button
              key={day.dayNum}
              onClick={() => setActiveDay(day.dayNum)}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeDay === day.dayNum
                  ? 'bg-sky-500 border-sky-400 text-white shadow-sm font-mono'
                  : 'bg-[#070B13]/40 border-[#1F293D]/60 text-zinc-450 hover:border-zinc-500'
              }`}
              id={`btn_day_tab_${day.dayNum}`}
            >
              Day {day.dayNum}
            </button>
          ))}
        </div>
      )}

      {/* Render Itinerary days */}
      <div className="space-y-8">
        {itinerary
          .filter((day) => viewMode === 'all' || day.dayNum === activeDay)
          .map((day) => (
            <motion.div
              key={day.dayNum}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-[#1F293D]/60 rounded-xl p-5 md:p-6 space-y-6 bg-[#070B13]/60 border-l-4 border-l-sky-400"
              id={`day_container_${day.dayNum}`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-[#1F293D]/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-mono font-bold shadow-md shadow-sky-500/10">
                    D{day.dayNum}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Day Schedule</span>
                    <h3 className="text-sm font-semibold text-white font-sans">{day.theme}</h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-sky-400/80 font-medium">100% Geoclustered</span>
              </div>

              {/* Time Slots Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Morning Slot */}
                <div className="bg-[#111827]/30 border border-[#1F293D]/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1F293D]/30 pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                      <Sunrise className="w-4 h-4 text-sky-400" />
                      Morning (08:00 - 12:00)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans min-h-[40px]">{day.morningActivity}</p>
                  <div className="bg-[#111827]/80 border border-[#1F293D]/40 rounded-lg p-2.5 flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-mono text-sky-400 block">Breakfast Spot</span>
                      <span className="text-xs font-bold text-white block leading-snug font-sans">{day.breakfastSpot}</span>
                    </div>
                  </div>
                </div>

                {/* Afternoon Slot */}
                <div className="bg-[#111827]/30 border border-[#1F293D]/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1F293D]/30 pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                      <Sun className="w-4 h-4 text-sky-400" />
                      Afternoon (12:00 - 16:00)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans min-h-[40px]">{day.afternoonActivity}</p>
                  <div className="bg-[#111827]/80 border border-[#1F293D]/40 rounded-lg p-2.5 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-mono text-sky-400 block">Lunch Spot</span>
                      <span className="text-xs font-bold text-white block leading-snug font-sans">{day.lunchSpot}</span>
                    </div>
                  </div>
                </div>

                {/* Evening Slot */}
                <div className="bg-[#111827]/30 border border-[#1F293D]/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1F293D]/30 pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                      <Sunset className="w-4 h-4 text-sky-400" />
                      Evening (16:00 - 20:00)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans min-h-[40px]">{day.eveningActivity}</p>
                  <div className="bg-[#111827]/80 border border-[#1F293D]/40 rounded-lg p-2.5 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-mono text-sky-400 block">Dinner Spot</span>
                      <span className="text-xs font-bold text-white block leading-snug font-sans">{day.dinnerSpot}</span>
                    </div>
                  </div>
                </div>

                {/* Night Slot */}
                <div className="bg-[#111827]/30 border border-[#1F293D]/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1F293D]/30 pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                      <Moon className="w-4 h-4 text-sky-400" />
                      Night (20:00 - 00:00)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans min-h-[40px]">{day.nightActivity}</p>
                  <div className="bg-[#111827]/80 border border-[#1F293D]/40 rounded-lg p-2.5 flex items-center gap-2">
                    <Beer className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase font-mono text-sky-400 block">Late-Night Spot</span>
                      <span className="text-xs font-bold text-white block leading-snug font-sans">{day.lateNightSpot}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Optimization Compass Callout */}
              <div className="bg-[#111827]/80 border border-[#1F293D]/50 rounded-xl p-4 flex items-start gap-3">
                <Navigation className="w-4 h-4 text-sky-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs text-zinc-300 leading-relaxed font-sans">
                  <span className="text-[9px] uppercase font-mono text-sky-400 block mb-0.5">Route Optimization:</span>
                  {day.routeOptimization}
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
