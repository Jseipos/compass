"use client";

interface WelcomeProps {
  onBegin: () => void;
}

export default function Welcome({ onBegin }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-8" aria-hidden="true">🧭</div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6 leading-snug">
          Sometimes your brain won&apos;t shut up.
          <br />
          Sometimes it goes too quiet.
        </h1>

        <p className="text-slate-600 leading-relaxed mb-8">
          Compass helps you figure out which patterns are running the show
          and gives you prompts worth writing about.
        </p>

        <p className="text-sm text-slate-500 leading-relaxed mb-10">
          No account, no server, no cloud.
          <br />
          What you write stays on your phone.
        </p>

        <button
          onClick={onBegin}
          className="w-full py-4 bg-gradient-to-r from-rose-400 to-teal-400 text-white font-medium rounded-xl hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
        >
          Start your journey →
        </button>

        <p className="text-xs text-slate-400 mt-12">
          Compass is a journaling tool, not a substitute for professional care.
          <br />
          If you&apos;re in crisis, call or text 988.
        </p>
      </div>
    </div>
  );
}
