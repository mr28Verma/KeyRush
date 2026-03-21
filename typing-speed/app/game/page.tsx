"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import VariableProximity from "@/components/VariableProximity";

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement | null>(null); // ✅ FIXED

  const games = [
    {
      id: 1,
      name: "KeyPop",
      image:
        "https://img.sanishtech.com/u/1eaed2054c125682af4d4d79086ec4d2.png",
      path: "",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <Navbar />

      <div className="pt-32 px-6">
        
        {/* HEADING */}
        <div ref={containerRef} className="flex justify-center mb-20">
          <VariableProximity
            label="Choose Your Game"
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-green-400 bg-clip-text text-transparent"
            style={{ fontFamily: "Roboto Flex, sans-serif" }}
            fromFontVariationSettings="'wght' 100"
            toFontVariationSettings="'wght' 1000"
            containerRef={containerRef}
            radius={140}
          />
        </div>

        {/* GAME CARD */}
        <div className="flex justify-center">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}

function GameCard({ game }: any) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 12;
    const rotateX = -((y - midY) / midY) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  return (
    <Link href={game.path}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotate({ x: 0, y: 0 })}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
        }}
        transition={{ type: "spring", stiffness: 120 }}
        className="group relative w-[320px] rounded-3xl cursor-pointer"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-green-400 blur opacity-40 group-hover:opacity-80 transition rounded-3xl" />

        <div className="relative bg-[#0f172a] rounded-3xl overflow-hidden">
          <img
            src={game.image}
            className="w-full h-64 object-cover group-hover:scale-110 transition"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />

          <div className="absolute bottom-0 p-5">
            <h2 className="text-2xl font-bold text-white">
              {game.name}
            </h2>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}