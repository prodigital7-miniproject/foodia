"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { mockRestaurants } from "@/lib/data/mockData";
import { Review, Store } from "@/lib/types";

const reviewTags = [
  "가성비",
  "분위기좋음",
  "조용함",
  "양많음",
  "맛있음",
  "친절함",
  "깔끔함",
  "재방문의사",
];

export function ReviewWrite({ rid }: { rid: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [restaurant, setRestaurant] = useState<Store | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("익명");
  const [img_url, setImgUrl] = useState("");
  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/restaurants/${rid}`, {
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

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("별점을 선택해주세요");
      return;
    }
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요");
      return;
    }
    const normalizedNickname = nickname.trim() || "익명";
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rid,
          rating,
          content,
          img_url,
          nickname: normalizedNickname,
        }),
      });
      if (!res.ok) {
        throw new Error(`리뷰 등록 실패: ${res.status}`);
      }
      alert("리뷰가 등록되었습니다!");
      router.push(`/restaurant/${rid}`);
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다.");
    }
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
        <p className="text-gray-500">가게 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-900">리뷰 작성</h1>
            <p className="text-sm text-gray-600">{restaurant.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex gap-3">
            <img
              src={restaurant.imgUrl || "/lib/data/no-image.jpg"}
              alt={restaurant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.category}</p>
            </div>
          </div>
        </div>

        {/* 닉네임 */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">닉네임</h2>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            maxLength={20}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-500">
              {nickname.trim() ? "" : "미입력 시 익명으로 등록됩니다"}
            </span>
            <span className="text-sm text-gray-500">{nickname.length}/20</span>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4 text-center">
            별점을 선택해주세요
          </h2>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={40}
                  className={
                    star <= (hoverRating || rating)
                      ? "fill-orange-400 text-orange-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            {rating > 0 ? `${rating}점` : "별점을 선택하세요"}
          </p>
        </div>

        {/* Review Content */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">
            리뷰를 작성해주세요
          </h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="이 식당에 대한 솔직한 리뷰를 남겨주세요&#10;(최소 10자 이상)"
            className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
            maxLength={500}
          />
          <div className="flex justify-end mt-2">
            <span className="text-sm text-gray-500">{content.length}/500</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors"
        >
          리뷰 등록하기
        </button>
      </div>
    </div>
  );
}
