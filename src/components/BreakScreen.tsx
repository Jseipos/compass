"use client";

import { useState } from "react";
import type { BreakScreen as BreakScreenData } from "@/lib/breaks";

interface BreakScreenProps {
  screen: BreakScreenData;
  onComplete: (answers: Record<string, number>) => void;
  onSkip: () => void;
}

export default function BreakScreen({ screen, onComplete, onSkip }: BreakScreenProps) {
  const [ranking, setRanking] = useState(
    screen.rankItems ? [...screen.rankItems] : []
  );
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(50);

  const handleDone = () => {
    let answers: Record<string, number> = {};
    if (screen.type === "ranking" && ranking.length > 0) {
      // Top item gets highest weight
      ranking.forEach((item, idx) => {
        answers[item.id] = ranking.length - idx;
      });
    } else if (screen.type === "visual-pick" && pickedId) {
      answers[pickedId] = 3;
    } else if (screen.type === "slider") {
      answers["slider"] = sliderValue;
      if (sliderValue > 66) answers["high"] = 3;
      else if (sliderValue > 33) answers["high"] = 1;
    }
    onComplete(answers);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...ranking];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setRanking(next);
  };

  const moveDown = (idx: number) => {
    if (idx === ranking.length - 1) return;
    const next = [...ranking];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setRanking(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-teal-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{screen.title}</h1>
          {screen.subtitle && (
            <p className="text-slate-500">{screen.subtitle}</p>
          )}
        </div>

        {/* Ranking */}
        {screen.type === "ranking" && (
          <div className="space-y-3 mb-8">
            {ranking.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white rounded-xl border-2 border-slate-200 p-4"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-lg leading-none"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === ranking.length - 1}
                    className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-lg leading-none"
                  >
                    ▼
                  </button>
                </div>
                <div className="text-2xl">{item.emoji}</div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.label}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visual Pick */}
        {screen.type === "visual-pick" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {screen.pickOptions?.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPickedId(opt.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                  pickedId === opt.id
                    ? "border-rose-400 bg-rose-50 scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-3xl mb-3">{opt.emoji}</div>
                <p className="text-slate-800 leading-relaxed">{opt.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Slider */}
        {screen.type === "slider" && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 mb-8">
            <p className="text-lg text-slate-800 text-center mb-8">
              {screen.sliderQuestion}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl">{screen.sliderMin?.emoji}</div>
              <input
                type="range"
                min={0}
                max={100}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="flex-1 accent-rose-400"
              />
              <div className="text-3xl">{screen.sliderMax?.emoji}</div>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{screen.sliderMin?.label}</span>
              <span>{screen.sliderMax?.label}</span>
            </div>
          </div>
        )}

        {/* Celebration text */}
        {screen.celebration && (
          <p className="text-center text-rose-500 font-medium mb-6">
            {screen.celebration}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleDone}
            disabled={
              (screen.type === "visual-pick" && !pickedId) ||
              (screen.type === "ranking" && ranking.length === 0)
            }
            className="w-full py-4 bg-gradient-to-r from-rose-400 to-teal-400 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
          <button
            onClick={onSkip}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors text-center"
          >
            Skip this
          </button>
        </div>
      </div>
    </div>
  );
}
