export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    default: string;
    medium: string;
    high: string;
    maxres?: string;
  };
  channelTitle: string;
  channelId: string;
  channelAvatar?: string;
  publishedAt: string;
  duration: string;
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  tags?: string[];
  categoryId?: string;
}

export interface SearchResult {
  videos: Video[];
  nextPageToken?: string;
  totalResults: number;
}

export interface VideoCategory {
  id: string;
  title: string;
}

export interface LocalVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
  addedAt: number;
  watchedAt?: number;
  progress?: number;
}

export type SortOption = "relevance" | "date" | "views" | "rating";

export type VideoQuality = "auto" | "hd1080" | "hd720" | "large" | "medium" | "small";

export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackSpeed: number;
  quality: VideoQuality;
  currentTime: number;
  duration: number;
  isTheaterMode: boolean;
}

export interface AppSettings {
  theme: "dark" | "light" | "system";
  autoplay: boolean;
  defaultQuality: VideoQuality;
  playbackSpeed: number;
  showCaptions: boolean;
  volume: number;
}

export interface HistoryEntry {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
  watchedAt: number;
  progress: number;
}

export interface SearchHistoryEntry {
  query: string;
  timestamp: number;
}
