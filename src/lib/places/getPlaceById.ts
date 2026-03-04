import { fetchPlaceDetails } from "@/lib/places/fetchPlaceDetails";
import { mapDetailToRestaurant } from "@/lib/places/mapToRestaurant";

/**
 * 가게 ID만 받아 Restaurant 형태로 반환합니다.
 * 서버 컴포넌트, API 라우트, 서버 액션 등 어디서든 사용 가능합니다.
 * @param placeId - Google Place ID
 * @param options.baseUrl - 이미지 등 절대 URL에 사용할 베이스 URL (미지정 시 APP_BASE_URL 또는 localhost)
 */
export async function getPlaceById(
  placeId: string,
  options?: { baseUrl?: string },
) {
  const place = await fetchPlaceDetails(placeId);
  const baseUrl =
    options?.baseUrl ??
    process.env.APP_BASE_URL ??
    "http://localhost:3000";
  return mapDetailToRestaurant(place, { baseUrl });
}
