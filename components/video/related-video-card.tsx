"use client";

import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/types";
import { formatViewCount, formatDate } from "@/lib/utils";

interface RelatedVideoCardProps {
  video: Video;
}

export function RelatedVideoCard({ video }: RelatedVideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`} className="group flex gap-3">
      <div className="relative w-40 shrink-0 overflow-hidden rounded-xl">
        <div className="aspect-video w-full bg-muted">
          {video.thumbnail.medium && (
            <Image
              src={video.thumbnail.medium}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="160px"
              loading="lazy"
            />
          )}
        </div>
        <div className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {video.duration}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {video.channelTitle}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatViewCount(video.viewCount)} views ·{" "}
          {formatDate(video.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
