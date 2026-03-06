"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Plus } from "lucide-react";
import type { Store } from "@/lib/types";

type TogetherPostItem = {
  id: number;
  rid: string;
  title: string;
  content: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  authorName?: string;
  maxParticipants: number;
  storeName: string | null;
  storeCategory: string | null;
  participantCount: number;
  participants?: string[];
};

export function TogetherBoard() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Store | null>(null);
  const [posts, setPosts] = useState<TogetherPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [participatedPostIds, setParticipatedPostIds] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    const fetchAll = async () => {
      if (!restaurantId) return;
      setLoading(true);
      try {
        const [storeRes, postsRes] = await Promise.all([
          fetch(`/api/restaurants/${restaurantId}`, { cache: "no-store" }),
          fetch(
            `/api/together-posts?rid=${encodeURIComponent(
              restaurantId,
            )}&limit=20`,
            { cache: "no-store" },
          ),
        ]);

        if (storeRes.ok) {
          const storeJson = await storeRes.json();
          setRestaurant(storeJson.data ?? null);
        } else {
          setRestaurant(null);
        }

        if (postsRes.ok) {
          const postsJson = await postsRes.json();
          setPosts(Array.isArray(postsJson.data) ? postsJson.data : []);
        } else {
          setPosts([]);
        }
      } catch {
        setRestaurant(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [restaurantId]);

  useEffect(() => {
    // 로컬 스토리지에 저장된 참여 여부를 기반으로 초기 상태 설정
    const next = new Set<number>();
    for (const post of posts) {
      if (
        typeof window !== "undefined" &&
        window.localStorage.getItem(`together_participated_${post.id}`) ===
          "true"
      ) {
        next.add(post.id);
      }
    }
    setParticipatedPostIds(next);
  }, [posts]);

  const handleOpenParticipate = (postId: number, status: string) => {
    if (status !== "open") {
      alert("이미 마감된 모집글입니다.");
      return;
    }
    if (participatedPostIds.has(postId)) {
      alert("이미 참여한 모집글입니다.");
      return;
    }
    setActivePostId(postId);
    setNickname("");
    setError(null);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setActivePostId(null);
    setNickname("");
    setError(null);
  };

  const handleConfirmParticipate = async () => {
    if (activePostId === null) return;
    if (!nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/together-posts/${activePostId}/participate`, {
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

      const nextCount: number | undefined = json.data?.participantCount;

      setPosts((prev) =>
        prev.map((post) =>
          post.id === activePostId
            ? {
                ...post,
                participants: [
                  ...(post.participants ?? []),
                  nickname.trim(),
                ],
                participantCount:
                  typeof nextCount === "number"
                    ? nextCount
                    : post.participantCount + 1,
              }
            : post,
        ),
      );

      setParticipatedPostIds((prev) => {
        const next = new Set(prev);
        next.add(activePostId);
        return next;
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          `together_participated_${activePostId}`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">식당 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-orange-600" />
                <h1 className="font-semibold text-gray-900">같이먹기 모집</h1>
              </div>
              <p className="text-sm text-gray-600">{restaurant.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <Link
          href={`/restaurant/${restaurantId}`}
          className="bg-white rounded-lg p-4 mb-6 border border-gray-200 flex gap-3 hover:border-orange-300 hover:bg-orange-50/30 transition-colors cursor-pointer"
        >
          <img
            src={restaurant.imgUrl || "/images/default-restaurant.jpg"}
            alt={restaurant.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-1">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{restaurant.category}</p>
            <p className="text-xs text-gray-500 truncate">{restaurant.address}</p>
          </div>
        </Link>

        {/* Post Count */}
        <p className="text-sm text-gray-600 mb-4">
          {posts.length}개의 모집글이 있어요
        </p>

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-3 mb-6">
            {posts.map((post) => {
              const hasParticipated = participatedPostIds.has(post.id);
              const isClosed = post.status !== "open";
              const isFull = post.participantCount >= post.maxParticipants;
              const disabled = hasParticipated || isClosed || isFull;

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {post.isAnonymous ? "익명" : post.authorName ?? "익명"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      {isClosed ? "마감" : "모집 중"}
                    </span>
                  </div>

                  <p className="text-gray-900 mb-3 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                    {post.storeCategory && (
                      <span className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full">
                        {post.storeCategory}
                      </span>
                    )}
                    <span>
                      {post.participantCount}명 참여 / {post.maxParticipants}명 모집
                    </span>
                  </div>

                {post.participants && post.participants.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {post.participants.map((name, index) => (
                      <li
                        key={`${post.id}-${name}-${index}`}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="font-medium">{name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                  <button
                    type="button"
                    onClick={() => handleOpenParticipate(post.id, post.status)}
                    disabled={disabled}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                      hasParticipated
                        ? "bg-emerald-500 text-white cursor-default"
                        : isClosed
                        ? "bg-gray-300 text-white cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    <span aria-hidden>💬</span>
                    {hasParticipated
                      ? "참여완료"
                      : isFull
                      ? "정원마감"
                      : "참여하기"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 mb-6">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">아직 모집글이 없습니다</p>
            <p className="text-sm text-gray-400">
              첫 번째 모집글을 작성해보세요!
            </p>
          </div>
        )}
      </div>

      {activePostId !== null && (
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

      {/* Floating Write Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Link
          href={`/together/write/${restaurantId}`}
          className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={24} />
        </Link>
      </div>

    </div>
  );
}
