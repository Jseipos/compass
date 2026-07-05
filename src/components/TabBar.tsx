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
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 h-14">
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
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-[60px] ${
                isActive
                  ? "text-rose-500"
                  : isDisabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="text-[10px] font-medium leading-none">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
