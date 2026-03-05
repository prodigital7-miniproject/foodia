"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

export type TogetherPostDetailData = {
  id: number;
  rid: string;
  title: string;
  content: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  storeName: string;
  storeCategory: string | null;
  storeAddress: string;
  participantCount: number;
  /** 해당 식당(rid)의 모집글 개수 */
  postCountAtStore: number;
};

type TogetherPostDetailProps = {
  data: TogetherPostDetailData;
};

export function TogetherPostDetail({ data }: TogetherPostDetailProps) {
  const router = useRouter();
  const {
    storeName,
    storeCategory,
    storeAddress,
    content,
    createdAt,
    isAnonymous,
    status,
    participantCount,
    postCountAtStore,
    id,
  } = data;

  const posterLabel = isAnonymous ? "익명" : "익명";
  const mealChipLabel = status === "open" ? "모집 중" : "마감";
  const cuisineTag = storeCategory ?? "한식";

  const handleParticipate = () => {
    // TODO: POST /api/together-posts/[postId]/participate 연동
    alert("참여하기 기능은 준비 중입니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 상단 네비게이션 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
              aria-label="뒤로 가기"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-900 text-base">같이먹기 모집</h1>
              <p className="text-sm text-gray-500 truncate">{storeName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 식당 정보 카드 */}
        <div className="bg-white rounded-2xl p-4 mb-5 border border-gray-100 shadow-sm flex gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-2xl">
            🍚
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg mb-1">{storeName}</h2>
            <p className="text-sm text-gray-500 mb-1">{cuisineTag}</p>
            <p className="text-xs text-gray-400">{storeAddress}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          1개의 모집글이 있어요
        </p>

        {/* 모집글 카드 */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {posterLabel} A
              </span>
              <span className="text-xs text-gray-400">
                {format(new Date(createdAt), "yyyy-MM-dd")}
              </span>
            </div>
            <span className="flex-shrink-0 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              {mealChipLabel}
            </span>
          </div>

          <p className="text-gray-800 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
            {content}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full">
              {cuisineTag}
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
              모집 중
            </span>
          </div>

          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 mb-1">참여자</p>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                {participantCount}
              </span>
              <span className="text-sm text-gray-500">
                {participantCount === 0
                  ? "아직 참여자가 없어요"
                  : `${participantCount}명 참여 중`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleParticipate}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="text-base" aria-hidden>
              💬
            </span>
            같이먹기
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
