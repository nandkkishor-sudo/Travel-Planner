import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, CheckSquare, Square, Plus, Trash2, 
  RefreshCw, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { PackingRegistry } from '../types';

interface PackingChecklistProps {
  packing: PackingRegistry;
}

interface ChecklistItem {
  id: string;
  category: keyof PackingRegistry;
  text: string;
  checked: boolean;
}

export default function PackingChecklist({ packing }: PackingChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [customText, setCustomText] = useState({
    documents: '',
    apparel: '',
    hardware: '',
    gear: '',
  });

  // Hydrate checklist items from prop on mount or prop update
  useEffect(() => {
    const list: ChecklistItem[] = [];
    
    // Add documents
    packing.documents.forEach((text, i) => {
      list.push({ id: `docs-${i}`, category: 'documents', text, checked: false });
    });
    // Add apparel
    packing.apparel.forEach((text, i) => {
      list.push({ id: `apparel-${i}`, category: 'apparel', text, checked: false });
    });
    // Add hardware
    packing.hardware.forEach((text, i) => {
      list.push({ id: `hardware-${i}`, category: 'hardware', text, checked: false });
    });
    // Add gear
    packing.gear.forEach((text, i) => {
      list.push({ id: `gear-${i}`, category: 'gear', text, checked: false });
    });

    setItems(list);
  }, [packing]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addCustomItem = (category: keyof PackingRegistry, e: React.FormEvent) => {
    e.preventDefault();
    const text = customText[category].trim();
    if (!text) return;

    const newItem: ChecklistItem = {
      id: `custom-${category}-${Date.now()}`,
      category,
      text,
      checked: false
    };

    setItems([...items, newItem]);
    setCustomText({
      ...customText,
      [category]: ''
    });
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Calculations
  const categoryKeys: (keyof PackingRegistry)[] = ['documents', 'apparel', 'hardware', 'gear'];
  
  const getCategoryTitle = (key: keyof PackingRegistry) => {
    if (key === 'documents') return '📄 Documentation & Currency';
    if (key === 'apparel') return '🧥 Contextual Apparel';
    if (key === 'hardware') return '🔌 Hardware & Gadgets';
    return '🎒 Destination-Specific Gear';
  };

  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-[#0D1220]/80 border border-[#1F293D]/60 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1F293D]/60 pb-4 gap-4">
        <div>
          <h2 className="text-[10px] uppercase tracking-wider text-sky-400 font-bold mb-1 italic font-mono">
            Module 5: Packing Registry
          </h2>
          <h3 className="text-lg font-light text-white font-sans">Terrain-Tailored Gear Checklist</h3>
        </div>

        {/* Packing Progress Bar */}
        <div className="flex items-center gap-3 bg-[#070B13] border border-[#1F293D]/80 px-4 py-2 rounded-xl shrink-0">
          <div className="w-24 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-sky-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-[10px] font-bold text-sky-400">
            {progressPercent}% LOADED ({checkedCount}/{totalCount})
          </span>
        </div>
      </div>

      {/* Grid of checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryKeys.map((category) => {
          const categoryItems = items.filter(i => i.category === category);
          return (
            <div key={category} className="border border-[#1F293D]/60 rounded-xl p-5 space-y-4 bg-[#070B13]/60 border-l-4 border-l-sky-400">
              <h4 className="text-xs uppercase tracking-wider text-sky-300 font-bold border-b border-[#1F293D]/45 pb-2 font-mono">
                {getCategoryTitle(category)}
              </h4>

              {/* Items checklist */}
              <ul className="space-y-2.5 min-h-[120px]">
                {categoryItems.map((item) => (
                  <li 
                    key={item.id} 
                    className="flex items-start justify-between gap-3 text-xs group"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="flex items-start gap-2.5 text-left text-zinc-300 hover:text-white cursor-pointer w-full transition-colors"
                      id={`btn_toggle_pack_${item.id}`}
                    >
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-700 hover:text-sky-400 shrink-0 mt-0.5" />
                      )}
                      <span className={`font-sans leading-relaxed ${item.checked ? 'line-through text-zinc-500' : ''}`}>
                        {item.text}
                      </span>
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-zinc-600 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer shrink-0"
                      title="Remove item"
                      id={`btn_delete_pack_${item.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
                {categoryItems.length === 0 && (
                  <div className="text-zinc-650 italic text-xs py-4 text-center">No items listed.</div>
                )}
              </ul>

              {/* Add Custom Item form */}
              <form 
                onSubmit={(e) => addCustomItem(category, e)}
                className="flex gap-2 pt-2 border-t border-[#1F293D]/45"
              >
                <input
                  type="text"
                  placeholder="Add custom item..."
                  value={customText[category]}
                  onChange={(e) => setCustomText({ ...customText, [category]: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-[#070B13] border border-[#1F293D]/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 text-white placeholder-zinc-650"
                  id={`input_add_custom_pack_${category}`}
                />
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white p-1.5 rounded-lg flex items-center justify-center cursor-pointer shrink-0"
                  id={`btn_add_custom_pack_${category}`}
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
