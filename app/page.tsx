"use client";

import { useState, useEffect, useCallback } from "react";
import { VideoGrid } from "@/components/video/video-grid";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { searchVideos } from "@/lib/youtube";
import type { Video } from "@/types";
import { SITE_NAME } from "@/lib/constants";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async (page?: string) => {
    try {
      const result = await searchVideos("trending", page, 12);
      return result;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const result = await fetchVideos();
        setVideos(result.videos);
        setPageToken(result.nextPageToken);
        setHasMore(!!result.nextPageToken);
      } catch (err) {
        setError("Failed to load videos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [fetchVideos]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const result = await fetchVideos(pageToken);
      setVideos((prev) => [...prev, ...result.videos]);
      setPageToken(result.nextPageToken);
      setHasMore(!!result.nextPageToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, pageToken, fetchVideos]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="mb-4 rounded-2xl bg-destructive/10 p-6">
          <div className="text-4xl">⚠️</div>
        </div>
        <h3 className="text-lg font-semibold">Something went wrong</h3>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome to <span className="gradient-text">{SITE_NAME}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover trending videos and explore content
        </p>
      </div>
      <VideoGrid videos={videos} loading={loading} />
      <InfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={loadingMore}
      />
    </div>
  );
}
