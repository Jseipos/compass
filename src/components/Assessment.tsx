"use client";

import { useState, useEffect } from "react";
import { questionGroups, answerScale, type Question } from "@/lib/assessment";

interface AssessmentProps {
  answers: Record<string, number>;
  groupId: string;
  onComplete: (answers: Record<string, number>) => void;
}

export default function Assessment({ answers, groupId, onComplete }: AssessmentProps) {
  const group = questionGroups.find((g) => g.id === groupId)!;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [localAnswers, setLocalAnswers] = useState<Record<string, number>>(answers);

  const question: Question = group.questions[currentIdx];
  const progress = ((currentIdx + 1) / group.questions.length) * 100;

  // Load existing answer for first question
  useEffect(() => {
    const existing = localAnswers[group.questions[0]?.id];
    setSelected(existing !== undefined ? existing : null);
  }, [groupId]);

  const handleAnswer = (value: number) => {
    setSelected(value);
    const newAnswers = { ...localAnswers, [question.id]: value };
    setLocalAnswers(newAnswers);

    setTimeout(() => {
      if (currentIdx < group.questions.length - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        const nextExisting = newAnswers[group.questions[nextIdx].id];
        setSelected(nextExisting !== undefined ? nextExisting : null);
      } else {
        // Finished this group
        onComplete(newAnswers);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onComplete(localAnswers)}
            className="text-sm text-slate-500 hover:text-slate-600 transition-colors"
          >
            ← All topics
          </button>
          <span className="text-sm text-slate-500 font-medium">
            {group.emoji} {group.title}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500 font-medium">
              {currentIdx + 1} of {group.questions.length}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-teal-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scenario */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <p className="text-lg text-slate-800 leading-relaxed mb-3">
            {question.text}
          </p>
          {question.help && (
            <p className="text-sm text-slate-500 leading-relaxed">
              {question.help}
            </p>
          )}
        </div>

        {/* Answers */}
        <div className="space-y-3">
          {answerScale.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                selected === option.value
                  ? "border-rose-400 bg-rose-50"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{option.label}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{option.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${
                  selected === option.value
                    ? "border-rose-400 bg-rose-400"
                    : "border-slate-300"
                }`}>
                  {selected === option.value && (
                    <div className="w-full h-full rounded-full scale-50 bg-white" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Back within group */}
        {currentIdx > 0 && (
          <button
            onClick={() => {
              const prevIdx = currentIdx - 1;
              setCurrentIdx(prevIdx);
              const prevExisting = localAnswers[group.questions[prevIdx].id];
              setSelected(prevExisting !== undefined ? prevExisting : null);
            }}
            className="mt-6 text-sm text-slate-500 hover:text-slate-600 transition-colors"
          >
            ← Previous
          </button>
        )}
      </div>
    </div>
  );
}
