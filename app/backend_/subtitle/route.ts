// Backend B route example
import { NextRequest, NextResponse } from "next/server";
import { extractSubtitle } from "@/lib/subtitle-extractor";

export async function GET(req: NextRequest) {
  const tmdbId = req.nextUrl.searchParams.get("tmdbId")!;
  const mediaType = req.nextUrl.searchParams.get("mediaType")!;
  const title = req.nextUrl.searchParams.get("title")!;
  const date = req.nextUrl.searchParams.get("date")!;
  const season = req.nextUrl.searchParams.get("season");
  const episode = req.nextUrl.searchParams.get("episode");

  const result = await extractSubtitle({
    tmdbId,
    mediaType,
    title,
    date,
    season,
    episode,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: result.status });
  }

  return NextResponse.json(result);
}
