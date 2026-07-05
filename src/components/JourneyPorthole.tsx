"use client";

import type { PlaceId, Place } from "@/lib/journey";
import { PLACES } from "@/lib/journey";
import type { PlantType } from "./Welcome";

interface JourneyPortholeProps {
  place: PlaceId;
  plantType: PlantType;
  entryCount: number;
  foragedCount: number;
  onTap: () => void;
}

// Mini terrain rendering inside a circle
function MiniTerrain({ place }: { place: Place }) {
  const id = place.id;

  return (
    <>
      {/* Sky gradient */}
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={place.skyTop} />
          <stop offset="100%" stopColor={place.skyBottom} />
        </linearGradient>
        <clipPath id={`circle-${id}`}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>

      <g clipPath={`url(#circle-${id})`}>
        {/* Sky */}
        <rect width="100" height="100" fill={`url(#sky-${id})`} />

        {/* Terrain-specific elements */}
        {id === "doorway" && (
          <>
            <rect x="0" y="70" width="100" height="30" fill={place.groundColor} />
            <rect x="42" y="35" width="16" height="40" rx="2" fill="#8b6f47" />
            <rect x="44" y="37" width="12" height="36" rx="1" fill={place.accentColor} opacity="0.6" />
            <circle cx="50" cy="55" r="1.5" fill="#f59e0b" />
          </>
        )}

        {id === "misty_forest" && (
          <>
            <rect x="0" y="65" width="100" height="35" fill={place.groundColor} />
            <rect x="10" y="20" width="8" height="50" rx="2" fill="#334155" />
            <rect x="25" y="15" width="10" height="55" rx="3" fill="#3e4c63" />
            <rect x="65" y="18" width="9" height="52" rx="2" fill="#334155" />
            <rect x="82" y="22" width="7" height="48" rx="2" fill="#3e4c63" />
            {/* Fog */}
            <ellipse cx="30" cy="55" rx="25" ry="8" fill="#cbd5e1" opacity="0.4" />
            <ellipse cx="70" cy="50" rx="30" ry="10" fill="#cbd5e1" opacity="0.3" />
          </>
        )}

        {id === "riverbank" && (
          <>
            <rect x="0" y="60" width="100" height="40" fill={place.skyBottom} opacity="0.3" />
            <path d="M0 60 Q25 58 50 60 Q75 62 100 60 L100 100 L0 100 Z" fill={place.accentColor} opacity="0.4" />
            <path d="M0 70 Q30 68 50 70 Q70 72 100 70 L100 100 L0 100 Z" fill={place.accentColor} opacity="0.5" />
            <ellipse cx="20" cy="75" rx="4" ry="2" fill="#64748b" />
            <ellipse cx="75" cy="80" rx="5" ry="2.5" fill="#64748b" />
          </>
        )}

        {id === "wildflower_field" && (
          <>
            <rect x="0" y="65" width="100" height="35" fill={place.groundColor} />
            <circle cx="20" cy="70" r="2.5" fill="#f472b6" />
            <circle cx="35" cy="68" r="2" fill="#fbbf24" />
            <circle cx="55" cy="72" r="2.5" fill="#a78bfa" />
            <circle cx="72" cy="69" r="2" fill="#f472b6" />
            <circle cx="85" cy="71" r="2.5" fill="#fbbf24" />
            <line x1="20" y1="70" x2="20" y2="78" stroke="#16a34a" strokeWidth="1" />
            <line x1="35" y1="68" x2="35" y2="76" stroke="#16a34a" strokeWidth="1" />
            <line x1="55" y1="72" x2="55" y2="80" stroke="#16a34a" strokeWidth="1" />
            <line x1="72" y1="69" x2="72" y2="77" stroke="#16a34a" strokeWidth="1" />
            <line x1="85" y1="71" x2="85" y2="79" stroke="#16a34a" strokeWidth="1" />
          </>
        )}

        {id === "mountain_trail" && (
          <>
            <polygon points="0,65 25,25 50,65" fill="#78716c" />
            <polygon points="30,65 60,20 90,65" fill="#6b6560" />
            <polygon points="60,65 80,35 100,65" fill="#78716c" />
            <rect x="0" y="65" width="100" height="35" fill={place.groundColor} />
            <path d="M25 65 L35 50 L50 55 L55 45 L70 50" stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity="0.5" />
            {/* Pine trees */}
            <polygon points="15,65 12,55 18,55" fill="#166534" />
            <polygon points="80,65 77,58 83,58" fill="#166534" />
          </>
        )}

        {id === "old_growth_grove" && (
          <>
            <rect x="0" y="60" width="100" height="40" fill={place.groundColor} />
            <rect x="5" y="10" width="20" height="55" rx="3" fill="#14532d" />
            <rect x="75" y="5" width="22" height="60" rx="3" fill="#14532d" />
            <circle cx="15" cy="15" r="14" fill="#166534" />
            <circle cx="86" cy="10" r="16" fill="#166534" />
            <circle cx="50" cy="20" r="12" fill="#15803d" />
            {/* Dappled light */}
            <circle cx="40" cy="45" r="3" fill="#fde68a" opacity="0.4" />
            <circle cx="60" cy="50" r="2" fill="#fde68a" opacity="0.3" />
          </>
        )}
      </g>

      {/* Circle border */}
      <circle cx="50" cy="50" r="48" fill="none" stroke={place.accentColor} strokeWidth="2" opacity="0.4" />
    </>
  );
}

