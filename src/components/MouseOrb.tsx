"use client";

import { useEffect, useRef, useState } from "react";

export function MouseOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const trailTarget = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      trailTarget.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const handleLeave = () => {
      setVisible(false);
    };

    const handleEnter = () => {
      setVisible(true);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    /* Smooth animation loop using lerp */
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

      const tx = trailTarget.current.x;
      const ty = trailTarget.current.y;
      const dx = pos.current.x - tx;
      const dy = pos.current.y - ty;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${1 + Math.min(speed * 0.003, 0.3)})`;
      }

      if (trailRef.current) {
        const trailX = lerp(parseFloat(trailRef.current.dataset.px || "0"), tx, 0.08);
        const trailY = lerp(parseFloat(trailRef.current.dataset.py || "0"), ty, 0.08);
        trailRef.current.dataset.px = String(trailX);
        trailRef.current.dataset.py = String(trailY);
        trailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
        trailRef.current.style.opacity = String(0.3 + Math.min(speed * 0.005, 0.4));
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  return (
    <>
      {/* Trail orb (larger, softer, follows slower) */}
      <div
        ref={trailRef}
        data-px="-100"
        data-py="-100"
        className="mouse-orb-trail pointer-events-none fixed z-[9998] hidden"
        aria-hidden
      />

      {/* Main orb (crisp, responsive) */}
      <div
        ref={orbRef}
        className={`mouse-orb pointer-events-none fixed z-[9999] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
        aria-hidden
      />
    </>
  );
}
