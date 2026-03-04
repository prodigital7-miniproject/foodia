"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { mockRestaurants } from "@/lib/data/mockData";

const reviewTags = [
  "가성비",
  "분위기좋음",
  "조용함",
  "양많음",
  "맛있음",
  "친절함",
  "깔끔함",
  "재방문의사"
];

export function ReviewWrite() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    return null;
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("별점을 선택해주세요");
      return;
    }
    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요");
      return;
    }

    // Mock submit
    alert("리뷰가 등록되었습니다!");
    router.push(`/restaurant/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
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
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.category}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4 text-center">별점을 선택해주세요</h2>
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
          <h2 className="font-semibold text-gray-900 mb-3">리뷰를 작성해주세요</h2>
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

        {/* Tags */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">태그를 선택해주세요</h2>
          <p className="text-sm text-gray-600 mb-3">식당의 특징을 나타내는 태그를 선택하세요</p>
          <div className="flex flex-wrap gap-2">
            {reviewTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
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
