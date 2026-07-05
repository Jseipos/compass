"use client";

import { useState } from "react";

export default function PrivacyPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const sections = [
    {
      id: "overview",
      title: "Overview",
      body: "Compass is a mental health journaling application. The short version: we don't collect, store, or transmit any of your data. Everything stays on your device.",
    },
    {
      id: "not-do",
      title: "What Compass Does Not Do",
      body: "No data collection. No accounts. No cookies. No analytics or tracking. No third-party services. No data sales or sharing. We don't have a server, database, or any backend infrastructure.",
    },
    {
      id: "where",
      title: "Where Your Data Lives",
      body: "All data — assessment answers, journal entries, mood ratings, therapist recommendations — is stored exclusively in your browser's local storage (IndexedDB) on your device. It never leaves your device, is never transmitted over the internet, and we cannot access, read, or recover it.",
    },
    {
      id: "health",
      title: "Health and Sensitive Information",
      body: "You may enter mental health information in Compass. Because all data is stored locally and never transmitted to any server, we do not collect, process, or store your health data. It remains under your sole control on your device.",
    },
    {
      id: "immutable",
      title: "Journal Entries Are Permanent",
      body: "Once you save a journal entry, it cannot be edited or deleted through the app. This is a deliberate safety decision — if you are experiencing a mental health crisis, preserving your entries ensures that a therapist or loved one reviewing your history can see an accurate record. You can still delete all data via Settings or by clearing browser storage.",
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      body: "Because Compass does not collect personal data, all state privacy rights (access, delete, correct, opt-out, portability) are automatically satisfied. You can export your data anytime in Settings. You can delete everything anytime in Settings. These rights apply under CCPA/CPRA, VCDPA, CPA, CTDPA, UCPA, TDPSA, Washington MHMDA, and all other state privacy laws.",
    },
    {
      id: "children",
      title: "Children's Privacy",
      body: "Compass is not directed at children under 13 (or 16 where applicable). No data is collected from anyone, adult or child.",
    },
    {
      id: "breaches",
      title: "Data Breaches",
      body: "Because Compass does not store data on any server, there is no risk of a data breach. Your data exists only on your device. Use a device passcode or biometric lock to protect access.",
    },
    {
      id: "international",
      title: "International Users",
      body: "Compass does not process personal data subject to GDPR or UK GDPR, as no personal data is collected. Your data remains on your device under your control regardless of where you are located.",
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      body: "If we ever add features that change how Compass handles data (cloud sync, accounts, third-party integrations), we will update this policy and notify users in the app before activating those features. We will never silently change our data practices.",
    },
    {
      id: "delete",
      title: "How to Delete Your Data",
      body: "Three options: (1) Settings → Delete all my data, (2) Clear your browser's local storage for Compass, (3) Uninstall the PWA from your device. Once deleted, data cannot be recovered — export a backup first if you want to keep it.",
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      body: "Compass is a journaling tool, not a medical device or substitute for professional mental health care. If you are experiencing a mental health crisis, contact the Veterans Crisis Line at 988 (press 1), the Suicide & Crisis Lifeline at 988, or emergency services at 911.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pt-6">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2" aria-hidden="true">🔒</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: July 4, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <p className="text-sm text-slate-600 leading-relaxed text-center">
            <strong>We don't collect, store, or transmit your data.</strong> Everything stays on your device.
          </p>
        </div>

        <div className="space-y-2 mb-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === section.id ? null : section.id)}
                aria-expanded={expanded === section.id}
                className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-slate-800 text-sm">{section.title}</span>
                <span className="text-slate-500 text-sm" aria-hidden="true">
                  {expanded === section.id ? "−" : "+"}
                </span>
              </button>
              {expanded === section.id && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{section.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to Compass
          </a>
        </div>

        <p className="text-center text-xs text-slate-500">
          Made with love by Jess and Kai 🩷
        </p>
      </div>
    </div>
  );
}
