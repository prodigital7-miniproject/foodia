import { z } from "zod";

export const createStoreSchema = z.object({
  googlePlaceId: z.string().min(1, "Google Place ID를 입력하여 주세요."),
  name: z.string().min(1, "가게 이름을 입력하여 주세요."),
  category: z.string().min(1, "카테고리를 입력하여 주세요."),
  address: z.string().min(1, "주소를 입력하여 주세요."),
  distance: z
    .number()
    .int("거리는 정수여야 합니다.")
    .min(0, "거리는 0 이상이어야 합니다.")
    .optional(),
  priceRange: z.string().min(1, "가격대를 입력하여 주세요.").optional(),
  imgUrl: z.string().url("올바른 이미지 URL 형식이어야 합니다.").optional(),
  description: z.string().min(1, "설명을 입력하여 주세요.").optional(),
});

export type CreateStoreSchema = z.infer<typeof createStoreSchema>;
