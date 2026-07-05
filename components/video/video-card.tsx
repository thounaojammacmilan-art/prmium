"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Video } from "@/types";
import { formatViewCount, formatDate } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";

interface VideoCardProps {
  video: Video;
  index?: number;
}

export function VideoCard({ video, index = 0 }: VideoCardProps) {
  const { value: favorites } = useLocalStorage<string[]>(STORAGE_KEYS.FAVORITES, []);
  const isFavorite = favorites.includes(video.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/watch/${video.id}`} className="group block">
        <div className="relative mb-3 overflow-hidden rounded-2xl">
          <div className="aspect-video w-full bg-muted">
            {video.thumbnail.high && (
              <Image
                src={video.thumbnail.high || video.thumbnail.medium}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />
            )}
          </div>
          <div className="absolute bottom-2 right-2 rounded-lg bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {video.duration}
          </div>
          {isFavorite && (
            <div className="absolute left-2 top-2 rounded-lg bg-red-500/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              <Heart className="inline h-3 w-3 fill-current" />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
            {video.channelTitle && (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-xs font-bold text-primary">
                {video.channelTitle.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {video.channelTitle}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>{formatViewCount(video.viewCount)} views</span>
              <span>·</span>
              <Clock className="h-3 w-3" />
              <span>{formatDate(video.publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
