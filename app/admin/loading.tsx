import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-6 w-24 mr-6" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col space-y-6">
          {/* Actions Row Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Skeleton className="h-10 w-full sm:max-w-xs" />
            <Skeleton className="h-10 w-28" />
          </div>

          {/* Posts Table Skeleton */}
          <div className="border rounded-md p-4">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border py-3 px-2 sm:px-4"
                >
                  {/* Left side: title + excerpt */}
                  <div className="space-y-2 w-full max-w-xs sm:max-w-md">
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>

                  {/* Right side: action buttons */}
                  <div className="flex gap-2 shrink-0">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-md p-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}