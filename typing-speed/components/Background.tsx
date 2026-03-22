"use client";

import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const context = canvasEl.getContext("2d");
    if (!context) return;

    // 🔒 LOCK TYPES (important)
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    let animId = 0;
    let W = 0;
    let H = 0;

    // ── Particles ─────────────────────────────
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
    };

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 60;

    function mkParticle(): Particle {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.15 + Math.random() * 0.45,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.012 + Math.random() * 0.018,
      };
    }

    // ── Rain ─────────────────────────────────
    type RainDrop = {
      x: number;
      y: number;
      speed: number;
      alpha: number;
      length: number;
    };

    const rain: RainDrop[] = [];
    const RAIN_COUNT = 18;

    function mkRain(): RainDrop {
      return {
        x: Math.random() * W,
        y: Math.random() * H - H,
        speed: 0.4 + Math.random() * 1.2,
        alpha: 0.04 + Math.random() * 0.1,
        length: 30 + Math.random() * 80,
      };
    }

    // ── Nodes ────────────────────────────────
    type Node = { x: number; y: number; vx: number; vy: number };

    const nodes: Node[] = [];
    const NODE_COUNT = 22;
    const CONNECTION_DIST = 160;

    function mkNode(): Node {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      };
    }

    // ── Resize (NO ERROR HERE) ───────────────
    function resize() {
      const dpr = window.devicePixelRatio || 1;

      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = W * dpr;
      canvas.height = H * dpr;

      canvas.style.width = W + "px";
      canvas.style.height = H + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // ✅ no error

      particles.length = 0;
      rain.length = 0;
      nodes.length = 0;

      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(mkParticle());
      for (let i = 0; i < RAIN_COUNT; i++) rain.push(mkRain());
      for (let i = 0; i < NODE_COUNT; i++) nodes.push(mkNode());
    }

    // ── Draw Loop ────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,197,94,0.4)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}