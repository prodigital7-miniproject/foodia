import { z } from "zod";

export const createStoreSchema = z.object({
  rid: z
    .string()
    .min(1, "가게의 rid를 입력하여 주세요.")
    .max(255, "rid는 255자 이하여야 합니다."),
  name: z
    .string()
    .min(1, "가게 이름을 입력하여 주세요.")
    .max(30, "가게 이름은 30자 이하여야 합니다."),
  category: z
    .string()
    .min(1, "카테고리를 입력하여 주세요.")
    .max(30, "카테고리는 30자 이하여야 합니다."),
  address: z
    .string()
    .min(1, "주소를 입력하여 주세요.")
    .max(255, "주소는 255자 이하여야 합니다."),
  distance: z
    .number()
    .int("거리는 정수여야 합니다.")
    .min(0, "거리는 0 이상이어야 합니다.")
    .max(100000, "거리는 100000 이하이어야 합니다.")
    .optional(),
  priceRange: z
    .string()
    .min(1, "가격대를 입력하여 주세요.")
    .max(30, "가격대는 30자 이하여야 합니다.")
    .optional(),
  imgUrl: z
    .url("올바른 이미지 URL 형식이어야 합니다.")
    .max(255, "이미지 URL은 255자 이하여야 합니다.")
    .optional(),
  description: z
    .string()
    .min(1, "설명을 입력하여 주세요.")
    .max(255, "설명은 255자 이하여야 합니다.")
    .optional(),
});

export type CreateStoreSchema = z.infer<typeof createStoreSchema>;
