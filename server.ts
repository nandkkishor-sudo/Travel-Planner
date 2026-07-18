import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Post endpoint to generate a plan using Gemini
app.post("/api/generate-plan", async (req, res) => {
  const { origin, vibe, duration, budgetTier, companions } = req.body;

  if (!origin || !vibe || !duration || !budgetTier || !companions) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    const prompt = `You are a premium, highly experienced travel planner.
Generate an exhaustive travel plan based on these user parameters:
- Origin/Home City: ${origin}
- Travel Vibe: ${vibe}
- Duration: ${duration} Days
- Total Budget Tier: ${budgetTier} (Select appropriate premium/mid-range/budget destinations accordingly)
- Travel Companions: ${companions}

Strictly follow these modules:
- Module 1: Six-track destination matrix. Suggest exactly six premium options:
  - Exactly 3 Domestic options (inside the home country of ${origin})
  - Exactly 3 International options (outside the home country of ${origin})
  - For each option, provide its name, why it fits the vibe in one impact sentence, and the optimal travel window.
  - Dynamically select the single best destination among these six options that highest matches the requested vibe, and represent its exact name as 'selectedOptionName'.

For the selected best destination, build the remaining modules:
- Module 2: All-in-one Destination Encyclopedia:
  - 'destinationName' (must match 'selectedOptionName' exactly)
  - 'visa' (exact entry requirements, visa-on-arrival status, and processing fees based on User's Origin ${origin})
  - 'phrases' (exactly 3 essential local phrases with English translation and phonetic pronunciation)
  - 'transit' (the absolute best way to get around like metro, cabs, etc.)
  - 'culturalCodes' (3 crucial local etiquette laws, tipping standards, and 1 specific local scam to avoid)
  - 'emergency' (police and medical numbers)
  - 'bestTimeToVisit' (best time/months to visit with reasons)
  - 'famousFor' (what this destination is most famous for)
- Module 3: Hyper-detailed day-wise itinerary. Generate exactly ${duration} days. Every day must include a theme, morning activity with a specific real breakfast spot, afternoon activity with a specific real lunch spot, evening activity with a specific real dinner spot, night activity with a specific real late-night spot, and 1 sentence explaining the geographic route optimization. ONLY suggest actual, real, highly-rated establishments and landmarks. Zero hallucinations.
- Module 4: Financial Ledger (denominated in Indian Rupees - ₹). Calculate the itemized costs for 1 person based on the duration (${duration} days) and budget tier (${budgetTier}). Include:
  1. Major Transit (Flights, Trains, or Inter-city Bus from ${origin} to destination - AI must estimate this automatically based on distance, budget tier, and proximity, especially for domestic trips where trains and buses are highly common) - daily cost is not applicable, represent as total cost.
  2. Accommodation (Hotel/Stay) - daily cost and total cost.
  3. Food, Cafes & Dining - daily cost and total cost.
  4. Sightseeing & Adventure - daily cost and total cost.
  5. Local Intra-city Transport (Cab/Metro/Auto) - daily cost and total cost.
  6. Miscellaneous & Shopping - daily cost is not applicable, represent as total cost.
  Provide a grand total in INR. Also provide a specific money-saving strategy or booking platform for each item.
- Module 5: Tailored Packing Registry. Minimal, highly functional checklist containing documents & currency, contextual apparel, hardware & gadgets, and destination-specific gear.

Make sure the output is strict JSON matching the requested schema. All places must be real and verify accuracy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domesticOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Domestic Option Name, State/Region" },
                  fits: { type: Type.STRING, description: "Why it fits: 1 high-impact sentence linking it to the user's vibe" },
                  window: { type: Type.STRING, description: "Optimal Travel Window, e.g. Oct-Mar" }
                },
                required: ["name", "fits", "window"]
              },
              description: "Exactly 3 domestic options"
            },
            internationalOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "International Option Name, Country" },
                  fits: { type: Type.STRING, description: "Why it fits: 1 high-impact sentence linking it to the user's vibe" },
                  window: { type: Type.STRING, description: "Optimal Travel Window, e.g. Oct-Mar" }
                },
                required: ["name", "fits", "window"]
              },
              description: "Exactly 3 international options"
            },
            selectedOptionName: {
              type: Type.STRING,
              description: "Must match the exact name of one of the 6 options above that is selected for the comprehensive guide"
            },
            encyclopedia: {
              type: Type.OBJECT,
              properties: {
                destinationName: { type: Type.STRING },
                visa: { type: Type.STRING, description: "Exact entry requirements, visa-on-arrival status, and processing fees based on User's Origin" },
                phrases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phrase: { type: Type.STRING, description: "Local phrase" },
                      translation: { type: Type.STRING, description: "English translation" },
                      pronunciation: { type: Type.STRING, description: "Phonetic pronunciation" }
                    },
                    required: ["phrase", "translation", "pronunciation"]
                  },
                  description: "Exactly 3 essential local phrases"
                },
                transit: { type: Type.STRING, description: "The absolute best way to get around (Metro, local cabs, renting vehicle, etc.)" },
                culturalCodes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Crucial local etiquette laws, dress codes, tipping standards, and 1 specific scam to avoid"
                },
                emergency: {
                  type: Type.OBJECT,
                  properties: {
                    police: { type: Type.STRING, description: "Police contact number" },
                    medical: { type: Type.STRING, description: "Medical contact number" }
                  },
                  required: ["police", "medical"]
                },
                bestTimeToVisit: { type: Type.STRING, description: "Best time/months to visit with reasons" },
                famousFor: { type: Type.STRING, description: "What the destination is most famous for" }
              },
              required: ["destinationName", "visa", "phrases", "transit", "culturalCodes", "emergency", "bestTimeToVisit", "famousFor"]
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNum: { type: Type.INTEGER },
                  theme: { type: Type.STRING, description: "Theme of the day" },
                  morningActivity: { type: Type.STRING, description: "Morning (08:00 - 12:00) detailed tourist sightseeing" },
                  breakfastSpot: { type: Type.STRING, description: "Name of a specific real local cafe/eatery" },
                  afternoonActivity: { type: Type.STRING, description: "Afternoon (12:00 - 16:00) specific adventure or historical activity" },
                  lunchSpot: { type: Type.STRING, description: "Name of a specific real local restaurant" },
                  eveningActivity: { type: Type.STRING, description: "Evening (16:00 - 20:00) relaxed experience, market, or view spot" },
                  dinnerSpot: { type: Type.STRING, description: "Name of a specific real highly-rated dinner venue" },
                  nightActivity: { type: Type.STRING, description: "Night (20:00 - 00:00) nightlife, night market, stargazing, or show" },
                  lateNightSpot: { type: Type.STRING, description: "Name of a specific local bar, cafe, or lounge" },
                  routeOptimization: { type: Type.STRING, description: "1 sentence explaining why this sequence minimizes transit time" }
                },
                required: [
                  "dayNum", "theme", "morningActivity", "breakfastSpot",
                  "afternoonActivity", "lunchSpot", "eveningActivity", "dinnerSpot",
                  "nightActivity", "lateNightSpot", "routeOptimization"
                ]
              }
            },
            ledger: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "Expense Category (e.g. Major Transit, Accommodation, Food, Cafes & Dining, Sightseeing & Adventure, Local Intra-city Transport, Miscellaneous & Shopping)" },
                  costPerDay: { type: Type.NUMBER, description: "Estimated daily cost in ₹. Use 0 if not applicable (e.g. for Major Transit)" },
                  totalCost: { type: Type.NUMBER, description: "Total cost for the trip category in ₹" },
                  strategy: { type: Type.STRING, description: "Money-saving strategy or booking platform recommendation" }
                },
                required: ["category", "costPerDay", "totalCost", "strategy"]
              }
            },
            grandTotal: { type: Type.NUMBER, description: "Sum of all totals in Indian Rupees (₹)" },
            packing: {
              type: Type.OBJECT,
              properties: {
                documents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Must carry documents and currency" },
                apparel: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Terrain and climate specific clothing and shoes" },
                hardware: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific electronic devices, adapter types, etc." },
                gear: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Destination-specific gear (sunscreeen, repellents, meds)" }
              },
              required: ["documents", "apparel", "hardware", "gear"]
            }
          },
          required: ["domesticOptions", "internationalOptions", "selectedOptionName", "encyclopedia", "itinerary", "ledger", "grandTotal", "packing"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(response.text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate travel plan." });
  }
});

// Post endpoint to generate only details for a selected destination
app.post("/api/generate-destination-details", async (req, res) => {
  const { destinationName, origin, vibe, duration, budgetTier, companions } = req.body;

  if (!destinationName || !origin || !vibe || !duration || !budgetTier || !companions) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  try {
    const prompt = `You are an expert, high-fidelity travel planner.
Generate a comprehensive, highly-detailed travel plan specifically for the destination "${destinationName}", based on these user parameters:
- Origin/Home City: ${origin}
- Travel Vibe: ${vibe}
- Duration: ${duration} Days
- Total Budget Tier: ${budgetTier}
- Travel Companions: ${companions}

Build these exact modules for "${destinationName}":
- Module 2: All-in-one Destination Encyclopedia:
  - 'destinationName' (must match "${destinationName}" exactly)
  - 'visa' (exact entry requirements, visa-on-arrival status, and processing fees based on User's Origin ${origin})
  - 'phrases' (exactly 3 essential local phrases with English translation and phonetic pronunciation)
  - 'transit' (the absolute best way to get around like metro, cabs, etc.)
  - 'culturalCodes' (3 crucial local etiquette laws, tipping standards, and 1 specific local scam to avoid)
  - 'emergency' (police and medical numbers)
  - 'bestTimeToVisit' (best time/months to visit with reasons)
  - 'famousFor' (what this destination is most famous for)
- Module 3: Hyper-detailed day-wise itinerary. Generate exactly ${duration} days. Every day must include a theme, morning activity with a specific real breakfast spot, afternoon activity with a specific real lunch spot, evening activity with a specific real dinner spot, night activity with a specific real late-night spot, and 1 sentence explaining the geographic route optimization. ONLY suggest actual, real, highly-rated establishments and landmarks. Zero hallucinations.
- Module 4: Financial Ledger (denominated in Indian Rupees - ₹). Calculate the itemized costs for 1 person based on the duration (${duration} days) and budget tier (${budgetTier}). Include:
  1. Major Transit (Flights, Trains, or Inter-city Bus from ${origin} to destination - AI must estimate this automatically based on distance, budget tier, and proximity, especially for domestic trips where trains and buses are highly common) - daily cost is not applicable, represent as total cost.
  2. Accommodation (Hotel/Stay) - daily cost and total cost.
  3. Food, Cafes & Dining - daily cost and total cost.
  4. Sightseeing & Adventure - daily cost and total cost.
  5. Local Intra-city Transport (Cab/Metro/Auto) - daily cost and total cost.
  6. Miscellaneous & Shopping - daily cost is not applicable, represent as total cost.
  Provide a grand total in INR. Also provide a specific money-saving strategy or booking platform for each item.
- Module 5: Tailored Packing Registry. Minimal, highly functional checklist containing documents & currency, contextual apparel, hardware & gadgets, and destination-specific gear.

Return strictly JSON matching the requested schema. All places must be real.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            encyclopedia: {
              type: Type.OBJECT,
              properties: {
                destinationName: { type: Type.STRING },
                visa: { type: Type.STRING, description: "Exact entry requirements, visa-on-arrival status, and processing fees based on User's Origin" },
                phrases: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phrase: { type: Type.STRING, description: "Local phrase" },
                      translation: { type: Type.STRING, description: "English translation" },
                      pronunciation: { type: Type.STRING, description: "Phonetic pronunciation" }
                    },
                    required: ["phrase", "translation", "pronunciation"]
                  },
                  description: "Exactly 3 essential local phrases"
                },
                transit: { type: Type.STRING, description: "The absolute best way to get around (Metro, local cabs, renting vehicle, etc.)" },
                culturalCodes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Crucial local etiquette laws, dress codes, tipping standards, and 1 specific scam to avoid"
                },
                emergency: {
                  type: Type.OBJECT,
                  properties: {
                    police: { type: Type.STRING, description: "Police contact number" },
                    medical: { type: Type.STRING, description: "Medical contact number" }
                  },
                  required: ["police", "medical"]
                },
                bestTimeToVisit: { type: Type.STRING, description: "Best time/months to visit with reasons" },
                famousFor: { type: Type.STRING, description: "What the destination is most famous for" }
              },
              required: ["destinationName", "visa", "phrases", "transit", "culturalCodes", "emergency", "bestTimeToVisit", "famousFor"]
            },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNum: { type: Type.INTEGER },
                  theme: { type: Type.STRING, description: "Theme of the day" },
                  morningActivity: { type: Type.STRING, description: "Morning (08:00 - 12:00) detailed tourist sightseeing" },
                  breakfastSpot: { type: Type.STRING, description: "Name of a specific real local cafe/eatery" },
                  afternoonActivity: { type: Type.STRING, description: "Afternoon (12:00 - 16:00) specific adventure or historical activity" },
                  lunchSpot: { type: Type.STRING, description: "Name of a specific real local restaurant" },
                  eveningActivity: { type: Type.STRING, description: "Evening (16:00 - 20:00) relaxed experience, market, or view spot" },
                  dinnerSpot: { type: Type.STRING, description: "Name of a specific real highly-rated dinner venue" },
                  nightActivity: { type: Type.STRING, description: "Night (20:00 - 00:00) nightlife, night market, stargazing, or show" },
                  lateNightSpot: { type: Type.STRING, description: "Name of a specific local bar, cafe, or lounge" },
                  routeOptimization: { type: Type.STRING, description: "1 sentence explaining why this sequence minimizes transit time" }
                },
                required: [
                  "dayNum", "theme", "morningActivity", "breakfastSpot",
                  "afternoonActivity", "lunchSpot", "eveningActivity", "dinnerSpot",
                  "nightActivity", "lateNightSpot", "routeOptimization"
                ]
              }
            },
            ledger: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "Expense Category (e.g. Major Transit, Accommodation, Food, Cafes & Dining, Sightseeing & Adventure, Local Intra-city Transport, Miscellaneous & Shopping)" },
                  costPerDay: { type: Type.NUMBER, description: "Estimated daily cost in ₹. Use 0 if not applicable (e.g. for Major Transit)" },
                  totalCost: { type: Type.NUMBER, description: "Total cost for the trip category in ₹" },
                  strategy: { type: Type.STRING, description: "Money-saving strategy or booking platform recommendation" }
                },
                required: ["category", "costPerDay", "totalCost", "strategy"]
              }
            },
            grandTotal: { type: Type.NUMBER, description: "Sum of all totals in Indian Rupees (₹)" },
            packing: {
              type: Type.OBJECT,
              properties: {
                documents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Must carry documents and currency" },
                apparel: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Terrain and climate specific clothing and shoes" },
                hardware: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific electronic devices, adapter types, etc." },
                gear: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Destination-specific gear (sunscreeen, repellents, meds)" }
              },
              required: ["documents", "apparel", "hardware", "gear"]
            }
          },
          required: ["encyclopedia", "itinerary", "ledger", "grandTotal", "packing"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(response.text.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Details Generation Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate destination details." });
  }
});

// Serve frontend build or mount Vite Dev Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