// Mini plant inside the porthole
function MiniPlant({ type, entryCount }: { type: PlantType; entryCount: number }) {
  const stage = entryCount === 0 ? "seed" : entryCount <= 2 ? "sprout" : entryCount <= 9 ? "small" : entryCount <= 29 ? "established" : "mature";

  if (stage === "seed") {
    return <ellipse cx="50" cy="78" rx="3" ry="2.5" fill="#6b4423" />;
  }

  if (stage === "sprout") {
    return (
      <g>
        <path d="M50 78 L50 68" stroke="#7cb342" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="47" cy="70" rx="4" ry="2.5" fill="#9ccc65" transform="rotate(-30 47 70)" />
        <ellipse cx="53" cy="70" rx="4" ry="2.5" fill="#9ccc65" transform="rotate(30 53 70)" />
      </g>
    );
  }

  // small / established / mature — simplified shapes
  const height = stage === "small" ? 20 : stage === "established" ? 28 : 35;
  const sw = stage === "small" ? 2 : 3;

  if (type === "sunflower") {
    return (
      <g>
        <path d={`M50 78 L50 ${78 - height}`} stroke="#7cb342" strokeWidth={sw} strokeLinecap="round" />
        {stage !== "small" && <ellipse cx={50 - 8} cy={78 - height / 2} rx="5" ry="3" fill="#9ccc65" transform={`rotate(-25 ${50 - 8} ${78 - height / 2})`} />}
        {stage !== "small" && <ellipse cx={58} cy={78 - height / 2 - 5} rx="5" ry="3" fill="#9ccc65" transform={`rotate(25 58 ${78 - height / 2 - 5})`} />}
        <circle cx="50" cy={78 - height - 3} r={stage === "mature" ? 6 : 4} fill="#f9a825" />
        <circle cx="50" cy={78 - height - 3} r={stage === "mature" ? 3 : 2} fill="#6d4c41" />
      </g>
    );
  }

  if (type === "cactus") {
    const w = stage === "mature" ? 8 : 5;
    return (
      <g>
        <rect x={50 - w / 2} y={78 - height} width={w} height={height} rx={w / 2} fill="#66bb6a" />
        {stage !== "small" && <rect x={50 - w / 2 - 5} y={78 - height / 2} width="4" height="8" rx="2" fill="#66bb6a" />}
        {stage !== "small" && <rect x={50 + w / 2 + 1} y={78 - height / 2 - 3} width="4" height="10" rx="2" fill="#66bb6a" />}
      </g>
    );
  }

  if (type === "tulip") {
    return (
      <g>
        <path d={`M50 78 L50 ${78 - height}`} stroke="#7cb342" strokeWidth={sw} strokeLinecap="round" />
        {stage !== "small" && <ellipse cx={42} cy={78 - height / 2} rx="5" ry="3" fill="#9ccc65" transform={`rotate(-20 42 ${78 - height / 2})`} />}
        <path d={`M${50 - 4} ${78 - height} Q${50 - 6} ${78 - height - 6} ${50 - 2} ${78 - height - 8} Q50 ${78 - height - 10} 50 ${78 - height - 4} Q50 ${78 - height - 10} ${52} ${78 - height - 8} Q${56} ${78 - height - 6} ${54} ${78 - height} Q${52} ${78 - height - 3} 50 ${78 - height - 3} Q${48} ${78 - height - 3} ${50 - 4} ${78 - height} Z`} fill="#ec407a" />
      </g>
    );
  }

  if (type === "mint") {
    return (
      <g>
        <path d={`M50 78 Q48 ${78 - height / 2} 46 ${78 - height}`} stroke="#7cb342" strokeWidth={sw - 0.5} fill="none" strokeLinecap="round" />
        <path d={`M50 78 Q52 ${78 - height / 2 + 2} 54 ${78 - height + 3}`} stroke="#7cb342" strokeWidth={sw - 0.5} fill="none" strokeLinecap="round" />
        <ellipse cx="46" cy={78 - height} rx="4" ry="2.5" fill="#aed581" transform={`rotate(-15 46 ${78 - height})`} />
        <ellipse cx="54" cy={78 - height + 3} rx="4" ry="2.5" fill="#c5e1a5" transform={`rotate(20 54 ${78 - height + 3})`} />
        {stage !== "small" && <ellipse cx="50" cy={78 - height - 3} rx="3.5" ry="2" fill="#dcedc8" />}
      </g>
    );
  }

  // oak
  const r = stage === "mature" ? 8 : stage === "established" ? 6 : 4;
  return (
    <g>
      <path d={`M50 78 L50 ${78 - height + r}`} stroke="#8d6e63" strokeWidth={sw + 1} strokeLinecap="round" />
      <circle cx="50" cy={78 - height} r={r} fill="#66bb6a" />
      {stage !== "small" && <circle cx={50 - r * 0.7} cy={78 - height + 2} r={r - 2} fill="#81c784" />}
      {stage !== "small" && <circle cx={50 + r * 0.7} cy={78 - height - 1} r={r - 2} fill="#7cb342" />}
    </g>
  );
}

export default function JourneyPorthole({ place, plantType, entryCount, foragedCount, onTap }: JourneyPortholeProps) {
  const p = PLACES[place];

  return (
    <button
      onClick={onTap}
      aria-label={`Journey map: ${p.name}. ${p.message} Tap to enter.`}
      className="flex flex-col items-center group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400 rounded-full"
    >
      <div className="relative">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="drop-shadow-sm transition-transform group-hover:scale-105 group-active:scale-95"
        >
          <MiniTerrain place={p} />
          <MiniPlant type={plantType} entryCount={entryCount} />
        </svg>

        {/* Foraged item count badge */}
        {foragedCount > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-md px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
            {foragedCount}
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <p className="text-sm font-semibold text-slate-700">{p.name}</p>
        <p className="text-xs text-slate-500 mt-0.5 max-w-[180px]">{p.message}</p>
      </div>
    </button>
  );
}
