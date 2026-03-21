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
      
      {/* 🔥 Background */}
      

      {/* 🔥 Navbar */}
      <Navbar />

      {/* 🔥 Main */}
      <main className="relative z-10 pt-32 pb-16">
        <section className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">

          {/* STATUS BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-[11px] font-mono uppercase tracking-widest border rounded-full border-green-500/20 bg-green-500/10 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
            </span>
            SYSTEM CORE: OPTIMIZED
          </div>

          {/* GLITCH TITLE */}
          <GlitchText
            text="KEYRUSH"
            className="text-6xl md:text-8xl font-black italic mb-6"
          />

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-12">
            Master your keyboard with precision and speed.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mb-32 flex-wrap">
            <button
              onClick={scrollToTest}
              className="px-10 py-4 bg-green-500 text-black font-bold hover:scale-105 transition"
            >
              START TEST
            </button>

            <a
              href="/test"
              className="px-10 py-4 border border-white/10 hover:bg-white/5 transition"
            >
              Games
            </a>
          </div>

          {/* Typing Area */}
          <div
            ref={typingSectionRef}
            className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000"
          >
            <TypingArea />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-10 max-w-4xl mx-auto mt-20">
            {[
              { label: "WPM", value: "0" },
              { label: "Accuracy", value: "100%" },
              { label: "Time", value: "30s" },
              { label: "Status", value: "READY" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}