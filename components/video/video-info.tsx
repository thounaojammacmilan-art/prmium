"use client";

import { useState } from "react";
import {
  Heart,
  ThumbsUp,
  Clock,
  Share2,
  Download,
  Copy,
  QrCode,
} from "lucide-react";
import type { Video } from "@/types";
import { formatViewCount, formatDate } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShareDialog } from "@/components/share-dialog";
import { QRCodeDialog } from "@/components/qrcode-dialog";

interface VideoInfoProps {
  video: Video;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [liked, setLiked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { value: favorites, setValue: setFavorites } = useLocalStorage<string[]>(
    STORAGE_KEYS.FAVORITES,
    [],
  );
  const { value: watchLater, setValue: setWatchLater } = useLocalStorage<string[]>(
    STORAGE_KEYS.WATCH_LATER,
    [],
  );

  const isFavorite = favorites.includes(video.id);
  const isWatchLater = watchLater.includes(video.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(video.id)
        ? prev.filter((id) => id !== video.id)
        : [...prev, video.id],
    );
  };

  const toggleWatchLater = () => {
    setWatchLater((prev) =>
      prev.includes(video.id)
        ? prev.filter((id) => id !== video.id)
        : [...prev, video.id],
    );
  };

  const handleDownloadThumbnail = () => {
    const link = document.createElement("a");
    link.href = video.thumbnail.maxres || video.thumbnail.high;
    link.download = `${video.id}-thumbnail.jpg`;
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/watch/${video.id}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold leading-tight md:text-2xl">
        {video.title}
      </h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            {video.channelTitle && (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-primary">
                {video.channelTitle.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold">{video.channelTitle}</p>
            <p className="text-sm text-muted-foreground">
              {formatViewCount(video.viewCount)} views ·{" "}
              {formatDate(video.publishedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={liked ? "default" : "glass"}
            size="sm"
            onClick={() => setLiked(!liked)}
            className="rounded-xl"
          >
            <ThumbsUp
              className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
            />
            <span className="hidden sm:inline">
              {liked ? "Liked" : "Like"}
            </span>
            {video.likeCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {formatViewCount(video.likeCount)}
              </span>
            )}
          </Button>

          <Button
            variant={isFavorite ? "default" : "glass"}
            size="sm"
            onClick={toggleFavorite}
            className="rounded-xl"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            <span className="hidden sm:inline">
              {isFavorite ? "Favorited" : "Favorite"}
            </span>
          </Button>

          <Button
            variant={isWatchLater ? "default" : "glass"}
            size="sm"
            onClick={toggleWatchLater}
            className="rounded-xl"
          >
            <Clock className={`h-4 w-4 ${isWatchLater ? "" : "opacity-70"}`} />
            <span className="hidden sm:inline">
              {isWatchLater ? "Saved" : "Watch Later"}
            </span>
          </Button>

          <Button
            variant="glass"
            size="sm"
            onClick={() => setShowShareDialog(true)}
            className="rounded-xl"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button
            variant="glass"
            size="icon"
            onClick={() => setShowQRDialog(true)}
            className="rounded-xl"
          >
            <QrCode className="h-4 w-4" />
          </Button>

          <Button
            variant="glass"
            size="icon"
            onClick={handleCopyLink}
            className="rounded-xl"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="glass"
            size="icon"
            onClick={handleDownloadThumbnail}
            className="rounded-xl"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div
        className="cursor-pointer rounded-2xl bg-muted/30 p-4 transition-colors hover:bg-muted/50"
        onClick={() => setShowFullDescription(!showFullDescription)}
      >
        <p
          className={`text-sm leading-relaxed text-muted-foreground ${
            showFullDescription ? "" : "line-clamp-3"
          }`}
        >
          {video.description || "No description available."}
        </p>
        {video.description && video.description.length > 150 && (
          <button className="mt-1 text-xs font-medium text-primary">
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {video.tags.slice(0, 10).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
            >
              #{tag.replace(/[^a-zA-Z0-9]/g, "")}
            </span>
          ))}
        </div>
      )}

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        videoId={video.id}
        videoTitle={video.title}
      />
      <QRCodeDialog
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
        videoId={video.id}
        videoTitle={video.title}
      />
    </div>
  );
}
