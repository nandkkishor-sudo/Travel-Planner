import React from 'react';
import { motion } from 'motion/react';
import { Compass, CheckCircle2, Globe, Flag, ChevronRight, HelpCircle, Loader2 } from 'lucide-react';
import { DestinationOption } from '../types';

interface DestinationMatrixProps {
  domesticOptions: DestinationOption[];
  internationalOptions: DestinationOption[];
  selectedOptionName: string;
  onSelectOption: (optionName: string) => void;
  isDetailsLoading?: boolean;
}

export default function DestinationMatrix({
  domesticOptions = [],
  internationalOptions = [],
  selectedOptionName,
  onSelectOption,
  isDetailsLoading = false,
}: DestinationMatrixProps) {
  return (
    <div className="bg-[#0D1220]/80 border border-[#1F293D]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-8">
      <div className="flex items-center justify-between border-b border-[#1F293D]/60 pb-4">
        <div>
          <h2 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-1 italic font-mono">
            Module 1: Destination Matrix
          </h2>
          <h3 className="text-lg font-light text-white font-sans">Six-Track Choice Pairings</h3>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full font-bold">
          6-Track Curated
        </span>
      </div>

      <div className="space-y-6">
        {/* Domestic Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">🇮🇳 Domestic Tracks (3)</span>
            <div className="h-px bg-[#1F293D]/60 flex-grow" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {domesticOptions.map((option, idx) => {
              const isSelected = option.name === selectedOptionName;
              return (
                <div
                  key={`domestic-${idx}`}
                  onClick={() => !isSelected && !isDetailsLoading && onSelectOption(option.name)}
                  className={`relative p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/20 shadow-lg border-l-4'
                      : 'border-[#1F293D]/55 opacity-60 hover:opacity-100 hover:border-[#1F293D] bg-[#070B13]/30 cursor-pointer hover:bg-[#070B13]/60'
                  }`}
                  id={`dest_domestic_${idx}`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-sky-500 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm font-mono">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      Active Plan
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center text-sm shadow-sm border border-[#1F293D]/30">
                        🇮🇳
                      </div>
                      <h4 className="text-xs font-mono tracking-wider uppercase text-zinc-500">Track {idx + 1}</h4>
                    </div>

                    <h5 className="text-sm font-bold text-white tracking-tight">{option.name}</h5>

                    <div>
                      <span className="text-[9px] font-mono uppercase text-sky-400/80 block mb-1">Why It Fits</span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{option.fits}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F293D]/40 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-zinc-500 block">Best Window</span>
                      <p className="text-[11px] text-zinc-350 font-medium font-sans leading-tight">{option.window}</p>
                    </div>
                    
                    {!isSelected && (
                      <span className="text-[9px] font-mono text-sky-400 hover:underline flex items-center gap-0.5 shrink-0 ml-2">
                        Load Details <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* International Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">✈️ International Tracks (3)</span>
            <div className="h-px bg-[#1F293D]/60 flex-grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {internationalOptions.map((option, idx) => {
              const isSelected = option.name === selectedOptionName;
              return (
                <div
                  key={`intl-${idx}`}
                  onClick={() => !isSelected && !isDetailsLoading && onSelectOption(option.name)}
                  className={`relative p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between h-full ${
                    isSelected
                      ? 'border-sky-400 bg-sky-950/20 shadow-lg border-l-4'
                      : 'border-[#1F293D]/55 opacity-60 hover:opacity-100 hover:border-[#1F293D] bg-[#070B13]/30 cursor-pointer hover:bg-[#070B13]/60'
                  }`}
                  id={`dest_intl_${idx}`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-sky-500 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-sm font-mono">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      Active Plan
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center text-sm shadow-sm border border-[#1F293D]/30">
                        ✈️
                      </div>
                      <h4 className="text-xs font-mono tracking-wider uppercase text-zinc-500">Track {idx + 4}</h4>
                    </div>

                    <h5 className="text-sm font-bold text-white tracking-tight">{option.name}</h5>

                    <div>
                      <span className="text-[9px] font-mono uppercase text-sky-400/80 block mb-1">Why It Fits</span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{option.fits}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1F293D]/40 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-zinc-500 block">Best Window</span>
                      <p className="text-[11px] text-zinc-350 font-medium font-sans leading-tight">{option.window}</p>
                    </div>

                    {!isSelected && (
                      <span className="text-[9px] font-mono text-sky-400 hover:underline flex items-center gap-0.5 shrink-0 ml-2">
                        Load Details <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#070B13] border border-[#1F293D]/60 p-4 rounded-xl flex items-start gap-3">
        <HelpCircle className="w-4.5 h-4.5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-400 leading-relaxed font-sans">
          <span className="font-bold text-white uppercase tracking-wider text-[9px] block mb-1 font-mono">Route & Optimization Engine Selection</span>
          Based on your criteria, our system suggested 6 highly matching tracks (3 Domestic & 3 International).
          The active travel blueprint is built for <strong className="text-white font-semibold">{selectedOptionName}</strong>. 
          <span className="text-sky-400 block mt-1 font-mono text-[10px]">
            💡 Click on any card in the matrix above to instantly switch the selected track and fetch real-time full details for that option!
          </span>
        </div>
      </div>
    </div>
  );
}
