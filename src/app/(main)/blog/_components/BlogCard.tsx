import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function BlogCard({
  post,
  className,
}: {
  post: BlogPost;
  className?: string;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn("block group h-full focus:outline-none", className)}
    >
      <article className="relative h-full flex flex-col overflow-hidden rounded-4xl bg-white dark:bg-[#12122a] border border-gray-100 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-gray-900/60 to-transparent opacity-60 dark:opacity-40 transition-opacity group-hover:opacity-40" />

          {/* Category Badge - Floating */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 border border-white/20 shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col grow p-7">
          {/* Meta Data */}

          {/* Title */}
          <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-slate-300 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Footer - Spacer pushes it to bottom */}
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
            {/* Meta Data */}
            <div className="flex items-center gap-4 text-xs font-semibold tracking-wide text-gray-400 dark:text-slate-400 uppercase">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.publishedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* CTA Arrow */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
