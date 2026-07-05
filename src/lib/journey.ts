// Journey Map — places, calculation, and foraging system
// Based on docs/journey-map-design.md

import type { JournalEntry } from "./storage";

export type PlaceId =
  | "doorway"
  | "misty_forest"
  | "riverbank"
  | "wildflower_field"
  | "mountain_trail"
  | "old_growth_grove";

export interface Place {
  id: PlaceId;
  name: string;
  message: string; // the one-liner under the porthole
  description: string; // longer description for the full-screen scene
  forageItem: string;
  forageVerb: string;
  plantEffect: string;
  // Colors for terrain rendering
  skyTop: string;
  skyBottom: string;
  groundColor: string;
  accentColor: string;
}

export const PLACES: Record<PlaceId, Place> = {
  doorway: {
    id: "doorway",
    name: "The Doorway",
    message: "You just got here. That's enough.",
    description: "A simple door with soft light behind it. Bare ground waiting for a seed. Everything starts here.",
    forageItem: "soil",
    forageVerb: "settling",
    plantEffect: "Your plant is a seed in fresh earth.",
    skyTop: "#fef3c7",
    skyBottom: "#fde68a",
    groundColor: "#d4a574",
    accentColor: "#f59e0b",
  },
  misty_forest: {
    id: "misty_forest",
    name: "Misty Forest",
    message: "You showed up anyway. That's the whole thing.",
    description: "Tall trees, soft fog, muted greens. The air is damp and you can't see far ahead. But you're walking. You're writing. The mist is just where you are today.",
    forageItem: "rainwater",
    forageVerb: "falling",
    plantEffect: "Rainwater feeds the root system. Deep roots grow here.",
    skyTop: "#cbd5e1",
    skyBottom: "#94a3b8",
    groundColor: "#475569",
    accentColor: "#64748b",
  },
  riverbank: {
    id: "riverbank",
    name: "Riverbank",
    message: "Things are moving. You're tracking them.",
    description: "Running water, smooth stones, willows. Some days the current pulls, some days you watch it go by. But you're here, feet in the water.",
    forageItem: "river stone",
    forageVerb: "settling",
    plantEffect: "River stones settle around the base. A solid foundation.",
    skyTop: "#bae6fd",
    skyBottom: "#7dd3fc",
    groundColor: "#64748b",
    accentColor: "#0ea5e9",
  },
  wildflower_field: {
    id: "wildflower_field",
    name: "Wildflower Field",
    message: "The sky is big. You can breathe here.",
    description: "Open meadow, wildflowers, warm light. The prompts are hitting and you're writing real stuff. Not every moment is perfect but the air is clear.",
    forageItem: "sunlight",
    forageVerb: "drifting",
    plantEffect: "Sunlight stretches your plant upward. Brighter leaves.",
    skyTop: "#fef9c3",
    skyBottom: "#fde68a",
    groundColor: "#86efac",
    accentColor: "#facc15",
  },
  mountain_trail: {
    id: "mountain_trail",
    name: "Mountain Trail",
    message: "Hard climb. But you can see the valley from here.",
    description: "Switchback trail, pine trees, rocky outcrops. You've been at this long enough that the hard days don't erase what you can see from up here.",
    forageItem: "pine needles",
    forageVerb: "falling",
    plantEffect: "Pine mulch protects the base. Your plant weathers the next storm better.",
    skyTop: "#e0f2fe",
    skyBottom: "#bfdbfe",
    groundColor: "#78716c",
    accentColor: "#a78bfa",
  },
  old_growth_grove: {
    id: "old_growth_grove",
    name: "Old Growth Grove",
    message: "Deep roots. Stable ground. This forest is yours.",
    description: "Massive trees, dappled light, thick undergrowth. Storms come through and you feel them but they don't knock you down. You know this forest.",
    forageItem: "seeds",
    forageVerb: "dropping",
    plantEffect: "Seeds sprout beside your plant. It isn't alone anymore.",
    skyTop: "#d1fae5",
    skyBottom: "#a7f3d0",
    groundColor: "#166534",
    accentColor: "#059669",
  },
};

export interface ForagedItem {
  id: string;
  place: PlaceId;
  item: string;
  date: string;
  entryId: string;
}

// ===== Place Calculation =====

interface EntryStats {
  count: number;
  recentAvgMood: number;
  recentAvgEnergy: number;
  firstAvgMood: number;
  firstAvgEnergy: number;
  moodTrend: number; // positive = improving, negative = declining
  energyTrend: number;
  moodVariance: number;
  energyVariance: number;
  hasRecentDip: boolean;
}

