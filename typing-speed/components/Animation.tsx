"use client";

import { useEffect, RefObject } from "react";

// ─── All CSS keyframes & animation classes ─────────────────────────────────
export const gameAnimations = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes glitch {
    0%   { clip-path: inset(0 0 98% 0); transform: translate(-4px,0); }
    5%   { clip-path: inset(40% 0 50% 0); transform: translate(4px,0); }
    10%  { clip-path: inset(80% 0 5% 0); transform: translate(-2px,0); }
    15%  { clip-path: inset(0 0 0 0); transform: translate(0,0); }
    100% { clip-path: inset(0 0 0 0); transform: translate(0,0); }
  }

  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 8px rgba(74,222,128,0.3); }
    50%     { box-shadow: 0 0 24px rgba(74,222,128,0.7), 0 0 48px rgba(74,222,128,0.2); }
  }

  @keyframes filterSlideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes float {
    0%,100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
    33%     { transform: translateY(-20px) translateX(8px); opacity: 0.8; }
    66%     { transform: translateY(-10px) translateX(-6px); opacity: 0.5; }
  }

  @keyframes statsIn {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .hero-text {
    animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }

  .stats-bar > * {
    animation: statsIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  .stats-bar > *:nth-child(1) { animation-delay: 0.3s; }
  .stats-bar > *:nth-child(2) { animation-delay: 0.45s; }
  .stats-bar > *:nth-child(3) { animation-delay: 0.6s; }

  .filter-btn {
    animation: filterSlideIn 0.4s ease both;
  }

  .game-card {
    animation: cardReveal 0.55s cubic-bezier(0.16,1,0.3,1) both;
    will-change: transform, opacity;
  }

  .game-card:hover .play-btn {
    animation: pulseGlow 1.5s ease-in-out infinite;
  }

  .particle {
    position: fixed;
    background: #4ade80;
    border-radius: 50%;
    pointer-events: none;
    animation: float linear infinite;
  }
`;

// ─── Scroll-triggered card reveals ────────────────────────────────────────
function observeCards() {
  const cards = document.querySelectorAll<HTMLElement>(".game-card");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animationPlayState = "running";
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  cards.forEach((card, i) => {
    card.style.animationPlayState = "paused";
    card.style.animationDelay = `${i * 0.08}s`;
    io.observe(card);
  });
}

// ─── Floating green particles ──────────────────────────────────────────────
function spawnParticles() {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = `${1 + Math.random() * 3}px`;
    p.style.width = size;
    p.style.height = size;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `${Math.random() * 100}vh`;
    p.style.opacity = `${0.1 + Math.random() * 0.35}`;
    p.style.animationDuration = `${6 + Math.random() * 10}s`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    p.style.zIndex = "1";
    document.body.appendChild(p);
  }
}

// ─── Subtle cursor glow ────────────────────────────────────────────────────
function initCursorGlow() {
  // Avoid duplicates on hot-reload
  if (document.getElementById("cursor-glow")) return;
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  glow.style.cssText = `
    position: fixed;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
    left: -500px; top: -500px;
  `;
  document.body.appendChild(glow);
  window.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// ─── Inject styles once ───────────────────────────────────────────────────
function injectStyles() {
  if (document.getElementById("game-animations")) return;
  const style = document.createElement("style");
  style.id = "game-animations";
  style.textContent = gameAnimations;
  document.head.appendChild(style);
}

// ─── Master hook ──────────────────────────────────────────────────────────
export function useGameAnimations(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    injectStyles();
    observeCards();
    spawnParticles();
    initCursorGlow();

    return () => {
      document.querySelectorAll(".particle").forEach((p) => p.remove());
      document.getElementById("cursor-glow")?.remove();
    };
  }, []);
}