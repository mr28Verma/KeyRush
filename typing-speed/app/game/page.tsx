"use client";

import { useRef } from "react";
import { useGameAnimations } from "@/components/Animation";
import Navbar from "@/components/Navbar";

const games = [
  {
    id: 1,
    title: "Reaction Rush",
    genre: "Reflex",
    description: "Test your raw reaction speed. Click the moment you see green.",
    players: "124K",
    rating: 4.9,
    difficulty: "Hard",
    tag: "HOT",
    gradient: "from-green-500 to-emerald-900",
    icon: "⚡",
  },
  {
    id: 2,
    title: "Type Racer X",
    genre: "Typing",
    description: "Race against others in high-speed typing duels.",
    players: "98K",
    rating: 4.8,
    difficulty: "Medium",
    tag: "NEW",
    gradient: "from-lime-400 to-green-900",
    icon: "⌨️",
  },
  {
    id: 3,
    title: "Click Storm",
    genre: "Clicking",
    description: "How many clicks per second can you achieve? Set your record.",
    players: "210K",
    rating: 4.7,
    difficulty: "Easy",
    tag: "TOP",
    gradient: "from-green-600 to-teal-900",
    icon: "🖱️",
  },
  {
    id: 4,
    title: "Aim Sniper",
    genre: "Aim Training",
    description: "Precision targeting. Hit moving targets with deadly accuracy.",
    players: "76K",
    rating: 4.6,
    difficulty: "Hard",
    tag: "PRO",
    gradient: "from-emerald-500 to-green-950",
    icon: "🎯",
  },
  {
    id: 5,
    title: "Sequence Blitz",
    genre: "Memory",
    description: "Memorize and repeat color sequences at lightning speed.",
    players: "53K",
    rating: 4.5,
    difficulty: "Medium",
    tag: "FUN",
    gradient: "from-green-400 to-cyan-900",
    icon: "🧠",
  },
  {
    id: 6,
    title: "Dodge Matrix",
    genre: "Reflex",
    description: "Evade incoming projectiles using pure instinct and speed.",
    players: "89K",
    rating: 4.8,
    difficulty: "Extreme",
    tag: "HOT",
    gradient: "from-teal-400 to-green-900",
    icon: "🕹️",
  },
];

const difficultyColor: Record<string, string> = {
  Easy: "text-green-400 border-green-400",
  Medium: "text-yellow-400 border-yellow-400",
  Hard: "text-orange-400 border-orange-400",
  Extreme: "text-red-400 border-red-400",
};

const tagColor: Record<string, string> = {
  HOT: "bg-red-500",
  NEW: "bg-blue-500",
  TOP: "bg-yellow-500",
  PRO: "bg-purple-500",
  FUN: "bg-green-500",
};

