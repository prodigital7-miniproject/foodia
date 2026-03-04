"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { CategoryButton } from "@/components/home/CategoryButton";
import { BottomNav } from "@/components/layout/BottomNav";

export function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?location=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNearbySearch = () => {
    router.push("/search?location=성수역");
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };

  const popularLocations = ["성수역", "서울숲", "뚝섬역"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Foodia</h1>
          <p className="text-sm text-gray-600">오늘 뭐먹지? 근처 맛집을 빠르게 찾아보세요</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8">
        {/* Search Section */}
        <div className="space-y-4">
          <SearchBar
            placeholder="지역명을 검색하세요 (예: 성수역)"
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
          />
          
          <button
            onClick={handleNearbySearch}
            className="w-full py-4 bg-orange-600 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors shadow-md"
          >
            <MapPin size={20} />
            내 주변 맛집 찾기
          </button>
        </div>

        {/* Popular Locations */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">자주 찾는 지역</h2>
          <div className="flex gap-2">
            {popularLocations.map((location) => (
              <button
                key={location}
                onClick={() => router.push(`/search?location=${encodeURIComponent(location)}`)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* Category Quick Select */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">음식 종류별로 찾기</h2>
          <div className="grid grid-cols-3 gap-3">
            <CategoryButton icon="🍚" label="한식" onClick={() => handleCategoryClick("한식")} />
            <CategoryButton icon="🍜" label="중식" onClick={() => handleCategoryClick("중식")} />
            <CategoryButton icon="🍣" label="일식" onClick={() => handleCategoryClick("일식")} />
            <CategoryButton icon="🍝" label="양식" onClick={() => handleCategoryClick("양식")} />
            <CategoryButton icon="☕" label="카페" onClick={() => handleCategoryClick("카페")} />
            <CategoryButton icon="🍴" label="전체" onClick={() => handleCategoryClick("전체")} />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <h3 className="font-semibold text-gray-900 mb-2">💡 빠른 맛집 탐색 팁</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• 지역명 또는 '내 주변'으로 검색하세요</li>
            <li>• 필터로 원하는 조건만 빠르게 추려보세요</li>
            <li>• 마음에 드는 맛집은 저장해서 나중에 방문하세요</li>
            <li>• 같이먹기 게시판에서 식사 메이트를 구해보세요</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
