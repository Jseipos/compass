"use client";

interface TabBarProps {
  active: "home" | "journal" | "history" | "settings";
  onNavigate: (tab: "home" | "journal" | "history" | "settings") => void;
  journalDisabled?: boolean;
}

const tabs = [
  { id: "home", label: "Home", icon: "🧭" },
  { id: "journal", label: "Journal", icon: "✍️" },
  { id: "history", label: "History", icon: "📋" },
  { id: "settings", label: "Settings", icon: "⚙️" },
] as const;

export default function TabBar({ active, onNavigate, journalDisabled }: TabBarProps) {
  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 h-16">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const isDisabled = tab.id === "journal" && journalDisabled;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onClick={() => !isDisabled && onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all min-w-[64px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${
                isActive
                  ? "text-rose-600"
                  : isDisabled
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <span className="text-2xl leading-none" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="text-xs font-semibold leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
