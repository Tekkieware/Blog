
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Car } from "lucide-react"
import { PostCardSkeleton } from "./post-card-skeleton"

export function FeaturedMarqueeSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}

    </div>
  )
}
