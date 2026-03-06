"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SearchInputWithSuggestions } from "@/components/search/SearchInputWithSuggestions";
import { FilterChips } from "@/components/search/FilterChips";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import type {
  Restaurant,
  FoodCategory,
  PriceRange,
  SituationTag,
  SortOption,
} from "@/lib/types";
import { Footer } from "../layout/Footer";

const CATEGORY_ALIAS: Record<string, string[]> = {
  한식: ["한식", "한국식", "한국음식", "한정식"],
  중식: ["중식", "중국식", "중국음식"],
  일식: ["일식", "일본식", "일본음식"],
  양식: ["양식", "양식/서양식", "이탈리안", "프랑스식"],
  카페: ["카페", "카페/디저트", "디저트", "베이커리"],
};
const PRICE_RANGE_ALIAS: Record<string, string[]> = {
  "1만원 이하": ["5천원 미만", "5천원대", "1만원대"],
  "1-2만원": ["1.2만원대", "1.5만원대", "2만원대"],
  "2만원 이상": ["2.5만원대", "3만원대", "4만원 이상"],
};
const SITUATION_ALIAS: Record<string, string[]> = {
  혼밥: [
    "혼밥",
    "혼자먹기",
    "혼술",
    "혼카페",
    "혼자카페",
    "혼자방문",
    "혼자할일",
  ],
  데이트: [
    "데이트",
    "데이트하기좋은",
    "소개팅장소",
    "소개팅",
    "데이트코스",
    "연애인맛집",
  ],
  친구모임: [
    "친구모임",
    "술모임",
    "회식",
    "모임",
    "단체모임",
    "가족외식",
    "회식장소",
    "2차",
    "차모임",
  ],
};

function matchesCategory(c: string, sel: string) {
  if (sel === "전체") return true;
  const aliases = CATEGORY_ALIAS[sel] ?? [sel];
  const v = (c ?? "").trim();
  return v
    ? aliases.some((a) => v === a || v.includes(a) || a.includes(v))
    : false;
}
function matchesPriceRange(p: string, sel: string) {
  if (sel === "전체") return true;
  return (PRICE_RANGE_ALIAS[sel] ?? [sel]).includes(p);
}
function matchesSituation(tags: string[], sel: string) {
  if (sel === "전체") return true;
  const aliases = SITUATION_ALIAS[sel] ?? [sel];
  return tags.some((t) => aliases.some((a) => t.includes(a) || a.includes(t)));
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const locationParam = searchParams.get("location") || "";
  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("q");

  const [searchQuery, setSearchQuery] = useState(queryParam ?? locationParam);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>(
    (categoryParam as FoodCategory) || "전체"
  );
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>("전체");
  const [selectedSituation, setSelectedSituation] =
    useState<SituationTag>("전체");
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const isSearchByQuery = !!queryParam?.length;

  useEffect(() => {
    setSearchQuery(queryParam ?? locationParam);
  }, [queryParam, locationParam]);

  useEffect(() => {
    if (!isSearchByQuery) return;
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(queryParam!)}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((j) => {
        if (!ctrl.signal.aborted) setRestaurants(j.success ? j.data : []);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setRestaurants([]);
          setError("검색 결과를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [queryParam, isSearchByQuery]);

  useEffect(() => {
    if (isSearchByQuery) return;
    const ctrl = new AbortController();
    const p = new URLSearchParams();
    if (selectedCategory !== "전체") p.set("category", selectedCategory);
    if (selectedPrice !== "전체") p.set("priceRange", selectedPrice);
    if (selectedSituation !== "전체") p.set("situation", selectedSituation);
    p.set("sort", sortBy);
    setLoading(true);
    setError(null);
    fetch(`/api/restaurants?${p}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j) => {
        if (!ctrl.signal.aborted) setRestaurants(j.success ? j.data : []);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setRestaurants([]);
          setError("목록을 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [
    isSearchByQuery,
    selectedCategory,
    selectedPrice,
    selectedSituation,
    sortBy,
  ]);

  const filteredRestaurants = useMemo(() => {
    let list = restaurants;
    if (isSearchByQuery) {
      const parseDist = (d: string | number | undefined) => {
        const n = parseInt(String(d ?? "").replace(/\D/g, ""), 10);
        return isNaN(n) ? Infinity : n;
      };
      list = list
        .filter((r) => matchesCategory(r.category, selectedCategory))
        .filter((r) => matchesPriceRange(r.priceRange ?? "", selectedPrice))
        .filter((r) => matchesSituation(r.tags ?? [], selectedSituation))
        .sort((a, b) =>
          sortBy === "rating"
            ? b.rating - a.rating
            : parseDist(a.distance) - parseDist(b.distance)
        );
    }
    return list.map((r) => ({ ...r, isBookmarked: bookmarkedIds.has(r.id) }));
  }, [
    restaurants,
    bookmarkedIds,
    isSearchByQuery,
    selectedCategory,
    selectedPrice,
    selectedSituation,
    sortBy,
  ]);

  const foodCategories: FoodCategory[] = [
    "전체",
    "한식",
    "중식",
    "일식",
    "양식",
    "카페",
  ];
  const priceRanges: PriceRange[] = [
    "전체",
    "1만원 이하",
    "1-2만원",
    "2만원 이상",
  ];
  const situationTags: SituationTag[] = ["전체", "혼밥", "데이트", "친구모임"];

  // 활성 필터 개수
  const activeFilterCount = [
    selectedCategory !== "전체",
    selectedPrice !== "전체",
    selectedSituation !== "전체",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── 헤더: 뒤로가기 + 타이틀만 ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base font-bold text-gray-900 truncate">
            {isSearchByQuery ? `"${queryParam}"` : `${locationParam} 맛집`}
          </h1>
          <span className="ml-auto text-xs text-gray-400 shrink-0">
            {!loading && `${filteredRestaurants.length}개`}
          </span>
        </div>
      </header>

      <div className="max-w-screen-lg mx-auto px-4 py-4">
        {/* ── 검색창 (헤더 아래 본문 상단) ── */}
        <div className="mb-4">
          <SearchInputWithSuggestions
            variant="default"
            placeholder="음식점 · 음식 이름을 검색하세요"
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={(q) => {
              if (q.trim())
                router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          />
        </div>

        {/* ── 필터 토글 바 ── */}
        <div className="mb-4">
          {/* 카테고리 칩은 항상 노출 */}
          <div className="flex items-center gap-2 mb-2">
            <FilterChips
              options={foodCategories}
              selected={selectedCategory}
              onChange={(v) => setSelectedCategory(v as FoodCategory)}
            />
          </div>

          {/* 필터 열기 버튼 */}
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-500 transition-colors"
          >
            <SlidersHorizontal size={13} />
            상세 필터
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            {filterOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {/* 펼쳐지는 상세 필터 */}
          {filterOpen && (
            <div className="mt-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">
                  가격대
                </p>
                <FilterChips
                  options={priceRanges}
                  selected={selectedPrice}
                  onChange={(v) => setSelectedPrice(v as PriceRange)}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">상황</p>
                <FilterChips
                  options={situationTags}
                  selected={selectedSituation}
                  onChange={(v) => setSelectedSituation(v as SituationTag)}
                />
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400">
                  정렬
                </span>
                {(["distance", "rating"] as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                      sortBy === opt
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    {opt === "distance" ? "거리순" : "평점순"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 결과 목록 ── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-28 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="space-y-3">
            {filteredRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🍽️</p>
            <p className="text-gray-600 font-semibold">검색 결과가 없어요</p>
            <p className="text-sm text-gray-400 mt-1">
              다른 필터 조건을 시도해보세요
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
