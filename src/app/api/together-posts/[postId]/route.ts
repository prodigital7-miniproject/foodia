import { NextRequest } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import {
  togetherPostTable,
  storeTable,
  togetherParticipantTable,
} from "@/lib/db/schema";

/** GET /api/together-posts/[postId] - 단건 조회 (식당 정보 + 참여자 수) */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const id = Number(postId);
  if (!Number.isInteger(id) || id < 1) {
    return response.fail("잘못된 게시글 ID입니다.", 400);
  }

  const rows = await db
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
      storeAddress: storeTable.address,
    })
    .from(togetherPostTable)
    .innerJoin(storeTable, eq(togetherPostTable.rid, storeTable.rid))
    .where(
    and(
      eq(togetherPostTable.id, id),
      eq(storeTable.isDeleted, false)
    )
  );

  if (rows.length === 0) {
    return response.fail("게시글을 찾을 수 없습니다.", 404);
  }

  const row = rows[0];
  if (row.storeName === null) {
    return response.fail("게시글을 찾을 수 없습니다.", 404);
  }

  const rid = row.rid;

  const [participantCountResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(togetherParticipantTable)
    .where(eq(togetherParticipantTable.togetherPostId, id));

  const participantCount = participantCountResult?.count ?? 0;

  const [postCountResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(togetherPostTable)
    .innerJoin(storeTable, eq(togetherPostTable.rid, storeTable.rid))
    .where(
      and(
        eq(togetherPostTable.rid, rid),
        eq(storeTable.isDeleted, false)
      )
    );

  const postCountAtStore = postCountResult?.count ?? 0;

  return response.ok(
    {
      ...row,
      storeAddress: row.storeAddress ?? "",
      participantCount,
      postCountAtStore,
    },
    { status: 200 }
  );
}
