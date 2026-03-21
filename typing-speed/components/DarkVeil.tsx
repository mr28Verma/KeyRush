"use client";

import { useRef, useEffect } from "react";

export default function DarkVeil() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let t = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    const render = () => {
      t += 0.01;

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);

      // 🔥 gradient wave
      const gradient = ctx.createLinearGradient(0, 0, w, h);

      gradient.addColorStop(0, "rgba(0,255,100,0.8)");
      gradient.addColorStop(0.5, "rgba(0,255,100,0.2)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = gradient;

      ctx.beginPath();

      const amplitude = 200;
      const frequency = 0.002;

      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin(x * frequency + t) * amplitude +
          Math.cos(x * frequency * 0.5 + t) * 100;

        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      ctx.fill();

      requestAnimationFrame(render);
    };

    render();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
    />
  );
}