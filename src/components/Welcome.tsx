"use client";

import { useState } from "react";

export type PlantType = "sunflower" | "cactus" | "tulip" | "mint" | "oak";

interface PlantOption {
  id: PlantType;
  emoji: string;
  name: string;
  description: string;
}

const plantOptions: PlantOption[] = [
  { id: "sunflower", emoji: "🌻", name: "Sunflower", description: "Grows tall, follows the light." },
  { id: "cactus", emoji: "🌵", name: "Cactus", description: "Built for harsh conditions. Still here." },
  { id: "tulip", emoji: "🪻", name: "Tulip", description: "Comes back every season, even after winter." },
  { id: "mint", emoji: "🌿", name: "Mint", description: "Spreads and grows. Hard to stop." },
  { id: "oak", emoji: "🌳", name: "Oak", description: "Slow growth, deep roots. In it for the long haul." },
];

interface WelcomeProps {
  onBegin: (plant: PlantType) => void;
}

export default function Welcome({ onBegin }: WelcomeProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center p-4 sm:p-6 pt-6">
      <div className="max-w-md w-full">
        <div className="text-3xl mb-2 text-center" aria-hidden="true">🧭</div>

        <h1 className="text-xl font-bold text-slate-800 mb-2 leading-snug">
          Sometimes your brain won&apos;t shut up. Sometimes it goes too quiet.
        </h1>

        <p className="text-sm text-slate-600 mb-1">
          Compass helps you figure out which patterns are running the show and gives you prompts worth writing about.
        </p>

        <p className="text-xs text-slate-500 mb-6">
          No account, no server, no cloud. What you write stays on your phone.
        </p>

        {/* Plant picker */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-700 mb-1">
            Pick your plant.
          </p>
          <p className="text-xs text-slate-500 mb-3">
            Each entry you write feeds it. Watch it grow.
          </p>

          <div className="grid grid-cols-1 gap-2">
            {plantOptions.map((plant) => (
              <button
                key={plant.id}
                onClick={() => setSelectedPlant(plant.id)}
                aria-pressed={selectedPlant === plant.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedPlant === plant.id
                    ? "border-rose-400 bg-rose-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{plant.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm">{plant.name}</p>
                  <p className="text-xs text-slate-500">{plant.description}</p>
                </div>
                {selectedPlant === plant.id && (
                  <span className="text-rose-500 text-sm font-medium">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => selectedPlant && onBegin(selectedPlant)}
          disabled={!selectedPlant}
          className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-teal-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Start your journey →
        </button>

        <p className="text-xs text-slate-500 mt-6">
          Compass is a journaling tool, not a substitute for professional care. If you&apos;re in crisis, call or text 988.
        </p>
      </div>
    </div>
  );
}
