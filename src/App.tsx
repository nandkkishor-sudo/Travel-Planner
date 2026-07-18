import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, Sparkles, MapPin, Calendar, Clock, 
  Copy, Check, FileText, Download, Bookmark, 
  HelpCircle, Trash2, ArrowRight, Plane, Globe, ChevronRight
} from 'lucide-react';
import { TravelParams, TravelBlueprint, SavedPlan } from './types';
import InputForm from './components/InputForm';
import DestinationMatrix from './components/DestinationMatrix';
import Encyclopedia from './components/Encyclopedia';
import ItineraryView from './components/ItineraryView';
import FinancialLedger from './components/FinancialLedger';
import PackingChecklist from './components/PackingChecklist';
import SavedPlans from './components/SavedPlans';

// Curated high-fidelity mock data for instant demo
const DEMO_BLUEPRINT: TravelBlueprint = {
  domesticOptions: [
    {
      name: "Jaipur & Udaipur, Rajasthan",
      fits: "Immerse yourself in rich regal history, stunning palaces, and heritage boutique stays perfect for couples seeking slow luxury.",
      window: "October to March (Pleasant daytime temperatures, vibrant local festivals)"
    },
    {
      name: "Munnar & Alleppey, Kerala",
      fits: "Experience tranquil backwater houseboats and lush tea plantation retreats with Ayurvedic wellness spas.",
      window: "September to March (Post-monsoon freshness, highly comfortable climate)"
    },
    {
      name: "Leh-Ladakh, Jammu & Kashmir",
      fits: "Embark on dramatic high-altitude road trips across salt lakes, desert mountains, and serene Buddhist monasteries.",
      window: "May to September (All mountain passes are open, perfectly dry climate)"
    }
  ],
  internationalOptions: [
    {
      name: "Kyoto, Japan",
      fits: "Discover zen rock gardens, pristine temples, and exquisite traditional culinary arts in a peaceful world-class setting.",
      window: "October to November (Autumn leaves) or March to April (Cherry blossoms)"
    },
    {
      name: "Bali, Indonesia",
      fits: "Relax in lush rainforest pool villas, vibrant beach clubs, and serene coastal surf bays.",
      window: "April to October (Dry season, sun-filled afternoons, perfect beach weather)"
    },
    {
      name: "Swiss Alps, Switzerland",
      fits: "Journey through magical snow-capped peaks, alpine lakes, and world-renowned cogwheel train journeys.",
      window: "December to March (For pristine winter sports) or June to September (For lush hiking trails)"
    }
  ],
  selectedOptionName: "Kyoto, Japan",
  encyclopedia: {
    destinationName: "Kyoto, Japan",
    visa: "Indian passport holders can apply for an e-Visa online via the Japan eVisa website. Standard processing takes 5 business days, with an application fee of approximately ₹500.",
    phrases: [
      { phrase: "Arigatou gozaimasu", translation: "Thank you very much", pronunciation: "Ah-ree-gah-toh goh-zai-mass" },
      { phrase: "Sumimasen", translation: "Excuse me / Sorry", pronunciation: "Sue-mee-mah-sen" },
      { phrase: "Kore wa ikura desu ka?", translation: "How much is this?", pronunciation: "Koh-reh wah ee-koo-rah dess kah?" }
    ],
    transit: "Kyoto features a seamless subway and bus network. Purchase an ICOCA IC card (pre-loaded transit card) for frictionless tap-and-go access to all city buses and trains.",
    culturalCodes: [
      "Always remove your shoes when entering traditional temples, ryokans, or homes.",
      "Tipping is strictly discouraged and considered rude. Exceptional service is covered in the standard bill.",
      "Avoid walking while eating; consume street food standing near the stall where purchased.",
      "Scam to avoid: Be wary of unlicensed 'izakaya' hosts in nightlife alleys (Pontocho) inviting you in with free drinks, which can lead to high cover fees."
    ],
    emergency: {
      police: "110",
      medical: "119"
    },
    bestTimeToVisit: "October to November (Autumn leaves) or March to April (Cherry blossoms)",
    famousFor: "Prismatic Zen rock gardens, preserved traditional wooden Machiya townhouses, towering bamboo paths, and exquisite multi-course Kaiseki dining."
  },
  itinerary: [
    {
      dayNum: 1,
      theme: "Zen Temples & Bamboo Paths",
      morningActivity: "Arrive early at Arashiyama Bamboo Grove to walk the towering green paths in complete silence and visit Tenryu-ji Temple.",
      breakfastSpot: "Saga-Tofu Ine (Enjoy delicate traditional soy-based breakfast delicacies with garden views)",
      afternoonActivity: "Rent a rental cruiser bicycle and ride along the scenic Katsura River to visit the golden Kinkaku-ji (Golden Pavilion).",
      lunchSpot: "Kinkaku-ji Itadaki (Generous, crisp local vegetable tempura sets)",
      eveningActivity: "Walk the pristine, traditional wooden Machiya streets of Gion, keeping a respectful lookout for real Geishas.",
      dinnerSpot: "Gion Karyo (A multi-course traditional Kaiseki dinner served in a restored 100-year-old home)",
      nightActivity: "Watch the illuminated modern views of Kyoto City from the observation deck of Kyoto Tower.",
      lateNightSpot: "Bar Rocking Chair (Cozy up by a real fireplace with an award-winning custom cocktail)",
      routeOptimization: "All morning activities are clustered in Western Kyoto (Arashiyama), shifting Eastward for a relaxed evening in central Gion."
    },
    {
      dayNum: 2,
      theme: "The Vermilion Gates & Historic Alleys",
      morningActivity: "Hike early through the iconic tunnels of 10,000 vermilion Torii gates at Fushimi Inari Shrine.",
      breakfastSpot: "Vermillion Cafe (Specialty coffee and avocado sourdough next to a forest pond)",
      afternoonActivity: "Explore the ancient, scenic hillside wooden temple Kiyomizu-dera and shop for local pottery in Ninenzaka Alleys.",
      lunchSpot: "Hisago (Renowned for their silky, historic Oyako-don chicken and egg rice bowls)",
      eveningActivity: "Unwind on a sunset walking stroll along the tranquil Philosopher's Path, lined with canal-side shops.",
      dinnerSpot: "Omen Ginkakuji (Premium hand-pulled local udon noodles served with fresh seasonal mountain herbs)",
      nightActivity: "Explore the atmospheric, lantern-lit alleys of Pontocho running parallel to the Kamogawa River.",
      lateNightSpot: "L\'Escamoteur Bar (A mystical, apothecary-themed cocktail lounge with magic tricks)",
      routeOptimization: "Clustered strictly along Eastern Kyoto (Higashiyama line), starting South and moving Northward to minimize travel."
    },
    {
      dayNum: 3,
      theme: "Traditional Tea Ceremonies & Modern Suburbs",
      morningActivity: "Participate in an authentic, meditative matcha tea preparation ceremony at Camellia Tea House.",
      breakfastSpot: "Maeda Coffee (Freshly baked pastries and traditional siphon drip coffee in Gion)",
      afternoonActivity: "Visit the massive, historical wooden castle grounds of Nijo Castle, experiencing the 'nightingale floors' that chirp like birds.",
      lunchSpot: "Nishiki Warai (Fluffy, savory Kyoto-style Okonomiyaki pancakes)",
      eveningActivity: "Browse the historic stalls of Nishiki Market, sampling fresh sesame dango, pickled items, and roasted tea.",
      dinnerSpot: "Ramen Sen-no-Kaze (Kyoto\'s highest-rated rich pork and soy broth ramen)",
      nightActivity: "Take a relaxed evening stroll along the Kamogawa River bank where locals gather to play music under the stars.",
      lateNightSpot: "Café Independants (An underground artistic lounge located in a historic 1928 basement)",
      routeOptimization: "Clustered in Central Kyoto to allow a leisurely pace with low transit requirements."
    }
  ],
  ledger: [
    { category: "✈️ Major Transit (Flights, Trains, or Bus)", costPerDay: 0, totalCost: 52700, strategy: "Book flights or bullet trains early. For domestic travel, express trains and luxury buses are 60% cheaper than flights." },
    { category: "🛏️ Accommodation (Hotel/Stay)", costPerDay: 8500, totalCost: 25500, strategy: "Choose mid-range ryokan hotels in Shimogyo Ward on Agoda; close to transit and free breakfast included." },
    { category: "🍔 Food, Cafes & Dining", costPerDay: 4000, totalCost: 12000, strategy: "Opt for set lunches (Lunch Teishoku) which are 40% cheaper than identical dinner menus." },
    { category: "🎟️ Sightseeing & Adventure", costPerDay: 1500, totalCost: 4500, strategy: "Purchase tickets online on Klook for attractions like Nijo Castle to skip long ticket-booth queues." },
    { category: "🚖 Local Intra-city Transport", costPerDay: 600, totalCost: 1800, strategy: "Use an ICOCA card combined with Kyoto's One-Day Subway & Bus Pass (₹700) for unlimited transit." },
    { category: "🛍️ Miscellaneous & Shopping", costPerDay: 0, totalCost: 6000, strategy: "Shop tax-free (8-10% off) at authorized shops like Don Don Donki by carrying your physical passport." }
  ],
  grandTotal: 102500,
  packing: {
    documents: [
      "Printed Japan eVisa confirmation page",
      "Physical Passport with at least 6 months validity",
      "ICOCA Card preloaded (or download to Apple Wallet)",
      "Physical credit card and roughly ¥10,000 in physical cash"
    ],
    apparel: [
      "Sturdy slip-on walking shoes (frequent shoe removal required at temples)",
      "Breathable, lightweight layers for moderate walking hiking",
      "Smart-casual modest wear for high-end dining in Gion"
    ],
    hardware: [
      "Type A flat two-prong power adapter plug",
      "10,000mAh Power bank (strictly below airline carry-on limits)",
      "Pocket Wi-Fi terminal or local eSIM pre-activated"
    ],
    gear: [
      "Small personal daypack for hydration",
      "Handkerchief or small hand towel (many public restrooms don't provide paper towels)",
      "Compact travel umbrella for unexpected coastal showers"
    ]
  }
};

