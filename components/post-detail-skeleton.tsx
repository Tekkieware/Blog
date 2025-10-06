
import { Skeleton } from "@/components/ui/skeleton";

export default function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8">
          {/* Table of Contents Skeleton */}
          <aside className="hidden lg:block sticky top-30 self-start h-fit">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <article className="min-w-0">
            {/* Post Header Skeleton */}
            <header className="mb-12 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-8 w-3/4" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </header>

            {/* Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <br />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <br />
              <Skeleton className="h-64 w-full" />
              <br />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </article>

          {/* Debug Notes Skeleton */}
          <aside className="hidden lg:block sticky top-20 self-start h-fit">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
