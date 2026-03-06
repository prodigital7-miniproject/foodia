import { NextRequest } from "next/server";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { foodTable, storeTable } from "@/lib/db/schema";
import response from "@/lib/http/response";

const SUGGEST_LIMIT = 8;

/**
 * GET /api/search/suggest?q=검색어
 * - 식당 이름 자동완성 (stores.name ILIKE)
 * - 음식 이름/카테고리 (foods.name or foods.category ILIKE)
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 1) {
    return response.ok({ storeNames: [], foodSuggestions: [] });
  }

  const pattern = `%${q}%`;

  try {
    const [storeRows, foodRows] = await Promise.all([
      db
        .select({ name: storeTable.name })
        .from(storeTable)
        .where(
          and(
            eq(storeTable.isDeleted, false),
            ilike(storeTable.name, pattern)
          )
        )
        .limit(SUGGEST_LIMIT),
      db
        .select({ name: foodTable.name, category: foodTable.category })
        .from(foodTable)
        .where(
          or(
            ilike(foodTable.name, pattern),
            ilike(foodTable.category, pattern)
          )
        )
        .limit(SUGGEST_LIMIT),
    ]);

    const storeNames = [...new Set(storeRows.map((r) => r.name))].slice(
      0,
      SUGGEST_LIMIT
    );
    const foodSuggestions = foodRows.map((r) => ({
      name: r.name,
      category: r.category ?? null,
    }));

    return response.ok({ storeNames, foodSuggestions });
  } catch (e) {
    console.error("GET /api/search/suggest", e);
    return response.fail("추천 검색어를 불러오지 못했습니다.", 500, String(e));
  }
}
