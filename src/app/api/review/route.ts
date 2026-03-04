import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import { NextRequest } from "next/server";
import { z } from "zod";
import { reviewTable } from "@/lib/db/schema";
import { createReviewSchema } from "@/lib/validators/review/review";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = createReviewSchema.safeParse(body);
  if (!result.success) {
    return response.fail(JSON.stringify(z.treeifyError(result.error)));
  }
  const review = await db.insert(reviewTable).values(result.data).returning();

  return response.ok(review, { status: 201 });
}
