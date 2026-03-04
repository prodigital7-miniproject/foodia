import { NextRequest, NextResponse } from "next/server";
import { getPlaceById } from "@/lib/places/getPlaceById";
import { PlaceDetailsError } from "@/lib/places/fetchPlaceDetails";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> },
) {
  const { placeId } = await params;

  try {
    const baseUrl =
      process.env.APP_BASE_URL ?? request.nextUrl.origin;
    const restaurant = await getPlaceById(placeId, { baseUrl });
    return NextResponse.json(restaurant);
  } catch (e) {
    if (e instanceof PlaceDetailsError) {
      return NextResponse.json(
        { error: e.message },
        { status: e.status ?? 500 },
      );
    }
    console.error("Place details error:", e);
    return NextResponse.json(
      { error: "상세 정보 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
