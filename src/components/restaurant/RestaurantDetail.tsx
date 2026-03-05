"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Review, Store } from "@/lib/types";

/** GET /api/together-posts?rid=... 응답 한 건 */
type TogetherPostItem = {
  id: number;
  rid: string;
  title: string;
  content: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  authorName?: string;
  maxParticipants?: number;
  storeName: string | null;
  storeCategory: string | null;
};

export function RestaurantDetail({ rid }: { rid: string }) {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [restaurant, setRestaurant] = useState<Store | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [togetherPosts, setTogetherPosts] = useState<TogetherPostItem[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
        setReviews([]);
      }
    };

    if (rid) {
      fetchReviews();
    }
  }, [rid]);

  useEffect(() => {
    const fetchTogetherPosts = async () => {
      try {
        const res = await fetch(
          `/api/together-posts?rid=${encodeURIComponent(rid)}&limit=10`,
          { method: "GET", cache: "no-store" },
        );
        if (!res.ok) {
          setTogetherPosts([]);
          return;
        }
        const json = await res.json();
        setTogetherPosts(Array.isArray(json.data) ? json.data : []);
      } catch {
        setTogetherPosts([]);
      }
    };
    if (rid) fetchTogetherPosts();
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
              {restaurant.category.split(",").map((tag) => {
                console.log("tag:", tag);
                return (
                  <>
                    <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full">
                      {tag.trim()}
                    </span>
                  </>
                );
              })}
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
              restaurant.menu!.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-gray-900">
                    {item.price ?? "-"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">메뉴 정보가 없습니다.</p>
            )}
          </div>
        </div>

        {/* Together Posts Preview */}
        {togetherPosts.length > 0 && (
          <div className="bg-white px-4 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-orange-600" />
                <h2 className="font-semibold text-gray-900">
                  같이먹기 모집 ({togetherPosts.length})
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {togetherPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 bg-orange-50 rounded-lg border border-orange-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-orange-700">
                      {post.isAnonymous ? "익명" : (post.authorName ?? "익명")}
                    </span>
                    <span className="text-xs text-orange-600">
                      {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                  <div className="flex items-center gap-2">
                    {post.storeCategory && (
                      <span className="px-2 py-0.5 bg-white text-xs text-orange-700 rounded-full">
                        {post.storeCategory}
                      </span>
                    )}
                    <span className="text-xs text-gray-600">
                      {post.maxParticipants ?? 0}명 모집
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              reviews.map((review) => (
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

                  <p className="text-sm text-gray-700 mb-2">{review.content}</p>

                  <span className="text-xs text-gray-400 mt-2 block">
                    {formatReviewDate(review.createdAt)}
                  </span>
                </div>
              ))
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
