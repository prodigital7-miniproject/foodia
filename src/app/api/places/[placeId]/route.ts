import { NextRequest, NextResponse } from "next/server";
import { mapDetailToRestaurant } from "@/lib/places/mapToRestaurant";

const GOOGLE_KEY = process.env.GOOGLE_MAP_API_KEY;
const PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;
  if (!placeId?.trim()) {
    return NextResponse.json({ error: "place_id가 필요합니다." }, { status: 400 });
  }

  if (!GOOGLE_KEY) {
    return NextResponse.json({ error: "Places API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  try {
    const url = `${PLACE_DETAILS_URL}?place_id=${encodeURIComponent(placeId)}&key=${GOOGLE_KEY}&language=ko`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.error_message || "장소 정보를 가져오지 못했습니다." },
        { status: 404 }
      );
    }

    const place = data.result as {
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
      formatted_phone_number?: string;
      website?: string;
    };

    const origin = request.headers.get("x-forwarded-host")
      ? `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("x-forwarded-host")}`
      : request.nextUrl.origin;

    const restaurant = mapDetailToRestaurant(place, { baseUrl: origin });
    return NextResponse.json(restaurant);
  } catch (e) {
    console.error("Place details error:", e);
    return NextResponse.json({ error: "상세 정보 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
