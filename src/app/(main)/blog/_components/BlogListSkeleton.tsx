import { Skeleton } from "@/components/ui/Skeleton";

export default function BlogListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="section bg-white dark:bg-[#0a0a1f]">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl space-y-4">
            <Skeleton className="h-10 w-64 md:w-96" />
            <Skeleton className="h-6 w-full max-w-md" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
