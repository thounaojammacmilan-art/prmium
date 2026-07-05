import { VideoGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="mb-2 h-8 w-64 animate-pulse rounded-lg bg-muted/60" />
        <div className="h-4 w-48 animate-pulse rounded-lg bg-muted/40" />
      </div>
      <VideoGridSkeleton count={8} />
    </div>
  );
}
