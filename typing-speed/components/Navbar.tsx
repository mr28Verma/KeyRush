"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Game', href: '/game' },
    { name: 'Progress', href: '/progress' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_#22C55E]">
                <Image 
                  src="https://instasize.com/api/image/6d3ae475e37778743563b0d175dac96c5f0ebe91ec11c34db44575c5ad589864.jpeg" 
                  alt="KeyRush Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded-lg"
                  unoptimized 
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                KEY<span className="text-[#22C55E]">RUSH</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-[#22C55E] px-1 py-2 text-sm font-bold transition-all font-mono tracking-widest uppercase"
                >
                  {link.name}
                </Link>
              ))}
              <button className="ml-4 bg-[#22C55E] hover:bg-[#16a34a] text-[#020617] px-6 py-2 rounded-lg text-sm font-black uppercase transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]">
                Login
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-[#22C55E] focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#020617] border-t border-white/5 px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-400 hover:text-[#22C55E] block px-3 py-3 rounded-md text-base font-bold uppercase font-mono border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button className="w-full mt-4 bg-[#22C55E] text-[#020617] px-3 py-4 rounded-xl text-base font-black uppercase shadow-lg">
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;