import Link from "next/link";
import { getAllPosts, getFeaturedPosts, getAllCategories } from "@/lib/posts";
import { FeaturedPost } from "@/components/FeaturedPost";
import { PostCard } from "@/components/PostCard";
import { CategoryCard } from "@/components/CategoryCard";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Github,
  Coffee,
  Heart,
  Terminal,
  Code2,
} from "lucide-react";

export default function HomePage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const categories = getAllCategories();
  const recentPosts = allPosts.filter(
    (p) => !featuredPosts.find((f) => f.slug === p.slug)
  );

  const mainFeatured = featuredPosts[0];
  const sideFeatured = featuredPosts.slice(1, 3);

  return (
    <div className="flex flex-col">
      {/* ─────────── Hero ─────────── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32 px-4 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6 sm:mb-8 animate-fade-up delay-0">
            <span className="live-dot" />
            <span className="text-[10px] sm:text-[11px] text-white/70 font-medium tracking-wider uppercase">
              Tech blog · ao vivo
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[10px] sm:text-[11px] text-amber-300/80 font-medium">v2026</span>
          </div>

          {/* Main title */}
          <h1 className="mb-5 sm:mb-7 leading-[0.95] text-balance animate-fade-up delay-1">
            <span className="block text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight">
              <span className="gradient-text-muted">Linux</span>
              <span className="shimmer-text">Zeiro</span>
            </span>
            <span className="block mt-3 sm:mt-5 text-xl sm:text-3xl lg:text-4xl font-semibold text-white/40 tracking-tight px-2">
              Tutoriais, dicas & guias com{" "}
              <span className="relative inline-block">
                <span className="text-white/70">toque de terminal</span>
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed text-pretty animate-fade-up delay-2 px-2">
            Tudo sobre{" "}
            <span className="text-amber-300/80 font-medium">Linux</span>
            {", "}
            <span className="text-sky-300/80 font-medium">Windows</span>
            {", "}
            <span className="text-emerald-300/80 font-medium">desenvolvimento</span>
            {" "}e{" "}
            <span className="text-lime-300/80 font-medium">gaming</span>
            {" — pra quem vive na linha de comando."}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-8 sm:mt-10 animate-fade-up delay-3 px-4 sm:px-0 max-w-sm sm:max-w-none mx-auto">
            <Link href="/blog" className="btn-primary justify-center">
              Explorar artigos
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/#categories" className="btn-secondary justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Ver categorias
            </Link>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 mt-8 sm:mt-10 text-xs sm:text-sm text-white/35 animate-fade-up delay-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />
              <span className="font-mono tabular-nums text-white/60">{allPosts.length}</span>
              <span>artigos</span>
            </div>
            <div className="w-px h-3.5 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="font-mono tabular-nums text-white/60">{categories.length}</span>
              <span>categorias</span>
            </div>
            <div className="w-px h-3.5 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400/60" />
              <span>Semanal</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Featured Bento ─────────── */}
      {mainFeatured && (
        <section className="cv-auto px-4 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow="Em destaque"
              title="Leitura recomendada"
              subtitle="O que está bombando agora"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Main featured (2 cols) */}
              <div className="lg:col-span-2 animate-fade-up delay-1">
                <FeaturedPost post={mainFeatured} variant="hero" />
              </div>

              {/* Side featured stack */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
                {sideFeatured.length > 0 ? (
                  sideFeatured.map((post, i) => (
                    <div key={post.slug} className={`animate-fade-up delay-${i + 2}`}>
                      <FeaturedPost post={post} variant="compact" />
                    </div>
                  ))
                ) : (
                  recentPosts.slice(0, 2).map((post, i) => (
                    <div key={post.slug} className={`animate-fade-up delay-${i + 2}`}>
                      <FeaturedPost post={post} variant="compact" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── Categories ─────────── */}
      {categories.length > 0 && (
        <section className="cv-auto px-4 pb-16 sm:pb-20 lg:pb-24" id="categories">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow="Por tema"
              title="Navegue por categoria"
              subtitle="Escolha seu universo"
            />

            {(() => {
              const [featuredCat, ...restCats] = categories;
              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                  {/* Featured big card (left) */}
                  {featuredCat && (
                    <div className="animate-fade-up delay-0">
                      <CategoryCard
                        name={featuredCat.name}
                        count={featuredCat.count}
                        size="lg"
                        className="h-full"
                      />
                    </div>
                  )}

                  {/* Standard cards (2x2 grid on the right) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {restCats.map((cat, i) => (
                      <div
                        key={cat.name}
                        className={`animate-fade-up delay-${Math.min(i + 1, 6)}`}
                      >
                        <CategoryCard
                          name={cat.name}
                          count={cat.count}
                          size="md"
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ─────────── Recent Posts ─────────── */}
      <section className="cv-auto px-4 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-3 sm:gap-4">
            <SectionHeader
              eyebrow="Mais recentes"
              title="Últimos artigos"
              subtitle="Saindo do forno"
              className="mb-0"
            />
            <Link
              href="/blog"
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors group self-start sm:self-auto"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {recentPosts.map((post, i) => (
              <div
                key={post.slug}
                className={`animate-fade-up delay-${Math.min(i, 6)}`}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Sobre ─────────── */}
      <section className="cv-auto px-4 pb-20 sm:pb-28" id="sobre">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="Quem tá por trás"
            title="Sobre o LinuxZeiro"
            subtitle="Um blog que nasceu do terminal"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
            {/* Card principal — Sobre o autor */}
            <div className="lg:col-span-3 relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] p-6 sm:p-8 lg:p-10
                            bg-gradient-to-br from-amber-500/[0.08] via-white/[0.02] to-transparent">
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 border border-amber-400/30 flex items-center justify-center
                                shadow-[0_8px_24px_-8px_rgba(249,189,24,0.5)]">
                  <Terminal className="w-7 h-7 sm:w-8 sm:h-8 text-amber-200" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-amber-300/80 uppercase tracking-wider mb-1">
                    <span className="text-amber-400">❯</span> whoami
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Oi, eu sou o Micael
                  </h3>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-white/65 leading-relaxed text-pretty">
                <p>
                  Faz um tempo que eu vivo enfiado em terminal, quebrando sistema, reinstalando distro,
                  testando mod, tunando bios. Em algum momento eu pensei: <em className="text-white/85 not-italic">por que não escrever tudo isso?</em>
                </p>
                <p>
                  E foi assim que nasceu o <span className="text-amber-300 font-semibold">LinuxZeiro</span> —
                  um blog sem firula, sem fluff, sem &ldquo;10 maneiras de você ser mais produtivo!&rdquo;.
                  Só tutorial honesto, dica que funciona e uma opinião quando precisa ter.
                </p>
                <p>
                  Aqui você vai encontrar de tudo um pouco: <span className="text-amber-300/80">Linux</span>,
                  {" "}<span className="text-sky-300/80">Windows</span>,
                  {" "}<span className="text-emerald-300/80">dev</span> e
                  {" "}<span className="text-lime-300/80">gaming</span>.
                  Tudo escrito por quem usa de verdade, não por quem leu sobre.
                </p>
              </div>

              <div className="mt-7 sm:mt-8 flex flex-wrap gap-3">
                <a
                  href="https://github.com/MicaelSanPedro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Github className="w-4 h-4" />
                  @MicaelSanPedro
                </a>
                <Link href="/blog" className="btn-primary">
                  Ver os artigos
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Coluna lateral — 3 cards empilhados */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
              {/* Stack do site */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-5 sm:p-6
                              bg-gradient-to-br from-emerald-500/[0.08] via-white/[0.015] to-transparent">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300/80 uppercase tracking-wider">
                    Stack
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
                  Como foi feito
                </h4>
                <p className="text-sm text-white/55 leading-relaxed">
                  Next.js 16, Tailwind v4, TypeScript e markdown puro. Hospedado na Vercel.
                  Tudo open source no GitHub.
                </p>
              </div>

              {/* Contribuir */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-5 sm:p-6
                              bg-gradient-to-br from-sky-500/[0.08] via-white/[0.015] to-transparent">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/25 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-sky-300" />
                  </div>
                  <span className="text-[10px] font-mono text-sky-300/80 uppercase tracking-wider">
                    Contribuir
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
                  Achou um typo?
                </h4>
                <p className="text-sm text-white/55 leading-relaxed">
                  Manda PR no GitHub ou abre uma issue. Quem ajuda entra na próxima patch notes 😄
                </p>
              </div>

              {/* Café */}
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-5 sm:p-6 sm:col-span-2 lg:col-span-1
                              bg-gradient-to-br from-rose-500/[0.08] via-white/[0.015] to-transparent">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-400/25 flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-rose-300" />
                  </div>
                  <span className="text-[10px] font-mono text-rose-300/80 uppercase tracking-wider">
                    Sem ads
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
                  Movido a café
                </h4>
                <p className="text-sm text-white/55 leading-relaxed">
                  Sem trackers invasivos, sem popup de cookie. Só conteúdo. Bem old-school mesmo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className = "",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`mb-8 sm:mb-12 ${className}`}>
      <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
        <span className="w-5 sm:w-6 h-px bg-gradient-to-r from-amber-400 to-transparent" />
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-amber-300/80 font-medium">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-white/40 mt-1.5">{subtitle}</p>
      )}
    </div>
  );
}
