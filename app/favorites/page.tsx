"use client";

import { useState, useEffect } from "react";
import { Heart, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { VideoGrid } from "@/components/video/video-grid";
import { getVideoById } from "@/lib/youtube";
import type { Video } from "@/types";

export default function FavoritesPage() {
  const { value: favoriteIds, setValue: setFavoriteIds } = useLocalStorage<
    string[]
  >(STORAGE_KEYS.FAVORITES, []);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      if (favoriteIds.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await Promise.all(
          favoriteIds.map((id) => getVideoById(id)),
        );
        setVideos(results.filter((v): v is Video => v !== null));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, [favoriteIds]);

  const clearAll = () => {
    setFavoriteIds([]);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Favorites</h1>
            <p className="text-sm text-muted-foreground">
              {favoriteIds.length} favorite{favoriteIds.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {favoriteIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAll}
            className="rounded-xl"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {favoriteIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-2xl bg-muted/30 p-6">
            <div className="text-4xl">❤️</div>
          </div>
          <h3 className="text-lg font-semibold">No favorites yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Click the heart icon on any video to add it to your favorites
          </p>
        </div>
      ) : (
        <VideoGrid videos={videos} loading={loading} />
      )}
    </div>
  );
}
