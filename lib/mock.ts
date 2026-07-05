import type { Video, SearchResult } from "@/types";
import { MOCK_VIDEOS } from "./constants";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const MOCK_THUMBNAILS = [
  { default: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg", medium: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg", high: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" },
  { default: "https://i.ytimg.com/vi/jNQXAC9IVRw/default.jpg", medium: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg", high: "https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg" },
  { default: "https://i.ytimg.com/vi/9bZkp7q19f0/default.jpg", medium: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg", high: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg" },
  { default: "https://i.ytimg.com/vi/kJQP7kiw5Fk/default.jpg", medium: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg", high: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg" },
  { default: "https://i.ytimg.com/vi/JGwWNGJdvx8/default.jpg", medium: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg", high: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg" },
  { default: "https://i.ytimg.com/vi/RgKAFK5djSk/default.jpg", medium: "https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg", high: "https://i.ytimg.com/vi/RgKAFK5djSk/hqdefault.jpg" },
  { default: "https://i.ytimg.com/vi/OPf0YbXqDm0/default.jpg", medium: "https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg", high: "https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg" },
  { default: "https://i.ytimg.com/vi/HP-MbfHFUqs/default.jpg", medium: "https://i.ytimg.com/vi/HP-MbfHFUqs/mqdefault.jpg", high: "https://i.ytimg.com/vi/HP-MbfHFUqs/hqdefault.jpg" },
];

function attachThumbnails(video: Video, index: number): Video {
  const thumbs = MOCK_THUMBNAILS[index % MOCK_THUMBNAILS.length];
  return { ...video, thumbnail: { ...video.thumbnail, ...thumbs } };
}

export function getMockSearchResults(
  query: string,
  _pageToken?: string,
  maxResults = 12,
): SearchResult {
  const filtered = MOCK_VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.channelTitle.toLowerCase().includes(query.toLowerCase()),
  );

  const videos = filtered.slice(0, maxResults).map((v, i) => attachThumbnails({ ...v }, i));

  return {
    videos,
    nextPageToken: undefined,
    totalResults: videos.length,
  };
}

export function getMockVideoById(videoId: string): Video | null {
  const video = MOCK_VIDEOS.find((v) => v.id === videoId);
  if (!video) return null;
  const idx = MOCK_VIDEOS.indexOf(video);
  return attachThumbnails({ ...video }, idx);
}

export function getMockTrendingVideos(
  _pageToken?: string,
  maxResults = 12,
): SearchResult {
  const sorted = [...MOCK_VIDEOS].sort((a, b) => b.viewCount - a.viewCount);
  const videos = sorted.slice(0, maxResults).map((v, i) => attachThumbnails({ ...v }, i));

  return {
    videos,
    nextPageToken: undefined,
    totalResults: videos.length,
  };
}

export function getMockRelatedVideos(
  _videoId: string,
  maxResults = 12,
): Video[] {
  const shuffled = shuffleArray(MOCK_VIDEOS);
  return shuffled.slice(0, maxResults).map((v, i) => attachThumbnails({ ...v }, i));
}

export function getMockVideosByCategory(
  _categoryId: string,
  _pageToken?: string,
  maxResults = 12,
): SearchResult {
  const videos = shuffleArray(MOCK_VIDEOS)
    .slice(0, maxResults)
    .map((v, i) => attachThumbnails({ ...v }, i));

  return {
    videos,
    nextPageToken: undefined,
    totalResults: videos.length,
  };
}
