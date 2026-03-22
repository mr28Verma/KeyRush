"use client";

import { useRef } from "react";
import Navbar from "../components/Navbar";
import TypingArea from "../components/TypingArea";
import Background from "../components/Background";
import GlitchText from "../components/GlitchText";

export default function Home() {
  const typingSectionRef = useRef<HTMLDivElement>(null);

  const scrollToTest = () => {
    typingSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setTimeout(() => {
      const input = document.querySelector("input") as HTMLInputElement;
      input?.focus();
    }, 600);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#020617] text-white">

      {/* ── Animated canvas background ── */}
      <Background />

      {/* ── Radial green glow (top-center) ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Bottom vignette ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 100% 40% at 50% 110%, rgba(2,6,23,0.85) 0%, transparent 70%)",
        }}
      />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main content ── */}
      <main className="relative pt-32 pb-16" style={{ zIndex: 2 }}>
        <section className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-[11px] font-mono uppercase tracking-widest border rounded-full border-green-500/20 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full" />
            </span>
            SYSTEM CORE: OPTIMIZED
          </div>

          {/* Glitch title */}
          <GlitchText
            text="KEYRUSH"
            className="text-6xl md:text-8xl font-black italic mb-6"
          />

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-12">
            Master your keyboard with precision and speed.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 justify-center mb-32 flex-wrap">
            <button
              onClick={scrollToTest}
              className="px-10 py-4 bg-green-500 text-black font-bold hover:scale-105 transition shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:shadow-[0_0_50px_rgba(34,197,94,0.45)]"
            >
              START TEST
            </button>
            <a
              href="/game"
              className="px-10 py-4 border border-white/10 hover:bg-white/5 hover:border-green-500/30 transition"
            >
              Games
            </a>
          </div>

          {/* Typing area */}
          <div
            ref={typingSectionRef}
            className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000"
          >
            <TypingArea />
          </div>

      </section>
      </main>
    </div>
  );
}