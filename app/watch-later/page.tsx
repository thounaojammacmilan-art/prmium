"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Trash2, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { getVideoById } from "@/lib/youtube";
import type { Video } from "@/types";
import { formatViewCount, formatDate } from "@/lib/utils";

export default function WatchLaterPage() {
  const { value: watchLaterIds, setValue: setWatchLaterIds } = useLocalStorage<
    string[]
  >(STORAGE_KEYS.WATCH_LATER, []);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      if (watchLaterIds.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await Promise.all(
          watchLaterIds.map((id) => getVideoById(id)),
        );
        setVideos(results.filter((v): v is Video => v !== null));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [watchLaterIds]);

  const removeFromWatchLater = (id: string) => {
    setWatchLaterIds((prev) => prev.filter((vid) => vid !== id));
  };

  const clearAll = () => {
    setWatchLaterIds([]);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-muted/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (watchLaterIds.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Watch Later</h1>
            <p className="text-sm text-muted-foreground">0 videos saved</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-2xl bg-muted/30 p-6">
            <div className="text-4xl">⏰</div>
          </div>
          <h3 className="text-lg font-semibold">Your watch later list is empty</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Save videos to watch later by clicking the clock icon
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Watch Later</h1>
            <p className="text-sm text-muted-foreground">
              {watchLaterIds.length} video{watchLaterIds.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={clearAll}
          className="rounded-xl"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card/30 p-3 transition-all hover:bg-card/60 hover:shadow-sm"
            >
              <Link
                href={`/watch/${video.id}`}
                className="flex flex-1 items-center gap-4"
              >
                <div className="relative w-36 shrink-0 overflow-hidden rounded-xl">
                  <div className="aspect-video w-full bg-muted">
                    {video.thumbnail.medium && (
                      <Image
                        src={video.thumbnail.medium}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="144px"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-8 w-8 fill-white text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold">
                    {video.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {video.channelTitle}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {formatViewCount(video.viewCount)} views
                    </span>
                    <span>·</span>
                    <span>{formatDate(video.publishedAt)}</span>
                    <span>·</span>
                    <span>{video.duration}</span>
                  </div>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromWatchLater(video.id)}
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
