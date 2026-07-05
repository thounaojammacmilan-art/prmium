import { extractVideoId } from "./utils";

interface YouTubePlayerConfig {
  videoId: string;
  playerVars?: {
    autoplay?: number;
    controls?: number;
    rel?: number;
    modestbranding?: number;
    enablejsapi?: number;
    origin?: string;
  };
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function buildPlayerConfig(videoId: string, autoplay = false): YouTubePlayerConfig {
  return {
    videoId,
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      enablejsapi: 1,
    },
  };
}

export function parseYouTubeUrl(url: string): string | null {
  return extractVideoId(url);
}

export function getVideoThumbnails(videoId: string) {
  return {
    default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  };
}

export function getChannelAvatarUrl(channelId: string): string {
  return `https://yt3.ggpht.com/ytc/${channelId}=s88-c-k-c0x00ffffff-no-rj`;
}
