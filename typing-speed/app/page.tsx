"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import VariableProximity from "../components/VariableProximity";

export default function TestPage() {
  const containerRef = useRef(null);

  const games = [
    {
      id: 1,
      name: "KeyPop",
      image: "https://img.sanishtech.com/u/1eaed2054c125682af4d4d79086ec4d2.png",
      path: ""
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      <Navbar />

      <div className="pt-32 px-6">
        
        {/* 🔥 Animated Heading */}
        <div className="relative flex justify-center mb-20">
          
          {/* Glow */}
          <div className="absolute blur-3xl opacity-40 bg-gradient-to-r from-purple-500 via-pink-500 to-green-400 w-[500px] h-[150px]" />

          <div ref={containerRef}>
            <VariableProximity
              label={"🎮 Choose Your Game"}
              className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-green-400 bg-clip-text text-transparent tracking-wide"
              fromFontVariationSettings="'wght' 300"
              toFontVariationSettings="'wght' 1000"
              containerRef={containerRef}
              radius={140}
              falloff="gaussian"
            />
          </div>
        </div>

        {/* 🎮 Game Card */}
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

  const reset = () => setRotate({ x: 0, y: 0 });

  return (
    <Link href={game.path}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={reset}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y
        }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        style={{ perspective: 1000 }}
        className="group relative w-[320px] rounded-3xl cursor-pointer"
      >
        {/* Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-green-400 blur opacity-40 group-hover:opacity-80 transition duration-500 rounded-3xl" />

        {/* Card */}
        <div className="relative bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Image */}
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-64 object-cover transition duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Play Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-full p-5 border border-white/30 shadow-lg text-xl">
              ▶
            </div>
          </motion.div>

          {/* Title */}
          <div className="absolute bottom-0 p-5 w-full">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent tracking-wide">
              {game.name}
            </h2>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}