import { NextRequest } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import {
  togetherPostTable,
  storeTable,
} from "@/lib/db/schema";
import { createTogetherPostSchema } from "@/lib/validators/together-post/together-post";

/** POST /api/together-posts - 같이먹기 모집글 작성 (실명, 본문, 모집 인원) */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response.fail("요청 본문이 올바른 JSON이 아닙니다.", 400);
  }

  const result = createTogetherPostSchema.safeParse(body);
  if (!result.success) {
    const first = result.error.flatten().fieldErrors;
    const message =
      typeof first === "object" && first !== null && Object.keys(first).length > 0
        ? Object.values(first)
            .flat()
            .filter(Boolean)[0] ?? "입력값을 확인해 주세요."
        : "입력값을 확인해 주세요.";
    return response.fail(String(message), 400);
  }

  const { rid, content, authorName, maxParticipants } = result.data;
  const title =
    result.data.title?.trim() ||
    content.slice(0, 100);

  const [storeExists] = await db
    .select({ rid: storeTable.rid })
    .from(storeTable)
    .where(and(eq(storeTable.rid, rid), eq(storeTable.isDeleted, false)))
    .limit(1);

  if (!storeExists) {
    return response.fail("해당 식당을 찾을 수 없거나 삭제된 식당입니다.", 404);
  }

  const [inserted] = await db
    .insert(togetherPostTable)
    .values({
      rid,
      title,
      content,
      authorName,
      maxParticipants,
      status: "open",
      isAnonymous: false,
    })
    .returning();

  return response.ok(inserted, { status: 201 });
}

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
      authorName: togetherPostTable.authorName,
      maxParticipants: togetherPostTable.maxParticipants,
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