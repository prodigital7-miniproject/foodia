import { NextRequest, NextResponse } from "next/server";

const GOOGLE_KEY = process.env.GOOGLE_MAP_API_KEY;
const PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo";

export async function GET(request: NextRequest) {
  const photoReference = request.nextUrl.searchParams.get("photo_reference");
  if (!photoReference?.trim() || !GOOGLE_KEY) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const url = `${PHOTO_URL}?maxwidth=800&photo_reference=${encodeURIComponent(photoReference)}&key=${GOOGLE_KEY}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const contentType = res.headers.get("content-type") || "image/jpeg";
  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
