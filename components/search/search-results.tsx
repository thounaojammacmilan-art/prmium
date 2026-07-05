"use client";

import type { Video } from "@/types";
import { VideoCard } from "@/components/video/video-card";
import { VideoGridSkeleton } from "@/components/ui/skeleton";

interface SearchResultsProps {
  videos: Video[];
  loading?: boolean;
  query?: string;
}

export function SearchResults({ videos, loading, query }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 skeleton-pulse rounded-lg bg-muted" />
        <VideoGridSkeleton count={8} />
      </div>
    );
  }

  if (!videos.length && query) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 rounded-2xl bg-muted/30 p-6">
          <div className="text-4xl">🔍</div>
        </div>
        <h3 className="text-lg font-semibold">No results for &ldquo;{query}&rdquo;</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try different keywords or check your spelling
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {videos.length} result{videos.length !== 1 ? "s" : ""}
        {query ? <> for &ldquo;{query}&rdquo;</> : ""}
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}
      </div>
    </div>
  );
}
