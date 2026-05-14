import Link from "next/link";
import { getAllPosts, getFeaturedPosts, getAllCategories } from "@/lib/posts";
import { FeaturedPost } from "@/components/FeaturedPost";
import { PostCard } from "@/components/PostCard";
import {
  ArrowRight,
  Terminal,
  Cpu,
  Shield,
  Monitor,
  Lightbulb,
  Code,
  Gamepad2,
  Sparkles,
  Zap,
  Flame,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  Linux: <Terminal className="w-5 h-5" />,
  Windows: <Monitor className="w-5 h-5" />,
  Desenvolvimento: <Code className="w-5 h-5" />,
  "Segurança": <Shield className="w-5 h-5" />,
  Hardware: <Cpu className="w-5 h-5" />,
  Dicas: <Lightbulb className="w-5 h-5" />,
  Jogos: <Gamepad2 className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  Linux: "from-amber-500/10 to-amber-500/5 border-amber-500/10",
  Windows: "from-blue-500/10 to-blue-500/5 border-blue-500/10",
  Desenvolvimento: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/10",
  "Segurança": "from-red-500/10 to-red-500/5 border-red-500/10",
  Hardware: "from-purple-500/10 to-purple-500/5 border-purple-500/10",
  Dicas: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/10",
  Jogos: "from-green-500/10 to-green-500/5 border-green-500/10",
};

export default function HomePage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const categories = getAllCategories();
  const recentPosts = allPosts.filter(
    (p) => !featuredPosts.find((f) => f.slug === p.slug)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-36 pb-24 sm:pt-44 sm:pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
              Tech Blog
            </span>
          </div>

          {/* Main title */}
          <h1 className="mb-8 leading-[1.1]">
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
              Linux<span className="shimmer-text">Zeiro</span>
            </span>
            <span className="block mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white/60 via-white/40 to-white/20 bg-clip-text text-transparent">
              Tutoriais, dicas e guias
            </span>
          </h1>

          {/* Subtitle with colored keywords */}
          <p className="text-base sm:text-lg text-white/30 max-w-xl mx-auto leading-relaxed">
            Tudo sobre{" "}
            <span className="text-amber-400/50 hover:text-amber-400 transition-colors cursor-default">Linux</span>
            {", "}
            <span className="text-blue-400/50 hover:text-blue-400 transition-colors cursor-default">Windows</span>
            {", "}
            <span className="text-emerald-400/50 hover:text-emerald-400 transition-colors cursor-default">desenvolvimento</span>
            {" "}
            e{" "}
            <span className="text-green-400/50 hover:text-green-400 transition-colors cursor-default">gaming</span>
            {" — com aquele toque de terminal."}
          </p>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-white/20">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400/40" />
              <span>{allPosts.length} artigos</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span>{categories.length} categorias</span>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400/40" />
              <span>Atualizado semanalmente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 rounded-full bg-amber-500" />
              <h2 className="text-xl font-bold text-white">Destaques</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="px-4 pb-16" id="categories">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 rounded-full bg-amber-500" />
              <h2 className="text-xl font-bold text-white">Categorias</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/blog?category=${encodeURIComponent(cat.name)}`}
                  className={`group flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-b border transition-all hover:scale-[1.02] ${
                    categoryColors[cat.name] || "from-white/5 to-white/[0.02] border-white/[0.06]"
                  }`}
                >
                  <div className="text-amber-400">
                    {categoryIcons[cat.name] || <Terminal className="w-5 h-5" />}
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-white/80 block">
                      {cat.name}
                    </span>
                    <span className="text-xs text-white/25">
                      {cat.count} {cat.count === 1 ? "artigo" : "artigos"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-amber-500" />
              <h2 className="text-xl font-bold text-white">Últimos Artigos</h2>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
