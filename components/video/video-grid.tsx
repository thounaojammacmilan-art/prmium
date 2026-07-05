"use client";

import type { Video } from "@/types";
import { VideoCard } from "./video-card";
import { VideoGridSkeleton } from "@/components/ui/skeleton";

interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
}

export function VideoGrid({ videos, loading }: VideoGridProps) {
  if (loading) {
    return <VideoGridSkeleton />;
  }

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-2xl bg-muted/30 p-6 mb-4">
          <div className="text-4xl">🎬</div>
        </div>
        <h3 className="text-lg font-semibold">No videos found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search or category
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video, i) => (
        <VideoCard key={video.id} video={video} index={i} />
      ))}
    </div>
  );
}
