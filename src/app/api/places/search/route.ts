import { NextRequest, NextResponse } from "next/server";
import { mapSearchResultToRestaurant } from "@/lib/places/mapToRestaurant";

const GOOGLE_KEY = process.env.GOOGLE_MAP_API_KEY;
const TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location");
  if (!location?.trim()) {
    return NextResponse.json({ error: "location 쿼리가 필요합니다." }, { status: 400 });
  }

  if (!GOOGLE_KEY) {
    return NextResponse.json({ error: "Places API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  try {
    const query = `맛집 ${location.trim()}`;
    const url = `${TEXT_SEARCH_URL}?query=${encodeURIComponent(query)}&key=${GOOGLE_KEY}&language=ko`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return NextResponse.json(
        { error: data.error_message || "검색 요청에 실패했습니다." },
        { status: 502 }
      );
    }

    const results = (data.results || []) as Array<{
      place_id: string;
      name: string;
      formatted_address?: string;
      geometry?: { location: { lat: number; lng: number } };
      rating?: number;
      user_ratings_total?: number;
      photos?: Array<{ photo_reference: string }>;
      types?: string[];
      price_level?: number;
      opening_hours?: { weekday_text?: string[] };
    }>;

    const origin = request.headers.get("x-forwarded-host")
      ? `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("x-forwarded-host")}`
      : request.nextUrl.origin;

    const restaurants = results.map((place) =>
      mapSearchResultToRestaurant(place, { baseUrl: origin })
    );

    return NextResponse.json(restaurants);
  } catch (e) {
    console.error("Places search error:", e);
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 });
  }
}
