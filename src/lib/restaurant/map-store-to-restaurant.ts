import type { Restaurant } from "@/lib/types";
import type { StoreRow } from "./stores-by-food";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";

export type ReviewStats = { reviewCount: number; avgRating: number };

/**
 * DB store 행 + 리뷰 집계를 화면용 Restaurant 형태로 변환.
 * /api/restaurants, /api/search 등에서 공통 사용.
 */
export function mapStoresToRestaurants(
  stores: StoreRow[],
  statsByRid: Map<string, ReviewStats>
): Restaurant[] {
  return stores.map((s) => {
    const stats = statsByRid.get(s.rid);
    const reviewCount = stats?.reviewCount ?? 0;
    const avgFromReviews = stats?.avgRating ?? 0;
    const rating =
      reviewCount > 0
        ? avgFromReviews
        : s.diningcodeScore != null && s.diningcodeScore <= 5
          ? s.diningcodeScore
          : s.diningcodeScore != null
            ? Math.round((s.diningcodeScore / 20) * 10) / 10
            : 0;

    const tags: string[] = [
      ...(s.purposeTags ?? []),
      ...(s.featureTags ?? []),
    ];
    const menuItems = (s.menu ?? []).map((m) => ({
      name: m.name,
      price: m.price,
    }));

    return {
      id: s.rid,
      name: s.name,
      category: s.category,
      imageUrl: s.imgUrl ?? DEFAULT_IMAGE,
      rating: Number(rating),
      reviewCount,
      distance: s.distance != null ? `${s.distance}m` : "",
      priceRange: s.priceRange ?? "",
      tags,
      address: s.address,
      hours: s.hoursSummary ?? "",
      menuItems,
      reviews: [],
    };
  });
}
