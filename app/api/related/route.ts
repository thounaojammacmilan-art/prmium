import { NextRequest, NextResponse } from "next/server";
import { getRelatedVideos } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  const maxResults = parseInt(searchParams.get("maxResults") || "12");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 },
    );
  }

  try {
    const videos = await getRelatedVideos(videoId, maxResults);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Related API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related videos" },
      { status: 500 },
    );
  }
}
