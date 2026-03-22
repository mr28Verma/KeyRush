"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Mode = "login" | "signup";

interface AuthModalProps {
  isOpen: boolean;
  defaultMode?: Mode;
  onClose: () => void;
}

export default function AuthModal({ isOpen, defaultMode = "login", onClose }: AuthModalProps) {
  const [mode,     setMode]     = useState<Mode>(defaultMode);
  const [email,    setEmail]    = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [mounted,  setMounted]  = useState(false);
  const [visible,  setVisible]  = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMode(defaultMode); }, [defaultMode]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    onClose();
  };

  const switchMode = (m: Mode) => {
    setMode(m); setEmail(""); setUsername(""); setPassword("");
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlay}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        /* Real blur of whatever is behind */
        backdropFilter: visible ? "blur(16px) brightness(0.45) saturate(0.6)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(16px) brightness(0.45) saturate(0.6)" : "blur(0px)",
        background: visible ? "rgba(2,6,23,0.55)" : "rgba(2,6,23,0)",
        transition: "backdrop-filter 0.35s ease, background 0.35s ease",
      }}
    >
      {/* ── Card ── */}
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "rgba(8,15,30,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
        overflow: "hidden",
        position: "relative",
      }}>

        {/* Thin green top border */}
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.6) 40%, rgba(74,222,128,0.4) 60%, transparent)",
        }} />

        <div style={{ padding: "28px 28px 24px" }}>

          {/* ── Header row ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            {/* Wordmark */}
            <span style={{ fontSize: "15px", fontWeight: 900, letterSpacing: "0.06em", fontFamily: "monospace" }}>
              <span style={{ color: "#fff" }}>KEY</span>
              <span style={{
                background: "linear-gradient(135deg,#22c55e,#4ade80)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>RUSH</span>
            </span>

            {/* Close */}
            <button onClick={onClose} style={{
              width: "28px", height: "28px", borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "transparent", color: "#4b5563",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#4b5563"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1L9 9M1 9L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Title ── */}
          <div style={{ marginBottom: "22px" }}>
            <h2 style={{
              margin: "0 0 4px",
              fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em",
            }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
              {mode === "login"
                ? "Enter your credentials to continue"
                : "Join KeyRush and start racing"}
            </p>
          </div>

          {/* ── Mode tabs ── */}
          <div style={{
            display: "flex", gap: "4px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px", padding: "3px",
            marginBottom: "20px",
          }}>
            {(["login","signup"] as Mode[]).map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: "7px 0",
                borderRadius: "6px", border: "none", cursor: "pointer",
                fontSize: "12px", fontWeight: 700,
                letterSpacing: "0.04em",
                transition: "all 0.18s ease",
                background: mode === m ? "rgba(34,197,94,0.12)" : "transparent",
                color: mode === m ? "#4ade80" : "#4b5563",
                boxShadow: mode === m ? "0 0 0 1px rgba(34,197,94,0.2)" : "none",
              }}>
                {m === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "13px" }}>

            {mode === "signup" && (
              <Field label="Username" type="text" value={username} onChange={setUsername} placeholder="your_username" />
            )}

            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@keyrush.gg" />

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  onFocus={e => focusInput(e.target as HTMLInputElement)}
                  onBlur={e  => blurInput(e.target as HTMLInputElement)}
                  style={{ ...inputStyle, paddingRight: "42px" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  color: showPass ? "#22c55e" : "#374151", transition: "color 0.15s",
                  display: "flex",
                }}>
                  {showPass
                    ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1 7.5s2.8-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.8 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 2l11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1 7.5s2.8-4.5 6.5-4.5 6.5 4.5 6.5 4.5-2.8 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                  }
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: "-4px" }}>
                <button type="button" style={{
                  background: "none", border: "none", fontSize: "12px",
                  color: "#374151", cursor: "pointer", transition: "color 0.15s",
                }}
                  onMouseEnter={e => (e.target as HTMLButtonElement).style.color = "#22c55e"}
                  onMouseLeave={e => (e.target as HTMLButtonElement).style.color = "#374151"}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button type="submit" disabled={loading} style={{
              marginTop: "2px", width: "100%", padding: "11px",
              borderRadius: "8px",
              border: "1px solid rgba(34,197,94,0.35)",
              background: loading
                ? "rgba(34,197,94,0.06)"
                : "rgba(34,197,94,0.1)",
              color: "#4ade80",
              fontSize: "13px", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.2s ease",
              letterSpacing: "0.02em",
            }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.17)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(34,197,94,0.5)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(34,197,94,0.1)"; } }}
              onMouseLeave={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(34,197,94,0.35)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; } }}
            >
              {loading
                ? <><Spinner /> {mode === "login" ? "Signing in..." : "Creating account..."}</>
                : mode === "login" ? "Sign In" : "Create Account"
              }
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: "11px", color: "#1f2937" }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Social */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                {
                  label: "Google",
                  icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 7.14c0-.49-.04-.85-.12-1.22H7.14v2.2h3.31c-.07.56-.44 1.4-1.27 1.97l1.97 1.52C12.2 10.47 13 8.95 13 7.14z" fill="#4285F4"/><path d="M7.14 13c1.62 0 2.98-.54 3.97-1.46l-1.89-1.46c-.51.35-1.19.6-2.08.6-1.59 0-2.94-1.05-3.42-2.5L1.79 9.7C2.76 11.75 4.77 13 7.14 13z" fill="#34A853"/><path d="M3.72 8.18A3.57 3.57 0 013.52 7c0-.41.07-.81.19-1.18L1.64 4.31A6 6 0 001 7c0 .97.23 1.88.64 2.69l2.08-1.51z" fill="#FBBC05"/><path d="M7.14 3.32c1.13 0 1.9.49 2.33.9L11.14 2.6A5.88 5.88 0 007.14 1a6 6 0 00-5.5 3.31l2.07 1.6c.49-1.44 1.84-2.59 3.43-2.59z" fill="#EA4335"/></svg>,
                },
                {
                  label: "GitHub",
                  icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="#e5e7eb"><path d="M7 .5C3.41.5.5 3.41.5 7c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.31v-1.09c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-.95-.72-.95-.59-.4.04-.39.04-.39.65.05 1 .67 1 .67.58 1 1.53.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.71 0 0 .55-.18 1.8.67A6.27 6.27 0 017 3.66c.56 0 1.12.07 1.64.22 1.25-.85 1.8-.67 1.8-.67.35.89.13 1.55.06 1.71.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.59.44 1.19v1.77c0 .17.12.37.44.31C11.64 12.3 13.5 9.87 13.5 7 13.5 3.41 10.59.5 7 .5z"/></svg>,
                },
              ].map(p => (
                <button key={p.label} type="button" style={{
                  padding: "9px 12px", borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#6b7280",
                  fontSize: "12px", fontWeight: 600,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,255,255,0.14)"; b.style.color = "#e5e7eb"; b.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(255,255,255,0.07)"; b.style.color = "#6b7280"; b.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", marginTop: "18px", fontSize: "12px", color: "#374151" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => switchMode(mode === "login" ? "signup" : "login")} style={{
              background: "none", border: "none",
              color: "#22c55e", cursor: "pointer",
              fontSize: "12px", fontWeight: 600,
              textDecoration: "underline", textUnderlineOffset: "2px",
            }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>

        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Field ── */
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px",
  color: "#4b5563", fontWeight: 500,
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e5e7eb",
  fontSize: "13px",
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function focusInput(el: HTMLInputElement) {
  el.style.borderColor = "rgba(34,197,94,0.45)";
  el.style.boxShadow   = "0 0 0 3px rgba(34,197,94,0.07)";
}
function blurInput(el: HTMLInputElement) {
  el.style.borderColor = "rgba(255,255,255,0.08)";
  el.style.boxShadow   = "none";
}

function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required
        onFocus={e => focusInput(e.target as HTMLInputElement)}
        onBlur={e  => blurInput(e.target as HTMLInputElement)}
        style={inputStyle}
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
      style={{ animation: "kspin 0.65s linear infinite" }}>
      <style>{`@keyframes kspin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="6.5" cy="6.5" r="5" stroke="rgba(74,222,128,0.2)" strokeWidth="1.5"/>
      <path d="M6.5 1.5A5 5 0 0111.5 6.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}