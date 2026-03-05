import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import { NextRequest } from "next/server";
import { storeFoodTable, storeTable } from "@/lib/db/schema"; // 실제 테이블명으로 변경
import { eq, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const foodId = request.nextUrl.searchParams.get("foodId");
  if (!foodId) {
    return response.fail("foodId는 필수 쿼리 파라미터입니다.", 400);
  }

  const storeFoods = await db
    .select()
    .from(storeFoodTable)
    .where(eq(storeFoodTable.foodId, Number(foodId)))
    .limit(3);

  if (storeFoods.length === 0) {
    return response.ok([], { status: 200 });
  }

  const rids = storeFoods.map((sf) => sf.rid);
  const stores = await db
    .select()
    .from(storeTable)
    .where(inArray(storeTable.rid, rids)); 

  return response.ok(stores, { status: 200 });
}