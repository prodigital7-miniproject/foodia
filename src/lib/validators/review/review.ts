import { z } from "zod";

export const createReviewSchema = z.object({
  googlePlaceId: z.string().min(1, "Google Place ID를 입력하여 주세요."),
  nickname: z.string().min(1, "작성자 이름을 입력하여 주세요."),
  imgUrl: z.string().url("올바른 이미지 URL 형식이어야 합니다.").optional(),
  rating: z
    .number()
    .int("평점은 정수여야 합니다.")
    .min(1, "평점을 입력하여 주세요.")
    .max(5, "평점은 5점이 최대입니다."),
  content: z.string().min(1, "리뷰 내용을 입력하여 주세요."),
});

export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
