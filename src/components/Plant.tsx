"use client";

import type { PlantType } from "./Welcome";

interface PlantProps {
  type: PlantType;
  entryCount: number;
  size?: number;
}

// Growth stages based on entry count
// 0: seed, 1-2: sprout, 3-9: small, 10-29: established, 30+: mature
function getStage(entryCount: number): "seed" | "sprout" | "small" | "established" | "mature" {
  if (entryCount === 0) return "seed";
  if (entryCount <= 2) return "sprout";
  if (entryCount <= 9) return "small";
  if (entryCount <= 29) return "established";
  return "mature";
}

export default function Plant({ type, entryCount, size = 120 }: PlantProps) {
  const stage = getStage(entryCount);

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`${type} plant, ${stage} stage, ${entryCount} entries`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pot / soil */}
        <ellipse cx="60" cy="108" rx="32" ry="6" fill="#c4a882" />
        <path d="M34 100 Q34 108 60 108 Q86 108 86 100 L82 88 L38 88 Z" fill="#d4a574" />
        <ellipse cx="60" cy="88" rx="24" ry="4" fill="#8b6f47" />

        {stage === "seed" && (
          <ellipse cx="60" cy="86" rx="5" ry="4" fill="#6b4423" />
        )}

        {stage === "sprout" && (
          <>
            <path d="M60 88 L60 72" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="55" cy="74" rx="6" ry="4" fill="#9ccc65" transform="rotate(-30 55 74)" />
            <ellipse cx="65" cy="74" rx="6" ry="4" fill="#9ccc65" transform="rotate(30 65 74)" />
          </>
        )}

        {stage === "small" && type === "sunflower" && (
          <>
            <path d="M60 88 L60 50" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="50" cy="68" rx="8" ry="5" fill="#9ccc65" transform="rotate(-25 50 68)" />
            <ellipse cx="70" cy="65" rx="8" ry="5" fill="#9ccc65" transform="rotate(25 70 65)" />
            <circle cx="60" cy="45" r="9" fill="#f9a825" />
            <circle cx="60" cy="45" r="5" fill="#6d4c41" />
          </>
        )}

        {stage === "small" && type === "cactus" && (
          <>
            <rect x="54" y="58" width="12" height="30" rx="6" fill="#66bb6a" />
            <rect x="42" y="68" width="8" height="14" rx="4" fill="#66bb6a" />
            <rect x="70" y="64" width="8" height="16" rx="4" fill="#66bb6a" />
            <circle cx="60" cy="56" r="2" fill="#ffa726" />
          </>
        )}

        {stage === "small" && type === "tulip" && (
          <>
            <path d="M60 88 L60 55" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="50" cy="70" rx="9" ry="5" fill="#9ccc65" transform="rotate(-20 50 70)" />
            <path d="M52 55 Q50 48 55 46 Q60 44 60 50 Q60 44 65 46 Q70 48 68 55 Q64 52 60 52 Q56 52 52 55 Z" fill="#ec407a" />
          </>
        )}

        {stage === "small" && type === "mint" && (
          <>
            <path d="M60 88 Q58 75 55 65 Q53 58 52 55" stroke="#7cb342" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M60 88 Q62 78 65 70 Q67 63 68 60" stroke="#7cb342" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="52" cy="58" rx="7" ry="5" fill="#aed581" transform="rotate(-15 52 58)" />
            <ellipse cx="68" cy="62" rx="7" ry="5" fill="#aed581" transform="rotate(20 68 62)" />
            <ellipse cx="56" cy="50" rx="6" ry="4" fill="#c5e1a5" transform="rotate(-10 56 50)" />
          </>
        )}

        {stage === "small" && type === "oak" && (
          <>
            <path d="M60 88 L60 62" stroke="#8d6e63" strokeWidth="4" strokeLinecap="round" />
            <circle cx="55" cy="62" r="8" fill="#66bb6a" />
            <circle cx="65" cy="58" r="7" fill="#7cb342" />
            <circle cx="60" cy="52" r="6" fill="#81c784" />
          </>
        )}

        {stage === "established" && type === "sunflower" && (
          <>
            <path d="M60 88 L60 35" stroke="#7cb342" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="46" cy="65" rx="12" ry="7" fill="#9ccc65" transform="rotate(-25 46 65)" />
            <ellipse cx="74" cy="58" rx="12" ry="7" fill="#9ccc65" transform="rotate(25 74 58)" />
            <ellipse cx="44" cy="48" rx="10" ry="6" fill="#aed581" transform="rotate(-30 44 48)" />
            <circle cx="60" cy="30" r="14" fill="#f9a825" />
            <circle cx="60" cy="30" r="9" fill="#6d4c41" />
            <circle cx="60" cy="30" r="6" fill="#4e342e" />
          </>
        )}

        {stage === "established" && type === "cactus" && (
          <>
            <rect x="50" y="40" width="20" height="48" rx="10" fill="#66bb6a" />
            <rect x="34" y="54" width="10" height="22" rx="5" fill="#66bb6a" />
            <rect x="76" y="48" width="10" height="26" rx="5" fill="#66bb6a" />
            <circle cx="60" cy="38" r="3" fill="#ffa726" />
            <circle cx="56" cy="35" r="2" fill="#ff7043" />
            <line x1="55" y1="50" x2="55" y2="52" stroke="#e0e0e0" strokeWidth="1" />
            <line x1="65" y1="55" x2="65" y2="57" stroke="#e0e0e0" strokeWidth="1" />
            <line x1="60" y1="65" x2="60" y2="67" stroke="#e0e0e0" strokeWidth="1" />
          </>
        )}

        {stage === "established" && type === "tulip" && (
          <>
            <path d="M60 88 L60 40" stroke="#7cb342" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="45" cy="65" rx="13" ry="7" fill="#9ccc65" transform="rotate(-20 45 65)" />
            <ellipse cx="75" cy="55" rx="13" ry="7" fill="#9ccc65" transform="rotate(20 75 55)" />
            <path d="M48 40 Q45 30 53 27 Q60 25 60 33 Q60 25 67 27 Q75 30 72 40 Q66 35 60 35 Q54 35 48 40 Z" fill="#ec407a" />
            <path d="M52 35 Q50 28 56 26" stroke="#ad1457" strokeWidth="2" fill="none" />
          </>
        )}

        {stage === "established" && type === "mint" && (
          <>
            <path d="M60 88 Q56 75 50 65 Q46 58 44 52" stroke="#7cb342" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M60 88 Q64 78 70 68 Q74 60 76 54" stroke="#7cb342" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M60 88 L60 55" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="44" cy="52" rx="9" ry="6" fill="#aed581" transform="rotate(-15 44 52)" />
            <ellipse cx="76" cy="54" rx="9" ry="6" fill="#aed581" transform="rotate(20 76 54)" />
            <ellipse cx="56" cy="48" rx="8" ry="5" fill="#c5e1a5" transform="rotate(-10 56 48)" />
            <ellipse cx="66" cy="42" rx="8" ry="5" fill="#c5e1a5" transform="rotate(15 66 42)" />
            <ellipse cx="60" cy="38" rx="7" ry="4" fill="#dcedc8" />
          </>
        )}

        {stage === "established" && type === "oak" && (
          <>
            <path d="M60 88 L60 45" stroke="#8d6e63" strokeWidth="5" strokeLinecap="round" />
            <path d="M60 65 L48 58" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 55 L72 50" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
            <circle cx="48" cy="55" r="12" fill="#66bb6a" />
            <circle cx="72" cy="48" r="11" fill="#7cb342" />
            <circle cx="60" cy="38" r="14" fill="#81c784" />
            <circle cx="52" cy="42" r="8" fill="#a5d6a7" />
          </>
        )}

        {stage === "mature" && type === "sunflower" && (
          <>
            <path d="M60 88 L60 25" stroke="#7cb342" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="42" cy="60" rx="15" ry="9" fill="#9ccc65" transform="rotate(-25 42 60)" />
            <ellipse cx="78" cy="52" rx="15" ry="9" fill="#9ccc65" transform="rotate(25 78 52)" />
            <ellipse cx="40" cy="42" rx="12" ry="7" fill="#aed581" transform="rotate(-30 40 42)" />
            <ellipse cx="80" cy="38" rx="12" ry="7" fill="#aed581" transform="rotate(30 80 38)" />
            <circle cx="60" cy="20" r="18" fill="#f9a825" />
            <circle cx="60" cy="20" r="12" fill="#6d4c41" />
            <circle cx="60" cy="20" r="8" fill="#4e342e" />
            {/* Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + Math.cos(rad) * 18;
              const y = 20 + Math.sin(rad) * 18;
              return <circle key={angle} cx={x} cy={y} r="4" fill="#f9a825" />;
            })}
          </>
        )}

        {stage === "mature" && type === "cactus" && (
          <>
            <rect x="46" y="28" width="28" height="60" rx="14" fill="#66bb6a" />
            <rect x="28" y="48" width="12" height="28" rx="6" fill="#66bb6a" />
            <rect x="80" y="42" width="12" height="32" rx="6" fill="#66bb6a" />
            <rect x="50" y="36" width="8" height="18" rx="4" fill="#7cb342" />
            <circle cx="60" cy="26" r="5" fill="#ffa726" />
            <circle cx="55" cy="22" r="3" fill="#ff7043" />
            <circle cx="65" cy="24" r="3" fill="#ef5350" />
            {/* Spines */}
            {[35, 45, 55, 65, 75].map((y) => (
              <line key={y} x1="54" y1={y} x2="52" y2={y - 2} stroke="#e0e0e0" strokeWidth="1" />
            ))}
            {[40, 50, 60, 70].map((y) => (
              <line key={y} x1="66" y1={y} x2="68" y2={y - 2} stroke="#e0e0e0" strokeWidth="1" />
            ))}
          </>
        )}

        {stage === "mature" && type === "tulip" && (
          <>
            <path d="M60 88 L60 30" stroke="#7cb342" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="42" cy="60" rx="16" ry="9" fill="#9ccc65" transform="rotate(-20 42 60)" />
            <ellipse cx="78" cy="50" rx="16" ry="9" fill="#9ccc65" transform="rotate(20 78 50)" />
            <ellipse cx="38" cy="42" rx="12" ry="7" fill="#aed581" transform="rotate(-25 38 42)" />
            <path d="M46 30 Q42 18 52 14 Q60 12 60 22 Q60 12 68 14 Q78 18 74 30 Q66 24 60 24 Q54 24 46 30 Z" fill="#ec407a" />
            <path d="M50 25 Q48 18 54 16" stroke="#ad1457" strokeWidth="2" fill="none" />
            <path d="M70 25 Q72 18 66 16" stroke="#ad1457" strokeWidth="2" fill="none" />
          </>
        )}

        {stage === "mature" && type === "mint" && (
          <>
            <path d="M60 88 Q54 72 44 60 Q38 50 34 42" stroke="#7cb342" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M60 88 Q66 76 76 64 Q82 54 86 46" stroke="#7cb342" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M60 88 L60 42" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="34" cy="42" rx="11" ry="7" fill="#aed581" transform="rotate(-15 34 42)" />
            <ellipse cx="86" cy="46" rx="11" ry="7" fill="#aed581" transform="rotate(20 86 46)" />
            <ellipse cx="50" cy="50" rx="10" ry="6" fill="#c5e1a5" transform="rotate(-10 50 50)" />
            <ellipse cx="70" cy="46" rx="10" ry="6" fill="#c5e1a5" transform="rotate(15 70 46)" />
            <ellipse cx="56" cy="38" rx="9" ry="5" fill="#dcedc8" transform="rotate(-10 56 38)" />
            <ellipse cx="64" cy="34" rx="9" ry="5" fill="#dcedc8" transform="rotate(10 64 34)" />
            <ellipse cx="60" cy="28" rx="8" ry="5" fill="#c5e1a5" />
          </>
        )}

        {stage === "mature" && type === "oak" && (
          <>
            <path d="M60 88 L60 35" stroke="#8d6e63" strokeWidth="7" strokeLinecap="round" />
            <path d="M60 60 L42 50" stroke="#8d6e63" strokeWidth="4" strokeLinecap="round" />
            <path d="M60 50 L78 42" stroke="#8d6e63" strokeWidth="4" strokeLinecap="round" />
            <path d="M60 42 L50 34" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 40 L70 32" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" />
            <circle cx="42" cy="46" r="16" fill="#66bb6a" />
            <circle cx="78" cy="40" r="15" fill="#7cb342" />
            <circle cx="60" cy="28" r="18" fill="#81c784" />
            <circle cx="48" cy="34" r="10" fill="#a5d6a7" />
            <circle cx="72" cy="30" r="10" fill="#a5d6a7" />
            <circle cx="55" cy="22" r="8" fill="#c8e6c9" />
          </>
        )}
      </svg>

      <span className="text-xs text-slate-500 mt-1">
        {entryCount === 0
          ? "Waiting to be planted"
          : entryCount === 1
            ? "Something's taking root"
            : entryCount < 7
              ? "Growing"
              : entryCount < 30
                ? "Established"
                : "Rooted deep"}
      </span>
    </div>
  );
}
