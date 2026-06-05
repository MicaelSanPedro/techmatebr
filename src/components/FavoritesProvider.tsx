"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useSession } from "next-auth/react";

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => Promise<void>;
  loading: boolean;
  isLoggedIn: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isFavorite: () => false,
  toggle: async () => {},
  loading: true,
  isLoggedIn: false,
});

const LS_KEY = "techmate-favorites";

function getLocalFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalFavorites(favs: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(favs));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session, status } = useSession();

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        const favs = data.favorites || [];
        setFavorites(favs);
        setLocalFavorites(favs);
        setIsLoggedIn(true);
      } else {
        // API failed (e.g. no GitHub token for Google user) — fallback to localStorage
        const localFavs = getLocalFavorites();
        setFavorites(localFavs);
        setIsLoggedIn(true);
      }
    } catch {
      const localFavs = getLocalFavorites();
      setFavorites(localFavs);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch favorites when session is confirmed (not loading, not unauthenticated)
  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      fetchFavorites();
    } else {
      setIsLoggedIn(false);
      setFavorites([]);
      setLoading(false);
    }
  }, [status, fetchFavorites]);

  const toggle = useCallback(async (slug: string) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        const { isFavorite: fav } = await res.json();
        setFavorites((prev) => {
          const updated = fav ? [...prev, slug] : prev.filter((s) => s !== slug);
          setLocalFavorites(updated);
          return updated;
        });
      } else {
        // API failed (e.g. Google user) — toggle locally
        setFavorites((prev) => {
          const isFav = prev.includes(slug);
          const updated = isFav ? prev.filter((s) => s !== slug) : [...prev, slug];
          setLocalFavorites(updated);
          return updated;
        });
      }
    } catch {
      // Network error — toggle locally
      setFavorites((prev) => {
        const isFav = prev.includes(slug);
        const updated = isFav ? prev.filter((s) => s !== slug) : [...prev, slug];
        setLocalFavorites(updated);
        return updated;
      });
    }
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite: (slug) => favorites.includes(slug),
        toggle,
        loading: status === "loading" || loading,
        isLoggedIn,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
