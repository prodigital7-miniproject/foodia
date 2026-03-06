import { NextRequest } from "next/server";
import { and, eq, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { storeTable, reviewTable } from "@/lib/db/schema";
import response from "@/lib/http/response";
import { mapStoresToRestaurants } from "@/lib/restaurant/map-store-to-restaurant";
import type { Restaurant } from "@/lib/types";

/** 화면 필터 값 → DB에 저장돼 있을 수 있는 값들 (category 불일치 대응) */
const CATEGORY_ALIAS: Record<string, string[]> = {
  한식: ["한식", "한국식", "한국음식", "한정식"],
  중식: ["중식", "중국식", "중국음식"],
  일식: ["일식", "일본식", "일본음식"],
  양식: ["양식", "양식/서양식", "이탈리안", "프랑스식"],
  카페: ["카페", "카페/디저트", "디저트", "베이커리"],
};

/** 화면 가격대 필터 → DB 실제 저장값 (price_range / food_price_range) */
const PRICE_RANGE_ALIAS: Record<string, string[]> = {
  "1만원 이하": ["5천원 미만", "5천원대", "1만원대"],
  "1-2만원": ["1.2만원대", "1.5만원대", "2만원대"],
  "2만원 이상": ["2.5만원대", "3만원대", "4만원 이상"],
};

/** 화면 상황 필터 → DB stores.categories(jsonb) 실제 저장 태그 값 */
const SITUATION_ALIAS: Record<string, string[]> = {
  혼밥: ["혼밥", "혼자먹기", "혼술", "혼카페", "혼자카페", "혼자방문", "혼자할일"],
  데이트: ["데이트", "데이트하기좋은", "소개팅장소", "소개팅", "데이트코스", "연애인맛집"],
  친구모임: ["친구모임", "술모임", "회식", "모임", "단체모임", "가족외식", "회식장소", "2차", "차모임"],
};

/**
 * GET /api/restaurants
 * Query: category, priceRange, situation, sort (distance | rating)
 * stores 테이블 조회 후 화면용 Restaurant 형태로 변환해 반환
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category")?.trim() || undefined;
  const priceRange = searchParams.get("priceRange")?.trim() || undefined;
  const situation = searchParams.get("situation")?.trim() || undefined;
  const sort = (searchParams.get("sort") as "distance" | "rating") || "distance";

  try {
    // 1) 리뷰 집계 (rid별 개수, 평균 평점)
    const reviewStats = await db
      .select({
        rid: reviewTable.rid,
        reviewCount: sql<number>`count(*)::int`,
        avgRating: sql<number>`coalesce(round(avg(${reviewTable.rating})::numeric, 1), 0)`,
      })
      .from(reviewTable)
      .groupBy(reviewTable.rid);

    const statsByRid = new Map(
      reviewStats.map((r) => [r.rid, { reviewCount: r.reviewCount, avgRating: r.avgRating }])
    );

    // 2) stores 조회 조건 (DB 저장값이 화면 옵션과 다를 수 있어 여러 컬럼/값 매핑 사용)
    const conditions = [eq(storeTable.isDeleted, false)];

    if (category && category !== "전체") {
      const aliases = CATEGORY_ALIAS[category] ?? [category];
      const categoryConditions = aliases.flatMap((c) => [
        eq(storeTable.category, c),
        eq(storeTable.cuisineType, c),
        sql`${storeTable.categories} @> ${JSON.stringify([c])}::jsonb`,
      ]);
      conditions.push(or(...categoryConditions)!);
    }
    if (priceRange && priceRange !== "전체") {
      const priceAliases = PRICE_RANGE_ALIAS[priceRange] ?? [priceRange];
      const priceConditions = priceAliases.flatMap((p) => [
        eq(storeTable.priceRange, p),
        eq(storeTable.foodPriceRange, p),
      ]);
      conditions.push(or(...priceConditions)!);
    }
    if (situation && situation !== "전체") {
      const situationAliases = SITUATION_ALIAS[situation] ?? [situation];
      // 상황 태그는 stores.categories(jsonb 배열)에 저장됨. ?| = jsonb 배열이 text[] 중 하나라도 포함하면 true
      // 각 요소를 개별 바인드 파라미터로 전달해 SQL 인젝션을 방지
      conditions.push(
        sql`${storeTable.categories} ?| array[${sql.join(
          situationAliases.map((t) => sql`${t}`),
          sql`, `,
        )}]::text[]`,
      );
    }

    const query = db
      .select()
      .from(storeTable)
      .where(and(...conditions));

    // 정렬은 조회 후 적용 (rating은 리뷰 집계와 합쳐야 해서)
    const stores = await query;

    // 3) Restaurant 형태로 매핑
    const restaurants: Restaurant[] = mapStoresToRestaurants(stores, statsByRid);

    // 4) 정렬 (거리 미존재는 뒤로)
    const parseDistance = (d: string | number | undefined): number => {
      if (d == null || d === "") return Infinity;
      const n = parseInt(String(d), 10);
      return Number.isNaN(n) ? Infinity : n;
    };
    if (sort === "rating") {
      restaurants.sort((a, b) => b.rating - a.rating);
    } else {
      restaurants.sort((a, b) => {
        const da = parseDistance(a.distance);
        const db = parseDistance(b.distance);
        return da - db;
      });
    }

    return response.ok(restaurants);
  } catch (e) {
    console.error("GET /api/restaurants", e);
    return response.fail("맛집 목록을 불러오지 못했습니다.", 500, String(e));
  }
}
