//RESSHIN SERVER (thin proxy)
import { NextRequest, NextResponse } from "next/server";
import { validateBackendToken } from "@/lib/validate-token";
import { FIELD_MAP } from "@/lib/token";
import { isValidReferer } from "@/lib/allowed-referers";

export async function GET(req: NextRequest) {
  const logRequest = (status: number, reason: string) => {
    const tmdbId = req.nextUrl.searchParams.get(FIELD_MAP.id);
    const mediaType = req.nextUrl.searchParams.get("b");
    const season = req.nextUrl.searchParams.get(FIELD_MAP.season);
    const episode = req.nextUrl.searchParams.get(FIELD_MAP.episode);
    const extra = mediaType === "tv" ? `/${season}/${episode}` : "";

    const ip = req.headers.get("cf-connecting-ip") ?? "unknown";

    console.log(
      `[RESSHIN] ${tmdbId}/${mediaType}${extra} | ${status} | ${reason} | ts: ${new Date().toISOString()} | IP: ${ip}`,
    );
  };

  try {
    const tmdbId = req.nextUrl.searchParams.get(FIELD_MAP.id);
    const mediaType = req.nextUrl.searchParams.get("b");
    const season = req.nextUrl.searchParams.get(FIELD_MAP.season);
    const episode = req.nextUrl.searchParams.get(FIELD_MAP.episode);
    const title = req.nextUrl.searchParams.get(FIELD_MAP.title);
    const date = req.nextUrl.searchParams.get("date");
    const ts = Number(req.nextUrl.searchParams.get(FIELD_MAP.ts));
    const token = req.nextUrl.searchParams.get(FIELD_MAP.token)!;
    const f_token = req.nextUrl.searchParams.get(FIELD_MAP.fToken)!;
    const dubCode = req.nextUrl.searchParams.get("dubCode");
    const dubType = Number(req.nextUrl.searchParams.get("dubType") ?? "0");

    if (!tmdbId || !mediaType || !title || !date || !ts || !token) {
      logRequest(400, "missing params");
      return NextResponse.json(
        { success: false, error: "missing params" },
        { status: 400 },
      );
    }

    if (Date.now() - ts > 120000) {
      logRequest(401, "token expired");
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    if (!validateBackendToken(tmdbId, f_token, ts, token)) {
      logRequest(401, "invalid token");
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    const referer = req.headers.get("referer") || "";
    if (!isValidReferer(referer)) {
      logRequest(403, "invalid referrer");
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }
    // Forward only the extraction params to Backend B
    const params = new URLSearchParams({
      tmdbId,
      mediaType,
      title,
      date,
      ...(season && { season }),
      ...(episode && { episode }),
      ...(dubCode && { dubCode }),
      dubType: String(dubType),
    });
    const res = await fetch(
      `https://online-seller-tau.vercel.app/backend_/servers/resshin_?${params.toString()}`,
      {
        method: "GET",
        // headers: {
        //   // optional: add an internal secret if you want
        //   // "x-internal-key": process.env.INTERNAL_KEY || "",
        // },
      },
    );

    const data = await res.json();

    if (!data.success) {
      logRequest(data.status || 500, data.error || "extraction failed");
      return NextResponse.json(
        { success: false, error: data.error || "extraction failed" },
        { status: data.status || 500 },
      );
    }

    logRequest(200, "OK");
    return NextResponse.json(data);
  } catch (err: any) {
    logRequest(500, err.message);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