export default function GamesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGameAnimations(containerRef);

  return (
    <>
      {/* ── Font import + scoped styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');

        /*
         * Scope the custom font ONLY inside .games-page.
         * The Navbar lives OUTSIDE this div so its font-mono is untouched.
         */
        .games-page,
        .games-page h1,
        .games-page h2,
        .games-page h3,
        .games-page p,
        .games-page span:not(.keep-font),
        .games-page button,
        .games-page div {
          font-family: 'Rajdhani', 'Orbitron', sans-serif !important;
        }

        .games-page .grid-bg {
          background-image:
            linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .games-page .scanline {
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
          );
          pointer-events: none;
        }

        .games-page .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .games-page .circuit-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2322c55e' stroke-width='0.5'%3E%3Cpath d='M10 10h10v10H10zM40 10h10v10H40zM10 40h10v10H10zM40 40h10v10H40z'/%3E%3Cpath d='M20 15h20M15 20v20M45 20v20M20 45h20'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 60px 60px;
        }

        .games-page .card-scanline {
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(74,222,128,0.03) 3px, rgba(74,222,128,0.03) 6px
          );
          animation: scanMove 3s linear infinite;
        }

        @keyframes scanMove {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }

        /* Terminal cursor blink */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cursor-blink { animation: blink 1s step-end infinite; }
      `}</style>

      {/* Navbar is OUTSIDE .games-page — its font-mono stays intact */}
      <Navbar />

      <div
        ref={containerRef}
        className="games-page min-h-screen bg-black text-white overflow-x-hidden"
      >
        {/* Fixed grid + scanline background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="grid-bg absolute inset-0" />
          <div className="scanline absolute inset-0" />
        </div>

        {/* ── HERO — two-column ── */}
        <section className="relative z-10 px-6 md:px-12 pt-28 pb-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

            {/* LEFT — headline + stats */}
            <div className="hero-text flex-1 min-w-0">
              <p className="text-green-500 text-xs tracking-[0.4em] uppercase mb-3">
                ▶ Game Arena
              </p>
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-4">
                <span className="text-white">TEST YOUR</span>
                <br />
                <span
                  className="text-green-400"
                  style={{ textShadow: "0 0 40px rgba(74,222,128,0.5)" }}
                >
                  REFLEXES
                </span>
              </h1>
              <p className="text-green-700 text-base md:text-lg max-w-xl mt-4 leading-relaxed">
                Sharpen your speed. Compete globally. Every millisecond counts
                in these high-intensity reflex games.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="bg-green-500 text-black text-sm font-black px-7 py-3 tracking-widest uppercase hover:bg-green-400 transition-colors">
                  PLAY NOW
                </button>
                <button className="border border-green-700 text-green-400 text-sm font-bold px-7 py-3 tracking-widest uppercase hover:border-green-400 hover:text-green-300 transition-colors">
                  LEADERBOARD
                </button>
              </div>

              {/* Stats row */}
              <div className="stats-bar flex flex-wrap gap-8 mt-10 pt-8 border-t border-green-900/30">
                {[
                  { label: "Active Players",  value: "48,291" },
                  { label: "Games Today",     value: "1.2M+"  },
                  { label: "World Records",   value: "3,847"  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-black text-green-400">{stat.value}</div>
                    <div className="text-xs text-green-800 tracking-widest uppercase mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — terminal card */}
            <div
              className="hero-text flex-shrink-0 w-full lg:w-[380px]"
              style={{ animationDelay: "0.18s" }}
            >
              <div
                className="border border-green-900/60 bg-black/70 backdrop-blur-sm rounded-sm overflow-hidden"
                style={{ boxShadow: "0 0 40px rgba(74,222,128,0.06)" }}
              >
                {/* Terminal title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-green-900/40 bg-green-950/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-2 text-green-700 text-xs tracking-widest" style={{ fontFamily: 'monospace' }}>
                    keyrush_arena.exe
                  </span>
                </div>

                {/* Terminal body */}
                <div className="p-5 space-y-2.5" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  <p className="text-green-600">
                    <span className="text-green-400">$</span> initializing game engine...
                  </p>
                  <p className="text-green-500">✓ reflex module loaded</p>
                  <p className="text-green-500">✓ leaderboard synced</p>
                  <p className="text-green-500">✓ 48,291 players online</p>
                  <p className="text-green-700">
                    <span className="text-green-400">$</span> select game to begin
                    <span className="cursor-blink text-green-400 ml-0.5">_</span>
                  </p>

                  {/* Mini game list */}
                  <div className="mt-3 space-y-2 border-t border-green-900/30 pt-4">
                    {[
                      { icon: "⚡", name: "Reaction Rush", ms: "124ms avg" },
                      { icon: "⌨️", name: "Type Racer X",  ms: "98 WPM"   },
                      { icon: "🖱️", name: "Click Storm",   ms: "14.2 CPS" },
                      { icon: "🎯", name: "Aim Sniper",    ms: "3px acc"  },
                    ].map((g) => (
                      <div
                        key={g.name}
                        className="flex items-center justify-between text-green-700 hover:text-green-400 transition-colors cursor-pointer group"
                      >
                        <span>{g.icon} {g.name}</span>
                        <span className="text-green-900 group-hover:text-green-500 transition-colors text-xs">
                          {g.ms} ▶
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trophy badge below terminal */}
              <div
                className="mt-4 flex items-center gap-3 border border-green-800/40 bg-green-950/20 px-4 py-3 rounded-sm"
                style={{ boxShadow: "0 0 20px rgba(74,222,128,0.04)" }}
              >
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="text-green-400 text-sm font-black">Today&apos;s Top Player</div>
                  <div className="text-green-700 text-xs tracking-widest">xShadow99 — 142ms avg</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <div className="relative z-10 px-6 md:px-12 mb-8">
          <div className="max-w-7xl mx-auto flex gap-3 flex-wrap">
            {["All Games", "Reflex", "Typing", "Clicking", "Aim", "Memory"].map(
              (filter, i) => (
                <button
                  key={filter}
                  className={`filter-btn text-xs px-4 py-2 rounded-sm tracking-widest uppercase transition-all border ${
                    i === 0
                      ? "bg-green-500 text-black border-green-500 font-bold"
                      : "border-green-900 text-green-700 hover:border-green-500 hover:text-green-400"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {/* ── Games Grid ── */}
        <section className="relative z-10 px-6 md:px-12 pb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="game-card group relative bg-black border border-green-900/50 rounded-sm overflow-hidden cursor-pointer"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Cover image area */}
                <div className={`relative h-48 bg-gradient-to-br ${game.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 noise-overlay opacity-20" />
                  <div className="absolute inset-0 circuit-pattern opacity-10" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-7xl opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110 transform"
                      style={{ filter: "drop-shadow(0 0 20px rgba(74,222,128,0.8))" }}
                    >
                      {game.icon}
                    </span>
                  </div>

                  <div className="absolute inset-0 card-scanline opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className={`absolute top-3 left-3 ${tagColor[game.tag]} text-black text-xs font-black px-2 py-0.5 tracking-widest`}>
                    {game.tag}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-green-400 text-xs px-2 py-0.5 tracking-widest border border-green-900/50">
                    {game.genre}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-black text-lg tracking-wide group-hover:text-green-400 transition-colors">
                      {game.title}
                    </h3>
                    <span className="text-green-500 text-sm font-bold">★ {game.rating}</span>
                  </div>
                  <p className="text-green-800 text-xs leading-relaxed mb-4">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs border px-2 py-0.5 rounded-sm tracking-wider ${difficultyColor[game.difficulty]}`}>
                        {game.difficulty}
                      </span>
                      <span className="text-green-800 text-xs">👥 {game.players}</span>
                    </div>
                    <button className="play-btn text-xs text-black bg-green-500 px-3 py-1.5 font-bold tracking-widest uppercase hover:bg-green-400 transition-colors">
                      PLAY
                    </button>
                  </div>
                </div>

                {/* Hover glow border */}
                <div className="absolute inset-0 pointer-events-none border border-green-500/0 group-hover:border-green-500/40 transition-all duration-300 rounded-sm" />
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm"
                  style={{ boxShadow: "inset 0 0 30px rgba(74,222,128,0.05)" }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}