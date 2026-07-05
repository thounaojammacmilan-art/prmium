import { NextRequest, NextResponse } from "next/server";
import { getTrendingVideos } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get("pageToken") || undefined;
  const maxResults = parseInt(searchParams.get("maxResults") || "12");

  try {
    const result = await getTrendingVideos(pageToken, maxResults);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending videos" },
      { status: 500 },
    );
  }
}
