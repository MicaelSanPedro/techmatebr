"use client";

import { useFavorites } from "@/components/FavoritesProvider";
import { PostCard } from "@/components/PostCard";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { PostSummary } from "@/lib/posts";

interface FavoritesPageClientProps {
  allPosts: PostSummary[];
}

export default function FavoritesPageClient({ allPosts }: FavoritesPageClientProps) {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-white/40 text-sm animate-pulse">Carregando favoritos...</div>
      </div>
    );
  }

  const favPosts = allPosts.filter((p) => favorites.includes(p.slug));

  return (
    <div className="pt-24 sm:pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-amber-300 transition-colors mb-6 sm:mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Voltar ao Blog
      </Link>

      <div className="mb-8 sm:mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-rose-600/10 flex items-center justify-center">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Meus Favoritos
          </h1>
        </div>
        <p className="text-white/45 text-sm">
          {favPosts.length} artigo{favPosts.length !== 1 ? "s" : ""} salvo{favPosts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {favPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {favPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="w-12 h-12 text-white/10 mb-4" />
          <p className="text-white/40 text-lg mb-2">Nenhum favorito ainda</p>
          <p className="text-white/25 text-sm mb-6">Toque no coração em qualquer artigo para salvar</p>
          <Link href="/blog" className="btn-primary">
            Explorar artigos
          </Link>
        </div>
      )}
    </div>
  );
}
