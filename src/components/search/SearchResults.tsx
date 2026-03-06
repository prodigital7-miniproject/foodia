"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { SearchInputWithSuggestions } from "@/components/search/SearchInputWithSuggestions";
import { FilterChips } from "@/components/search/FilterChips";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { BottomNav } from "@/components/layout/BottomNav";
import type { Restaurant, FoodCategory, PriceRange, SituationTag, SortOption } from "@/lib/types";

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locationParam = searchParams.get("location") || "성수역";
  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("q");

  const [searchQuery, setSearchQuery] = useState(queryParam ?? locationParam);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>(
    (categoryParam as FoodCategory) || "전체"
  );
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>("전체");
  const [selectedSituation, setSelectedSituation] = useState<SituationTag>("전체");
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSearchByQuery = queryParam != null && queryParam.length > 0;

  // URL의 q와 동기화
  useEffect(() => {
    setSearchQuery(queryParam ?? locationParam);
  }, [queryParam, locationParam]);

  // 키워드 검색 모드: /api/search?q=
  useEffect(() => {
    if (!isSearchByQuery) return;
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(queryParam!)}`, { signal })
      .then((res) => res.json())
      .then((json) => {
        if (signal.aborted) return;
        if (json.success && Array.isArray(json.data)) {
          setRestaurants(json.data);
        } else {
          setRestaurants([]);
          setError(json.error?.message ?? "검색 결과를 불러오지 못했습니다.");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setRestaurants([]);
        setError("검색 결과를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [queryParam, isSearchByQuery]);

  // 필터/목록 모드: /api/restaurants
  useEffect(() => {
    if (isSearchByQuery) return;
    const controller = new AbortController();
    const { signal } = controller;

    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "전체") params.set("category", selectedCategory);
    if (selectedPrice && selectedPrice !== "전체") params.set("priceRange", selectedPrice);
    if (selectedSituation && selectedSituation !== "전체") params.set("situation", selectedSituation);
    params.set("sort", sortBy);

    setLoading(true);
    setError(null);
    fetch(`/api/restaurants?${params.toString()}`, { signal })
      .then((res) => res.json())
      .then((json) => {
        if (signal.aborted) return;
        if (json.success && Array.isArray(json.data)) {
          setRestaurants(json.data);
        } else {
          setRestaurants([]);
          setError(json.error?.message ?? "목록을 불러오지 못했습니다.");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setRestaurants([]);
        setError("목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [isSearchByQuery, selectedCategory, selectedPrice, selectedSituation, sortBy]);

  const foodCategories: FoodCategory[] = ["전체", "한식", "중식", "일식", "양식", "카페"];
  const priceRanges: PriceRange[] = ["전체", "1만원 이하", "1-2만원", "2만원 이상"];
  const situationTags: SituationTag[] = ["전체", "혼밥", "데이트", "친구모임"];

  const handleSearchSubmit = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const filteredRestaurants = useMemo(
    () =>
      restaurants.map((r) => ({
        ...r,
        isBookmarked: bookmarkedIds.has(r.id),
      })),
    [restaurants, bookmarkedIds]
  );

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
              <SearchInputWithSuggestions
                variant="compact"
                placeholder="음식점·음식 이름 검색"
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearchSubmit}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Title & Result Count */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {isSearchByQuery ? `"${queryParam}" 검색 결과` : `${locationParam} 맛집`}
          </h2>
          <p className="text-sm text-gray-600">{filteredRestaurants.length}개의 맛집을 찾았어요</p>
        </div>

        {/* Filters: 키워드 검색 모드가 아닐 때만 표시 */}
        {!isSearchByQuery && (
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
        )}

        {/* Results */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">{error}</p>
            </div>
          ) : filteredRestaurants.length > 0 ? (
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
