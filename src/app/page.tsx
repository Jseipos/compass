"use client";

import { useEffect, useState, useCallback } from "react";
import { getAssessmentAnswers, saveAssessmentAnswers } from "@/lib/storage";
import { scoreAssessment, questionGroups } from "@/lib/assessment";
import { generatePlan, type JournalPrompt } from "@/lib/prompts";
import { breakScreens, type BreakScreen as BreakScreenData } from "@/lib/breaks";
import Assessment from "@/components/Assessment";
import BreakScreen from "@/components/BreakScreen";
import Results from "@/components/Results";
import Journal from "@/components/Journal";
import History from "@/components/History";

type View = "loading" | "hub" | "results" | "journal" | "history" | "break" | string;

export default function Home() {
  const [view, setView] = useState<View>("loading");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [plan, setPlan] = useState<{ patterns: string[]; prompts: JournalPrompt[] } | null>(null);
  const [resultsData, setResultsData] = useState<{
    patterns: Record<string, number>;
    topPatterns: string[];
    totalScore: number;
  } | null>(null);
  const [pendingBreak, setPendingBreak] = useState<BreakScreenData | null>(null);
  const [shownBreaks, setShownBreaks] = useState<Set<number>>(new Set());

  const totalQuestions = questionGroups.reduce((sum, g) => sum + g.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const completedGroups = questionGroups.filter((g) =>
    g.questions.every((q) => answers[q.id] !== undefined)
  ).length;

  // Load saved answers on mount
  useEffect(() => {
    async function load() {
      const saved = await getAssessmentAnswers();
      if (saved && Object.keys(saved).length > 0) {
        setAnswers(saved);
        const results = scoreAssessment(saved);
        if (results.topPatterns.length > 0) {
          setPlan(generatePlan(results.topPatterns));
        }
        setView("hub");
      } else {
        setView("hub");
      }
    }
    load();
  }, []);

  const updateAnswers = useCallback(async (newAnswers: Record<string, number>) => {
    setAnswers(newAnswers);
    await saveAssessmentAnswers(newAnswers);
    const results = scoreAssessment(newAnswers);
    if (results.topPatterns.length > 0) {
      setPlan(generatePlan(results.topPatterns));
    }
  }, []);

  const checkForBreak = useCallback((newAnswers: Record<string, number>) => {
    const count = Object.keys(newAnswers).length;
    for (const { afterQuestion, screen } of breakScreens) {
      if (count >= afterQuestion && !shownBreaks.has(afterQuestion)) {
        setShownBreaks((prev) => new Set(prev).add(afterQuestion));
        setPendingBreak(screen);
        return true;
      }
    }
    return false;
  }, [shownBreaks]);

  const handleSeeResults = () => {
    const results = scoreAssessment(answers);
    setResultsData(results);
    setView("results");
  };

  const handleStartJournaling = () => {
    setView("journal");
  };

  const handleViewHistory = () => {
    setView("history");
  };

  const handleBackToHub = () => {
    setView("hub");
  };

  if (view === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🧭</div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Hub — shows progress + navigation
  if (view === "hub") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center p-4 sm:p-6">
        <div className="max-w-2xl w-full pt-4 sm:pt-6">
          {/* Hero — compact */}
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🧭</div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">
              {answeredCount === 0 ? "What gets in your way?" : "Welcome back"}
            </h1>
            <p className="text-sm text-slate-500">
              {answeredCount === 0
                ? "Pick a topic below. Answer as many or as few as you want."
                : `${answeredCount}/${totalQuestions} answered · ${completedGroups}/${questionGroups.length} topics`}
            </p>
          </div>

          {/* Progress bar — compact */}
          {answeredCount > 0 && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-teal-400 transition-all duration-500"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-sm text-slate-400">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
            </div>
          )}

          {/* Journal + History — ABOVE topic cards so always visible */}
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-3">
              {plan && plan.prompts.length > 0 && (
                <button
                  onClick={handleStartJournaling}
                  className="py-4 bg-gradient-to-r from-rose-400 to-teal-400 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  Journal →
                </button>
              )}
              <button
                onClick={handleViewHistory}
                className={`py-4 font-medium rounded-xl transition-all ${
                  plan && plan.prompts.length > 0
                    ? "bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300"
                    : "bg-gradient-to-r from-rose-400 to-teal-400 text-white hover:opacity-90 col-span-2"
                }`}
              >
                History →
              </button>
            </div>

            {/* See results button — only if assessment has data */}
            {answeredCount > 0 && (
              <button
                onClick={handleSeeResults}
                className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors text-center"
              >
                See my patterns →
              </button>
            )}

            {answeredCount > 0 && answeredCount < totalQuestions && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-700">
                  💡 More personalized prompts as you answer more topics. {questionGroups.length - completedGroups} left.
                </p>
              </div>
            )}

            {answeredCount === 0 && (
              <p className="text-center text-sm text-slate-400">
                Answer at least one topic to unlock journaling
              </p>
            )}
          </div>

          {/* Topic cards — compact, below action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {questionGroups.map((group) => {
              const groupAnswered = group.questions.filter((q) => answers[q.id] !== undefined).length;
              const isComplete = groupAnswered === group.questions.length;
              return (
                <button
                  key={group.id}
                  onClick={() => setView("assessment-" + group.id as any)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isComplete
                      ? "border-teal-300 bg-teal-50/50"
                      : "border-slate-200 bg-white hover:border-rose-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{group.emoji}</div>
                      <h2 className="font-bold text-slate-800 text-sm">{group.title}</h2>
                    </div>
                    {isComplete && (
                      <div className="text-xs text-teal-600 font-medium bg-teal-100 px-2 py-0.5 rounded-full">
                        ✓
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2 line-clamp-2">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isComplete ? "bg-teal-400" : "bg-rose-300"
                        }`}
                        style={{ width: `${(groupAnswered / group.questions.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {groupAnswered}/{group.questions.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mb-3">
            <a href="/settings" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Settings
            </a>
          </div>

          <p className="text-center text-xs text-slate-400">
            Made with love by Jess and Kai 🩷
          </p>
        </div>
      </div>
    );
  }

  // Assessment view for a specific group
  if (view.startsWith("assessment-")) {
    const groupId = view.replace("assessment-", "");
    return (
      <Assessment
        answers={answers}
        groupId={groupId}
        onComplete={(newAnswers) => {
          updateAnswers(newAnswers);
          if (!checkForBreak(newAnswers)) {
            setView("hub");
          } else {
            setView("break");
          }
        }}
      />
    );
  }

  if (view === "break" && pendingBreak) {
    return (
      <BreakScreen
        screen={pendingBreak}
        onComplete={() => {
          setPendingBreak(null);
          setView("hub");
        }}
        onSkip={() => {
          setPendingBreak(null);
          setView("hub");
        }}
      />
    );
  }

  if (view === "results" && resultsData) {
    return (
      <Results
        patterns={resultsData.patterns}
        topPatterns={resultsData.topPatterns}
        totalScore={resultsData.totalScore}
        onContinue={handleStartJournaling}
        onBack={handleBackToHub}
      />
    );
  }

  if (view === "journal" && plan) {
    return (
      <Journal
        plan={plan}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onBackToHub={handleBackToHub}
      />
    );
  }

  if (view === "history") {
    return <History onBackToHub={handleBackToHub} />;
  }

  return null;
}
