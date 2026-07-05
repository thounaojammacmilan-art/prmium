import { YOUTUBE_API_KEY, API_BASE_URL, USE_MOCK_DATA } from "./constants";
import type { Video, SearchResult } from "@/types";

interface YouTubeSearchItem {
  id: { videoId?: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
      maxres?: { url: string };
    };
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    tags?: string[];
    categoryId?: string;
  };
}

interface YouTubeVideoItem {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
      maxres?: { url: string };
    };
    channelTitle: string;
    channelId: string;
    publishedAt: string;
    tags?: string[];
    categoryId?: string;
  };
  contentDetails?: {
    duration: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

function parseDuration(duration: string): { duration: string; durationSeconds: number } {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match?.[1]?.replace("H", "") || "0");
  const minutes = parseInt(match?.[2]?.replace("M", "") || "0");
  const seconds = parseInt(match?.[3]?.replace("S", "") || "0");
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  if (hours > 0) {
    return {
      duration: `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      durationSeconds: totalSeconds,
    };
  }
  return {
    duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    durationSeconds: totalSeconds,
  };
}

type VideoItemInput = (YouTubeSearchItem & { contentDetails?: YouTubeVideoItem["contentDetails"]; statistics?: YouTubeVideoItem["statistics"] }) | YouTubeVideoItem;

function getVideoItemId(item: VideoItemInput): string {
  if (typeof item.id === "object" && item.id !== null && "videoId" in item.id) {
    return (item.id as { videoId?: string }).videoId || "";
  }
  return typeof item.id === "string" ? item.id : "";
}

function mapVideoItem(item: VideoItemInput): Video {
  const parsed = parseDuration(item.contentDetails?.duration || "PT0S");
  return {
    id: getVideoItemId(item),
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: {
      default: item.snippet.thumbnails.default?.url || "",
      medium: item.snippet.thumbnails.medium?.url || "",
      high: item.snippet.thumbnails.high?.url || "",
      maxres: item.snippet.thumbnails.maxres?.url,
    },
    channelTitle: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    publishedAt: item.snippet.publishedAt,
    duration: parsed.duration,
    durationSeconds: parsed.durationSeconds,
    viewCount: parseInt(item.statistics?.viewCount || "0"),
    likeCount: parseInt(item.statistics?.likeCount || "0"),
    tags: item.snippet.tags,
    categoryId: item.snippet.categoryId,
  };
}

export async function searchVideos(
  query: string,
  pageToken?: string,
  maxResults = 12,
): Promise<SearchResult> {
  if (USE_MOCK_DATA || !YOUTUBE_API_KEY) {
    const { getMockSearchResults } = await import("./mock");
    return getMockSearchResults(query, pageToken, maxResults);
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
    ...(pageToken && { pageToken }),
  });

  const res = await fetch(`${API_BASE_URL}/search?${params}`);
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  const videoIds = (data.items as YouTubeSearchItem[]).map((item) => item.id.videoId).join(",");
  const detailsParams = new URLSearchParams({
    part: "contentDetails,statistics",
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  const detailsRes = await fetch(`${API_BASE_URL}/videos?${detailsParams}`);
  const detailsData = await detailsRes.json();

  const detailsMap = new Map(
    (detailsData.items as YouTubeVideoItem[]).map((item) => [item.id, item]),
  );

  const videos = (data.items as YouTubeSearchItem[] || []).map((item) => {
    const details = item.id.videoId ? detailsMap.get(item.id.videoId) : undefined;
    return mapVideoItem({
      ...item,
      contentDetails: details?.contentDetails,
      statistics: details?.statistics,
    });
  });

  return {
    videos,
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo?.totalResults || 0,
  };
}

export async function getVideoById(videoId: string): Promise<Video | null> {
  if (USE_MOCK_DATA || !YOUTUBE_API_KEY) {
    const { getMockVideoById } = await import("./mock");
    return getMockVideoById(videoId);
  }

  const params = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    id: videoId,
    key: YOUTUBE_API_KEY,
  });

  const res = await fetch(`${API_BASE_URL}/videos?${params}`);
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);
  if (!data.items?.length) return null;

  return mapVideoItem(data.items[0]);
}

export async function getTrendingVideos(
  pageToken?: string,
  maxResults = 12,
): Promise<SearchResult> {
  if (USE_MOCK_DATA || !YOUTUBE_API_KEY) {
    const { getMockTrendingVideos } = await import("./mock");
    return getMockTrendingVideos(pageToken, maxResults);
  }

  const params = new URLSearchParams({
    part: "snippet,contentDetails,statistics",
    chart: "mostPopular",
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
    ...(pageToken && { pageToken }),
  });

  const res = await fetch(`${API_BASE_URL}/videos?${params}`);
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  return {
    videos: (data.items || []).map(mapVideoItem),
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo?.totalResults || 0,
  };
}

export async function getRelatedVideos(
  videoId: string,
  maxResults = 12,
): Promise<Video[]> {
  if (USE_MOCK_DATA || !YOUTUBE_API_KEY) {
    const { getMockRelatedVideos } = await import("./mock");
    return getMockRelatedVideos(videoId, maxResults);
  }

  const params = new URLSearchParams({
    part: "snippet",
    relatedToVideoId: videoId,
    type: "video",
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
  });

  const res = await fetch(`${API_BASE_URL}/search?${params}`);
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  const videoIds = (data.items as YouTubeSearchItem[]).map((item) => item.id.videoId).join(",");
  const detailsParams = new URLSearchParams({
    part: "contentDetails,statistics",
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  const detailsRes = await fetch(`${API_BASE_URL}/videos?${detailsParams}`);
  const detailsData = await detailsRes.json();

  const detailsMap = new Map(
    (detailsData.items as YouTubeVideoItem[]).map((item) => [item.id, item]),
  );

  return (data.items as YouTubeSearchItem[] || []).map((item) => {
    const details = item.id.videoId ? detailsMap.get(item.id.videoId) : undefined;
    return mapVideoItem({
      ...item,
      contentDetails: details?.contentDetails,
      statistics: details?.statistics,
    });
  });
}

export async function getVideosByCategory(
  categoryId: string,
  pageToken?: string,
  maxResults = 12,
): Promise<SearchResult> {
  if (USE_MOCK_DATA || !YOUTUBE_API_KEY) {
    const { getMockVideosByCategory } = await import("./mock");
    return getMockVideosByCategory(categoryId, pageToken, maxResults);
  }

  const params = new URLSearchParams({
    part: "snippet",
    videoCategoryId: categoryId,
    type: "video",
    maxResults: maxResults.toString(),
    key: YOUTUBE_API_KEY,
    ...(pageToken && { pageToken }),
  });

  const res = await fetch(`${API_BASE_URL}/search?${params}`);
  const data = await res.json();

  if (data.error) throw new Error(data.error.message);

  const videoIds = (data.items as YouTubeSearchItem[]).map((item) => item.id.videoId).join(",");
  const detailsParams = new URLSearchParams({
    part: "contentDetails,statistics",
    id: videoIds,
    key: YOUTUBE_API_KEY,
  });

  const detailsRes = await fetch(`${API_BASE_URL}/videos?${detailsParams}`);
  const detailsData = await detailsRes.json();

  const detailsMap = new Map(
    (detailsData.items as YouTubeVideoItem[]).map((item) => [item.id, item]),
  );

  const videos = (data.items as YouTubeSearchItem[] || []).map((item) => {
    const details = item.id.videoId ? detailsMap.get(item.id.videoId) : undefined;
    return mapVideoItem({
      ...item,
      contentDetails: details?.contentDetails,
      statistics: details?.statistics,
    });
  });

  return {
    videos,
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo?.totalResults || 0,
  };
}
