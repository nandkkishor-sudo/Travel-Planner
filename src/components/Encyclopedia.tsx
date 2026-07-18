import React, { useState } from 'react';
import { 
  BookOpen, Fingerprint, MessageSquareCode, Landmark, 
  ShieldAlert, PhoneCall, Check, Copy, HelpCircle, Eye, AlertTriangle 
} from 'lucide-react';
import { EncyclopediaData } from '../types';

interface EncyclopediaProps {
  data: EncyclopediaData;
}

export default function Encyclopedia({ data }: EncyclopediaProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-[#0D1220]/80 border border-[#1F293D]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-[#1F293D]/60 pb-4">
        <div>
          <h2 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-1 italic font-mono">
            Module 2: Destination Encyclopedia
          </h2>
          <h3 className="text-lg font-light text-white font-sans">Essential Intelligence for {data.destinationName}</h3>
        </div>
        <span className="text-[9px] font-mono uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full font-bold">
          VERIFIED SAFE
        </span>
      </div>

      {/* Dynamic Highlight Cards (Famous For & Best Time to Visit) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#070B13]/60 border border-[#1F293D]/50 p-5 rounded-xl">
        <div className="space-y-1">
          <span className="text-[9px] font-mono uppercase bg-[#111827] text-sky-400 border border-[#1F293D]/60 px-2 py-0.5 rounded font-bold tracking-wide">
            🌟 Famous For
          </span>
          <p className="text-xs text-zinc-100 font-sans leading-relaxed pt-1.5">
            {data.famousFor || "Rich cultural heritage, historic landmarks, beautiful environments, and incredible local food scenery."}
          </p>
        </div>
        <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#1F293D]/40 pt-4 md:pt-0 md:pl-6">
          <span className="text-[9px] font-mono uppercase bg-[#111827] text-sky-400 border border-[#1F293D]/60 px-2 py-0.5 rounded font-bold tracking-wide">
            📅 Best Time To Visit
          </span>
          <p className="text-xs text-zinc-100 font-sans leading-relaxed pt-1.5">
            {data.bestTimeToVisit || "Pleasant daytime seasons with optimal weather and lively local events."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visa & Entry requirements + Emergency numbers */}
        <div className="space-y-6">
          {/* Visa Protocols */}
          <div className="bg-[#070B13]/60 border border-[#1F293D]/50 p-5 rounded-xl space-y-3 border-l-4 border-l-sky-400">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Visa & Entry Protocols</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{data.visa}</p>
          </div>

          {/* Emergency Lifelines */}
          <div className="bg-[#070B13]/60 border border-[#1F293D]/50 p-5 rounded-xl space-y-3 border-l-4 border-l-sky-400">
            <div className="flex items-center gap-2 text-sky-400">
              <PhoneCall className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Emergency Lifelines</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#111827]/80 p-2.5 rounded border border-[#1F293D]/55 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Police</span>
                <span className="font-mono font-bold text-sky-400 text-sm block mt-0.5">{data.emergency.police}</span>
              </div>
              <div className="bg-[#111827]/80 p-2.5 rounded border border-[#1F293D]/55 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Medical</span>
                <span className="font-mono font-bold text-sky-400 text-sm block mt-0.5">{data.emergency.medical}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Local language cheat sheet & Local Transit */}
        <div className="space-y-6">
          {/* Language Cheat Sheet */}
          <div className="bg-[#070B13]/60 border border-[#1F293D]/50 p-5 rounded-xl space-y-3 border-l-4 border-l-sky-400">
            <div className="flex items-center gap-2">
              <MessageSquareCode className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Language Cheat Sheet</h4>
            </div>
            <div className="space-y-2">
              {data.phrases.map((phrase, idx) => (
                <div key={idx} className="bg-[#111827]/80 p-3 rounded-lg border border-[#1F293D]/40 flex items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">{phrase.phrase}</span>
                    <span className="text-[10px] font-mono text-zinc-500 block">Pronounced: {phrase.pronunciation}</span>
                    <span className="text-[11px] text-zinc-400 italic block">Means: &ldquo;{phrase.translation}&rdquo;</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(phrase.phrase, idx)}
                    className="p-1.5 rounded hover:bg-[#1F293D] text-zinc-400 hover:text-sky-400 transition-all cursor-pointer shrink-0"
                    title="Copy phrase"
                    id={`btn_copy_phrase_${idx}`}
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transit & Cultural codes */}
        <div className="space-y-6">
          {/* Transit Network */}
          <div className="bg-[#070B13]/60 border border-[#1F293D]/50 p-5 rounded-xl space-y-3 border-l-4 border-l-sky-400">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Transit Network</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{data.transit}</p>
          </div>

          {/* Cultural Codes & Safety */}
          <div className="bg-[#070B13]/60 border border-[#1F293D]/50 p-5 rounded-xl space-y-3 border-l-4 border-l-sky-400">
            <div className="flex items-center gap-2 text-sky-400">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Cultural Codes & Safety</h4>
            </div>
            <ul className="space-y-2">
              {data.culturalCodes.map((code, idx) => (
                <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                  <span className="text-sky-400 shrink-0 select-none mt-0.5">•</span>
                  <span className="font-sans leading-relaxed text-zinc-300">{code}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
