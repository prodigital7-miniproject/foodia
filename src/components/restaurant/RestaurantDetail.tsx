"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Star, MapPin, Clock,
  MessageCircle, Users, ChevronDown, ChevronUp,
} from "lucide-react";
import { Store } from "@/lib/types";
import { Footer } from "../layout/Footer";

type StoreReview = {
  id: number; rid: string; nickname: string; imgUrl: string | null;
  rating: number; content: string; createdAt: string; updatedAt: string;
};

// 영업시간 문자열 파싱: "월: 11:00 - 21:00 화: 11:00 - 21:00 ..." → [{day, hours}]
function parseHours(summary: string): { day: string; hours: string }[] {
  const DAY_ORDER = ["월", "화", "수", "목", "금", "토", "일"];
  const result: { day: string; hours: string }[] = [];

  // "월: 11:00 - 21:00" 패턴으로 분리
  const regex = /([월화수목금토일])\s*:\s*([^월화수목금토일]+)/g;
  let match;
  while ((match = regex.exec(summary)) !== null) {
    result.push({
      day: match[1],
      hours: match[2].trim().replace(/\s+/g, " "),
    });
  }

  // 파싱 실패 시 원본 그대로
  if (result.length === 0) {
    return [{ day: "", hours: summary }];
  }

  // 요일 순서대로 정렬
  return result.sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
}

