import Heading from "@/components/ui/Heading";
import { cn } from "@/lib/utils";
import { BlogPost } from "@/types/blog";
import Button from "../../../../components/ui/Button";
import { BlogCard } from "./BlogCard";

interface BlogRowProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  className?: string;
  blogs: BlogPost[];
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function BlogRow({
  blogs = [],
  title,
  description,
  buttonLabel,
  className,
  children,
  headerAction,
}: BlogRowProps) {
  return (
    <section className={cn("section bg-white dark:bg-[#0a0a1f]", className)}>
      <div className="relative">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#6D28D9]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-[350px] h-[350px] bg-[#ec4899]/12 rounded-full blur-[90px]" />
      </div>
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            {title && (
              <Heading
                level="h2"
                className="mb-4 text-gray-900 dark:text-white text-3xl md:text-5xl font-bold tracking-tight"
              >
                {title}
              </Heading>
            )}

            {description && (
              <p className="text-gray-500 dark:text-slate-400 text-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {headerAction}
            {buttonLabel && (
              <Button
                variant="tag"
                size="sm"
                className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white font-medium border-transparent shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:scale-105 hover:text-white transition-all duration-300 px-6 py-2.5 rounded-full"
              >
                {buttonLabel}
              </Button>
            )}
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} post={blog} />
            ))}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
