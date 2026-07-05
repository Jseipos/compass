"use client";

import { useState } from "react";
import { deleteAllData } from "@/lib/storage";

export default function Settings() {
  const [cleared, setCleared] = useState(false);

  const handleReset = async () => {
    await deleteAllData();
    setCleared(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-4xl mb-6">🧭</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Settings</h1>

        {cleared ? (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-6">
            <p className="text-teal-700 font-medium mb-1">Cleared!</p>
            <p className="text-sm text-teal-600">Taking you back to the start...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 text-left">
              <h2 className="font-medium text-slate-800 mb-2">Reset everything</h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                This deletes your assessment answers, journal entries, and plan.
                Everything is stored locally on your device, so it's gone for real.
                No backup. No undo.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 bg-rose-400 text-white font-medium rounded-xl hover:bg-rose-500 transition-colors"
              >
                Delete all my data
              </button>
            </div>
            <button
              onClick={() => window.location.href = "/"}
              className="text-sm text-slate-500 hover:text-slate-600 transition-colors"
            >
              ← Back
            </button>
          </>
        )}

        <p className="text-xs text-slate-500 mt-8">
          Made with love by Jess and Kai 🩷
        </p>
      </div>
    </div>
  );
}