export function RestaurantDetail({ rid }: { rid: string }) {
  const router = useRouter();
  const [restaurant, setRestaurant]= useState<Store | null>(null);
  const [reviews, setReviews]= useState<StoreReview[]>([]);
  const [reviewVisibleCount, setReviewVisibleCount]= useState(10);
  const reviewSentinelRef= useRef<HTMLDivElement>(null);
  const reviewsLengthRef= useRef(0);
  const [togetherPostCount, setTogetherPostCount]= useState(0);
  const [loading, setLoading]= useState(true);
  const [menuExpanded, setMenuExpanded]= useState(false);
  const [hoursExpanded, setHoursExpanded] = useState(false);
  const TODAY = ["일", "월", "화", "수", "목", "금", "토"][new Date().getDay()];

  const REVIEW_INITIAL_VISIBLE = 10;
  const REVIEW_LOAD_MORE       = 10;
  reviewsLengthRef.current     = reviews.length;

  useEffect(() => { setMenuExpanded(false); }, [rid]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`/api/restaurants/${rid}`, { cache: "no-store" });
        const json = await res.json();
        setRestaurant(res.ok ? json.data : null);
      } catch { setRestaurant(null); }
      finally  { setLoading(false); }
    };
    if (rid) fetchStore();
  }, [rid]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res  = await fetch(`/api/review?rid=${rid}`, { cache: "no-store" });
        const json = await res.json();
        setReviews(res.ok && Array.isArray(json.data) ? json.data : []);
        setReviewVisibleCount(REVIEW_INITIAL_VISIBLE);
      } catch { setReviews([]); }
    };
    if (rid) fetchReviews();
  }, [rid]);

  useLayoutEffect(() => {
    const sentinel = reviewSentinelRef.current;
    if (!sentinel || reviews.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      const total = reviewsLengthRef.current;
      setReviewVisibleCount(prev => Math.min(prev + REVIEW_LOAD_MORE, total));
    }, { rootMargin: "400px 0px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [reviews.length]);

  useEffect(() => {
    const fetchTogetherPostCount = async () => {
      try {
        const res  = await fetch(`/api/together-posts?rid=${encodeURIComponent(rid)}&limit=100`, { cache: "no-store" });
        const json = await res.json();
        setTogetherPostCount(Array.isArray(json.data) ? json.data.length : 0);
      } catch { setTogetherPostCount(0); }
    };
    if (rid) fetchTogetherPostCount();
  }, [rid]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return Number((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1));
  }, [reviews]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString("ko-KR");
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
      <p className="text-gray-500 font-medium">맛집을 찾을 수 없습니다</p>
      <button onClick={() => router.back()} className="text-sm text-orange-500 font-semibold">← 돌아가기</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base font-bold text-gray-900 truncate">
            상세 정보
          </h1>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 pt-4">

        {/* ── 기본 정보 카드 ── */}
        <div className="bg-white rounded-2xl px-5 pt-5 pb-6 mb-3 shadow-sm border border-gray-100">

          {/* 썸네일 + 기본 정보 나란히 */}
          <div className="flex gap-4 mb-5">
            <div className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={restaurant.imgUrl || "/images/default-restaurant.jpg"}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-gray-900 mb-2 tracking-tight leading-snug">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap gap-1 mb-2">
                {restaurant.category.split(",").map(t => t.trim()).filter(Boolean).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-500 text-[11px] font-semibold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full">
                  <Star size={12} className="fill-orange-400 text-orange-400" />
                  <span className="text-xs font-bold text-gray-900">{averageRating}</span>
                  <span className="text-[11px] text-gray-400">({reviews.length})</span>
                </div>
                {restaurant.priceRange && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-semibold rounded-full">
                    {restaurant.priceRange}
                  </span>
                )}
              </div>
            </div>
          </div>

         {/* 주소 / 영업시간 */}
<div className="space-y-2 mb-5">
  <div className="flex items-start gap-2">
    <MapPin size={15} className="text-orange-400 mt-0.5 shrink-0" />
    <span className="text-sm text-gray-600 leading-relaxed">{restaurant.address}</span>
  </div>

  {/* 영업시간 토글 */}
  <button
  onClick={() => setHoursExpanded(v => !v)}
  className="w-full flex items-center justify-between gap-2 text-left group"
>
  <div className="flex items-center gap-2 flex-1 min-w-0">
    <Clock size={15} className="text-orange-400 shrink-0" />
    {hoursExpanded ? (
      <span className="text-sm text-gray-600">영업시간</span>
    ) : (
      <span className="text-sm text-gray-600 truncate">
        {(() => {
          if (!restaurant.hoursSummary) return "영업시간 정보 없음";
          const parsed = parseHours(restaurant.hoursSummary);
          const todayHours = parsed.find(h => h.day === TODAY);
          return todayHours
            ? `오늘(${TODAY}) ${todayHours.hours}`
            : restaurant.hoursSummary;
        })()}
      </span>
    )}
  </div>
  {restaurant.hoursSummary && (
    hoursExpanded
      ? <ChevronUp size={14} className="text-gray-400 shrink-0" />
      : <ChevronDown size={14} className="text-gray-400 shrink-0" />
  )}
</button>

  {/* 펼쳐지는 요일별 시간표 */}
  {hoursExpanded && restaurant.hoursSummary && (
    <div className="ml-5 bg-gray-50 rounded-xl p-3 space-y-1.5">
      {parseHours(restaurant.hoursSummary).map(({ day, hours }, i) => (
        <div key={i} className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-700 w-5 shrink-0">{day}</span>
          <span className="text-gray-500 flex-1 ml-3">
            {hours === "-" ? <span className="text-gray-300">휴무</span> : hours}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            <Link
              href={`/together/write/${restaurant.rid}`}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all"
            >
              <MessageCircle size={16} />
              같이먹기 모집
            </Link>
            <Link
              href={`/review/write/${restaurant.rid}`}
              className="flex-1 py-3 bg-orange-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-200"
            >
              <Star size={16} />
              리뷰 작성
            </Link>
          </div>
        </div>

        {/* ── 특징 태그 ── */}
        {(restaurant.featureTags ?? []).length > 0 && (
          <div className="bg-white rounded-2xl px-5 py-4 mb-3 shadow-sm border border-gray-100">
            <div className="flex gap-2 flex-wrap">
              {restaurant.featureTags!.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── 대표 메뉴 ── */}
        <div className="bg-white rounded-2xl px-5 py-5 mb-3 shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-900 mb-3">대표 메뉴</h2>
          {(restaurant.menu ?? []).length > 0 ? (
            <>
              <div className="space-y-2.5">
                {(menuExpanded ? restaurant.menu! : restaurant.menu!.slice(0, 3)).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.price ?? "-"}</span>
                  </div>
                ))}
              </div>
              {restaurant.menu!.length > 3 && (
                <button
                  onClick={() => setMenuExpanded(v => !v)}
                  className="mt-3 w-full py-2.5 flex items-center justify-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  {menuExpanded
                    ? <><ChevronUp size={14} />접기</>
                    : <><ChevronDown size={14} />메뉴 더보기 ({restaurant.menu!.length - 3}개)</>
                  }
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400">메뉴 정보가 없습니다.</p>
          )}
        </div>

        {/* ── 같이먹기 배너 ── */}
        <div className="bg-white rounded-2xl px-5 py-4 mb-3 shadow-sm border border-gray-100">
          <button
            onClick={() => router.push(`/together/${encodeURIComponent(restaurant.rid)}`)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 hover:from-orange-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                <Users size={16} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">같이먹기 모집</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {togetherPostCount > 0
                    ? `${togetherPostCount}개의 모집글이 있어요`
                    : "첫 번째 모집글을 작성해보세요!"}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-500 shrink-0">전체 보기 →</span>
          </button>
        </div>

        {/* ── 리뷰 ── */}
        <div className="bg-white rounded-2xl px-5 py-5 mb-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">리뷰 ({reviews.length})</h2>
            <Link
              href={`/review/write/${restaurant.rid}`}
              className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors"
            >
              리뷰 작성
            </Link>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, reviewVisibleCount).map(review => (
                <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-orange-500">
                          {review.nickname.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{review.nickname}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full">
                      <Star size={11} className="fill-orange-400 text-orange-400" />
                      <span className="text-xs font-bold text-gray-700">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-1.5">{review.content}</p>
                  <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                </div>
              ))}
              {reviewVisibleCount < reviews.length && (
                <>
                  <div ref={reviewSentinelRef} className="min-h-[120px]" aria-hidden />
                  <button
                    onClick={() => setReviewVisibleCount(prev => Math.min(prev + REVIEW_LOAD_MORE, reviews.length))}
                    className="w-full py-3 text-sm font-semibold text-orange-500 border border-orange-200 rounded-2xl hover:bg-orange-50 transition-colors"
                  >
                    리뷰 더보기 ({reviews.length - reviewVisibleCount}개 남음)
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">✍️</p>
              <p className="text-sm text-gray-400">아직 작성된 리뷰가 없어요</p>
              <p className="text-xs text-gray-300 mt-1">첫 번째 리뷰를 남겨보세요!</p>
            </div>
          )}
        </div>

      </div>
      <Footer/>
    </div>
  );
}