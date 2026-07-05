"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getAssessmentAnswers, saveAssessmentAnswers } from "@/lib/storage";
import { scoreAssessment, questionGroups } from "@/lib/assessment";
import { generatePlan, type JournalPrompt } from "@/lib/prompts";
import { breakScreens, type BreakScreen as BreakScreenData } from "@/lib/breaks";
import Assessment from "@/components/Assessment";
import BreakScreen from "@/components/BreakScreen";
import Results from "@/components/Results";
import Journal from "@/components/Journal";
import History from "@/components/History";
import TabBar from "@/components/TabBar";
import Welcome from "@/components/Welcome";

type Tab = "home" | "journal" | "history" | "settings";
type View = "loading" | "welcome" | Tab | "results" | "break" | string;

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

  const journalEnabled = !!(plan && plan.prompts.length > 0);

  useEffect(() => {
    async function load() {
      const { getPref } = await import("@/lib/storage");
      const hasSeenWelcome = await getPref("hasSeenWelcome");

      const saved = await getAssessmentAnswers();
      if (saved && Object.keys(saved).length > 0) {
        setAnswers(saved);
        const results = scoreAssessment(saved);
        if (results.topPatterns.length > 0) {
          setPlan(generatePlan(results.topPatterns));
        }
      }

      if (!hasSeenWelcome) {
        setView("welcome");
      } else {
        setView("home");
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

  const handleNavigate = (tab: Tab) => {
    setView(tab);
  };

  const handleSeeResults = () => {
    const results = scoreAssessment(answers);
    setResultsData(results);
    setView("results");
  };

  // Determine which tab is "active" for highlight purposes
  const activeTab: Tab = view === "results" || view.startsWith("assessment-") ? "home" : (view as Tab);

  if (view === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🧭</div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === "welcome") {
    return (
      <Welcome
        onBegin={async () => {
          const { setPref } = await import("@/lib/storage");
          await setPref("hasSeenWelcome", "true");
          setView("home");
        }}
      />
    );
  }

  // Assessment view (no tab bar — it's a sub-view of Home)
  if (view.startsWith("assessment-")) {
    const groupId = view.replace("assessment-", "");
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <TabBar active="home" onNavigate={handleNavigate} journalDisabled={!journalEnabled} />
        <Assessment
          answers={answers}
          groupId={groupId}
          onComplete={(newAnswers) => {
            updateAnswers(newAnswers);
            if (!checkForBreak(newAnswers)) {
              setView("home");
            } else {
              setView("break");
            }
          }}
        />
      </div>
    );
  }

  // Break screen (no tab bar — it's a transition)
  if (view === "break" && pendingBreak) {
    return (
      <BreakScreen
        screen={pendingBreak}
        onComplete={() => {
          setPendingBreak(null);
          setView("home");
        }}
        onSkip={() => {
          setPendingBreak(null);
          setView("home");
        }}
      />
    );
  }

  // Results (tab bar with home active)
  if (view === "results" && resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <TabBar active="home" onNavigate={handleNavigate} journalDisabled={!journalEnabled} />
        <Results
          patterns={resultsData.patterns}
          topPatterns={resultsData.topPatterns}
          totalScore={resultsData.totalScore}
          onContinue={() => setView("journal")}
          onBack={() => setView("home")}
        />
      </div>
    );
  }

  // All main tab views get the TabBar
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <TabBar active={activeTab} onNavigate={handleNavigate} journalDisabled={!journalEnabled} />

      {view === "home" && (
        <div className="flex flex-col items-center p-4 sm:p-6">
          <div className="max-w-2xl w-full pt-4 sm:pt-6">
            {/* Hero */}
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

            {/* Progress bar */}
            {answeredCount > 0 && (
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-teal-400 transition-all duration-500"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-500">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
              </div>
            )}

            {/* See patterns link */}
            {answeredCount > 0 && (
              <div className="text-center mb-4">
                <button
                  onClick={handleSeeResults}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline"
                >
                  See my patterns →
                </button>
              </div>
            )}

            {/* Nudge */}
            {answeredCount > 0 && answeredCount < totalQuestions && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center mb-4">
                <p className="text-xs text-amber-700">
                  💡 More personalized prompts as you answer more topics. {questionGroups.length - completedGroups} left.
                </p>
              </div>
            )}

            {answeredCount === 0 && (
              <p className="text-center text-sm text-slate-500 mb-4">
                Answer at least one topic to unlock journaling
              </p>
            )}

            {/* Topic cards */}
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
                        <div className="text-2xl" aria-hidden="true">{group.emoji}</div>
                        <h2 className="font-bold text-slate-800 text-sm">{group.title}</h2>
                      </div>
                      {isComplete && (
                        <div className="text-xs text-teal-700 font-medium bg-teal-100 px-2 py-0.5 rounded-full">
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
                      <span className="text-xs text-slate-500">
                        {groupAnswered}/{group.questions.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-slate-500">
              Made with love by Jess and Kai 🩷
            </p>
          </div>
        </div>
      )}

      {view === "journal" && plan && (
        <Journal
          plan={plan}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          onBackToHub={() => setView("home")}
        />
      )}

      {view === "journal" && !journalEnabled && (
        <div className="flex flex-col items-center justify-center p-6 min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="text-xl font-bold text-slate-800 mb-2">Journaling locked</h1>
            <p className="text-sm text-slate-500 mb-6">
              Answer at least one topic on the Home tab to unlock personalized journal prompts.
            </p>
            <button
              onClick={() => setView("home")}
              className="text-rose-500 hover:text-rose-600 font-medium"
            >
              Go to Home →
            </button>
          </div>
        </div>
      )}

      {view === "history" && (
        <History onBackToHub={() => setView("home")} />
      )}

      {view === "settings" && <SettingsView onReset={() => setView("home")} />}
    </div>
  );
}

// Inline settings view (replaces the separate /settings route for tab navigation)
function SettingsView({ onReset }: { onReset: () => void }) {
  const [cleared, setCleared] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [therapistText, setTherapistText] = useState("");
  const [therapistSaved, setTherapistSaved] = useState(false);
  const [savedPlan, setSavedPlan] = useState<string | null>(null);

  // Load saved therapist plan on mount
  useEffect(() => {
    async function load() {
      const { getTherapistPlan } = await import("@/lib/storage");
      const plan = await getTherapistPlan();
      if (plan) {
        setTherapistText(plan.text);
        setSavedPlan(plan.text);
      }
    }
    load();
  }, []);

  const handleReset = async () => {
    const { deleteAllData } = await import("@/lib/storage");
    await deleteAllData();
    setCleared(true);
    setTimeout(() => onReset(), 1500);
  };

  const handleExport = async () => {
    const { exportAllData } = await import("@/lib/storage");
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().split("T")[0];
    a.download = `compass-export-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.app !== "compass") {
        setImportResult("That doesn't look like a Compass export file.");
        return;
      }
      const { importData } = await import("@/lib/storage");
      const result = await importData(data);
      setImportResult(`Imported ${result.entries} journal entries${result.assessment ? " + assessment answers" : ""}.`);
      setTimeout(() => onReset(), 2000);
    } catch {
      setImportResult("Couldn't read that file. Make sure it's a valid Compass export.");
    }
  };

  const handleSaveTherapist = async () => {
    const { saveTherapistPlan } = await import("@/lib/storage");
    await saveTherapistPlan(therapistText);
    setTherapistSaved(true);
    setSavedPlan(therapistText);
    setTimeout(() => setTherapistSaved(false), 2000);
  };

  const handleClearTherapist = async () => {
    const { saveTherapistPlan } = await import("@/lib/storage");
    await saveTherapistPlan("");
    setTherapistText("");
    setSavedPlan(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[60vh]">
      <div className="max-w-md w-full text-center">
        <div className="text-3xl mb-4" aria-hidden="true">⚙️</div>
        <h1 className="text-xl font-bold text-slate-800 mb-4">Settings</h1>

        {cleared ? (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-6">
            <p className="text-teal-700 font-medium mb-1">Cleared!</p>
            <p className="text-sm text-teal-600">Taking you back to the start...</p>
          </div>
        ) : (
          <>
            {/* Therapist Treatment Plan */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 text-left">
              <h2 className="font-medium text-slate-800 mb-2">Therapist recommendations</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Paste your therapist&apos;s treatment plan, recommended focus areas, or session notes here.
                Compass will read it and prioritize journal prompts that match what you&apos;re working on in therapy.
              </p>
              <textarea
                value={therapistText}
                onChange={(e) => setTherapistText(e.target.value)}
                placeholder="e.g., Diagnosis: PTSD, Generalized Anxiety. Focus on grounding techniques, anxiety tracking, sleep journaling. Working on avoidance patterns and hypervigilance..."
                aria-label="Therapist recommendations"
                className="w-full min-h-[120px] p-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-rose-300 focus:outline-none transition-colors resize-none leading-relaxed text-sm mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveTherapist}
                  disabled={therapistText.trim().length < 5}
                  className="flex-1 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {therapistSaved ? "Saved ✓" : "Save plan"}
                </button>
                {savedPlan && (
                  <button
                    onClick={handleClearTherapist}
                    className="py-3 px-4 bg-white border-2 border-slate-200 text-slate-600 font-medium rounded-xl hover:border-slate-300 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              {savedPlan && (
                <p className="text-xs text-slate-400 mt-3">
                  ✓ Plan saved. Your journal prompts will prioritize these focus areas.
                </p>
              )}
            </div>

            {/* Export */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 text-left">
              <h2 className="font-medium text-slate-800 mb-2">Export your data</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Download a backup of your assessment answers, journal entries, and therapist plan.
              </p>
              <button
                onClick={handleExport}
                className="w-full py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Export data ↓
              </button>
            </div>

            {/* Import backup */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4 text-left">
              <h2 className="font-medium text-slate-800 mb-2">Restore from backup</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Import a previous Compass export file. This adds to your existing data.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
              >
                Choose file ↑
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImport}
                className="hidden"
                aria-label="Import Compass backup file"
              />
              {importResult && (
                <p className="text-sm text-teal-600 mt-3 text-center">{importResult}</p>
              )}
            </div>

            {/* Reset */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 text-left">
              <h2 className="font-medium text-slate-800 mb-2">Reset everything</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                This deletes your assessment answers, journal entries, therapist plan, and cached data.
                Everything is stored locally on your device, so it&apos;s gone for real.
                No backup. No undo.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors"
              >
                Delete all my data
              </button>
            </div>
          </>
        )}

        <div className="flex justify-center gap-4 mb-3">
          <a href="/privacy" className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline">
            Privacy Policy
          </a>
        </div>

        <p className="text-xs text-slate-500">
          Made with love by Jess and Kai 🩷
        </p>
      </div>
    </div>
  );
}
