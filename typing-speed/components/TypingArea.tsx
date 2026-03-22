"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Timer, Zap, Target, Lock, Award, RefreshCw } from "lucide-react";

/* ── Fetch random text ── */
const fetchText = async (): Promise<string> => {
  try {
    const res = await fetch("https://baconipsum.com/api/?type=all-meat&paras=1");
    const data = await res.json();
    return data[0] as string;
  } catch {
    return "Practice typing every day to improve your speed and accuracy across all kinds of text.";
  }
};

type Mode = "30" | "60" | "custom";

interface TypingAreaProps {
  onStatsChange?: (wpm: number, accuracy: number, timeLeft: number, started: boolean, finished: boolean) => void;
}

/* ══════════════════════════════════════════
   ROAST / MOTIVATE MESSAGE ENGINE
══════════════════════════════════════════ */
function getFeedbackMessage(wpm: number, acc: number): { emoji: string; msg: string; color: string } {
  // High WPM, trash accuracy
  if (wpm >= 80 && acc < 70)  return { emoji: "💀", msg: "Bro typed like his keyboard was on fire. Slow down and actually HIT THE RIGHT KEYS.", color: "#f87171" };
  if (wpm >= 60 && acc < 75)  return { emoji: "🤦", msg: "Fast fingers, zero brain. Your accuracy is an embarrassment to keyboards everywhere.", color: "#f87171" };
  if (wpm >= 40 && acc < 80)  return { emoji: "😬", msg: "Speed means nothing when half your letters are wrong. A drunk sloth types more accurately.", color: "#fb923c" };

  // Low WPM, high accuracy
  if (wpm < 20 && acc >= 95)  return { emoji: "🐢", msg: "100% accuracy at 18 WPM... are you typing with one finger? Or a pencil?", color: "#fb923c" };
  if (wpm < 30 && acc >= 90)  return { emoji: "🦥", msg: "You're accurate but slower than government paperwork. Pick up the pace!", color: "#fb923c" };
  if (wpm < 40 && acc >= 85)  return { emoji: "😅", msg: "Not bad on accuracy, but your speed needs CPR. Keep grinding.", color: "#facc15" };

  // Both bad
  if (wpm < 20 && acc < 75)   return { emoji: "💩", msg: "Slow AND wrong. The worst combo. Did you type this with your elbow?", color: "#f87171" };
  if (wpm < 30 && acc < 80)   return { emoji: "😭", msg: "Both your speed and accuracy are crying. Time to practice. A lot.", color: "#f87171" };

  // Close to milestones — motivate
  if (wpm >= 58 && wpm < 60 && acc >= 90)  return { emoji: "🔥", msg: "2 WPM away from 60! You're SO close. One more round and you'll crack it.", color: "#4ade80" };
  if (wpm >= 78 && wpm < 80 && acc >= 90)  return { emoji: "⚡", msg: "78 WPM?! You're basically knocking on the door of 80. Don't stop now!", color: "#4ade80" };
  if (wpm >= 95 && wpm < 100 && acc >= 90) return { emoji: "🚀", msg: "5 WPM from 100. You're elite. Push once more — 100 WPM is RIGHT THERE.", color: "#facc15" };

  // Good performance — hype
  if (wpm >= 100 && acc >= 95) return { emoji: "👑", msg: "GOATED. 100+ WPM and pin-point accuracy. You're built different.", color: "#facc15" };
  if (wpm >= 80 && acc >= 90)  return { emoji: "🔥", msg: "Absolutely cooking. 80+ WPM with clean accuracy — that's elite territory.", color: "#4ade80" };
  if (wpm >= 60 && acc >= 90)  return { emoji: "💪", msg: "Solid run! 60+ WPM with great accuracy. You're above average — keep building.", color: "#4ade80" };
  if (wpm >= 40 && acc >= 85)  return { emoji: "📈", msg: "Decent! You're in the zone. A few more sessions and you'll break 60 WPM.", color: "#60a5fa" };

  // Generic ok
  return { emoji: "🎯", msg: "Not bad. But you can do better. Hit restart and go again.", color: "#9ca3af" };
}

/* ── Performance badge ── */
const getPerfBadge = (wpm: number, acc: number) => {
  if (wpm >= 100 && acc >= 95) return { label: "LEGENDARY", color: "#facc15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)" };
  if (wpm >= 80  && acc >= 90) return { label: "EXPERT",    color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.25)" };
  if (wpm >= 60  && acc >= 85) return { label: "ADVANCED",  color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.25)" };
  if (wpm >= 40  && acc >= 80) return { label: "AVERAGE",   color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)" };
  return                              { label: "BEGINNER",  color: "#9ca3af", bg: "rgba(156,163,175,0.08)", border: "rgba(156,163,175,0.25)" };
};

