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
  const rid = searchParams.get("rid")?.trim();

  const base = db
    .select({
      id: togetherPostTable.id,
      rid: togetherPostTable.rid,
      title: togetherPostTable.title,
      content: togetherPostTable.content,
      status: togetherPostTable.status,
      isAnonymous: togetherPostTable.isAnonymous,
      createdAt: togetherPostTable.createdAt,
      storeName: storeTable.name,
      storeCategory: storeTable.cuisineType,
    })
    .from(togetherPostTable)
    .innerJoin(
      storeTable,
      eq(togetherPostTable.rid, storeTable.rid)
    );

  const rows = rid
    ? await base
        .where(
          and(
            eq(togetherPostTable.rid, rid),
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