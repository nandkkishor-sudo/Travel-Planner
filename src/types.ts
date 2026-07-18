export interface TravelParams {
  origin: string;
  vibe: string;
  duration: number;
  budgetTier: 'Budget' | 'Mid-range' | 'Luxury';
  companions: string;
}

export interface DestinationOption {
  name: string;
  fits: string;
  window: string;
}

export interface LocalPhrase {
  phrase: string;
  translation: string;
  pronunciation: string;
}

export interface EncyclopediaData {
  destinationName: string;
  visa: string;
  phrases: LocalPhrase[];
  transit: string;
  culturalCodes: string[];
  emergency: {
    police: string;
    medical: string;
  };
  bestTimeToVisit: string;
  famousFor: string;
}

export interface DayPlan {
  dayNum: number;
  theme: string;
  morningActivity: string;
  breakfastSpot: string;
  afternoonActivity: string;
  lunchSpot: string;
  eveningActivity: string;
  dinnerSpot: string;
  nightActivity: string;
  lateNightSpot: string;
  routeOptimization: string;
}

export interface LedgerItem {
  category: string;
  costPerDay: number;
  totalCost: number;
  strategy: string;
}

export interface PackingRegistry {
  documents: string[];
  apparel: string[];
  hardware: string[];
  gear: string[];
}

export interface TravelBlueprint {
  domesticOptions: DestinationOption[];
  internationalOptions: DestinationOption[];
  selectedOptionName: string;
  encyclopedia: EncyclopediaData;
  itinerary: DayPlan[];
  ledger: LedgerItem[];
  grandTotal: number;
  packing: PackingRegistry;
}

export interface SavedPlan {
  id: string;
  params: TravelParams;
  blueprint: TravelBlueprint;
  createdAt: string;
}
