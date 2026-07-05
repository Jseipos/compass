"use client";

import { useState, useEffect } from "react";
import { getJournalEntries, type JournalEntry } from "@/lib/storage";
import { patternInfo } from "@/lib/assessment";

interface HistoryProps {
  onBackToHub: () => void;
}

const moodLabels = ["😞", "😕", "😐", "🙂", "😄"];
const moodWords = ["Rough", "Low", "Okay", "Good", "Great"];
const energyLabels = ["🪫", "🔋", "⚡"];
const energyWords = ["Depleted", "Steady", "Wired"];

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function History({ onBackToHub }: HistoryProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [filterPattern, setFilterPattern] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getJournalEntries();
      setEntries(data);
      setLoading(false);
    }
    load();
  }, []);

  // Get unique patterns from entries for filter
  const entryPatterns = new Set<string>();
  entries.forEach((e) => {
    const prompt = e.promptId.split("-")[0];
    if (patternInfo[prompt]) entryPatterns.add(prompt);
  });

  const filtered = filterPattern
    ? entries.filter((e) => e.promptId.startsWith(filterPattern + "-"))
    : entries;

  // Group entries by day
  const grouped: Record<string, JournalEntry[]> = {};
  filtered.forEach((e) => {
    const label = formatDate(e.date);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(e);
  });
  const dayLabels = Object.keys(grouped);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🧭</div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Detail view
  if (selected) {
    const pattern = selected.promptId.split("-")[0];
    const info = patternInfo[pattern];
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center p-6">
        <div className="max-w-2xl w-full pt-4">
          <div className="mb-8 pt-4">
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Back to history
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              {info && (
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: info.color + "20",
                    color: info.color,
                  }}
                >
                  {info.name}
                </span>
              )}
              <span className="text-xs text-slate-500 capitalize">
                {selected.promptId.includes("morning")
                  ? "morning"
                  : selected.promptId.includes("evening")
                    ? "evening"
                    : "anytime"}
              </span>
            </div>

            <p className="text-lg font-medium text-slate-800 leading-relaxed mb-6">
              {selected.promptText}
            </p>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selected.response}
              </p>
            </div>

            {selected.followUpResponse && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 italic mb-3">
                  Follow-up response:
                </p>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selected.followUpResponse}
                </p>
              </div>
            )}
          </div>

          {/* Mood & energy */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {selected.mood !== undefined && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500 mb-2">Mood</p>
                <div className="text-3xl mb-1">
                  {moodLabels[selected.mood - 1] ?? "😐"}
                </div>
                <p className="text-xs text-slate-500">
                  {moodWords[selected.mood - 1] ?? "—"}
                </p>
              </div>
            )}
            {selected.energy !== undefined && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                <p className="text-sm text-slate-500 mb-2">Energy</p>
                <div className="text-3xl mb-1">
                  {energyLabels[selected.energy - 1] ?? "🔋"}
                </div>
                <p className="text-xs text-slate-500">
                  {energyWords[selected.energy - 1] ?? "—"}
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              {formatDate(selected.date)} at {formatTime(selected.date)}
            </p>
          </div>

          <p className="text-center text-xs text-slate-500 mt-8">
            Made with love by Jess and Kai 🩷
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            No entries yet
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Your journal entries will show up here once you start writing.
            Everything stays on your device — nobody else can see it.
          </p>
          <button
            onClick={onBackToHub}
            className="text-rose-500 hover:text-rose-600 font-medium"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center p-6">
      <div className="max-w-2xl w-full pt-4">
        <div className="mb-6 pt-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Your Journal</h1>
            <p className="text-sm text-slate-500">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </p>
          </div>
        </div>

        {/* Pattern filters */}
        {entryPatterns.size > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterPattern(null)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                filterPattern === null
                  ? "bg-slate-700 text-white"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              All
            </button>
            {Array.from(entryPatterns).map((p) => {
              const info = patternInfo[p];
              if (!info) return null;
              return (
                <button
                  key={p}
                  onClick={() => setFilterPattern(p)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    filterPattern === p
                      ? "text-white"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                  style={
                    filterPattern === p
                      ? { backgroundColor: info.color }
                      : undefined
                  }
                >
                  {info.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Entries grouped by day */}
        <div className="space-y-8">
          {dayLabels.map((day) => (
            <div key={day}>
              <h2 className="text-sm font-medium text-slate-500 mb-3 px-1">
                {day}
              </h2>
              <div className="space-y-3">
                {grouped[day].map((entry) => {
                  const pattern = entry.promptId.split("-")[0];
                  const info = patternInfo[pattern];
                  return (
                    <button
                      key={entry.id}
                      onClick={() => setSelected(entry)}
                      className="w-full text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-rose-200 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-sm text-slate-500">
                          {formatTime(entry.date)}
                        </p>
                        <div className="flex items-center gap-2">
                          {entry.mood !== undefined && (
                            <span className="text-lg">
                              {moodLabels[entry.mood - 1] ?? "😐"}
                            </span>
                          )}
                          {entry.energy !== undefined && (
                            <span className="text-lg">
                              {energyLabels[entry.energy - 1] ?? "🔋"}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm font-medium text-slate-700 leading-relaxed mb-2 line-clamp-2">
                        {entry.promptText}
                      </p>

                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {entry.response}
                      </p>

                      {info && (
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: info.color }}
                          />
                          <span className="text-xs text-slate-500">
                            {info.name}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">
              No entries for this filter.
            </p>
            <button
              onClick={() => setFilterPattern(null)}
              className="text-sm text-rose-500 hover:text-rose-600 mt-2"
            >
              Show all →
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-500 mt-10 mb-4">
          🔒 Everything stays on your device. Made with love by Jess and Kai 🩷
        </p>
      </div>
    </div>
  );
}
