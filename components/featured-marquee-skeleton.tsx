
import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedMarqueeSkeleton() {
  return (
    <div className="w-full space-y-16">
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0">
              <Skeleton className="w-[320px] h-[200px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
