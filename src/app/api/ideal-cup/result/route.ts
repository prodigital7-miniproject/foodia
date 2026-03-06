import response from "@/lib/http/response";
import { getStoresByFoodId } from "@/lib/restaurant/stores-by-food";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const foodId = request.nextUrl.searchParams.get("foodId");
  if (!foodId) {
    return response.fail("foodId는 필수 쿼리 파라미터입니다.", 400);
  }

  const stores = await getStoresByFoodId(Number(foodId), { limit: 3 });
  return response.ok(stores, { status: 200 });
}