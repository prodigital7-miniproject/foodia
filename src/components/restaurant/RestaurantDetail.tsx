"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Clock, Bookmark, MessageCircle, Users } from "lucide-react";
import { mockTogetherPosts } from "@/lib/data/mockData";
import type { Restaurant } from "@/lib/types";
import { BottomNav } from "@/components/layout/BottomNav";

export function RestaurantDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/places/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) return res.json().then((b) => Promise.reject(b?.error || res.statusText));
        return res.json();
      })
      .then((data: Restaurant) => setRestaurant(data))
      .catch((err) => setError(typeof err === "string" ? err : err?.message || "정보를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  const togetherPosts = mockTogetherPosts.filter((p) => p.restaurantId === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{error || "맛집을 찾을 수 없습니다"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Image */}
      <div className="relative">
        <img
          src={restaurant.imageUrl}
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
            className={isBookmarked ? "fill-orange-600 text-orange-600" : "text-gray-700"}
          />
        </button>
      </div>

      <div className="max-w-md mx-auto">
        {/* Basic Info */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full">
                {restaurant.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star size={18} className="fill-orange-400 text-orange-400" />
              <span className="font-semibold text-gray-900">{restaurant.rating}</span>
              <span className="text-sm text-gray-500">({restaurant.reviewCount}개 리뷰)</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{restaurant.hours}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {restaurant.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
              {restaurant.priceRange}
            </span>
          </div>
        </div>

        {/* Menu - Google Places API는 메뉴 목록을 제공하지 않음 */}
        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">대표 메뉴</h2>
          {restaurant.menuItems.length > 0 ? (
            <div className="space-y-3">
              {restaurant.menuItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-gray-900">{item.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">메뉴 정보는 Google에서 제공하지 않아요. 리뷰에서 확인해보세요.</p>
          )}
        </div>

        {/* Together Posts Preview */}
        {togetherPosts.length > 0 && (
          <div className="bg-white px-4 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-orange-600" />
                <h2 className="font-semibold text-gray-900">같이먹기 모집</h2>
              </div>
              <Link
                href={`/together/${restaurant.id}`}
                className="text-sm text-orange-600 font-medium"
              >
                전체보기
              </Link>
            </div>
            <div className="space-y-3">
              {togetherPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-orange-700">{post.author}</span>
                    <span className="text-xs text-orange-600">{post.timeTag}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white text-xs text-orange-700 rounded-full">
                      {post.situationTag}
                    </span>
                    <span className="text-xs text-gray-600">
                      {post.peopleCount}명 모집
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews - 우리 서비스 사용자 리뷰만 표시 */}
        <div className="bg-white px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">리뷰 ({restaurant.reviews.length})</h2>
            <Link
              href={`/review/write/${restaurant.id}`}
              className="text-sm text-orange-600 font-medium"
            >
              리뷰 작성
            </Link>
          </div>
          <div className="space-y-4">
            {restaurant.reviews.length === 0 ? (
              <p className="text-sm text-gray-500">아직 리뷰가 없어요. 첫 리뷰를 작성해보세요!</p>
            ) : (
              restaurant.reviews.map((review) => (
              <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{review.author}</span>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-orange-400 text-orange-400" />
                    <span className="text-sm text-gray-700">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{review.content}</p>
                <div className="flex gap-2">
                  {review.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-400 mt-2 block">{review.date}</span>
              </div>
            ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-md mx-auto flex gap-3">
          <Link
            href={`/together/${restaurant.id}`}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <MessageCircle size={18} />
            같이먹기
          </Link>
          <Link
            href={`/review/write/${restaurant.id}`}
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
