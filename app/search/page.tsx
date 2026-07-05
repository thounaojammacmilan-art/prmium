"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchResults } from "@/components/search/search-results";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { searchVideos } from "@/lib/youtube";
import type { Video } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const doSearch = useCallback(async (q: string, page?: string) => {
    if (!q.trim()) return { videos: [], nextPageToken: undefined };
    return searchVideos(q, page, 12);
  }, []);

  useEffect(() => {
    if (!query) {
      setVideos([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function fetchResults() {
      setLoading(true);
      try {
        const result = await doSearch(query);
        if (!cancelled) {
          setVideos(result.videos);
          setPageToken(result.nextPageToken);
          setHasMore(!!result.nextPageToken);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [query, doSearch]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !query) return;
    setLoadingMore(true);
    try {
      const result = await doSearch(query, pageToken);
      setVideos((prev) => [...prev, ...result.videos]);
      setPageToken(result.nextPageToken);
      setHasMore(!!result.nextPageToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, query, pageToken, doSearch]);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="mb-4 rounded-2xl bg-muted/30 p-6">
          <div className="text-4xl">🔍</div>
        </div>
        <h3 className="text-lg font-semibold">Search videos</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Type in the search bar to find videos
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <SearchResults videos={videos} loading={loading} query={query} />
      <InfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={loadingMore}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
