"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Plus } from "lucide-react";
import type { Store } from "@/lib/types";
import { Footer } from "../layout/Footer";

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
  const [participatedPostIds, setParticipatedPostIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      if (!restaurantId) return;
      setLoading(true);
      try {
        const [storeRes, postsRes] = await Promise.all([
          fetch(`/api/restaurants/${restaurantId}`, { cache: "no-store" }),
          fetch(`/api/together-posts?rid=${encodeURIComponent(restaurantId)}&limit=20`, { cache: "no-store" }),
        ]);
        if (storeRes.ok) {
          const j = await storeRes.json();
          setRestaurant(j.data ?? null);
        } else setRestaurant(null);
        if (postsRes.ok) {
          const j = await postsRes.json();
          setPosts(Array.isArray(j.data) ? j.data : []);
        } else setPosts([]);
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
    const next = new Set<number>();
    for (const post of posts) {
      if (typeof window !== "undefined" &&
        window.localStorage.getItem(`together_participated_${post.id}`) === "true") {
        next.add(post.id);
      }
    }
    setParticipatedPostIds(next);
  }, [posts]);

  const handleOpenParticipate = (postId: number, status: string) => {
    if (status !== "open") { alert("이미 마감된 모집글입니다."); return; }
    if (participatedPostIds.has(postId)) { alert("이미 참여한 모집글입니다."); return; }
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
    if (!nickname.trim()) { setError("닉네임을 입력해 주세요."); return; }
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch(`/api/together-posts/${activePostId}/participate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        setError(json?.error?.message ?? "참여에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      const nextCount: number | undefined = json.data?.participantCount;
      setPosts(prev => prev.map(post =>
        post.id === activePostId
          ? { ...post, participants: [...(post.participants ?? []), nickname.trim()],
              participantCount: typeof nextCount === "number" ? nextCount : post.participantCount + 1 }
          : post
      ));
      setParticipatedPostIds(prev => { const s = new Set(prev); s.add(activePostId); return s; });
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`together_participated_${activePostId}`, "true");
      }
      alert("참여가 완료되었습니다!");
      handleCloseModal();
    } catch {
      setError("참여에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <p className="text-2xl">🍽️</p>
      <p className="text-gray-500 font-medium">식당 정보를 찾을 수 없습니다</p>
      <button onClick={() => router.back()} className="text-sm text-orange-500 font-semibold">← 돌아가기</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> {/* 전체 높이 확보 */}

      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Users size={16} className="text-orange-500 shrink-0" />
            <h1 className="text-base font-bold text-gray-900 truncate">같이먹기 모집</h1>
            <span className="text-sm text-gray-400 truncate">· {restaurant.name}</span>
          </div>
        </div>
      </header>

      {/* ── 컨텐츠 영역 ── */}
      <div className="flex-grow"> {/* 이 부분이 남는 공간을 채워 푸터를 아래로 밉니다 */}
        <div className="max-w-screen-lg mx-auto px-4 pt-4 pb-28">

          {/* ── 식당 정보 카드 (클릭 시 이동 기능 포함) ── */}
          <Link
            href={`/restaurant/${restaurantId}`}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex gap-3 hover:border-orange-300 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
              <img
                src={restaurant.imgUrl || "/images/default-restaurant.jpg"}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm mb-0.5 truncate">{restaurant.name}</h3>
              <p className="text-xs text-gray-400 mb-1">{restaurant.category}</p>
              <p className="text-xs text-gray-400 truncate">{restaurant.address}</p>
            </div>
          </Link>

          {/* ── 모집글 개수 및 목록 ── */}
          <p className="text-xs font-semibold text-gray-400 mb-3">
            {posts.length}개의 모집글
          </p>
          {/* ── 모집글 목록 ── */}
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => {
                const hasParticipated = participatedPostIds.has(post.id);
                const isClosed = post.status !== "open";
                const isFull = post.participantCount >= post.maxParticipants;
                const disabled = hasParticipated || isClosed || isFull;

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                  >
                    {/* 상단: 작성자 + 상태 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-orange-500">
                            {(post.isAnonymous ? "익" : (post.authorName ?? "익"))[0]}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {post.isAnonymous ? "익명" : (post.authorName ?? "익명")}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                        isClosed
                          ? "bg-gray-100 text-gray-400"
                          : "bg-orange-50 text-orange-500"
                      }`}>
                        {isClosed ? "마감" : "모집 중"}
                      </span>
                    </div>

                    {/* 내용 */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {/* 참여 현황 */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full transition-all"
                          style={{ width: `${Math.min((post.participantCount / post.maxParticipants) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 shrink-0">
                        {post.participantCount} / {post.maxParticipants}명
                      </span>
                    </div>

                    {/* 참여자 목록 */}
                    {post.participants && post.participants.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.participants.map((name, i) => (
                          <span
                            key={`${post.id}-${name}-${i}`}
                            className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[11px] font-medium rounded-full"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            {name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 참여 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleOpenParticipate(post.id, post.status)}
                      disabled={disabled}
                      className={`w-full py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        hasParticipated
                          ? "bg-emerald-500 text-white cursor-default"
                          : isClosed || isFull
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200"
                      }`}
                    >
                      {hasParticipated ? "✅ 참여완료" : isFull ? "정원마감" : isClosed ? "마감된 모집" : "💬 참여하기"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-gray-600 font-semibold">아직 모집글이 없어요</p>
              <p className="text-sm text-gray-400 mt-1">첫 번째 모집글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>
      {/* ── 참여 모달 ── */}
      {activePostId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-screen-sm mx-auto bg-white rounded-3xl px-6 pt-5 pb-8 shadow-xl">
            <h2 className="text-base font-bold text-gray-900 mb-1">참여하기 👋</h2>
            <p className="text-xs text-gray-400 mb-5">모집글에 표시될 닉네임을 입력해 주세요.</p>

            <div className="mb-5">
              <div className={`flex items-center border-2 rounded-2xl px-4 py-3 transition-colors ${
                error ? "border-red-300" : "border-orange-300 focus-within:border-orange-400"
              }`}>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => { setNickname(e.target.value); if (error) setError(null); }}
                  maxLength={10}
                  placeholder="닉네임 입력 (최대 10자)"
                  className="flex-1 outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
                />
                <span className="text-[11px] text-gray-400 ml-2">{nickname.length}/10</span>
              </div>
              {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitting}
                className="flex-1 h-12 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmParticipate}
                disabled={!nickname.trim() || submitting}
                className={`flex-1 h-12 rounded-2xl text-sm font-bold text-white transition-all ${
                  !nickname.trim() || submitting
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-200"
                }`}
              >
                {submitting ? "참여 중..." : "참여 확정"}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ── 플로팅 작성 버튼 ── */}
      <div className="fixed bottom-24 right-5 z-40">
        <Link
          href={`/together/write/${restaurantId}`}
          className="w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all"
        >
          <Plus size={22} />
        </Link>
      </div>
      <Footer/>
    </div>
  );
}