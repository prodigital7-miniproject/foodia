"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";


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
  /** 참여자 닉네임 목록 */
  participants: string[];
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
    participants,
  } = data;
  const [participantCountState, setParticipantCountState] =
    useState(participantCount);
  const [participantsState, setParticipantsState] = useState<string[]>(
    participants ?? [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasParticipated, setHasParticipated] = useState(false);

  const posterLabel = isAnonymous ? "익명" : "익명";
  const mealChipLabel = status === "open" ? "모집 중" : "마감";
  const cuisineTag = storeCategory ?? "한식";

  const handleParticipate = () => {
    if (status !== "open" || hasParticipated) {
      alert("이미 마감된 모집글입니다.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setNickname("");
    setError(null);
  };

  const handleConfirmParticipate = async () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/together-posts/${id}/participate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      const json = await res.json();

      if (!res.ok || !json?.success) {
        const message =
          json?.error?.message ?? "참여에 실패했습니다. 잠시 후 다시 시도해 주세요.";
        setError(message);
        return;
      }

      const nextCount: number =
        typeof json.data?.participantCount === "number"
          ? json.data.participantCount
          : participantCountState + 1;

      setParticipantCountState(nextCount);
      setParticipantsState((prev) =>
        prev.includes(nickname.trim()) ? prev : [...prev, nickname.trim()],
      );
      setHasParticipated(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `together_participated_${id}`,
          "true",
        );
      }
      alert("참여가 완료되었습니다!");
      handleCloseModal();
    } catch {
      setError("참여에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
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
          {postCountAtStore}개의 모집글이 있어요
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
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                {participantCountState}
              </span>
              <span className="text-sm text-gray-500">
                {participantCountState === 0
                  ? "아직 참여자가 없어요"
                  : `${participantCountState}명 참여 중`}
              </span>
            </div>
            {participantsState.length > 0 && (
              <ul className="mt-1 space-y-1">
                {participantsState.map((name) => (
                  <li
                    key={name}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-medium">{name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={handleParticipate}
            disabled={hasParticipated || status !== "open"}
            className={`w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              hasParticipated
                ? "bg-emerald-500 cursor-default"
                : status !== "open"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            <span className="text-base" aria-hidden>
              💬
            </span>
            {hasParticipated ? "참여완료" : "참여하기"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-md mx-auto mb-16 bg-white rounded-t-3xl px-6 pt-5 pb-6 shadow-xl">
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              참여하기 👋
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              모집글에 표시될 닉네임을 입력해 주세요.
            </p>

            <div className="mb-4">
              <div
                className={`flex items-center justify-between border rounded-xl px-3 py-2 text-sm ${
                  error ? "border-red-400" : "border-orange-300"
                }`}
              >
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (error) setError(null);
                  }}
                  maxLength={10}
                  placeholder="닉네임 입력 (최대 10자)"
                  className="flex-1 outline-none text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
                <span className="ml-2 text-[11px] text-gray-400">
                  {nickname.length}/10
                </span>
              </div>
              {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 h-11 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-white"
                disabled={submitting}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmParticipate}
                className={`flex-1 h-11 rounded-full text-sm font-semibold text-white ${
                  !nickname.trim() || submitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
                disabled={!nickname.trim() || submitting}
              >
                참여 확정
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
