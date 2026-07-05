"use client";

import type { Video } from "@/types";
import { RelatedVideoCard } from "./related-video-card";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedVideosProps {
  videos: Video[];
  loading?: boolean;
}

export function RelatedVideos({ videos, loading }: RelatedVideosProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="aspect-video w-40 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No related videos found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Related Videos</h3>
      <div className="space-y-3">
        {videos.map((video) => (
          <RelatedVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
