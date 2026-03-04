"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { mockRestaurants } from "@/lib/data/mockData";

const timeTags = ["지금", "오늘 점심", "오늘 저녁", "내일 점심", "내일 저녁"];
const situationTags = ["혼밥 탈출", "점심메이트", "저녁메이트", "카페", "친구모임"];

export function TogetherWrite() {
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSituation, setSelectedSituation] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [openChatLink, setOpenChatLink] = useState("");

  const restaurant = mockRestaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return null;
  }

  const handleSubmit = () => {
    if (!content.trim()) {
      alert("모집글 내용을 입력해주세요");
      return;
    }
    if (!selectedTime) {
      alert("희망 시간대를 선택해주세요");
      return;
    }
    if (!selectedSituation) {
      alert("상황 태그를 선택해주세요");
      return;
    }

    // Mock submit
    alert("같이먹기 글이 등록되었습니다!");
    router.push(`/together/${restaurantId}`);
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
            <h1 className="font-semibold text-gray-900">같이먹기 글 작성</h1>
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

        {/* Content */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">모집글 작성</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="같이 식사할 분을 모집하는 글을 작성해주세요&#10;예: 오늘 점심 같이 드실 분 구해요!"
            className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
            maxLength={200}
          />
          <div className="flex justify-end mt-2">
            <span className="text-sm text-gray-500">{content.length}/200</span>
          </div>
        </div>

        {/* Time Selection */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">희망 시간대</h2>
          <div className="flex flex-wrap gap-2">
            {timeTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTime(tag)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTime === tag
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Situation Tag */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">상황 태그</h2>
          <div className="flex flex-wrap gap-2">
            {situationTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedSituation(tag)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSituation === tag
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* People Count */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-3">모집 인원</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              -
            </button>
            <span className="text-xl font-semibold text-gray-900 w-12 text-center">
              {peopleCount}명
            </span>
            <button
              onClick={() => setPeopleCount(Math.min(10, peopleCount + 1))}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Open Chat Link (Optional) */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">
            오픈채팅 링크 <span className="text-sm text-gray-500">(선택사항)</span>
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            카카오톡 오픈채팅 링크를 입력하면 참여자가 바로 연락할 수 있어요
          </p>
          <input
            type="url"
            value={openChatLink}
            onChange={(e) => setOpenChatLink(e.target.value)}
            placeholder="https://open.kakao.com/..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors"
        >
          모집글 등록하기
        </button>
      </div>
    </div>
  );
}
