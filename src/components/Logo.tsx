/**
 * TechMate Logo
 * Uses the custom PNG logo image with optional glow.
 */
import Image from "next/image";

interface LogoProps {
  className?: string;
  glow?: boolean;
  variant?: "amber" | "dark";
}

export function Logo({ className = "w-10 h-10", glow = false }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="TechMate"
      width={64}
      height={64}
      className={className}
      style={
        glow
          ? { filter: "drop-shadow(0 0 12px rgba(249, 189, 24, 0.45))" }
          : undefined
      }
    />
  );
}
