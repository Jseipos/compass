// SceneButton — reusable floating button for full-screen journey scenes
// ADA compliant: high contrast on any terrain background, visible focus, aria support

interface SceneButtonProps {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  position?: "top-left" | "top-right";
}

export default function SceneButton({
  onClick,
  ariaLabel,
  children,
  position = "top-right",
}: SceneButtonProps) {
  const positionClass =
    position === "top-right" ? "top-4 right-4" : "top-4 left-4";

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`absolute ${positionClass} z-30 w-12 h-12 rounded-full bg-slate-900/70 backdrop-blur-md flex items-center justify-center text-white text-lg hover:bg-slate-900/90 active:bg-slate-900 transition-colors cursor-pointer border-2 border-white/40 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
      style={{ marginTop: "env(safe-area-inset-top)" }}
    >
      {children}
    </button>
  );
}
