"use client";

import { useEffect, useState } from "react";
import { getJournalEntries, type JournalEntry } from "@/lib/storage";

interface EngagementTrackerProps {
  refreshKey?: number;
}

interface Milestone {
  threshold: number;
  emoji: string;
  label: string;
}

const milestones: Milestone[] = [
  { threshold: 1, emoji: "🌱", label: "First entry" },
  { threshold: 7, emoji: "🌿", label: "7 entries" },
  { threshold: 30, emoji: "🌳", label: "30 entries" },
  { threshold: 100, emoji: "🌲", label: "100 entries" },
];

export default function EngagementTracker({ refreshKey }: EngagementTrackerProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showReflection, setShowReflection] = useState<JournalEntry | null>(null);
  const [lastSeenCount, setLastSeenCount] = useState<number>(0);

  useEffect(() => {
    async function load() {
      const allEntries = await getJournalEntries();
      setEntries(allEntries);

      // Check if we hit a 10-entry milestone for reflection
      const { getPref, setPref } = await import("@/lib/storage");
      const seenCount = await getPref("lastReflectionCount");
      const count = seenCount ? parseInt(seenCount, 10) : 0;
      setLastSeenCount(count);

      if (allEntries.length > 0 && allEntries.length % 10 === 0 && allEntries.length !== count) {
        // Show a reflection from an earlier entry
        const earlierEntries = allEntries.slice(10);
        if (earlierEntries.length > 0) {
          const randomIdx = Math.floor(Math.random() * Math.min(5, earlierEntries.length));
          setShowReflection(earlierEntries[randomIdx]);
        }
      }
    }
    load();
  }, [refreshKey]);

  const handleDismissReflection = async () => {
    const { setPref } = await import("@/lib/storage");
    await setPref("lastReflectionCount", entries.length.toString());
    setShowReflection(null);
  };

  // Build calendar heatmap data — last 12 weeks
  const today = new Date();
  const weeks: { date: Date; count: number }[][] = [];
  const entryDates = new Set(entries.map((e) => e.date.split("T")[0]));

  for (let w = 11; w >= 0; w--) {
    const week: { date: Date; count: number }[] = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - w * 7 - d);
      const dateStr = date.toISOString().split("T")[0];
      week.push({ date, count: entryDates.has(dateStr) ? 1 : 0 });
    }
    weeks.push(week);
  }

  // Current earned milestones
  const earnedMilestones = milestones.filter((m) => entries.length >= m.threshold);
  const totalEntries = entries.length;

  // This week's count
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const thisWeekCount = entries.filter((e) => new Date(e.date) >= weekStart).length;

  if (totalEntries === 0) return null;

  return (
    <>
      {/* Reflection modal */}
      {showReflection && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={handleDismissReflection}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-2xl mb-2" aria-hidden="true">🪞</div>
              <h3 className="font-bold text-slate-800">A look back</h3>
              <p className="text-xs text-slate-500 mt-1">
                You&apos;ve written {totalEntries} entries. Here&apos;s one from earlier:
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-500 mb-2">
                {new Date(showReflection.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-slate-700 italic mb-2">&ldquo;{showReflection.promptText}&rdquo;</p>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                {showReflection.response}
              </p>
              {showReflection.mood !== undefined && (
                <p className="text-xs text-slate-500 mt-2">
                  Mood: {["😞", "😕", "😐", "🙂", "😄"][showReflection.mood] || "😐"}
                </p>
              )}
            </div>
            <button
              onClick={handleDismissReflection}
              className="w-full py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              Keep going →
            </button>
          </div>
        </div>
      )}

      {/* Heatmap + stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-800">Your writing</h3>
          <span className="text-xs text-slate-500">{totalEntries} {totalEntries === 1 ? "entry" : "entries"}</span>
        </div>

        {/* Calendar heatmap */}
        <div className="flex gap-[3px] mb-3 overflow-x-auto" aria-label="Journal activity over the last 12 weeks">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm ${
                    day.count > 0
                      ? "bg-rose-400"
                      : day.date <= today
                        ? "bg-slate-100"
                        : "bg-transparent"
                  }`}
                  title={`${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}${day.count > 0 ? " — journaled" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* This week + milestones */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            This week: {thisWeekCount}
          </span>
          {earnedMilestones.length > 0 && (
            <div className="flex gap-1.5">
              {earnedMilestones.map((m) => (
                <span
                  key={m.threshold}
                  className="text-lg"
                  title={m.label}
                  aria-label={m.label}
                >
                  {m.emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
