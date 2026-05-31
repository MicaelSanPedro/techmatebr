"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

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

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
        setIsLoggedIn(true);
      }
    } catch {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggle = useCallback(async (slug: string) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      const { isFavorite } = await res.json();
      setFavorites((prev) =>
        isFavorite ? [...prev, slug] : prev.filter((s) => s !== slug)
      );
    }
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite: (slug) => favorites.includes(slug),
        toggle,
        loading,
        isLoggedIn,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
