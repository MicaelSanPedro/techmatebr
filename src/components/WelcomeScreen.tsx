"use client";

import { useState, useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { Sparkles } from "lucide-react";

const STORAGE_KEY = "techmate_username";

function getStoredName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeName(name: string) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
    window.dispatchEvent(new CustomEvent("techmate:username-set"));
  } catch {
    /* ignore */
  }
}

export function getUsername(): string | null {
  return getStoredName();
}

export function WelcomeScreen() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"enter" | "ask" | "greet" | "exit">(
    "enter"
  );
  const [isVisible, setIsVisible] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [userName, setUserName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydrate from localStorage
  useEffect(() => {
    setMounted(true);
    const stored = getStoredName();
    if (stored) {
      // Returning user — skip name prompt
      setIsVisible(true);
      setUserName(stored);
      setPhase("enter");
    } else {
      // First visit — show splash then ask name
      setIsVisible(true);
      setPhase("enter");
    }
  }, []);

  // Phase transitions
  useEffect(() => {
    if (!mounted || !isVisible) return;

    if (phase === "enter") {
      // Check if we already have a name
      const stored = getStoredName();
      if (stored) {
        // Skip to greet + auto-exit for returning users
        const greetTimer = setTimeout(() => setPhase("greet"), 1500);
        const exitTimer = setTimeout(() => setPhase("exit"), 3500);
        return () => {
          clearTimeout(greetTimer);
          clearTimeout(exitTimer);
        };
      } else {
        // New user — go to name input after splash
        const askTimer = setTimeout(() => setPhase("ask"), 1800);
        return () => clearTimeout(askTimer);
      }
    }

    if (phase === "greet") {
      const exitTimer = setTimeout(() => setPhase("exit"), 2200);
      return () => clearTimeout(exitTimer);
    }

    if (phase === "exit") {
      const doneTimer = setTimeout(() => setIsVisible(false), 900);
      return () => clearTimeout(doneTimer);
    }
  }, [phase, mounted, isVisible]);

  // Auto-focus input when ask phase starts
  useEffect(() => {
    if (phase === "ask") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    storeName(trimmed);
    setUserName(trimmed);
    setPhase("greet");
  };

  // Prevent flash on SSR
  if (!mounted) return null;
  if (!isVisible) return null;

  const isExiting = phase === "exit";
  const showSplash = phase === "enter";
  const showAsk = phase === "ask";
  const showGreet = phase === "greet";
  const isReturningUser = !!getStoredName();

  return (
    <div
      className={`welcome-overlay ${showSplash ? "welcome-enter" : "welcome-hold"} ${isExiting ? "welcome-exit" : ""}`}
      aria-hidden="true"
      style={isExiting ? { pointerEvents: "none" } : undefined}
    >
      {/* Letterbox bars */}
      <div className="welcome-letterbox welcome-letterbox--top" />
      <div className="welcome-letterbox welcome-letterbox--bottom" />

      {/* Vignette */}
      <div className="welcome-vignette" />

      {/* Ambient glow behind logo */}
      <div className="welcome-glow" />

      {/* Content */}
      <div className="welcome-content">
        {/* Logo */}
        <div
          className={`welcome-logo-wrap ${showAsk ? "welcome-logo-small" : ""} ${showGreet ? "welcome-logo-small" : ""}`}
        >
          <Logo
            className={`w-20 h-20 sm:w-24 sm:h-24 ${showAsk || showGreet ? "!w-12 !h-12 sm:!w-14 sm:!h-14" : ""}`}
            glow
            variant="amber"
          />
        </div>

        {/* ── Splash phase ── */}
        {showSplash && !isReturningUser && (
          <div className="welcome-text-group">
            <h1 className="welcome-title">
              <span className="welcome-title--tech">Tech</span>
              <span className="welcome-title--mate shimmer-text">Mate</span>
            </h1>
            <p className="welcome-tagline">Bem-vindo ao seu parceiro em tech</p>
          </div>
        )}

        {/* ── Returning user splash ── */}
        {showSplash && isReturningUser && (
          <div className="welcome-text-group">
            <h1 className="welcome-title">
              <span className="welcome-title--tech">Bem-vindo de volta, </span>
            </h1>
            <p className="welcome-tagline">
              <span className="shimmer-text">{userName}</span>
            </p>
          </div>
        )}

        {/* ── Ask name phase ── */}
        {showAsk && (
          <div className="welcome-name-section">
            <h2 className="welcome-name-heading">
              <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
              Qual é o seu nome?
            </h2>
            <form onSubmit={handleSubmit} className="welcome-name-form">
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome..."
                maxLength={24}
                className="welcome-name-input"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!nameInput.trim()}
                className="welcome-name-btn"
              >
                Entrar
              </button>
            </form>
          </div>
        )}

        {/* ── Greet phase ── */}
        {showGreet && (
          <div className="welcome-text-group welcome-greet-section">
            <h1 className="welcome-title welcome-greet-title">
              Bem-vindo,{" "}
              <span className="shimmer-text">{userName}</span>
              <span className="welcome-title--tech">!</span>
            </h1>
            <p className="welcome-tagline">Bom te ver por aqui</p>
          </div>
        )}

        {/* Decorative line */}
        <div className="welcome-line" />
      </div>

      {/* Subtle particles ring */}
      <div className="welcome-ring" />
      <div className="welcome-ring welcome-ring--outer" />
    </div>
  );
}
