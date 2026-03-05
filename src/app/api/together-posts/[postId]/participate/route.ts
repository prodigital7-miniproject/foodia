import { NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import response from "@/lib/http/response";
import {
  togetherParticipantTable,
  togetherPostTable,
} from "@/lib/db/schema";
import { participateTogetherPostSchema } from "@/lib/validators/together-post/together-post";

type TxSuccess = {
  ok: true;
  participantId: number;
  participantCount: number;
};
type TxFailure = { ok: false; message: string; status: number };
type TxResult = TxSuccess | TxFailure;

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

  try {
    const txResult = await db.transaction(async (tx): Promise<TxResult> => {
      // 1) Lock post row and check status + maxParticipants
      const [post] = await tx
        .select({
          id: togetherPostTable.id,
          status: togetherPostTable.status,
          maxParticipants: togetherPostTable.maxParticipants,
        })
        .from(togetherPostTable)
        .where(eq(togetherPostTable.id, id))
        .for("update");

      if (!post) {
        return { ok: false, message: "게시글을 찾을 수 없습니다.", status: 404 };
      }
      if (post.status !== "open") {
        return {
          ok: false,
          message: "이미 마감된 모집글입니다.",
          status: 400,
        };
      }

      // 2) Re-read current participant count inside same tx and validate capacity
      const [countRow] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(togetherParticipantTable)
        .where(eq(togetherParticipantTable.togetherPostId, id));

      const currentCount = countRow?.count ?? 0;
      if (currentCount >= post.maxParticipants) {
        return {
          ok: false,
          message: "모집 인원이 가득 찼습니다.",
          status: 400,
        };
      }

      // 3) Insert and return id (unique constraint together_participants_unique_post_user may throw 23505)
      const [inserted] = await tx
        .insert(togetherParticipantTable)
        .values({
          togetherPostId: id,
          userId: nickname,
        })
        .returning({ id: togetherParticipantTable.id });

      return {
        ok: true,
        participantId: inserted.id,
        participantCount: currentCount + 1,
      };
    });

    if (!txResult.ok) {
      return response.fail(txResult.message, txResult.status);
    }
    return response.ok(
      {
        participantId: txResult.participantId,
        participantCount: txResult.participantCount,
      },
      { status: 201 },
    );
  } catch (err) {
    const code =
      (err as { cause?: { code?: string } }).cause?.code ??
      (err as { code?: string }).code;
    if (code === "23505") {
      return response.fail("이미 참여한 모집글입니다.", 400);
    }
    if (typeof code === "string") {
      return response.fail("요청을 처리할 수 없습니다.", 400);
    }
    return response.fail("일시적인 오류가 발생했습니다.", 500);
  }
}
