import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { PostSummary } from "@/lib/posts";

interface PostCardProps {
  post: PostSummary;
}

export function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;
  const hasImage = frontmatter.coverImage?.startsWith("http");

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-amber-500/20 hover:shadow-[0_0_20px_rgba(249,189,24,0.08)] h-full flex flex-col">
        {/* Cover image */}
        <div className="relative h-48 overflow-hidden">
          {hasImage ? (
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-900/40 via-amber-800/20 to-transparent flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

          {/* Category badge overlaid */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={frontmatter.category} />
          </div>

          {/* Arrow icon on hover */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Title */}
          <h3 className="text-base font-semibold text-white leading-snug group-hover:text-amber-100 transition-colors duration-200 line-clamp-2">
            {frontmatter.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-white/50 leading-relaxed line-clamp-2 flex-1">
            {frontmatter.excerpt}
          </p>

          {/* Date and read time */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Clock className="w-3.5 h-3.5" />
              <span>{frontmatter.readTime}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
