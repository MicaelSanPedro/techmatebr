import { getAllPosts, getAllCategories, getPostsByCategory } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Layers, Tag } from "lucide-react";
import { Suspense } from "react";

function BlogLoading() {
  return (
    <div className="pt-24 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 sm:mb-14 lg:mb-16 max-w-3xl animate-fade-up">
          <div className="h-8 w-48 bg-white/[0.06] rounded-full mb-6 animate-pulse" />
          <div className="h-10 w-96 bg-white/[0.06] rounded-lg mb-4 animate-pulse" />
          <div className="h-5 w-64 bg-white/[0.06] rounded animate-pulse" />
        </div>
        <div className="flex gap-2 mb-10 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white/[0.04] rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-white/[0.04] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogContent({ category }: { category: string }) {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const filteredPosts = category
    ? getPostsByCategory(category)
    : allPosts;

  const activeCategory = category
    ? categories.find(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      )
    : null;

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
            {activeCategory ? (
              <>
                {activeCategory.name}{" "}
                <span className="shimmer-text">artigos</span>
              </>
            ) : (
              <>
                Todos os <span className="shimmer-text">artigos</span>
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/45 text-pretty">
            {activeCategory
              ? `${filteredPosts.length} artigo${filteredPosts.length !== 1 ? "s" : ""} na categoria ${activeCategory.name}.`
              : `Explore os ${allPosts.length} artigos do blog.`}
          </p>
        </div>

        {/* ── Category Filter ── */}
        <Suspense>
          <CategoryFilter categories={categories} totalPosts={allPosts.length} />
        </Suspense>

        {/* ── Posts Grid ── */}
        {filteredPosts.length > 0 ? (
          <div className="cv-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredPosts.map((post, i) => (
              <div
                key={post.slug}
                data-scroll-reveal
                data-scroll-delay={`${Math.min(i, 6) * 80}`}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5">
              <Tag className="w-7 h-7 text-amber-400/60" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white/80 mb-2">
              Nenhum artigo encontrado
            </h2>
            <p className="text-sm text-white/40 max-w-md">
              Nenhum artigo nesta categoria ainda. Explore outras categorias ou
              volte mais tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return <BlogContent category={category || ""} />;
}
