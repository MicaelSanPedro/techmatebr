import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { Layers } from "lucide-react";

export default async function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <div className="pt-24 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-10 sm:mb-14 lg:mb-16 max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 sm:mb-5">
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-white/70 font-medium">
              Biblioteca
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-5 tracking-tight leading-[1.05] text-balance">
            Todos os <span className="shimmer-text">artigos</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/45 text-pretty">
            Explore os {allPosts.length} artigos do blog.
          </p>
        </div>

        {/* ── Posts Grid ── */}
        <div className="cv-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {allPosts.map((post, i) => (
            <div
              key={post.slug}
              data-scroll-reveal
              data-scroll-delay={`${Math.min(i, 6) * 80}`}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}