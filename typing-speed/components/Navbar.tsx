"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import AuthModal from "./Authmodal";

const navLinks = [
  { name: "Game",        href: "/game"        },
  { name: "Progress",    href: "/progress"    },
  { name: "Tutorials",   href: "/tutorials"   },
  { name: "Leaderboard", href: "/leaderboard" },
];

/* ── Live clock — mounted only on client to avoid hydration mismatch ── */
function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime]       = useState("");

  useEffect(() => {
    setMounted(true);
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour:   "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 h-7 rounded-full border border-white/10 bg-white/5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
      </span>
      <span className="text-[11px] font-mono tabular-nums text-gray-300 tracking-wider">
        {time}
      </span>
    </div>
  );
}

const Navbar = () => {
  const [isOpen,    setIsOpen]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [authOpen,  setAuthOpen]  = useState(false);
  const [authMode,  setAuthMode]  = useState<"login" | "signup">("login");
  const pathname = usePathname();

  const openLogin  = () => { setAuthMode("login");  setAuthOpen(true); };
  const openSignup = () => { setAuthMode("signup"); setAuthOpen(true); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{
          height: "60px",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          background: scrolled
            ? "linear-gradient(135deg, rgba(2,6,23,0.88) 0%, rgba(5,15,35,0.92) 100%)"
            : "linear-gradient(135deg, rgba(2,6,23,0.55) 0%, rgba(5,15,35,0.60) 100%)",
          borderBottom: scrolled
            ? "1px solid rgba(34,197,94,0.12)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "none",
        }}
      >
        {/* Subtle top highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.35) 30%, rgba(255,255,255,0.15) 50%, rgba(34,197,94,0.35) 70%, transparent 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-8">

            {/* ── Logo ── */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div
                className="relative w-8 h-8 rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: "0 0 0 1px rgba(34,197,94,0.2), 0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <Image
                  src="https://instasize.com/api/image/6d3ae475e37778743563b0d175dac96c5f0ebe91ec11c34db44575c5ad589864.jpeg"
                  alt="KeyRush Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(34,197,94,0.15)" }}
                />
              </div>
              <span className="text-[18px] font-black tracking-tight leading-none">
                <span className="text-white">KEY</span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  RUSH
                </span>
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative px-4 py-1.5 text-[12px] font-semibold tracking-wide transition-all duration-200 rounded-lg"
                    style={{
                      color:      isActive ? "#4ade80" : "#9ca3af",
                      background: isActive ? "rgba(34,197,94,0.08)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.color      = "#f9fafb";
                        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.color      = "#9ca3af";
                        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                      }
                    }}
                  >
                    {link.name}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-1/2 rounded-full"
                        style={{
                          background: "linear-gradient(90deg, #22c55e, #4ade80)",
                          boxShadow:  "0 0 8px rgba(34,197,94,0.6)",
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Right side ── */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <LiveClock />
              <div className="w-px h-5 bg-white/10" />

              {/* Login button */}
              <button
                onClick={openLogin}
                className="relative px-5 py-2 text-[12px] font-bold tracking-wide rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(74,222,128,0.1) 100%)",
                  border:     "1px solid rgba(34,197,94,0.3)",
                  color:      "#4ade80",
                }}
                onMouseEnter={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background   = "linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(74,222,128,0.18) 100%)";
                  b.style.boxShadow    = "0 0 20px rgba(34,197,94,0.25), inset 0 1px 0 rgba(255,255,255,0.1)";
                  b.style.borderColor  = "rgba(34,197,94,0.5)";
                }}
                onMouseLeave={(e) => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background  = "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(74,222,128,0.1) 100%)";
                  b.style.boxShadow   = "none";
                  b.style.borderColor = "rgba(34,197,94,0.3)";
                }}
              >
                <span className="relative">Login</span>
              </button>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: isOpen ? "#4ade80" : "#9ca3af" }}
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {isOpen ? (
                  <path d="M4 4L16 16M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M3 5H17"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile dropdown ── */}
      <div
        className="fixed left-0 right-0 z-40 md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          top:       "60px",
          maxHeight: isOpen ? "400px" : "0px",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          background:   "linear-gradient(180deg, rgba(2,6,23,0.97) 0%, rgba(5,15,35,0.98) 100%)",
          borderBottom: isOpen ? "1px solid rgba(34,197,94,0.1)" : "none",
        }}
      >
        <div className="px-4 pt-3 pb-5 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150"
                style={{
                  background: isActive ? "rgba(34,197,94,0.08)" : "transparent",
                  color:      isActive ? "#4ade80"               : "#9ca3af",
                  border:     isActive ? "1px solid rgba(34,197,94,0.15)" : "1px solid transparent",
                }}
              >
                <span className="text-sm font-semibold tracking-wide">{link.name}</span>
                {isActive && <span className="text-green-400 text-xs">●</span>}
              </Link>
            );
          })}

          <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
            <LiveClock />
            {/* Mobile login + signup buttons */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => { setIsOpen(false); openSignup(); }}
                className="px-4 py-2 rounded-xl text-sm font-bold tracking-wide"
                style={{
                  background: "transparent",
                  border:     "1px solid rgba(34,197,94,0.2)",
                  color:      "#6b7280",
                }}
              >
                Sign Up
              </button>
              <button
                onClick={() => { setIsOpen(false); openLogin(); }}
                className="px-5 py-2 rounded-xl text-sm font-bold tracking-wide"
                style={{
                  background: "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(74,222,128,0.12) 100%)",
                  border:     "1px solid rgba(34,197,94,0.3)",
                  color:      "#4ade80",
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={authOpen}
        defaultMode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
};

export default Navbar;