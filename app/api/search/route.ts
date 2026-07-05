import { NextRequest, NextResponse } from "next/server";
import { searchVideos } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const pageToken = searchParams.get("pageToken") || undefined;
  const maxResults = parseInt(searchParams.get("maxResults") || "12");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const result = await searchVideos(query, pageToken, maxResults);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search videos" },
      { status: 500 },
    );
  }
}