function calculateStats(entries: JournalEntry[]): EntryStats | null {
  // Sort oldest first for trend calculation
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const withMood = sorted.filter((e) => e.mood !== undefined && e.mood !== null);
  const withEnergy = sorted.filter((e) => e.energy !== undefined && e.energy !== null);

  if (withMood.length === 0 && withEnergy.length === 0) {
    return {
      count: sorted.length,
      recentAvgMood: 0,
      recentAvgEnergy: 0,
      firstAvgMood: 0,
      firstAvgEnergy: 0,
      moodTrend: 0,
      energyTrend: 0,
      moodVariance: 0,
      energyVariance: 0,
      hasRecentDip: false,
    };
  }

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = (arr: number[]) => {
    if (arr.length < 2) return 0;
    const m = avg(arr);
    return arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
  };

  const moodValues = withMood.map((e) => e.mood!);
  const energyValues = withEnergy.map((e) => e.energy!);

  // First 5 and last 5 for trend
  const firstMood = moodValues.slice(0, 5);
  const recentMood = moodValues.slice(-5);
  const firstEnergy = energyValues.slice(0, 5);
  const recentEnergy = energyValues.slice(-5);

  const recentAvgMood = avg(recentMood);
  const recentAvgEnergy = avg(recentEnergy);
  const firstAvgMood = avg(firstMood);
  const firstAvgEnergy = avg(firstEnergy);

  const moodTrend = recentAvgMood - firstAvgMood;
  const energyTrend = recentAvgEnergy - firstAvgEnergy;

  // Recent dip: last 3 entries average is lower than overall average by at least 1 point
  const recent3Mood = moodValues.slice(-3);
  const recent3Energy = energyValues.slice(-3);
  const overallMoodAvg = avg(moodValues);
  const overallEnergyAvg = avg(energyValues);
  const hasRecentDip =
    (recent3Mood.length >= 3 && avg(recent3Mood) < overallMoodAvg - 1) ||
    (recent3Energy.length >= 3 && avg(recent3Energy) < overallEnergyAvg - 1);

  return {
    count: sorted.length,
    recentAvgMood,
    recentAvgEnergy,
    firstAvgMood,
    firstAvgEnergy,
    moodTrend,
    energyTrend,
    moodVariance: variance(moodValues),
    energyVariance: variance(energyValues),
    hasRecentDip,
  };
}

export function calculatePlace(entries: JournalEntry[]): PlaceId {
  if (entries.length === 0) return "doorway";

  const stats = calculateStats(entries);
  if (!stats) return "doorway";

  // Priority logic from design doc
  // 1. No entries → doorway (already handled above)

  // 2. Old Growth Grove: 20+ entries, low variance, stable trend
  if (
    stats.count >= 20 &&
    stats.moodVariance < 0.8 &&
    stats.energyVariance < 0.8 &&
    Math.abs(stats.moodTrend) < 1 &&
    Math.abs(stats.energyTrend) < 1
  ) {
    return "old_growth_grove";
  }

  // 3. Mountain Trail: 15+ entries, recent dip but stable long-term
  if (
    stats.count >= 15 &&
    stats.hasRecentDip &&
    Math.abs(stats.moodTrend) < 1.5 &&
    Math.abs(stats.energyTrend) < 1.5
  ) {
    return "mountain_trail";
  }

  // 4. Wildflower Field: mood or energy trending up
  if (stats.moodTrend > 0.5 || stats.energyTrend > 0.5) {
    return "wildflower_field";
  }

  // 5. Misty Forest: low mood/energy but consistent entries
  if (
    (stats.recentAvgMood > 0 && stats.recentAvgMood <= 2.5) ||
    (stats.recentAvgEnergy > 0 && stats.recentAvgEnergy <= 2.5)
  ) {
    return "misty_forest";
  }

  // 6. Riverbank: mixed/stable scores with consistent entries
  return "riverbank";
}

// ===== Foraging =====

export function createForagedItem(place: PlaceId, entryId: string): ForagedItem {
  const p = PLACES[place];
  return {
    id: `${entryId}-${place}`,
    place,
    item: p.forageItem,
    date: new Date().toISOString(),
    entryId,
  };
}

// Count foraged items by place
export function countByPlace(items: ForagedItem[]): Record<PlaceId, number> {
  const counts: Record<PlaceId, number> = {
    doorway: 0,
    misty_forest: 0,
    riverbank: 0,
    wildflower_field: 0,
    mountain_trail: 0,
    old_growth_grove: 0,
  };
  for (const item of items) {
    counts[item.place]++;
  }
  return counts;
}
