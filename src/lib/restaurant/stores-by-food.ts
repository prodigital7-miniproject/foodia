import { db } from "@/lib/db/client";
import { storeFoodTable, storeTable } from "@/lib/db/schema";
import { desc, eq, inArray } from "drizzle-orm";

export type StoreRow = typeof storeTable.$inferSelect;

/**
 * foodId(들)에 해당하는 음식을 제공하는 식당 목록 조회.
 * 이상형월드컵 식당 추천, 검색(음식명/카테고리) 등에서 공통 사용.
 */
export async function getStoresByFoodIds(
  foodIds: number[],
  options?: { limit?: number }
): Promise<StoreRow[]> {
  if (foodIds.length === 0) return [];

  const limit = options?.limit ?? 50;

  const storeFoods = await db
    .select({ rid: storeFoodTable.rid })
    .from(storeFoodTable)
    .where(inArray(storeFoodTable.foodId, foodIds));

  const rids = [...new Set(storeFoods.map((sf) => sf.rid))];
  if (rids.length === 0) return [];

  const stores = await db
    .select()
    .from(storeTable)
    .where(inArray(storeTable.rid, rids))
    .orderBy(desc(storeTable.diningcodeScore))
    .limit(limit);

  return stores;
}

export async function getStoresByFoodId(
  foodId: number,
  options?: { limit?: number }
): Promise<StoreRow[]> {
  return getStoresByFoodIds([foodId], options);
}
