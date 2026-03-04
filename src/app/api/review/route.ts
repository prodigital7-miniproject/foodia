import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import { NextRequest } from "next/server";
import { z } from "zod";
import { reviewTable } from "@/lib/db/schema";
import { createReviewSchema } from "@/lib/validators/review/review";
import { desc, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createReviewSchema.safeParse(body);
  if (!result.success) {
    return response.fail(JSON.stringify(z.treeifyError(result.error)));
  }
  const review = await db.insert(reviewTable).values(result.data).returning();

  return response.ok(review, { status: 201 });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const result = await db
    .select()
    .from(reviewTable)
    .where(
      eq(reviewTable.googlePlaceId, searchParams.get("googlePlaceId") || ""),
    )
    .orderBy(desc(reviewTable.createdAt));
  if (result.length === 0) {
    return response.fail("리뷰가 없습니다.", 404);
  }
  return response.ok(result, { status: 201 });
}
