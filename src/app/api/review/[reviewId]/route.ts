import { db } from "@/lib/db/client";
import { reviewTable } from "@/lib/db/schema";
import response from "@/lib/http/response";
import { desc, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { reviewId: string } },
) {
  const { reviewId } = await params;
  if (!reviewId) {
    return response.fail("reviewId는 필수 경로 파라미터입니다.", 400);
  }
  const result = await db
    .select()
    .from(reviewTable)
    .where(eq(reviewTable.rid, reviewId))
    .orderBy(desc(reviewTable.createdAt));
  if (result.length === 0) {
    return response.fail("리뷰가 없습니다.", 404);
  }
  return response.ok(result, { status: 200 });
}
