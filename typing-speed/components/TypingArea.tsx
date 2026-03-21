"use client";

import React, { useState, useEffect, useRef } from "react";
import { RotateCcw, Timer, Zap, Target } from "lucide-react";

/* FETCH RANDOM TEXT */
const fetchText = async () => {
  try {
    const res = await fetch(
      "https://baconipsum.com/api/?type=all-meat&paras=1"
    );
    const data = await res.json();
    return data[0];
  } catch {
    return "Practice typing every day to improve your speed and accuracy.";
  }
};

const TypingArea = () => {
  const [sampleText, setSampleText] = useState("");
  const [customText, setCustomText] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [duration, setDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load random text
  useEffect(() => {
    const load = async () => {
      const text = await fetchText();
      setSampleText(text);
    };
    load();
  }, []);

  // Start on key press
  useEffect(() => {
    const handleKey = () => {
      setIsFocused(true);
      inputRef.current?.focus();
      setStartTime((prev) => prev ?? Date.now());
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Click start
  const handleContainerClick = () => {
    setIsFocused(true);
    inputRef.current?.focus();
    setStartTime((prev) => prev ?? Date.now());
  };

  // Typing
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isFocused || isFinished) return;

    const val = e.target.value;

    if (!startTime) setStartTime(Date.now());

    if (val.length <= sampleText.length) {
      setUserInput(val);
    }

    if (val.length === sampleText.length) {
      setIsFinished(true);
    }
  };

  // Sync duration
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Timer
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  // WPM + Accuracy
  useEffect(() => {
    if (startTime && !isFinished) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      const wordsTyped = userInput.length / 5;

      setWpm(Math.round(wordsTyped / timeElapsed) || 0);

      const errors = userInput
        .split("")
        .filter((char, i) => char !== sampleText[i]).length;

      const acc =
        ((userInput.length - errors) / userInput.length) * 100 || 100;

      setAccuracy(Math.round(acc));
    }
  }, [userInput, startTime, isFinished]);

  // RESET (fixed)
  const resetTest = async (text?: string) => {
    setIsFocused(false);

    let finalText = "";

    if (text) {
      finalText = text;
    } else if (isCustom && customText.trim()) {
      finalText = customText;
    } else {
      finalText = await fetchText();
    }

    setSampleText(finalText);

    setUserInput("");
    setStartTime(null);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(duration);
  };

  if (!sampleText) return null;

  return (
    <div className="w-full max-w-4xl mx-auto" onClick={handleContainerClick}>
      
      {/* STATS */}
      <div className="flex justify-center gap-12 mb-12">
        <StatCard label="WPM" value={wpm} icon={<Zap size={14} />} active={!!startTime} />
        <StatCard label="ACC" value={`${accuracy}%`} icon={<Target size={14} />} active={!!startTime} />
        <StatCard label="TIME" value={`${timeLeft}s`} icon={<Timer size={14} />} active={!!startTime} />
      </div>

      {/* CUSTOM MODE */}
      {isCustom && (
        <div className="mb-6">
          <textarea
            autoFocus
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your custom text..."
            className="w-full p-4 rounded-lg bg-black/40 border border-white/10 text-white outline-none"
          />

          <button
            onClick={() => {
              if (!customText.trim()) return;
              resetTest(customText);
              setIsCustom(false);
            }}
            className="mt-3 px-4 py-2 bg-green-500 text-black font-bold rounded"
          >
            Start Custom Test
          </button>
        </div>
      )}

      {/* TYPING BOX */}
      {!isCustom && (
        <>
          <div className="relative p-10 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm">

            {!isFocused && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-mono pointer-events-none">
                Click or press any key to start typing
              </div>
            )}

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInput}
              className="absolute inset-0 opacity-0"
            />

            <div className={`text-2xl font-mono ${!isFocused ? "blur-sm opacity-40" : ""}`}>
              {sampleText.split("").map((char, i) => {
                let state = "text-gray-600";

                if (i < userInput.length) {
                  state =
                    userInput[i] === char
                      ? "text-white"
                      : "text-red-500";
                }

                return (
                  <span key={i} className={`relative ${state}`}>
                    {i === userInput.length && isFocused && (
                      <span className="absolute -left-[2px] top-1 w-[2px] h-[1.2em] bg-green-400 animate-pulse" />
                    )}
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mt-8 h-1 w-full bg-white/5">
            <div
              className="h-full bg-green-400"
              style={{
                width: `${(userInput.length / sampleText.length) * 100}%`,
              }}
            />
          </div>
        </>
      )}

      {/* CONTROLS */}
      <div className="mt-12 flex justify-between text-xs font-mono">
        <div className="flex gap-4">
          <button onClick={() => { setIsCustom(false); setDuration(30); resetTest(); }}>30s</button>
          <button onClick={() => { setIsCustom(false); setDuration(60); resetTest(); }}>60s</button>
          <button onClick={() => { setIsCustom(true); setUserInput(""); setIsFocused(false); }}>
            Custom
          </button>
        </div>

        <button onClick={() => resetTest()}>
          <RotateCcw size={16} /> RESTART
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, active }: any) => (
  <div className="text-center">
    <div className="flex justify-center gap-2 text-gray-500 text-xs mb-1">
      {icon} {label}
    </div>
    <div className={`text-4xl font-bold ${active ? "text-green-400" : "text-white/20"}`}>
      {value}
    </div>
  </div>
);

export default TypingArea;