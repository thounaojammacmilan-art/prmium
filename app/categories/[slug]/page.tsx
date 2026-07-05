"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { VideoGrid } from "@/components/video/video-grid";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { getVideosByCategory } from "@/lib/youtube";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type { Video } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = VIDEO_CATEGORIES.find((c) => c.id === slug);

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const fetchCategory = useCallback(
    async (page?: string) => {
      return getVideosByCategory(slug, page, 12);
    },
    [slug],
  );

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const result = await fetchCategory();
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
  }, [fetchCategory]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const result = await fetchCategory(pageToken);
      setVideos((prev) => [...prev, ...result.videos]);
      setPageToken(result.nextPageToken);
      setHasMore(!!result.nextPageToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, pageToken, fetchCategory]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Link href="/categories">
          <Button variant="ghost" size="sm" className="mb-3">
            <ArrowLeft className="mr-1 h-4 w-4" />
            All Categories
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {category?.title || "Category"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Videos in this category
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