/* ── Accuracy ring ── */
const AccuracyRing = ({ value }: { value: number }) => {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 95 ? "#4ade80" : value >= 80 ? "#facc15" : "#f87171";
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle
        cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text x="40" y="44" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" fontFamily="monospace">
        {value}%
      </text>
    </svg>
  );
};

/* ── Stat card ── */
const StatCard = ({ label, value, icon, active }: { label: string; value: string | number; icon: React.ReactNode; active: boolean }) => (
  <div className="text-center">
    <div className="flex justify-center items-center gap-1.5 text-gray-500 text-[11px] font-mono uppercase tracking-widest mb-2">
      {icon}{label}
    </div>
    <div className={`text-4xl font-bold tabular-nums transition-colors duration-300 ${active ? "text-green-400" : "text-white/20"}`}>
      {value}
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const TypingArea = ({ onStatsChange }: TypingAreaProps) => {
  const [sampleText, setSampleText]   = useState("");
  const [customText, setCustomText]   = useState("");
  const [mode, setMode]               = useState<Mode>("30");
  const [userInput, setUserInput]     = useState("");
  const [startTime, setStartTime]     = useState<number | null>(null);
  const [isFinished, setIsFinished]   = useState(false);
  const [isFocused, setIsFocused]     = useState(false);
  const [duration, setDuration]       = useState(30);
  const [timeLeft, setTimeLeft]       = useState(30);
  const [wpm, setWpm]                 = useState(0);
  const [accuracy, setAccuracy]       = useState(100);
  const [finalWpm, setFinalWpm]       = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);
  const [wpmSnapshots, setWpmSnapshots]   = useState<number[]>([]);

  const inputRef    = useRef<HTMLInputElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const snapRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const wpmRef      = useRef(0); // always-current wpm for snapshot closure

  useEffect(() => { fetchText().then(setSampleText); }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
      setIsFocused(true);
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => { if (!startTime) setTimeLeft(duration); }, [duration, startTime]);

  useEffect(() => {
    onStatsChange?.(wpm, accuracy, timeLeft, !!startTime, isFinished);
  }, [wpm, accuracy, timeLeft, startTime, isFinished, onStatsChange]);

  /* Countdown */
  useEffect(() => {
    if (!startTime || isFinished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); setIsFinished(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime, isFinished]);

  /* WPM snapshot sampler */
  useEffect(() => {
    if (!startTime || isFinished) return;
    const interval = Math.max(4000, (duration * 1000) / 7);
    snapRef.current = setInterval(() => {
      setWpmSnapshots((prev) => [...prev.slice(-6), wpmRef.current]);
    }, interval);
    return () => { if (snapRef.current) clearInterval(snapRef.current); };
  }, [startTime, isFinished, duration]);

  /* Live WPM + accuracy */
  useEffect(() => {
    if (!startTime || isFinished || userInput.length === 0) return;
    const elapsed    = (Date.now() - startTime) / 60000;
    const currentWpm = Math.round(userInput.length / 5 / elapsed) || 0;
    const errors     = userInput.split("").filter((ch, i) => ch !== sampleText[i]).length;
    const currentAcc = Math.round(((userInput.length - errors) / userInput.length) * 100) || 100;
    setWpm(currentWpm);
    setAccuracy(currentAcc);
    wpmRef.current = currentWpm;
  }, [userInput, startTime, isFinished, sampleText]);

  /* Freeze on finish */
  useEffect(() => {
    if (!isFinished) return;
    setFinalWpm(wpm);
    setFinalAccuracy(accuracy);
    setWpmSnapshots((prev) => [...prev.slice(-6), wpmRef.current]);
    if (timerRef.current) clearInterval(timerRef.current);
    if (snapRef.current)  clearInterval(snapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  const resetTest = useCallback(async (overrideText?: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (snapRef.current)  clearInterval(snapRef.current);
    const nextText = overrideText || (await fetchText());
    setSampleText(nextText);
    setUserInput(""); setStartTime(null); setIsFinished(false);
    setWpm(0); setAccuracy(100); setFinalWpm(0); setFinalAccuracy(100);
    setTimeLeft(duration); setIsFocused(false); setWpmSnapshots([]);
    wpmRef.current = 0;
  }, [duration]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;
    if (!startTime && val.length > 0) setStartTime(Date.now());
    if (val.length <= sampleText.length) setUserInput(val);
    if (val.length === sampleText.length) setIsFinished(true);
  };

  const handleContainerClick = () => {
    if (mode === "custom") return;
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const switchMode = (newMode: Mode, newDuration?: number) => {
    setMode(newMode);
    if (newDuration) setDuration(newDuration);
    if (newMode !== "custom") {
      resetTest();
    } else {
      setUserInput(""); setStartTime(null); setIsFinished(false);
      setWpm(0); setAccuracy(100);
      setTimeLeft(newDuration ?? duration); setIsFocused(false); setWpmSnapshots([]);
    }
  };

  const isActive   = !!startTime && !isFinished;
  const progress   = sampleText.length > 0 ? (userInput.length / sampleText.length) * 100 : 0;
  const errors     = userInput.split("").filter((ch, i) => ch !== sampleText[i]).length;
  const cpm        = Math.round((userInput.length / Math.max(duration - timeLeft, 1)) * 60);
  const badge      = getPerfBadge(finalWpm, finalAccuracy);
  const feedback   = getFeedbackMessage(finalWpm, finalAccuracy);

  if (!sampleText && mode !== "custom") return null;

  return (
    <div className="w-full max-w-4xl mx-auto select-none">

      {/* ── LIVE STATS (only while typing) ── */}
      {!isFinished && (
        <div className="flex justify-center gap-16 mb-12">
          <StatCard label="WPM"  value={isActive ? wpm        : 0}      icon={<Zap    size={13} />} active={isActive} />
          <StatCard label="ACC"  value={isActive ? `${accuracy}%` : "100%"} icon={<Target size={13} />} active={isActive} />
          <StatCard label="TIME" value={`${timeLeft}s`}                  icon={<Timer  size={13} />} active={isActive} />
        </div>
      )}

      {/* ── CUSTOM INPUT ── */}
      {mode === "custom" && (
        <div className="mb-6 animate-in fade-in duration-300">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste or type your custom text here…"
            rows={5}
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm outline-none resize-none placeholder:text-gray-600 focus:border-green-500/30 transition-colors"
          />
          <button
            onClick={() => {
              const trimmed = customText.trim();
              if (!trimmed) return;
              setSampleText(trimmed);
              setUserInput(""); setStartTime(null); setIsFinished(false);
              setWpm(0); setAccuracy(100); setTimeLeft(duration); setIsFocused(false); setMode("30");
            }}
            className="mt-3 px-6 py-2.5 bg-green-500 text-black font-bold text-sm rounded-lg hover:bg-green-400 transition-colors"
          >
            Start Custom Test
          </button>
        </div>
      )}

      {mode !== "custom" && (
        <>
          {isFinished ? (
            /* ══════════════════════════════════
               RESULTS SCREEN
            ══════════════════════════════════ */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">

              {/* ── FEEDBACK MESSAGE ── */}
              <div
                className="rounded-2xl px-6 py-4 border flex items-start gap-4"
                style={{
                  background: `${feedback.color}08`,
                  borderColor: `${feedback.color}25`,
                }}
              >
                <span className="text-3xl leading-none mt-0.5">{feedback.emoji}</span>
                <p className="text-sm font-mono leading-relaxed" style={{ color: feedback.color }}>
                  {feedback.msg}
                </p>
              </div>

              {/* ── MAIN RESULT CARD ── */}
              <div
                className="rounded-2xl border p-6"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(34,197,94,0.025) 100%)",
                  borderColor: "rgba(34,197,94,0.12)",
                  boxShadow: "0 0 40px rgba(34,197,94,0.04), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {/* Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border"
                    style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
                  >
                    <Award size={11} />
                    {badge.label}
                  </div>
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    {mode === "30" ? "30s" : "60s"} test
                  </div>
                </div>

                {/* WPM hero + accuracy ring */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">words / min</div>
                    <div className="flex items-end gap-2">
                      <span
                        className="text-7xl font-black tabular-nums leading-none"
                        style={{
                          background: "linear-gradient(135deg, #ffffff 20%, #4ade80 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {finalWpm}
                      </span>
                      <span className="text-gray-600 font-mono text-xs mb-2">wpm</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-2">accuracy</div>
                    <AccuracyRing value={finalAccuracy} />
                  </div>
                </div>

                {/* Secondary stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "CPM",    value: cpm          },
                    { label: "Errors", value: errors       },
                    { label: "Time",   value: `${duration}s` },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-3 text-center border border-white/[0.04]"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <div className="text-lg font-bold text-white tabular-nums">{s.value}</div>
                      <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── GRAPH — locked behind login ── */}
                <div
                  className="rounded-xl border border-white/[0.04] overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.015)" }}
                >
                  <div className="flex items-center justify-between px-4 pt-3 pb-2">
                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">WPM over time</span>
                    <span className="text-[10px] font-mono text-gray-700">{wpmSnapshots.length} pts</span>
                  </div>

                  <div className="relative px-4 pb-4">
                    {/* Blurred fake chart behind the lock */}
                    <div style={{ filter: "blur(3px)", opacity: 0.4 }}>
                      <svg width="100%" height="72" viewBox="0 0 400 72" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* fake smooth curve */}
                        <path
                          d="M0 60 C50 55, 80 30, 130 25 S200 35, 250 20 S330 10, 400 15"
                          fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"
                        />
                        <path
                          d="M0 60 C50 55, 80 30, 130 25 S200 35, 250 20 S330 10, 400 15 L400 72 L0 72 Z"
                          fill="url(#gFill)"
                        />
                        {[0,130,250,400].map((x,i) => (
                          <circle key={i} cx={x} cy={[60,25,20,15][i]} r="3" fill="#4ade80" />
                        ))}
                      </svg>
                    </div>

                    {/* Login gate */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-lg"
                      style={{ background: "rgba(2,6,23,0.75)", backdropFilter: "blur(8px)" }}
                    >
                      <Lock size={14} className="text-green-400" />
                      <p className="text-[11px] font-mono text-gray-400 text-center leading-relaxed">
                        Login to unlock your full WPM graph
                      </p>
                      <button
                        className="px-5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-widest rounded-lg border transition-all duration-200 hover:bg-green-500/20"
                        style={{
                          background: "rgba(34,197,94,0.08)",
                          borderColor: "rgba(34,197,94,0.3)",
                          color: "#4ade80",
                        }}
                      >
                        Login / Sign up
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 mt-5">
                  <button
                    onClick={() => resetTest()}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      color: "#000",
                      boxShadow: "0 0 20px rgba(34,197,94,0.25)",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 32px rgba(34,197,94,0.45)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(34,197,94,0.25)"; }}
                  >
                    <RefreshCw size={14} /> Try Again
                  </button>
                  <button
                    onClick={() => switchMode(mode === "30" ? "60" : "30", mode === "30" ? 60 : 30)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-mono font-bold border border-white/8 transition-all duration-200 text-gray-500 hover:text-gray-200"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    Try {mode === "30" ? "60s" : "30s"}
                  </button>
                </div>
              </div>
            </div>

          ) : (
            /* ══════════════════════════════════
               TYPING BOX
            ══════════════════════════════════ */
            <div
              className="relative p-10 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm cursor-text"
              onClick={handleContainerClick}
            >
              {!isFocused && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <span className="text-gray-500 text-sm font-mono tracking-widest uppercase">
                    Click or press any key to start
                  </span>
                </div>
              )}
              <input
                ref={inputRef}
                data-typing
                type="text"
                value={userInput}
                onChange={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => { if (!startTime) setIsFocused(false); }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-text"
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              />
              <div className={`text-2xl font-mono leading-relaxed transition-all duration-300 ${!isFocused ? "blur-sm opacity-30" : ""}`}>
                {sampleText.split("").map((char, i) => {
                  let colorClass = "text-gray-600";
                  if (i < userInput.length) {
                    colorClass = userInput[i] === char ? "text-white" : "text-red-400 bg-red-500/10";
                  }
                  const isCursor = i === userInput.length && isFocused;
                  return (
                    <span key={i} className={`relative ${colorClass}`}>
                      {isCursor && (
                        <span className="absolute -left-[1px] top-[0.1em] w-[2px] h-[0.9em] bg-green-400 animate-pulse rounded-full" />
                      )}
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Progress bar */}
          {!isFinished && (
            <div className="mt-4 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-100 rounded-full"
                style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(74,222,128,0.6)" }}
              />
            </div>
          )}
        </>
      )}

      {/* ── CONTROLS ── */}
      {!isFinished && (
        <div className="mt-10 flex items-center justify-between text-xs font-mono text-gray-500">
          <div className="flex gap-1">
            {([
              { label: "30s",    m: "30" as Mode,     d: 30       },
              { label: "60s",    m: "60" as Mode,     d: 60       },
              { label: "Custom", m: "custom" as Mode, d: undefined },
            ] as const).map(({ label, m, d }) => (
              <button
                key={m}
                onClick={() => switchMode(m, d)}
                className={`px-3 py-1.5 rounded transition-colors uppercase tracking-widest ${
                  mode === m
                    ? "text-green-400 bg-green-500/10 border border-green-500/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => resetTest()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:text-gray-300 transition-colors uppercase tracking-widest"
          >
            <RotateCcw size={13} /> Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingArea;