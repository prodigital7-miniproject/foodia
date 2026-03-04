const PLACE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

/** Google Place Details API result (place object) */
export type GooglePlaceDetail = {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry?: { location: { lat: number; lng: number } };
  photos?: Array<{ photo_reference: string }>;
  types?: string[];
  price_level?: number;
  opening_hours?: { weekday_text?: string[] };
  formatted_phone_number?: string;
  website?: string;
};

export class PlaceDetailsError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "PlaceDetailsError";
  }
}

/**
 * 구글 Place Details API를 호출해 가게 상세 정보를 가져옵니다.
 * @param placeId - Google Place ID
 * @returns Place 상세 객체 (status !== "OK"이면 PlaceDetailsError throw)
 * @throws PlaceDetailsError - API 키 없음, place_id 없음, 또는 API 응답 실패 시
 */
export async function fetchPlaceDetails(
  placeId: string,
): Promise<GooglePlaceDetail> {
  const key = process.env.GOOGLE_MAP_API_KEY;
  if (!key) {
    throw new PlaceDetailsError("Places API 키가 설정되지 않았습니다.", 500);
  }

  const trimmed = placeId?.trim();
  if (!trimmed) {
    throw new PlaceDetailsError("place_id가 필요합니다.", 400);
  }

  const url = `${PLACE_DETAILS_URL}?place_id=${encodeURIComponent(trimmed)}&key=${key}&language=ko`;
  const res = await fetch(url, {
    headers: { "X-Goog-FieldMask": "*" },
  });
  const data = await res.json();

  if (data.status !== "OK") {
    throw new PlaceDetailsError(
      data.error_message || "장소 정보를 가져오지 못했습니다.",
      404,
      data.status,
    );
  }

  return data.result as GooglePlaceDetail;
}
