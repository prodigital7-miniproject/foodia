import { NextRequest } from "next/server";
import { and, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { foodTable, reviewTable, storeTable } from "@/lib/db/schema";
import response from "@/lib/http/response";
import { getStoresByFoodIds } from "@/lib/restaurant/stores-by-food";
import { mapStoresToRestaurants } from "@/lib/restaurant/map-store-to-restaurant";
import type { Restaurant } from "@/lib/types";

const SEARCH_LIMIT = 50;

/**
 * GET /api/search?q=검색어
 * - 식당 이름으로 검색 (stores.name ILIKE)
 * - 음식 이름/카테고리로 검색 (foods.name or foods.category ILIKE → 해당 음식 제공 식당)
 * 결과: 이름 매칭 식당 + 해당 음식 제공 식당 합친 목록 (중복 제거), Restaurant[] 형태
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return response.ok([], { status: 200 });
  }

  const pattern = `%${q}%`;

  try {
    // 1) 식당 이름으로 검색
    const storesByName = await db
      .select()
      .from(storeTable)
      .where(
        and(eq(storeTable.isDeleted, false), ilike(storeTable.name, pattern))
      )
      .limit(SEARCH_LIMIT);

    const ridSet = new Set(storesByName.map((s) => s.rid));

    // 2) 음식 이름 또는 category로 검색 → 해당 음식 제공 식당
    const foods = await db
      .select({ id: foodTable.id })
      .from(foodTable)
      .where(
        or(
          ilike(foodTable.name, pattern),
          ilike(foodTable.category, pattern)
        )
      )
      .limit(100);

    const foodIds = foods.map((f) => f.id);
    const storesByFood =
      foodIds.length > 0
        ? await getStoresByFoodIds(foodIds, { limit: SEARCH_LIMIT })
        : [];

    // 3) 합치기 (이름 매칭 우선, 그 다음 음식 매칭에서 아직 없는 rid만 추가)
    const storesById = new Map(storesByName.map((s) => [s.rid, s]));
    for (const s of storesByFood) {
      if (!ridSet.has(s.rid)) {
        ridSet.add(s.rid);
        storesById.set(s.rid, s);
      }
    }
    const mergedStores = Array.from(storesById.values());

    if (mergedStores.length === 0) {
      return response.ok([]);
    }

    // 4) 리뷰 집계
    const rids = mergedStores.map((s) => s.rid);
    const reviewStats = await db
      .select({
        rid: reviewTable.rid,
        reviewCount: sql<number>`count(*)::int`,
        avgRating: sql<number>`coalesce(round(avg(${reviewTable.rating})::numeric, 1), 0)`,
      })
      .from(reviewTable)
      .where(inArray(reviewTable.rid, rids))
      .groupBy(reviewTable.rid);

    const statsByRid = new Map(
      reviewStats.map((r) => [r.rid, { reviewCount: r.reviewCount, avgRating: r.avgRating }])
    );

    const restaurants: Restaurant[] = mapStoresToRestaurants(
      mergedStores,
      statsByRid
    );

    return response.ok(restaurants);
  } catch (e) {
    console.error("GET /api/search", e);
    return response.fail("검색 중 오류가 발생했습니다.", 500, String(e));
  }
}
