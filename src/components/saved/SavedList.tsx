"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { FilterChips } from "@/components/search/FilterChips";
import { SituationTag } from "@/lib/types";
import type { Restaurant } from "@/lib/types";
import { Footer } from "@/components/layout/Footer";

export function SavedList() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [selectedSituation, setSelectedSituation] = useState<SituationTag>("전체");
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);

  const situationTags: SituationTag[] = ["전체", "혼밥", "데이트", "친구모임"];

  // TODO: 저장한 맛집 API 연동 시 GET /api/... 호출로 savedRestaurants 설정
  const filteredSaved = savedRestaurants.filter((r) => {
    if (selectedSituation === "전체") return true;
    return r.tags.includes(selectedSituation);
  });


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-1">
            <Bookmark size={24} className="text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">저장한 맛집</h1>
          </div>
          <p className="text-sm text-gray-600">나중에 가고 싶은 맛집을 모아보세요</p>
        </div>
      </div>
      <div className="flex-grow">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Filters */}
        <div className="mb-6">
          <FilterChips
            options={situationTags}
            selected={selectedSituation}
            onChange={(value) => setSelectedSituation(value as SituationTag)}
          />
        </div>

        {/* Saved Count */}
        <p className="text-sm text-gray-600 mb-4">
          {filteredSaved.length}개의 맛집을 저장했어요
        </p>

        {/* Saved List */}
        {filteredSaved.length > 0 ? (
          <div className="space-y-4">
            {filteredSaved.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={{ ...restaurant, isBookmarked: true }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Bookmark size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">저장한 맛집이 없습니다</p>
            <p className="text-sm text-gray-400 text-center">
              맘에 드는 맛집을 저장하고<br />나중에 다시 찾아보세요
            </p>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}
