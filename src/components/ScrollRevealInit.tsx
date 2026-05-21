"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure DOM is fully painted after navigation
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll<HTMLElement>(
        "[data-scroll-reveal]"
      );

      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const delay = el.getAttribute("data-scroll-delay");
              const ms = delay ? parseInt(delay, 10) : 0;

              if (ms > 0) {
                setTimeout(() => el.classList.add("revealed"), ms);
              } else {
                el.classList.add("revealed");
              }

              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -40px 0px",
        }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
