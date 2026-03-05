import { NextRequest } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import {
  togetherParticipantTable,
  togetherPostTable,
} from "@/lib/db/schema";
import { participateTogetherPostSchema } from "@/lib/validators/together-post/together-post";

/** POST /api/together-posts/[postId]/participate - 모집글 참여 (닉네임/실명) */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const id = Number(postId);

  if (!Number.isInteger(id) || id < 1) {
    return response.fail("잘못된 게시글 ID입니다.", 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response.fail("요청 본문이 올바른 JSON이 아닙니다.", 400);
  }

  const result = participateTogetherPostSchema.safeParse(body);
  if (!result.success) {
    const first = result.error.flatten().fieldErrors;
    const message =
      typeof first === "object" && first !== null && Object.keys(first).length > 0
        ? (Object.values(first).flat().filter(Boolean)[0] as string) ??
          "입력값을 확인해 주세요."
        : "입력값을 확인해 주세요.";

    return response.fail(String(message), 400);
  }

  const { nickname } = result.data;

  // 모집글 존재 여부 및 상태/정원 조회
  const [post] = await db
    .select({
      id: togetherPostTable.id,
      status: togetherPostTable.status,
      maxParticipants: togetherPostTable.maxParticipants,
    })
    .from(togetherPostTable)
    .where(eq(togetherPostTable.id, id));

  if (!post) {
    return response.fail("게시글을 찾을 수 없습니다.", 404);
  }

  if (post.status !== "open") {
    return response.fail("이미 마감된 모집글입니다.", 400);
  }

  // 현재 참여 인원 수 조회
  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(togetherParticipantTable)
    .where(eq(togetherParticipantTable.togetherPostId, id));

  const currentCount = countRow?.count ?? 0;

  if (currentCount >= post.maxParticipants) {
    return response.fail("모집 인원이 가득 찼습니다.", 400);
  }

  // 동일 닉네임으로 중복 참여 방지
  const [existing] = await db
    .select({ id: togetherParticipantTable.id })
    .from(togetherParticipantTable)
    .where(
      and(
        eq(togetherParticipantTable.togetherPostId, id),
        eq(togetherParticipantTable.userId, nickname),
      ),
    );

  if (existing) {
    return response.fail("이미 참여한 모집글입니다.", 400);
  }

  const [inserted] = await db
    .insert(togetherParticipantTable)
    .values({
      togetherPostId: id,
      userId: nickname,
    })
    .returning({
      id: togetherParticipantTable.id,
    });

  return response.ok(
    {
      participantId: inserted.id,
      participantCount: currentCount + 1,
    },
    { status: 201 },
  );
}
