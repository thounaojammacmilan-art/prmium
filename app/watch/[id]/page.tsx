"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video/video-player";
import { VideoInfo } from "@/components/video/video-info";
import { RelatedVideos } from "@/components/video/related-videos";
import { getVideoById, getRelatedVideos } from "@/lib/youtube";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import type { Video, HistoryEntry } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id as string;
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setValue: setHistory } = useLocalStorage<HistoryEntry[]>(
    STORAGE_KEYS.HISTORY,
    [],
  );
  const { setValue: setContinueWatching } = useLocalStorage<HistoryEntry[]>(
    STORAGE_KEYS.CONTINUE_WATCHING,
    [],
  );

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const videoData = await getVideoById(videoId);
        if (cancelled) return;

        if (!videoData) {
          setError("Video not found");
          return;
        }

        setVideo(videoData);

        setHistory((prev) => {
          const filtered = prev.filter((e) => e.videoId !== videoId);
          return [
            {
              videoId,
              title: videoData.title,
              thumbnail: videoData.thumbnail.high,
              channelTitle: videoData.channelTitle,
              duration: videoData.duration,
              watchedAt: Date.now(),
              progress: 0,
            },
            ...filtered,
          ].slice(0, 100);
        });
      } catch (err) {
        if (!cancelled) setError("Failed to load video");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function fetchRelated() {
      try {
        setRelatedLoading(true);
        const related = await getRelatedVideos(videoId, 12);
        if (!cancelled) setRelatedVideos(related);
      } catch {
        // non-critical
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    }

    fetchData();
    fetchRelated();
    return () => {
      cancelled = true;
    };
  }, [videoId, setHistory]);

  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      if (!video) return;
      setContinueWatching((prev) => {
        const filtered = prev.filter((e) => e.videoId !== videoId);
        return [
          {
            videoId,
            title: video.title,
            thumbnail: video.thumbnail.high,
            channelTitle: video.channelTitle,
            duration: video.duration,
            watchedAt: Date.now(),
            progress: duration > 0 ? currentTime / duration : 0,
          },
          ...filtered,
        ].slice(0, 20);
      });

      setHistory((prev) =>
        prev.map((entry) =>
          entry.videoId === videoId
            ? { ...entry, progress: duration > 0 ? currentTime / duration : 0 }
            : entry,
        ),
      );
    },
    [video, videoId, setContinueWatching, setHistory],
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="mb-4 rounded-2xl bg-destructive/10 p-6">
          <div className="text-4xl">😕</div>
        </div>
        <h3 className="text-lg font-semibold">Video not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="aspect-video w-full max-w-5xl rounded-2xl" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <VideoPlayer
            videoId={videoId}
            autoplay
            onTimeUpdate={handleTimeUpdate}
          />
          <div className="mt-4">
            <VideoInfo video={video} />
          </div>
        </div>
        <div className="w-full shrink-0 lg:w-96">
          <RelatedVideos videos={relatedVideos} loading={relatedLoading} />
        </div>
      </div>
    </div>
  );
}
