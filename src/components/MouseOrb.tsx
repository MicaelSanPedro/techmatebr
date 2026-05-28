"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function MouseOrb() {
  const orbRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef({ x: -200, y: -200 });
  const target = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);
  const [visible, setVisible] = useState(false);
  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 5 }, () => ({ x: -200, y: -200 }))
  );

  const handleMove = useCallback((e: MouseEvent) => {
    target.current = { x: e.clientX, y: e.clientY };
    if (!visible) setVisible(true);
  }, [visible]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove, { passive: true });

    const handleLeave = () => setVisible(false);
    const handleEnter = () => {
      setVisible(true);
      /* snap orb to cursor position on re-enter */
      pos.current = { ...target.current };
    };

    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const animate = () => {
      /* Main orb - fast follow */
      pos.current.x = lerp(pos.current.x, target.current.x, 0.18);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.18);

      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const scale = 1 + Math.min(speed * 0.002, 0.15);

      if (orbRef.current) {
        orbRef.current.style.transform =
          `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) ` +
          `translate(-50%, -50%) scale(${scale})`;
      }

      /* Trail orbs - progressively slower */
      for (let i = 0; i < trailPositions.current.length; i++) {
        const prev =
          i === 0
            ? pos.current
            : trailPositions.current[i - 1];
        const factor = 0.12 - i * 0.018;
        const trail = trailPositions.current[i];
        trail.x = lerp(trail.x, prev.x, factor);
        trail.y = lerp(trail.y, prev.y, factor);

        const el = trailRefs.current[i];
        if (el) {
          const trailScale = 1 - i * 0.12;
          const trailOpacity = 0.6 - i * 0.1;
          el.style.transform =
            `translate3d(${trail.x}px, ${trail.y}px, 0) ` +
            `translate(-50%, -50%) scale(${trailScale})`;
          el.style.opacity = String(Math.max(trailOpacity + Math.min(speed * 0.002, 0.2), 0.1));
        }
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
  }, [handleMove]);

  return (
    <>
      {/* Trail orbs (progressively smaller and fainter) */}
      {trailPositions.current.map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="mouse-orb-trail pointer-events-none fixed"
          style={{
            zIndex: 9997 - i,
            width: 56 - i * 6,
            height: 56 - i * 6,
            transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
            opacity: 0,
          }}
          aria-hidden
        />
      ))}

      {/* Main orb */}
      <div
        ref={orbRef}
        className="mouse-orb pointer-events-none fixed"
        style={{
          zIndex: 9999,
          transform: "translate3d(-200px, -200px, 0) translate(-50%, -50%)",
        }}
        aria-hidden
      />
    </>
  );
}
