import { NextRequest } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import {
  togetherPostTable,
  storeTable,
} from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 20, 1), 100);
  const googlePlaceId = searchParams.get("googlePlaceId")?.trim();

  const base = db
    .select({
      id: togetherPostTable.id,
      googlePlaceId: togetherPostTable.googlePlaceId,
      title: togetherPostTable.title,
      content: togetherPostTable.content,
      status: togetherPostTable.status,
      isAnonymous: togetherPostTable.isAnonymous,
      createdAt: togetherPostTable.createdAt,
      storeName: storeTable.name,
      storeCategory: storeTable.category,
    })
    .from(togetherPostTable)
    .innerJoin(
      storeTable,
      eq(togetherPostTable.googlePlaceId, storeTable.googlePlaceId)
    );

  const rows = googlePlaceId
    ? await base
        .where(
          and(
            eq(togetherPostTable.googlePlaceId, googlePlaceId),
            eq(storeTable.isDeleted, false)
          )
        )
        .orderBy(desc(togetherPostTable.createdAt))
        .limit(limit)
    : await base
        .where(eq(storeTable.isDeleted, false))
        .orderBy(desc(togetherPostTable.createdAt))
        .limit(limit);

  return response.ok(rows, { status: 200 });
}