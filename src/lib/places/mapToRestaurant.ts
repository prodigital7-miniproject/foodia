import type { Restaurant } from "@/lib/types";

/** Google Places (old) Text Search result item */
export interface GooglePlaceResult {
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
}

/** Map Google place type to our category */
function typeToCategory(types: string[] | undefined): string {
  if (!types?.length) return "기타";
  const t = types.join(" ").toLowerCase();
  if (t.includes("restaurant") && (t.includes("korean") || t.includes("한식"))) return "한식";
  if (t.includes("restaurant") && (t.includes("chinese") || t.includes("중식"))) return "중식";
  if (t.includes("restaurant") && (t.includes("japanese") || t.includes("일식"))) return "일식";
  if (t.includes("restaurant") && (t.includes("western") || t.includes("양식"))) return "양식";
  if (t.includes("cafe") || t.includes("coffee")) return "카페";
  if (t.includes("restaurant")) return "한식"; // default restaurant
  return "기타";
}

function priceLevelToRange(level: number | undefined): string {
  if (level == null) return "정보없음";
  if (level <= 1) return "1만원 이하";
  if (level <= 2) return "1-2만원";
  return "2만원 이상";
}

/** Photo URL: use our proxy so API key is not exposed */
function photoUrl(photoReference: string | undefined, baseUrl: string): string {
  if (!photoReference) return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
  return `${baseUrl}/api/places/photo?photo_reference=${encodeURIComponent(photoReference)}`;
}

/** Map Google Text Search result to Restaurant (list item). 리뷰/리뷰 수는 우리 서비스 사용자만 사용하므로 구글 값 사용 안 함 */
export function mapSearchResultToRestaurant(
  place: GooglePlaceResult,
  options: { baseUrl: string }
): Restaurant {
  return {
    id: place.place_id,
    name: place.name,
    category: typeToCategory(place.types),
    imageUrl: photoUrl(place.photos?.[0]?.photo_reference, options.baseUrl),
    rating: place.rating ?? 0,
    reviewCount: 0,
    distance: "-",
    priceRange: priceLevelToRange(place.price_level),
    tags: [],
    address: place.formatted_address ?? "",
    hours: place.opening_hours?.weekday_text?.[0] ?? "정보없음",
    menuItems: [],
    reviews: [],
  };
}

/** Map Google Place Details result to Restaurant (detail). 리뷰/리뷰 수는 우리 서비스만 사용 */
export function mapDetailToRestaurant(
  place: GooglePlaceResult & { opening_hours?: { weekday_text?: string[] }; formatted_phone_number?: string; website?: string },
  options: { baseUrl: string }
): Restaurant {
  return {
    id: place.place_id,
    name: place.name,
    category: typeToCategory(place.types),
    imageUrl: photoUrl(place.photos?.[0]?.photo_reference, options.baseUrl),
    rating: place.rating ?? 0,
    reviewCount: 0,
    distance: "-",
    priceRange: priceLevelToRange(place.price_level),
    tags: [],
    address: place.formatted_address ?? "",
    hours: place.opening_hours?.weekday_text?.join(" / ") ?? "정보없음",
    menuItems: [],
    reviews: [], // 우리 서비스 리뷰만 사용
  };
}
