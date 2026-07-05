"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Clapperboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar } from "./sidebar";
import { SITE_NAME } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { SearchHistoryEntry } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

export function Navbar() {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { value: searchHistory, setValue: setSearchHistory } = useLocalStorage<
    SearchHistoryEntry[]
  >(STORAGE_KEYS.SEARCH_HISTORY, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const entry: SearchHistoryEntry = {
      query: query.trim(),
      timestamp: Date.now(),
    };
    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.query.toLowerCase() !== entry.query.toLowerCase(),
      );
      return [entry, ...filtered].slice(0, 10);
    });

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500">
                <Clapperboard className="h-5 w-5 text-white" />
              </div>
              <span className="hidden text-lg font-bold tracking-tight sm:inline-block">
                <span className="gradient-text">{SITE_NAME}</span>
              </span>
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search videos..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowSuggestions(query.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="h-11 w-full rounded-2xl border-border/50 bg-muted/30 pl-12 pr-4 text-sm backdrop-blur-sm placeholder:text-muted-foreground/60"
                />
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <AnimatePresence>
                {showSuggestions && searchHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 w-full rounded-2xl border bg-background/80 backdrop-blur-xl p-2 shadow-xl"
                  >
                    <div className="mb-1 flex items-center justify-between px-3 py-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Recent searches
                      </span>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </button>
                    </div>
                    {searchHistory.map((entry) => (
                      <button
                        key={entry.timestamp}
                        onClick={() => {
                          setQuery(entry.query);
                          router.push(`/search?q=${encodeURIComponent(entry.query)}`);
                          setShowSuggestions(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground" />
                        {entry.query}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowSearch(!showSearch)}
            >
              {showSearch ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
            <ThemeToggle />
          </div>
        </div>
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border/40 px-4 pb-3 pt-2 md:hidden"
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-11 w-full rounded-2xl border-border/50 bg-muted/30 pl-12 pr-4"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
