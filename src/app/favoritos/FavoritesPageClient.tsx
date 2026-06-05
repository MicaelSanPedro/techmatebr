"use client";

import { useSession } from "next-auth/react";
import { useFavorites } from "@/components/FavoritesProvider";
import { PostCard } from "@/components/PostCard";
import { Heart, ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { openSignInModal } from "@/components/SignInModal";
import type { PostSummary } from "@/lib/posts";

interface FavoritesPageClientProps {
  allPosts: PostSummary[];
}

export default function FavoritesPageClient({ allPosts }: FavoritesPageClientProps) {
  const { favorites, loading, isLoggedIn } = useFavorites();
  const { data: session } = useSession();

  // Not logged in -- show login prompt
  if (!session?.user) {
    return (
      <div className="pt-24 sm:pt-28 pb-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(249,189,24,0.15)]">
            <LogIn className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Faca login para ver seus favoritos</h1>
          <p className="text-white/45 text-sm mb-8">
            Entre com sua conta Google ou GitHub para salvar artigos e acessar seus favoritos de qualquer dispositivo
          </p>
          <button
            onClick={() => openSignInModal()}
            className="btn-primary"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar
          </button>
        </div>
      </div>
    );
  }

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
          <p className="text-white/25 text-sm mb-6">Toque no coracao em qualquer artigo para salvar</p>
          <Link href="/blog" className="btn-primary">
            Explorar artigos
          </Link>
        </div>
      )}
    </div>
  );
}
