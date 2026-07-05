"use client";

import { useState, useEffect } from "react";
import { getDailyPromptChoices, type JournalPrompt } from "@/lib/prompts";
import { saveJournalEntry, type JournalEntry } from "@/lib/storage";

interface JournalProps {
  plan: { patterns: string[]; prompts: JournalPrompt[] };
  answeredCount: number;
  totalQuestions: number;
  therapistPatterns?: string[];
  onBackToHub: () => void;
}

export default function Journal({ plan, answeredCount, totalQuestions, therapistPatterns = [], onBackToHub }: JournalProps) {
  const [choices, setChoices] = useState<[JournalPrompt, JournalPrompt] | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<JournalPrompt | null>(null);
  const [response, setResponse] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState("");
  const [showFollowUpInput, setShowFollowUpInput] = useState(false);
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (plan.prompts.length > 0) {
      setChoices(getDailyPromptChoices(plan, 0, therapistPatterns));
    }
  }, [plan]);

  if (!choices) return null;

  const handleSave = async () => {
    if (!selectedPrompt) return;
    const entry: JournalEntry = {
      id: `${Date.now()}`,
      date: new Date().toISOString(),
      promptId: selectedPrompt.id,
      promptText: selectedPrompt.text,
      response,
      followUpResponse: followUpResponse || undefined,
      mood,
      energy,
    };
    await saveJournalEntry(entry);
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">🌿</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Saved</h2>
          <p className="text-slate-500 mb-8">
            Your entry is stored locally on your device. Nobody else can see it.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setSaved(false);
                setSelectedPrompt(null);
                setResponse("");
                setFollowUpResponse("");
                setShowFollowUpInput(false);
              }}
              className="text-rose-500 hover:text-rose-600 font-medium"
            >
              Write another →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const moodEmojis = ["😞", "😕", "😐", "🙂", "😄"];
  const energyEmojis = ["🪫", "🔋", "⚡"];

  // Step 1: Choose a prompt
  if (!selectedPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center p-6">
        <div className="max-w-2xl w-full">
          <div className="mb-8 pt-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Today's Journal</h1>
              <p className="text-sm text-slate-400">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Nudge if not all topics answered */}
          {answeredCount < totalQuestions && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-700">
                💡 You've answered {answeredCount} of {totalQuestions} questions. Your prompts will get more personalized as you answer more topics.
                <button
                  onClick={onBackToHub}
                  className="underline ml-1 hover:text-amber-800"
                >
                  Answer more →
                </button>
              </p>
            </div>
          )}

          <p className="text-center text-slate-500 mb-6">
            Which one feels more like today?
          </p>

          <div className="space-y-4">
            {choices.map((prompt, idx) => (
              <button
                key={prompt.id}
                onClick={() => setSelectedPrompt(prompt)}
                className="w-full text-left p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-rose-100 flex items-center justify-center text-lg font-bold text-slate-400 group-hover:text-rose-500 transition-colors flex-shrink-0">
                    {idx === 0 ? "A" : "B"}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-slate-800 leading-relaxed">
                      {prompt.text}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 capitalize">
                      {prompt.type} · {prompt.timeOfDay ?? "anytime"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            Made with love by Jess and Kai 🩷
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Write
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-8 pt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Pick a different prompt
            </button>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Today's Journal</h1>
            <p className="text-sm text-slate-400">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <p className="text-lg font-medium text-slate-800 leading-relaxed mb-2">
            {selectedPrompt.text}
          </p>
          {selectedPrompt.followUp && !showFollowUpInput && response.length > 20 && (
            <button
              onClick={() => setShowFollowUpInput(true)}
              className="text-sm text-rose-500 hover:text-rose-600 mt-3"
            >
              There's a follow-up →
            </button>
          )}
          {showFollowUpInput && selectedPrompt.followUp && (
            <p className="text-sm text-slate-500 leading-relaxed italic mt-4 p-3 bg-slate-50 rounded-lg">
              {selectedPrompt.followUp}
            </p>
          )}
        </div>

        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Just write. No structure needed. This is for you."
          className="w-full min-h-[200px] p-5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none transition-colors resize-none leading-relaxed"
        />

        {showFollowUpInput && selectedPrompt.followUp && (
          <textarea
            value={followUpResponse}
            onChange={(e) => setFollowUpResponse(e.target.value)}
            placeholder="Your response to the follow-up..."
            className="w-full min-h-[120px] p-5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none transition-colors resize-none leading-relaxed mt-4"
          />
        )}

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500 mb-3">Mood</p>
            <div className="flex justify-between">
              {moodEmojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i + 1)}
                  className={`text-2xl transition-transform ${
                    mood === i + 1 ? "scale-125" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500 mb-3">Energy</p>
            <div className="flex justify-between">
              {energyEmojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setEnergy(i + 1)}
                  className={`text-2xl transition-transform ${
                    energy === i + 1 ? "scale-125" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={response.trim().length < 5}
          className="w-full py-4 mt-6 bg-gradient-to-r from-rose-400 to-teal-400 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Save Entry
        </button>

        <p className="text-center text-xs text-slate-400 mt-6">
          🔒 Everything stays on your device. Made with love by Jess and Kai 🩷
        </p>
      </div>
    </div>
  );
}
