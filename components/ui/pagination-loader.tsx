import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginationLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number;
}

export function PaginationLoader({
  className,
  items = 3,
  ...props
}: PaginationLoaderProps) {
  return (
    <div className={cn("mx-auto flex w-full justify-center items-center gap-2", className)} {...props}>
      <Skeleton className="h-8 w-20" />
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-8" />
      ))}
      <Skeleton className="h-8 w-20" />
    </div>
  );
}
