"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Bookmark,
  MessageCircle,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Store } from "@/lib/types";

type StoreReview = {
  id: number;
  rid: string;
  nickname: string;
  imgUrl: string | null;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export function RestaurantDetail({ rid }: { rid: string }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [restaurant, setRestaurant] = useState<Store | null>(null);
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [reviewVisibleCount, setReviewVisibleCount] = useState(10);
  const reviewSentinelRef = useRef<HTMLDivElement>(null);
  const reviewsLengthRef = useRef(0);
  const [togetherPostCount, setTogetherPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuExpanded, setMenuExpanded] = useState(false);

  const REVIEW_INITIAL_VISIBLE = 10;
  const REVIEW_LOAD_MORE = 10;

  reviewsLengthRef.current = reviews.length;

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/store/${rid}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          setRestaurant(null);
          return;
        }

        const json = await res.json();
        setRestaurant(json.data);
      } catch (error) {
        console.error("가게 조회 실패:", error);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    if (rid) fetchStore();
  }, [rid]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/review?rid=${rid}`, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          setReviews([]);
          return;
        }
        const json = await res.json();
        setReviews(Array.isArray(json.data) ? json.data : []);
        setReviewVisibleCount(REVIEW_INITIAL_VISIBLE);
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
        setReviews([]);
      }
    };
    if (rid) fetchReviews();
  }, [rid]);

  useLayoutEffect(() => {
    const sentinel = reviewSentinelRef.current;
    if (!sentinel || reviews.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        const total = reviewsLengthRef.current;
        setReviewVisibleCount((prev) => {
          const next = Math.min(prev + REVIEW_LOAD_MORE, total);
          return next >= total ? total : next;
        });
      },
      { root: null, rootMargin: "400px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [reviews.length]);

  useEffect(() => {
    const fetchTogetherPostCount = async () => {
      try {
        const res = await fetch(
          `/api/together-posts?rid=${encodeURIComponent(rid)}&limit=100`,
          { method: "GET", cache: "no-store" },
        );
        if (!res.ok) {
          setTogetherPostCount(0);
          return;
        }
        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        // API가 전체 개수는 주지 않으므로 현재는 배열 길이를 사용
        setTogetherPostCount(data.length);
      } catch {
        setTogetherPostCount(0);
      }
    };
    if (rid) fetchTogetherPostCount();
  }, [rid]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  const formatReviewDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("ko-KR");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">맛집을 찾을 수 없습니다</p>
      </div>
    );
  }
  console.log(restaurant);
  console.log("img: ", restaurant.imgUrl);
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Image */}
      <div className="relative">
        <img
          src={restaurant.imgUrl || "/images/default-restaurant.jpg"}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md"
        >
          <Bookmark
            size={20}
            className={
              isBookmarked ? "fill-orange-600 text-orange-600" : "text-gray-700"
            }
          />
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {/* Basic Info */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              {restaurant.category
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star size={18} className="fill-orange-400 text-orange-400" />
              <span className="font-semibold text-gray-900">
                {averageRating}
              </span>
              <span className="text-sm text-gray-500">
                ({reviews.length}개 리뷰)
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin
                size={16}
                className="text-gray-400 mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">
                {restaurant.hoursSummary || "영업시간 정보 없음"}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {(restaurant.featureTags ?? []).map(
              (tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ),
            )}
            {restaurant.priceRange && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                {restaurant.priceRange}
              </span>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">대표 메뉴</h2>
          <div className="space-y-3">
            {(restaurant.menu ?? []).length > 0 ? (
              <>
                {(menuExpanded
                  ? restaurant.menu!
                  : restaurant.menu!.slice(0, 3)
                ).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium text-gray-900">
                      {item.price ?? "-"}
                    </span>
                  </div>
                ))}
                {(restaurant.menu ?? []).length > 3 && (
                  <button
                    type="button"
                    onClick={() => setMenuExpanded((prev) => !prev)}
                    className="w-full py-2 flex items-center justify-center gap-1 text-sm text-orange-600 font-medium hover:text-orange-700"
                  >
                    {menuExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        접기
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        메뉴 더보기 (
                        {(restaurant.menu ?? []).length - 3}개)
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">메뉴 정보가 없습니다.</p>
            )}
          </div>
        </div>

        {/* Together Posts Summary & Link */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <button
            type="button"
            onClick={() => router.push(`/together/${encodeURIComponent(restaurant.rid)}`)}
            className="w-full flex items-center justify-between px-3 py-3 rounded-xl border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users size={20} className="text-orange-600" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900 cursor-pointer">
                  같이먹기 모집
                </span>
                <span className="text-xs text-gray-600">
                  {togetherPostCount > 0
                    ? `${togetherPostCount}개의 모집글이 있어요`
                    : "아직 모집글이 없습니다. 첫 번째 모집글을 작성해보세요!"}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-orange-600 cursor-pointer">
              전체 보기
            </span>
          </button>
        </div>

        <div className="bg-white px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              리뷰({reviews.length})
            </h2>
            <Link
              href={`/review/write/${restaurant.rid}`}
              className="text-sm text-orange-600 font-medium"
            >
              리뷰 작성
            </Link>
          </div>

          <div className="space-y-4">
            {reviews.length > 0 ? (
              <>
                {reviews
                  .slice(0, reviewVisibleCount)
                  .map((review) => (
                    <div
                      key={review.id}
                      className="pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {review.nickname}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="fill-orange-400 text-orange-400"
                          />
                          <span className="text-sm text-gray-700">
                            {review.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">
                        {review.content}
                      </p>

                      <span className="text-xs text-gray-400 mt-2 block">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                  ))}
                {reviewVisibleCount < reviews.length && (
                  <>
                    <div
                      ref={reviewSentinelRef}
                      className="min-h-[120px] w-full"
                      aria-hidden
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setReviewVisibleCount((prev) =>
                          Math.min(
                            prev + REVIEW_LOAD_MORE,
                            reviews.length,
                          ),
                        )
                      }
                      className="w-full py-3 text-sm text-orange-600 font-medium border border-orange-200 rounded-lg hover:bg-orange-50"
                    >
                      리뷰 더보기 (
                      {reviews.length - reviewVisibleCount}개 남음)
                    </button>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                아직 작성된 리뷰가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-md mx-auto flex gap-3">
          <Link
            href={`/together/write/${restaurant.rid}`}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <MessageCircle size={18} />
            같이먹기 모집
          </Link>
          <Link
            href={`/review/write/${restaurant.rid}`}
            className="flex-1 py-3 bg-orange-600 text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
          >
            <Star size={18} />
            리뷰 작성
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
