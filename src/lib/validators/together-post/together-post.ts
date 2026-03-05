import { z } from "zod";

export const createTogetherPostSchema = z.object({
  /** 모집할 식당 rid */
  rid: z
    .string()
    .min(1, "식당(rid)을 입력해 주세요.")
    .max(255, "rid는 255자 이하여야 합니다."),
  /** 제목 (미입력 시 본문 앞 100자 사용) */
  title: z
    .string()
    .max(100, "제목은 100자 이하여야 합니다.")
    .optional(),
  /** 모집글 본문 */
  content: z
    .string()
    .min(1, "본문을 입력해 주세요.")
    .max(300, "본문은 300자 이하여야 합니다."),
  /** 작성자 실명 */
  authorName: z
    .string()
    .min(1, "실명을 입력해 주세요.")
    .max(50, "실명은 50자 이하여야 합니다."),
  /** 모집 인원 (1명 이상) */
  maxParticipants: z
    .number()
    .int("모집 인원은 정수여야 합니다.")
    .min(1, "모집 인원은 1명 이상이어야 합니다.")
    .max(20, "모집 인원은 20명 이하여야 합니다."),
});

export type CreateTogetherPostSchema = z.infer<typeof createTogetherPostSchema>;

/** 같이먹기 모집글 참여 시 닉네임(실명) 입력 검증 */
export const participateTogetherPostSchema = z.object({
  nickname: z
    .string()
    .min(1, "닉네임을 입력해 주세요.")
    .max(10, "닉네임은 10자 이하여야 합니다."),
});

export type ParticipateTogetherPostSchema = z.infer<
  typeof participateTogetherPostSchema
>;
