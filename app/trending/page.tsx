"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp } from "lucide-react";
import { VideoGrid } from "@/components/video/video-grid";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { getTrendingVideos } from "@/lib/youtube";
import type { Video } from "@/types";

export default function TrendingPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchTrending = useCallback(async (page?: string) => {
    return getTrendingVideos(page, 12);
  }, []);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const result = await fetchTrending();
        setVideos(result.videos);
        setPageToken(result.nextPageToken);
        setHasMore(!!result.nextPageToken);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [fetchTrending]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchTrending(pageToken);
      setVideos((prev) => [...prev, ...result.videos]);
      setPageToken(result.nextPageToken);
      setHasMore(!!result.nextPageToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, pageToken, fetchTrending]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Trending</h1>
          <p className="text-sm text-muted-foreground">
            Most popular videos right now
          </p>
        </div>
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
