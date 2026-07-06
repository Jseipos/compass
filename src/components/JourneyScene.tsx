"use client";

import { useState, useEffect, useRef } from "react";
import type { PlaceId } from "@/lib/journey";
import { PLACES } from "@/lib/journey";
import type { PlantType } from "./Welcome";
import SceneButton from "./SceneButton";

interface JourneySceneProps {
  place: PlaceId;
  plantType: PlantType;
  entryCount: number;
  foragedCount: number;
  foragedByPlace: Record<PlaceId, number>;
  onClose: () => void;
}

// Ambient scene with CSS animations — no external assets needed
export default function JourneyScene({
  place,
  plantType,
  entryCount,
  foragedCount,
  foragedByPlace,
  onClose,
}: JourneySceneProps) {
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ drone1: OscillatorNode; drone2: OscillatorNode; noise: AudioBufferSourceNode } | null>(null);

  const p = PLACES[place];

  const startAudio = () => {
    try {
      const ctx = new AudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      audioRef.current = ctx;
      console.log("[Compass] AudioContext started, state:", ctx.state);

      // Base drone — two detuned oscillators
      const drone1 = ctx.createOscillator();
      const drone2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      drone1.type = "sine";
      drone2.type = "sine";

      const baseFreq: Record<PlaceId, number> = {
        doorway: 220,
        misty_forest: 160,
        riverbank: 262,
        wildflower_field: 330,
        mountain_trail: 196,
        old_growth_grove: 147,
      };

      drone1.frequency.value = baseFreq[place];
      drone2.frequency.value = baseFreq[place] * 1.005;

      filter.type = "lowpass";
      filter.frequency.value = 1200;
      gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 2);

      drone1.connect(filter);
      drone2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      drone1.start();
      drone2.start();
      console.log("[Compass] Drones started at", baseFreq[place], "Hz");

      // Brown noise for texture
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      const noiseFilterFreq: Record<PlaceId, number> = {
        doorway: 400,
        misty_forest: 800,
        riverbank: 1500,
        wildflower_field: 1000,
        mountain_trail: 700,
        old_growth_grove: 500,
      };
      const noiseGainVal: Record<PlaceId, number> = {
        doorway: 0.05,
        misty_forest: 0.08,
        riverbank: 0.1,
        wildflower_field: 0.07,
        mountain_trail: 0.09,
        old_growth_grove: 0.06,
      };

      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = noiseFilterFreq[place];
      noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(noiseGainVal[place], ctx.currentTime + 3);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
      console.log("[Compass] Noise started");

      audioNodesRef.current = { drone1, drone2, noise };
    } catch (err) {
      console.error("[Compass] Audio error:", err);
    }
  };

  const stopAudio = () => {
    if (audioNodesRef.current) {
      try {
        audioNodesRef.current.drone1.stop();
        audioNodesRef.current.drone2.stop();
        audioNodesRef.current.noise.stop();
      } catch {}
      audioNodesRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.close();
      audioRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAudio();
  }, []);

  const toggleAudio = () => {
    if (audioOn) {
      stopAudio();
      setAudioOn(false);
    } else {
      startAudio();
      setAudioOn(true);
    }
  };

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      role="dialog"
      aria-label={`${p.name} — ${p.description}`}
      aria-modal="true"
    >
      {/* Animated background */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, ${p.skyTop}, ${p.skyBottom})`,
        }}
      >
        <SceneAnimation place={place} />
      </div>

      {/* Close button */}
      <SceneButton onClick={onClose} ariaLabel="Close scene" position="top-right">
        ✕
      </SceneButton>

      {/* Audio toggle */}
      <SceneButton onClick={toggleAudio} ariaLabel={audioOn ? "Mute ambient sound" : "Play ambient sound"} position="top-left">
        {audioOn ? "🔊" : "🔈"}
      </SceneButton>

      {/* Content overlay — pointer-events-none so buttons work, children re-enable */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen pb-16 px-6 pointer-events-none"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 4rem)" }}
      >
        {/* Plant in the scene */}
        <div className="mb-8 opacity-90 pointer-events-auto">
          <ScenePlant type={plantType} entryCount={entryCount} />
        </div>

        {/* Place name and description — framed card for readability on any terrain */}
        <div className="max-w-sm w-full pointer-events-auto">
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl px-5 py-4 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              {p.name}
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed mb-3">
              {p.description}
            </p>

            {/* Foraging info */}
            <div className="bg-white/10 rounded-xl px-4 py-3 mb-3">
              <p className="text-slate-100 text-xs leading-relaxed">
                {entryCount === 0
                  ? "Write your first entry to begin foraging."
                  : `You've collected ${foragedCount} ${foragedCount === 1 ? "thing" : "things"} for your plant.`}
              </p>
              <p className="text-slate-300 text-xs mt-1">
                Here you find: <span className="text-white font-medium">{p.forageItem}</span>
              </p>
              <p className="text-slate-400 text-xs mt-0.5 italic">{p.plantEffect}</p>
            </div>

            {/* Places visited */}
            {foragedCount > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                {(Object.keys(foragedByPlace) as PlaceId[]).map((pid) => {
                  const count = foragedByPlace[pid];
                  if (count === 0) return null;
                  return (
                    <span
                      key={pid}
                      className="text-xs bg-white/10 text-slate-200 px-2 py-1 rounded-full"
                    >
                      {PLACES[pid].name} ×{count}
                    </span>
                  );
                })}
              </div>
            )}

            <p className="text-slate-400 text-xs">
              Close your eyes. Breathe. Stay as long as you want.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Scene-specific CSS animations =====

function SceneAnimation({ place }: { place: PlaceId }) {
  if (place === "doorway") {
    return (
      <div className="w-full h-full relative">
        {/* Pulsing light */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(254,243,199,0.6) 0%, transparent 70%)",
            animation: "journey-pulse 4s ease-in-out infinite",
          }}
        />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-200/40"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animation: `journey-float-${i % 3} ${6 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes journey-pulse { 0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; } 50% { transform: translate(-50%,-50%) scale(1.15); opacity: 0.9; } }
          @keyframes journey-float-0 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          @keyframes journey-float-1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(10px,-15px); } }
          @keyframes journey-float-2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-8px,-12px); } }
        `}</style>
      </div>
    );
  }

  if (place === "misty_forest") {
    return (
      <div className="w-full h-full relative">
        {/* Tree silhouettes */}
        {[...Array(7)].map((_, i) => (
          <div
            key={`tree-${i}`}
            className="absolute bottom-0 bg-slate-700/60"
            style={{
              left: `${i * 15}%`,
              width: `${6 + (i % 3) * 2}%`,
              height: `${50 + (i % 4) * 15}%`,
              animation: `journey-sway ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              transformOrigin: "bottom center",
            }}
          />
        ))}
        {/* Drifting fog */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`fog-${i}`}
            className="absolute rounded-full bg-slate-300/20 blur-xl"
            style={{
              width: "200px",
              height: "60px",
              left: `${i * 20 - 20}%`,
              top: `${30 + (i % 3) * 20}%`,
              animation: `journey-drift ${15 + i * 3}s linear infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
        {/* Raindrops */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`rain-${i}`}
            className="absolute w-px h-3 bg-slate-200/30"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `-10px`,
              animation: `journey-rain ${1.5 + (i % 3) * 0.5}s linear infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes journey-sway { 0%,100% { transform: rotate(-0.5deg); } 50% { transform: rotate(0.5deg); } }
          @keyframes journey-drift { 0% { transform: translateX(0); } 100% { transform: translateX(120vw); } }
          @keyframes journey-rain { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
        `}</style>
      </div>
    );
  }

  if (place === "riverbank") {
    return (
      <div className="w-full h-full relative">
        {/* Water ripples */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          {[...Array(6)].map((_, i) => (
            <div
              key={`ripple-${i}`}
              className="absolute w-full h-px bg-white/20"
              style={{
                top: `${i * 16}%`,
                animation: `journey-ripple ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
        {/* Floating leaves */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="absolute text-sm"
            style={{
              left: `-30px`,
              top: `${20 + (i * 11) % 60}%`,
              animation: `journey-leaf ${12 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            🍃
          </div>
        ))}
        <style>{`
          @keyframes journey-ripple { 0%,100% { transform: scaleX(1); opacity: 0.2; } 50% { transform: scaleX(1.05); opacity: 0.4; } }
          @keyframes journey-leaf { 0% { transform: translateX(0) rotate(0deg); } 100% { transform: translateX(110vw) rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (place === "wildflower_field") {
    return (
      <div className="w-full h-full relative">
        {/* Sun glow */}
        <div
          className="absolute top-10 right-10 w-32 h-32 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(253,224,71,0.5) 0%, transparent 70%)",
            animation: "journey-sun 6s ease-in-out infinite",
          }}
        />
        {/* Wildflowers */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`flower-${i}`}
            className="absolute bottom-0"
            style={{
              left: `${(i * 7) % 100}%`,
              bottom: `${(i % 4) * 8}%`,
              fontSize: "14px",
              animation: `journey-bob ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {["🌼", "🌸", "🌻", "🦋"][i % 4]}
          </div>
        ))}
        {/* Pollen drifting */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`pollen-${i}`}
            className="absolute w-1 h-1 rounded-full bg-yellow-200/50"
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 31) % 100}%`,
              animation: `journey-pollen ${8 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes journey-sun { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.7; } }
          @keyframes journey-bob { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-4px) rotate(3deg); } }
          @keyframes journey-pollen { 0%,100% { transform: translate(0,0); } 33% { transform: translate(15px,-10px); } 66% { transform: translate(-10px,5px); } }
        `}</style>
      </div>
    );
  }

  if (place === "mountain_trail") {
    return (
      <div className="w-full h-full relative">
        {/* Mountain peaks */}
        <svg className="absolute bottom-0 w-full h-2/3" viewBox="0 0 100 60" preserveAspectRatio="none">
          <polygon points="0,60 15,20 30,60" fill="#78716c" opacity="0.8" />
          <polygon points="20,60 45,10 70,60" fill="#6b6560" opacity="0.9" />
          <polygon points="55,60 75,25 100,60" fill="#78716c" opacity="0.7" />
        </svg>
        {/* Swaying pines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`pine-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${10 + i * 20}%`,
              bottom: `${5 + (i % 3) * 10}%`,
              animation: `journey-sway ${4 + (i % 2)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              transformOrigin: "bottom center",
            }}
          >
            🌲
          </div>
        ))}
        {/* Wind particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`wind-${i}`}
            className="absolute w-8 h-px bg-white/15"
            style={{
              left: `-40px`,
              top: `${20 + (i * 13) % 70}%`,
              animation: `journey-wind ${6 + i}s linear infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes journey-sway { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(1deg); } }
          @keyframes journey-wind { 0% { transform: translateX(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateX(110vw); opacity: 0; } }
        `}</style>
      </div>
    );
  }

  // old_growth_grove
  return (
    <div className="w-full h-full relative">
      {/* Large tree trunks */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`trunk-${i}`}
          className="absolute bottom-0 bg-green-950/40"
          style={{
            left: `${i * 28 - 5}%`,
            width: `${8 + (i % 2) * 4}%`,
            height: "85%",
            animation: `journey-sway ${8 + i}s ease-in-out infinite`,
            animationDelay: `${i}s`,
            transformOrigin: "bottom center",
          }}
        />
      ))}
      {/* Canopy */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`canopy-${i}`}
          className="absolute rounded-full bg-green-700/30 blur-md"
          style={{
            left: `${i * 28 - 10}%`,
            top: "5%",
            width: "35%",
            height: "40%",
            animation: `journey-sway ${10 + i}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            transformOrigin: "bottom center",
          }}
        />
      ))}
      {/* Dappled light spots */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`light-${i}`}
          className="absolute rounded-full bg-amber-100/20 blur-lg"
          style={{
            width: "30px",
            height: "30px",
            left: `${(i * 23) % 100}%`,
            top: `${(i * 37) % 80}%`,
            animation: `journey-light ${5 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}
      {/* Dust motes */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`mote-${i}`}
          className="absolute w-0.5 h-0.5 rounded-full bg-amber-50/40"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 29) % 100}%`,
            animation: `journey-pollen ${10 + (i % 5)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes journey-sway { 0%,100% { transform: rotate(-0.3deg); } 50% { transform: rotate(0.3deg); } }
        @keyframes journey-light { 0%,100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.2); } }
      `}</style>
    </div>
  );
}

// Larger plant rendering for the scene
function ScenePlant({ type, entryCount }: { type: PlantType; entryCount: number }) {
  const stage = entryCount === 0 ? "seed" : entryCount <= 2 ? "sprout" : entryCount <= 9 ? "small" : entryCount <= 29 ? "established" : "mature";
  const size = 160;

  // Reuse the Plant component's SVG approach but bigger
  // For now, render a simple large version
  return (
    <div className="flex flex-col items-center" role="img" aria-label={`${type} plant, ${stage} stage`}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* Ground */}
        <ellipse cx="60" cy="108" rx="35" ry="6" fill="rgba(0,0,0,0.2)" />
        <path d="M32 100 Q32 108 60 108 Q88 108 88 100 L84 86 L36 86 Z" fill="#d4a574" />
        <ellipse cx="60" cy="86" rx="26" ry="4" fill="#8b6f47" />

        {stage === "seed" && <ellipse cx="60" cy="84" rx="6" ry="5" fill="#6b4423" />}

        {stage === "sprout" && (
          <>
            <path d="M60 86 L60 68" stroke="#7cb342" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="54" cy="72" rx="7" ry="4" fill="#9ccc65" transform="rotate(-30 54 72)" />
            <ellipse cx="66" cy="72" rx="7" ry="4" fill="#9ccc65" transform="rotate(30 66 72)" />
          </>
        )}

        {stage !== "seed" && stage !== "sprout" && (
          <>
            {type === "sunflower" && (
              <>
                <path d={`M60 86 L60 ${stage === "mature" ? 22 : stage === "established" ? 32 : 48}`} stroke="#7cb342" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="44" cy="64" rx="12" ry="7" fill="#9ccc65" transform="rotate(-25 44 64)" />
                <ellipse cx="76" cy="56" rx="12" ry="7" fill="#9ccc65" transform="rotate(25 76 56)" />
                {stage !== "small" && <ellipse cx="42" cy="46" rx="10" ry="6" fill="#aed581" transform="rotate(-30 42 46)" />}
                <circle cx="60" cy={stage === "mature" ? 18 : stage === "established" ? 28 : 44} r={stage === "mature" ? 16 : 12} fill="#f9a825" />
                <circle cx="60" cy={stage === "mature" ? 18 : stage === "established" ? 28 : 44} r={stage === "mature" ? 10 : 7} fill="#6d4c41" />
              </>
            )}
            {type === "cactus" && (
              <>
                <rect x={stage === "mature" ? 48 : 52} y={stage === "mature" ? 24 : 38} width={stage === "mature" ? 24 : 16} height={stage === "mature" ? 62 : 48} rx={stage === "mature" ? 12 : 8} fill="#66bb6a" />
                {stage !== "small" && <rect x="32" y="52" width="10" height="22" rx="5" fill="#66bb6a" />}
                {stage !== "small" && <rect x="78" y="46" width="10" height="26" rx="5" fill="#66bb6a" />}
                <circle cx="60" cy={stage === "mature" ? 22 : 36} r="3" fill="#ffa726" />
              </>
            )}
            {type === "tulip" && (
              <>
                <path d={`M60 86 L60 ${stage === "mature" ? 28 : stage === "established" ? 38 : 52}`} stroke="#7cb342" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="44" cy="64" rx="13" ry="7" fill="#9ccc65" transform="rotate(-20 44 64)" />
                <ellipse cx="76" cy="54" rx="13" ry="7" fill="#9ccc65" transform="rotate(20 76 54)" />
                <path d={`M48 ${stage === "mature" ? 28 : 38} Q44 ${stage === "mature" ? 16 : 26} 54 ${stage === "mature" ? 12 : 22} Q60 ${stage === "mature" ? 10 : 20} 60 ${stage === "mature" ? 20 : 30} Q60 ${stage === "mature" ? 10 : 20} 66 ${stage === "mature" ? 12 : 22} Q76 ${stage === "mature" ? 16 : 26} 72 ${stage === "mature" ? 28 : 38} Q66 ${stage === "mature" ? 22 : 32} 60 ${stage === "mature" ? 22 : 32} Q54 ${stage === "mature" ? 22 : 32} 48 ${stage === "mature" ? 28 : 38} Z`} fill="#ec407a" />
              </>
            )}
            {type === "mint" && (
              <>
                <path d="M60 86 Q54 72 46 62 Q40 54 36 46" stroke="#7cb342" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M60 86 Q66 76 74 66 Q80 58 84 50" stroke="#7cb342" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d={`M60 86 L60 ${stage === "mature" ? 40 : 54}`} stroke="#7cb342" strokeWidth="3" strokeLinecap="round" />
                <ellipse cx="36" cy="46" rx="11" ry="7" fill="#aed581" transform="rotate(-15 36 46)" />
                <ellipse cx="84" cy="50" rx="11" ry="7" fill="#aed581" transform="rotate(20 84 50)" />
                <ellipse cx="52" cy="52" rx="10" ry="6" fill="#c5e1a5" transform="rotate(-10 52 52)" />
                <ellipse cx="70" cy="46" rx="10" ry="6" fill="#c5e1a5" transform="rotate(15 70 46)" />
                {stage !== "small" && <ellipse cx="60" cy="36" rx="9" ry="5" fill="#dcedc8" />}
              </>
            )}
            {type === "oak" && (
              <>
                <path d={`M60 86 L60 ${stage === "mature" ? 32 : 42}`} stroke="#8d6e63" strokeWidth="6" strokeLinecap="round" />
                {stage !== "small" && <path d="M60 58 L46 50" stroke="#8d6e63" strokeWidth="4" strokeLinecap="round" />}
                {stage !== "small" && <path d="M60 48 L76 40" stroke="#8d6e63" strokeWidth="4" strokeLinecap="round" />}
                <circle cx={stage === "mature" ? 42 : 46} cy={stage === "mature" ? 44 : 50} r={stage === "mature" ? 16 : 12} fill="#66bb6a" />
                <circle cx={stage === "mature" ? 78 : 74} cy={stage === "mature" ? 38 : 44} r={stage === "mature" ? 15 : 11} fill="#7cb342" />
                <circle cx="60" cy={stage === "mature" ? 26 : 36} r={stage === "mature" ? 18 : 14} fill="#81c784" />
                {stage === "mature" && <circle cx="50" cy="32" r="10" fill="#a5d6a7" />}
                {stage === "mature" && <circle cx="72" cy="28" r="10" fill="#a5d6a7" />}
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
