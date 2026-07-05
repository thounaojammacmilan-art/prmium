"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type { HistoryEntry } from "@/types";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const { value: history, setValue: setHistory } = useLocalStorage<HistoryEntry[]>(
    STORAGE_KEYS.HISTORY,
    [],
  );
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");

  const filteredHistory = history.filter((entry) => {
    const daysAgo =
      (Date.now() - entry.watchedAt) / (1000 * 60 * 60 * 24);
    if (filter === "today") return daysAgo < 1;
    if (filter === "week") return daysAgo < 7;
    if (filter === "month") return daysAgo < 30;
    return true;
  });

  const clearHistory = () => {
    setHistory([]);
  };

  const removeEntry = (videoId: string) => {
    setHistory((prev) => prev.filter((e) => e.videoId !== videoId));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <History className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-sm text-muted-foreground">
              {history.length} video{history.length !== 1 ? "s" : ""} watched
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={clearHistory}
            className="rounded-xl"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {history.length > 0 && (
        <div className="mb-6 flex gap-2">
          {(["all", "today", "week", "month"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className="rounded-xl capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-2xl bg-muted/30 p-6">
            <div className="text-4xl">📺</div>
          </div>
          <h3 className="text-lg font-semibold">
            {history.length === 0 ? "No watch history" : "No matches"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {history.length === 0
              ? "Videos you watch will appear here"
              : "Try a different filter"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredHistory.map((entry) => (
              <motion.div
                key={entry.videoId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card/30 p-3 transition-all hover:bg-card/60 hover:shadow-sm"
              >
                <Link
                  href={`/watch/${entry.videoId}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="relative w-36 shrink-0 overflow-hidden rounded-xl">
                    <div className="aspect-video w-full bg-muted">
                      {entry.thumbnail && (
                        <Image
                          src={entry.thumbnail}
                          alt={entry.title}
                          fill
                          className="object-cover"
                          sizes="144px"
                          loading="lazy"
                        />
                      )}
                    </div>
                    {entry.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${entry.progress * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold">
                      {entry.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {entry.channelTitle}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(new Date(entry.watchedAt).toISOString())}</span>
                      <span>·</span>
                      <span>{entry.duration}</span>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEntry(entry.videoId)}
                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