const LOADING_STATUSES = [
  "Drafting Six-Track Destination Matrix...",
  "Consulting 3 domestic and 3 international flight grids...",
  "Calculating entry requirements and visa fees based on your passport...",
  "Geographically clustering daily itineraries to avoid backtracking...",
  "Sifting through authentic highly-rated cafes and dinner spots...",
  "Calculating ledger parameters strictly in Indian Rupees (₹) with Major Transit routing...",
  "Tailoring custom packing checklists based on climate and terrain...",
  "Securing zero-hallucination operational safety lifelines..."
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<TravelBlueprint | null>(null);
  const [activeParams, setActiveParams] = useState<TravelParams | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>(undefined);
  const [loadingStatusIdx, setLoadingStatusIdx] = useState(0);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const handleSelectDestinationOption = async (optionName: string) => {
    if (!blueprint || !activeParams) return;
    if (blueprint.selectedOptionName === optionName) return;

    setIsDetailsLoading(true);

    try {
      const response = await fetch('/api/generate-destination-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationName: optionName,
          origin: activeParams.origin,
          vibe: activeParams.vibe,
          duration: activeParams.duration,
          budgetTier: activeParams.budgetTier,
          companions: activeParams.companions
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load destination details.");
      }

      const detailsData = await response.json();
      
      const updatedBlueprint = {
        ...blueprint,
        selectedOptionName: optionName,
        encyclopedia: detailsData.encyclopedia,
        itinerary: detailsData.itinerary,
        ledger: detailsData.ledger,
        grandTotal: detailsData.grandTotal,
        packing: detailsData.packing
      };

      setBlueprint(updatedBlueprint);

      // Save back to active item in history
      if (currentPlanId) {
        const updatedHistory = savedPlans.map(p => {
          if (p.id === currentPlanId) {
            return {
              ...p,
              blueprint: updatedBlueprint
            };
          }
          return p;
        });
        setSavedPlans(updatedHistory);
        localStorage.setItem('travel_planner_vault', JSON.stringify(updatedHistory));
      }
    } catch (error: any) {
      console.error(error);
      alert(`Error switching destination: ${error?.message || "Failed to load details. Please try again."}`);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // Load plans from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('travel_planner_vault');
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load plans from vault", e);
    }
  }, []);

  // Cycle loading status text
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStatusIdx((prev) => (prev + 1) % LOADING_STATUSES.length);
      }, 2500);
    } else {
      setLoadingStatusIdx(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async (params: TravelParams) => {
    setIsLoading(true);
    setBlueprint(null);
    setCurrentPlanId(undefined);
    setActiveParams(params);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Generation request failed. Check API key or parameters.");
      }

      const data: TravelBlueprint = await response.json();
      setBlueprint(data);

      // Save plan to history
      const newPlan: SavedPlan = {
        id: `plan-${Date.now()}`,
        params,
        blueprint: data,
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };

      const updatedHistory = [newPlan, ...savedPlans];
      setSavedPlans(updatedHistory);
      localStorage.setItem('travel_planner_vault', JSON.stringify(updatedHistory));
      setCurrentPlanId(newPlan.id);
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error?.message || "Failed to curate. Please retry."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemo = () => {
    const params: TravelParams = {
      origin: "Mumbai, India",
      vibe: "Slow luxury & Zen garden paths",
      duration: 3,
      budgetTier: "Luxury",
      companions: "Couple"
    };
    setActiveParams(params);
    setBlueprint(DEMO_BLUEPRINT);
    
    const newPlan: SavedPlan = {
      id: `demo-plan`,
      params,
      blueprint: DEMO_BLUEPRINT,
      createdAt: 'Instant Curated'
    };
    
    // Check if already in saved plans to avoid duplicates
    if (!savedPlans.some(p => p.id === 'demo-plan')) {
      const updatedHistory = [newPlan, ...savedPlans];
      setSavedPlans(updatedHistory);
      localStorage.setItem('travel_planner_vault', JSON.stringify(updatedHistory));
    }
    setCurrentPlanId(newPlan.id);
  };

  const handleSelectPlan = (plan: SavedPlan) => {
    setActiveParams(plan.params);
    setBlueprint(plan.blueprint);
    setCurrentPlanId(plan.id);
  };

  const handleDeletePlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem('travel_planner_vault', JSON.stringify(updated));
    if (currentPlanId === id) {
      setBlueprint(null);
      setActiveParams(null);
      setCurrentPlanId(undefined);
    }
  };

  const handleClearAllPlans = () => {
    if (confirm("Are you sure you want to clear your Planning Vault?")) {
      setSavedPlans([]);
      localStorage.removeItem('travel_planner_vault');
      setBlueprint(null);
      setActiveParams(null);
      setCurrentPlanId(undefined);
    }
  };

  const handleUpdateLedger = (updatedLedger: any[]) => {
    if (blueprint) {
      const calculatedTotal = updatedLedger.reduce((sum, item) => sum + item.totalCost, 0);
      const updatedBlueprint = {
        ...blueprint,
        ledger: updatedLedger,
        grandTotal: calculatedTotal,
      };
      setBlueprint(updatedBlueprint);

      // Save back to active item in history
      if (currentPlanId) {
        const updatedHistory = savedPlans.map(p => {
          if (p.id === currentPlanId) {
            return {
              ...p,
              blueprint: updatedBlueprint
            };
          }
          return p;
        });
        setSavedPlans(updatedHistory);
        localStorage.setItem('travel_planner_vault', JSON.stringify(updatedHistory));
      }
    }
  };

  // Generate the formatted raw markdown specified in user requests
  const getRawMarkdown = () => {
    if (!blueprint || !activeParams) return '';

    let md = `# 🗺️ TRAVEL BLUEPRINT: ${blueprint.selectedOptionName.toUpperCase()}
*Generated for ${activeParams.duration} Days | ${activeParams.vibe} Vibe | ${activeParams.budgetTier} Budget*

## 📍 MODULE 1: SIX-TRACK DESTINATION MATRIX
Suggest exactly six premium options that align perfectly with the user's Vibe and Budget Tier.

### 🇮🇳 DOMESTIC OPTIONS:
${blueprint.domesticOptions.map((opt, idx) => `* **Option ${idx + 1}: ${opt.name}**\n  * *Why It Fits:* ${opt.fits}\n  * *Optimal Travel Window:* ${opt.window}`).join('\n')}

### ✈️ INTERNATIONAL OPTIONS:
${blueprint.internationalOptions.map((opt, idx) => `* **Option ${idx + 4}: ${opt.name}**\n  * *Why It Fits:* ${opt.fits}\n  * *Optimal Travel Window:* ${opt.window}`).join('\n')}

*Note: Selected Destination for comprehensive planning is ${blueprint.selectedOptionName}*

## 🏛️ MODULE 2: ALL-IN-ONE DESTINATION ENCYCLOPEDIA
* **Destination Name:** ${blueprint.encyclopedia.destinationName}
* **Famous For:** ${blueprint.encyclopedia.famousFor}
* **Best Time to Visit:** ${blueprint.encyclopedia.bestTimeToVisit}
* **Visa & Entry Protocols:** ${blueprint.encyclopedia.visa}
* **Local Language Cheat Sheet:**
${blueprint.encyclopedia.phrases.map((phrase, idx) => `  ${idx + 1}. "${phrase.phrase}" (${phrase.pronunciation}) - Means: "${phrase.translation}"`).join('\n')}
* **Transit Network:** ${blueprint.encyclopedia.transit}
* **Cultural Codes & Safety:**
${blueprint.encyclopedia.culturalCodes.map(code => `  - ${code}`).join('\n')}
* **Emergency Lifelines:**
  - Police Emergency contact: ${blueprint.encyclopedia.emergency.police}
  - Medical Emergency contact: ${blueprint.encyclopedia.emergency.medical}

## 🗓️ MODULE 3: HYPER-DETAILED DAY-WISE ITINERARY
`;

    blueprint.itinerary.forEach((day) => {
      md += `
### Day ${day.dayNum}: ${day.theme}
* 🌅 **Morning (08:00 - 12:00):** ${day.morningActivity} | *Breakfast Spot:* ${day.breakfastSpot}
* ☀️ **Afternoon (12:00 - 16:00):** ${day.afternoonActivity} | *Lunch Spot:* ${day.lunchSpot}
* 🌆 **Evening (16:00 - 20:00):** ${day.eveningActivity} | *Dinner Spot:* ${day.dinnerSpot}
* 🌃 **Night (20:00 - 00:00):** ${day.nightActivity} | *Late-Night Spot:* ${day.lateNightSpot}
* 🧭 **Route Optimization:** ${day.routeOptimization}
`;
    });

    md += `
## 💰 MODULE 4: FINANCIAL LEDGER (IN RUPEES - ₹)

| Expense Category | Estimated Cost Per Day (₹) | Total Estimated Cost for Trip (₹) | Money-Saving Strategy / Booking Platform |
| :--- | :--- | :--- | :--- |
`;

    blueprint.ledger.forEach((item) => {
      const dailyVal = item.costPerDay > 0 ? `₹${item.costPerDay.toLocaleString('en-IN')}` : '—';
      md += `| ${item.category} | ${dailyVal} | ₹${item.totalCost.toLocaleString('en-IN')} | ${item.strategy} |\n`;
    });

    md += `
**Grand Total Estimated Trip Cost: ₹${blueprint.grandTotal.toLocaleString('en-IN')}**

## 🎒 MODULE 5: TAILORED PACKING REGISTRY
* **Documentation & Currency:**
${blueprint.packing.documents.map(doc => `  - ${doc}`).join('\n')}
* **Contextual Apparel:**
${blueprint.packing.apparel.map(app => `  - ${app}`).join('\n')}
* **Hardware & Gadgets:**
${blueprint.packing.hardware.map(hw => `  - ${hw}`).join('\n')}
* **Destination-Specific Gear:**
${blueprint.packing.gear.map(g => `  - ${g}`).join('\n')}
`;

    return md;
  };

  const copyRawMarkdownToClipboard = () => {
    const raw = getRawMarkdown();
    navigator.clipboard.writeText(raw);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E1A] via-[#0E1324] to-[#080B14] text-zinc-100 font-sans selection:bg-sky-500/20 relative overflow-hidden">
      {/* Decorative ambient glowing backdrops to mimic misty fog background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-sky-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[50%] rounded-full bg-teal-950/20 blur-[130px] pointer-events-none" />

      {/* Premium Header */}
      <header className="border-b border-[#1E293B]/60 bg-[#0D1324]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-teal-500 text-white flex items-center justify-center font-display shadow-lg shadow-sky-500/15">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold font-display tracking-tight text-white leading-tight">
                Minimalist Travel Planner
              </h1>
              <p className="text-[9px] text-sky-400 font-mono tracking-wider uppercase font-bold">
                HYPER-DETAILED CURATIONS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDemo}
              className="text-xs bg-[#111827]/80 hover:bg-[#1F293D] text-white font-bold px-3.5 py-2 rounded-xl border border-[#1E293B] transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-black/10"
              id="btn_load_demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Instant Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">
        {/* Dynamic Misty Mountain Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 border border-[#1F293D]/60 shadow-2xl shadow-black/40">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/95 via-[#0E1324]/85 to-[#0A0E1A]/40 z-10" />
          <img 
            src="/src/assets/images/misty_mountain_hero_1784363591260.jpg" 
            alt="Misty Mountain Journey" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-20 px-6 md:px-12 py-16 md:py-20 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs text-sky-400 font-mono font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Next-Gen Travel AI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Smart &amp; Simple <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Trip Planning</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed max-w-lg">
              Our AI simplifies every step of travel planning, combining hyper-detailed daily itineraries, zero-hallucination dining checklists, and domestic transit networks.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-400" /> No Hallucinations</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-teal-400" /> Smart Transit</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: History & Form */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Saved Plans History Panel */}
            <SavedPlans
              plans={savedPlans}
              onSelectPlan={handleSelectPlan}
              onDeletePlan={handleDeletePlan}
              onClearAll={handleClearAllPlans}
              currentPlanId={currentPlanId}
            />

            {/* Ingestion Parameters Form */}
            <div className="space-y-3">
              <div className="p-1 px-3 bg-[#0D1220]/80 border border-[#1F293D]/60 rounded-full inline-flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-wider font-bold text-sky-400">
                <Clock className="w-3 h-3 text-sky-400" />
                <span>Configure Preferences</span>
              </div>
              <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
            </div>

          </div>

          {/* Right Column: Planner Outputs or Splash Loader */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                /* Premium Loader screen with rotating statuses */
                <motion.div
                  key="loader"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-[#0D1220]/80 border border-[#1F293D]/60 rounded-2xl p-12 text-center shadow-2xl space-y-6 flex flex-col items-center justify-center min-h-[500px]"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-[#1E293B] border-t-sky-400 animate-spin" />
                    <Compass className="w-6 h-6 text-sky-400 absolute top-5 left-5 animate-pulse" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-xs uppercase tracking-wider text-sky-400 font-bold font-mono">Assembling Travel Vault</h3>
                    <p className="text-sm text-zinc-300 leading-relaxed font-mono min-h-[36px]">
                      {LOADING_STATUSES[loadingStatusIdx]}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono italic">
                    Real landmarks & eateries being indexed (Zero Hallucination)
                  </span>
                </motion.div>
              ) : blueprint && activeParams ? (
                /* Render Complete 5-Module Travel Blueprint */
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Active Blueprint Summary */}
                  <div className="bg-[#0D1220]/80 border border-[#1F293D]/60 text-white rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-sky-400">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono uppercase bg-[#070B13] text-sky-400 px-2.5 py-0.5 rounded tracking-wide border border-[#1F293D]/60 font-bold">
                          Curated Blueprint
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          Origin: {activeParams.origin}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white leading-tight">
                        {blueprint.selectedOptionName}
                      </h2>
                      <p className="text-xs text-zinc-400 font-sans">
                        {activeParams.duration} Days • {activeParams.vibe} • {activeParams.companions} • {activeParams.budgetTier} Budget
                      </p>
                    </div>

                    {/* Copy Plain Markdown Button */}
                    <button
                      onClick={copyRawMarkdownToClipboard}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shrink-0 shadow-lg shadow-sky-500/10 transition-colors border border-sky-400/25 font-mono"
                      id="btn_copy_markdown"
                    >
                      {copiedRaw ? (
                        <>
                          <Check className="w-4 h-4 text-white stroke-[3px]" />
                          <span>Blueprint Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-white" />
                          <span>Copy Plain Markdown</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* MODULE 1: Six Track Destination Matrix */}
                  <DestinationMatrix
                    domesticOptions={blueprint.domesticOptions}
                    internationalOptions={blueprint.internationalOptions}
                    selectedOptionName={blueprint.selectedOptionName}
                    onSelectOption={handleSelectDestinationOption}
                    isDetailsLoading={isDetailsLoading}
                  />

                  <div className="relative">
                    {isDetailsLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-50 rounded-2xl">
                        <div className="flex flex-col items-center gap-3 bg-[#0D1220]/95 p-6 rounded-2xl border border-[#1F293D]/80 shadow-2xl">
                          <div className="w-10 h-10 rounded-full border-2 border-[#1E293B] border-t-sky-400 animate-spin" />
                          <span className="text-xs text-zinc-300 font-mono">Curating details for {blueprint.selectedOptionName}...</span>
                        </div>
                      </div>
                    )}
                    
                    <div className={`space-y-8 transition-all ${isDetailsLoading ? 'opacity-30 pointer-events-none filter blur-[1px]' : ''}`}>
                      {/* MODULE 2: Destination Encyclopedia */}
                      <Encyclopedia data={blueprint.encyclopedia} />

                      {/* MODULE 3: Hyper-Detailed Day-Wise Itinerary */}
                      <ItineraryView itinerary={blueprint.itinerary} />

                      {/* MODULE 4: Financial Ledger */}
                      <FinancialLedger
                        ledger={blueprint.ledger}
                        grandTotal={blueprint.grandTotal}
                        onUpdateCost={handleUpdateLedger}
                      />

                      {/* MODULE 5: Packing Checklist */}
                      <PackingChecklist packing={blueprint.packing} />
                    </div>
                  </div>

                </motion.div>
              ) : (
                /* Welcome Splash State */
                <motion.div
                  key="splash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#0D1220]/80 border border-[#1F293D]/60 rounded-2xl p-10 md:p-12 text-center space-y-6 shadow-2xl flex flex-col items-center justify-center min-h-[500px]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#070B13] border border-[#1F293D]/60 flex items-center justify-center text-sky-400 shadow-md">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-bold font-display text-white">Aesthetic Travel Curator</h2>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      Enter your travel preferences, origin city, and companion settings on the left.
                      Our intelligent engine will synthesize a zero-hallucination, hyper-detailed 5-module travel dossier packed with verified local venues and optimal booking paths.
                    </p>
                  </div>
                  <div className="flex gap-4 flex-wrap justify-center pt-2">
                    <button
                      onClick={loadDemo}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-sky-500/10 font-mono"
                      id="btn_splash_demo"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Explore Curated Tokyo Demo</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-[#1F293D]/60 bg-[#070B13]/80 py-8 mt-16 text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-1.5">
            <span>© 2026 Minimalist Travel Planner. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span className="font-mono text-[10px] text-zinc-600">No-hallucination Curation Protocol v1.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
