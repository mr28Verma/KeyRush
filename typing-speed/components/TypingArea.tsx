"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, Timer, Zap, Target } from "lucide-react";

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

/* ── Types ── */
type Mode = "30" | "60" | "custom";

/* ── StatCard ── */
const StatCard = ({
  label,
  value,
  icon,
  active,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  active: boolean;
}) => (
  <div className="text-center">
    <div className="flex justify-center items-center gap-1.5 text-gray-500 text-[11px] font-mono uppercase tracking-widest mb-2">
      {icon}
      {label}
    </div>
    <div
      className={`text-4xl font-bold tabular-nums transition-colors duration-300 ${
        active ? "text-green-400" : "text-white/20"
      }`}
    >
      {value}
    </div>
  </div>
);

/* ── Main Component ── */
const TypingArea = () => {
  const [sampleText, setSampleText] = useState("");
  const [customText, setCustomText] = useState("");
  const [mode, setMode] = useState<Mode>("30");

  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Result snapshot when test finishes
  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Load initial text ── */
  useEffect(() => {
    fetchText().then(setSampleText);
  }, []);

  /* ── Global keydown → focus ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't steal focus when user types in the custom textarea
      if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
      setIsFocused(true);
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* ── Sync duration → timeLeft when mode changes (before start) ── */
  useEffect(() => {
    if (!startTime) setTimeLeft(duration);
  }, [duration, startTime]);

  /* ── Countdown timer ── */
  useEffect(() => {
    if (!startTime || isFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished]);

  /* ── Live WPM + Accuracy ── */
  useEffect(() => {
    if (!startTime || isFinished || userInput.length === 0) return;

    const elapsed = (Date.now() - startTime) / 60000; // minutes
    const wordsTyped = userInput.length / 5;
    const currentWpm = Math.round(wordsTyped / elapsed) || 0;

    const errors = userInput.split("").filter((ch, i) => ch !== sampleText[i]).length;
    const correct = userInput.length - errors;
    const currentAcc = Math.round((correct / userInput.length) * 100) || 100;

    setWpm(currentWpm);
    setAccuracy(currentAcc);
  }, [userInput, startTime, isFinished, sampleText]);

  /* ── Snapshot on finish ── */
  useEffect(() => {
    if (isFinished) {
      setFinalWpm(wpm);
      setFinalAccuracy(accuracy);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  /* ── Reset ── */
  const resetTest = useCallback(
    async (overrideText?: string) => {
      if (timerRef.current) clearInterval(timerRef.current);

      let nextText = overrideText ?? "";
      if (!nextText) {
        nextText = await fetchText();
      }

      setSampleText(nextText);
      setUserInput("");
      setStartTime(null);
      setIsFinished(false);
      setWpm(0);
      setAccuracy(100);
      setFinalWpm(0);
      setFinalAccuracy(100);
      setTimeLeft(duration);
      setIsFocused(false);
    },
    [duration]
  );

  /* ── Handle typing input ── */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const val = e.target.value;

    // Start timer on first character
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    // Clamp to text length
    if (val.length <= sampleText.length) {
      setUserInput(val);
    }

    // Finished when all chars typed
    if (val.length === sampleText.length) {
      setIsFinished(true);
    }
  };

  /* ── Click on typing area to focus ── */
  const handleContainerClick = () => {
    if (mode === "custom") return;
    setIsFocused(true);
    inputRef.current?.focus();
  };

  /* ── Switch mode ── */
  const switchMode = (newMode: Mode, newDuration?: number) => {
    setMode(newMode);
    if (newDuration) setDuration(newDuration);
    if (newMode !== "custom") {
      resetTest();
    } else {
      // Just clear state for custom
      setUserInput("");
      setStartTime(null);
      setIsFinished(false);
      setWpm(0);
      setAccuracy(100);
      setTimeLeft(newDuration ?? duration);
      setIsFocused(false);
    }
  };

  /* ── Derived display values ── */
  const displayWpm = isFinished ? finalWpm : wpm;
  const displayAcc = isFinished ? `${finalAccuracy}%` : `${accuracy}%`;
  const displayTime = isFinished ? "0s" : `${timeLeft}s`;
  const isActive = !!startTime && !isFinished;
  const progress = sampleText.length > 0 ? (userInput.length / sampleText.length) * 100 : 0;

  if (!sampleText && mode !== "custom") return null;

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* ── STATS ── */}
      <div className="flex justify-center gap-16 mb-12">
        <StatCard label="WPM"  value={displayWpm}  icon={<Zap    size={13} />} active={isActive || isFinished} />
        <StatCard label="ACC"  value={displayAcc}  icon={<Target size={13} />} active={isActive || isFinished} />
        <StatCard label="TIME" value={displayTime} icon={<Timer  size={13} />} active={isActive || isFinished} />
      </div>

      {/* ── CUSTOM TEXT INPUT ── */}
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
              setUserInput("");
              setStartTime(null);
              setIsFinished(false);
              setWpm(0);
              setAccuracy(100);
              setTimeLeft(duration);
              setIsFocused(false);
              setMode("30"); // Switch back to typing view
            }}
            className="mt-3 px-6 py-2.5 bg-green-500 text-black font-bold text-sm rounded-lg hover:bg-green-400 transition-colors"
          >
            Start Custom Test
          </button>
        </div>
      )}

      {/* ── TYPING BOX ── */}
      {mode !== "custom" && (
        <>
          {/* Finished overlay */}
          {isFinished ? (
            <div className="relative p-10 rounded-2xl border border-green-500/20 bg-white/[0.01] backdrop-blur-sm flex flex-col items-center gap-6">
              <div className="text-green-400 font-mono text-xs uppercase tracking-widest">
                Test Complete
              </div>
              <div className="flex gap-16">
                <div className="text-center">
                  <div className="text-6xl font-black text-white">{finalWpm}</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-mono">wpm</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-white">{finalAccuracy}%</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-mono">accuracy</div>
                </div>
              </div>
              <button
                onClick={() => resetTest()}
                className="flex items-center gap-2 px-8 py-3 bg-green-500 text-black font-bold text-sm hover:bg-green-400 transition-colors"
              >
                <RotateCcw size={15} />
                Try Again
              </button>
            </div>
          ) : (
            <div
              className="relative p-10 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm cursor-text"
              onClick={handleContainerClick}
            >
              {/* Focus prompt overlay */}
              {!isFocused && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <span className="text-gray-500 text-sm font-mono tracking-widest uppercase">
                    Click or press any key to start
                  </span>
                </div>
              )}

              {/* Hidden input */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Only unfocus if test hasn't started
                  if (!startTime) setIsFocused(false);
                }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              {/* Rendered text */}
              <div
                className={`text-2xl font-mono leading-relaxed transition-all duration-300 ${
                  !isFocused ? "blur-sm opacity-30" : ""
                }`}
              >
                {sampleText.split("").map((char, i) => {
                  let colorClass = "text-gray-600"; // untyped

                  if (i < userInput.length) {
                    colorClass =
                      userInput[i] === char ? "text-white" : "text-red-400 bg-red-500/10";
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

          {/* ── PROGRESS BAR ── */}
          <div className="mt-4 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-100 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      {/* ── CONTROLS ── */}
      <div className="mt-10 flex items-center justify-between text-xs font-mono text-gray-500">
        {/* Duration / Mode buttons */}
        <div className="flex gap-1">
          {(
            [
              { label: "30s",    m: "30" as Mode,     d: 30  },
              { label: "60s",    m: "60" as Mode,     d: 60  },
              { label: "Custom", m: "custom" as Mode, d: undefined },
            ] as const
          ).map(({ label, m, d }) => (
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

        {/* Restart */}
        <button
          onClick={() => resetTest()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:text-gray-300 transition-colors uppercase tracking-widest"
        >
          <RotateCcw size={13} />
          Restart
        </button>
      </div>
    </div>
  );
};

export default TypingArea;