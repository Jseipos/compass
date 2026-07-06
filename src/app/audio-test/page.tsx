"use client";

import { useState, useRef } from "react";

export default function AudioTest() {
  const [status, setStatus] = useState("Click button to test audio");
  const ctxRef = useRef<AudioContext | null>(null);

  const testAudio = () => {
    try {
      const ctx = new AudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      ctxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.value = 220;
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      setStatus(`Audio playing! Context state: ${ctx.state}, sample rate: ${ctx.sampleRate}`);
      
      // Stop after 3 seconds
      setTimeout(() => {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        setTimeout(() => {
          osc.stop();
          setStatus("Audio stopped. Click again to replay.");
        }, 600);
      }, 3000);
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Audio Test</h1>
      <p>{status}</p>
      <button onClick={testAudio} style={{ padding: "1rem 2rem", fontSize: "1rem" }}>
        Play test tone
      </button>
    </div>
  );
}
