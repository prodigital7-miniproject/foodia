"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterChips } from "@/components/search/FilterChips";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { mockRestaurants } from "@/lib/data/mockData";
import { FoodCategory, PriceRange, SituationTag, SortOption } from "@/lib/types";

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const locationParam = searchParams.get("location") || "성수역";
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState(locationParam);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>(
    (categoryParam as FoodCategory) || "전체"
  );
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>("전체");
  const [selectedSituation, setSelectedSituation] = useState<SituationTag>("전체");
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const foodCategories: FoodCategory[] = ["전체", "한식", "중식", "일식", "양식", "카페"];
  const priceRanges: PriceRange[] = ["전체", "1만원 이하", "1-2만원", "2만원 이상"];
  const situationTags: SituationTag[] = ["전체", "혼밥", "데이트", "친구모임"];

  const filteredRestaurants = useMemo(() => {
    let result = mockRestaurants.map(r => ({
      ...r,
      isBookmarked: bookmarkedIds.has(r.id)
    }));

    if (selectedCategory !== "전체") {
      result = result.filter(r => r.category === selectedCategory);
    }

    if (selectedPrice !== "전체") {
      result = result.filter(r => r.priceRange === selectedPrice);
    }

    if (selectedSituation !== "전체") {
      result = result.filter(r => r.tags.includes(selectedSituation));
    }

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
    }

    return result;
  }, [selectedCategory, selectedPrice, selectedSituation, sortBy, bookmarkedIds]);

  const handleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex-1">
              <SearchBar
                placeholder="다른 지역 검색"
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Location & Result Count */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{locationParam} 맛집</h2>
          <p className="text-sm text-gray-600">{filteredRestaurants.length}개의 맛집을 찾았어요</p>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <SlidersHorizontal size={16} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">음식 종류</span>
            </div>
            <FilterChips
              options={foodCategories}
              selected={selectedCategory}
              onChange={(value) => setSelectedCategory(value as FoodCategory)}
            />
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-700 mb-2 block">가격대</span>
            <FilterChips
              options={priceRanges}
              selected={selectedPrice}
              onChange={(value) => setSelectedPrice(value as PriceRange)}
            />
          </div>

          <div>
            <span className="text-sm font-semibold text-gray-700 mb-2 block">상황</span>
            <FilterChips
              options={situationTags}
              selected={selectedSituation}
              onChange={(value) => setSelectedSituation(value as SituationTag)}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-gray-600">정렬:</span>
            <button
              onClick={() => setSortBy("distance")}
              className={`text-sm px-3 py-1 rounded-full ${
                sortBy === "distance"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              거리순
            </button>
            <button
              onClick={() => setSortBy("rating")}
              className={`text-sm px-3 py-1 rounded-full ${
                sortBy === "rating"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              평점순
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onBookmark={handleBookmark}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
              <p className="text-sm text-gray-400">다른 필터 조건을 시도해보세요</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
