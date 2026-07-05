"use client";

import { patternInfo } from "@/lib/assessment";

interface ResultsProps {
  patterns: Record<string, number>;
  topPatterns: string[];
  totalScore: number;
  onContinue: () => void;
  onBack?: () => void;
}

export default function Results({ patterns, topPatterns, totalScore, onContinue, onBack }: ResultsProps) {
  const maxScore = Math.max(...Object.values(patterns), 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
          >
            ← Topics
          </button>
        )}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Here's what we noticed
          </h1>
          <p className="text-slate-500">
            Based on what you shared, these are the areas that seem to affect you most.
            Your journaling plan will focus on these.
          </p>
        </div>

        {/* Pattern bars */}
        <div className="space-y-4 mb-8">
          {topPatterns.map((pattern) => {
            const info = patternInfo[pattern];
            const score = patterns[pattern] ?? 0;
            const pct = (score / maxScore) * 100;
            return (
              <div key={pattern} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-800">{info.name}</p>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">{info.theme}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: info.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 mb-8">
          <p className="text-sm text-rose-800 leading-relaxed">
            This isn't a diagnosis. It's a reflection of what you told us about your daily experience.
            Your prompts are tailored to these areas — not to label you, but to help you reflect on
            the things that actually impact your life.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-4 bg-gradient-to-r from-rose-400 to-teal-400 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          Start Journaling →
        </button>

        <p className="text-center text-xs text-slate-400 mt-8">
          Made with love by Jess and Kai 🩷
        </p>
      </div>
    </div>
  );
}
