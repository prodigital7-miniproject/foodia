"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { CategoryButton } from "@/components/home/CategoryButton";
import { BottomNav } from "@/components/layout/BottomNav";
import Image from "next/image";
import TogetherList from "./TogetherList";
import { Header } from "../layout/Header";
import TogetherSlider from "./TogetherSlider";

export function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?location=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };

  const handleTogetherClick = (togtherId: string) => {
    router.push(`/together/${encodeURIComponent(togtherId)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white pb-20 pt-24">
      <Header />

      {/* Search Section */}
      <div className="space-y-4 max-w-md mx-auto px-4 py-6  ">
        <SearchBar
          placeholder="지역명을 검색하세요 (예: 성수역)"
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
        />
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-8">
        {/* Category Quick Select */}
        <div className=" items-end px-5 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            음식 종류별로 찾기
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <CategoryButton
              icon="🍚"
              label="한식"
              onClick={() => handleCategoryClick("한식")}
            />
            <CategoryButton
              icon="🍜"
              label="중식"
              onClick={() => handleCategoryClick("중식")}
            />
            <CategoryButton
              icon="🍣"
              label="일식"
              onClick={() => handleCategoryClick("일식")}
            />
            <CategoryButton
              icon="🍝"
              label="양식"
              onClick={() => handleCategoryClick("양식")}
            />
            <CategoryButton
              icon="☕"
              label="카페"
              onClick={() => handleCategoryClick("카페")}
            />
            <CategoryButton
              icon="🍴"
              label="전체"
              onClick={() => handleCategoryClick("전체")}
            />
          </div>
        </div>

        {/* 같이먹기 모집 공고 */}
        <TogetherSlider />
      </div>

      <button 
        onClick={() => router.push('/idel-cup')}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-5 py-3 
                   bg-white border-2 border-amber-900 text-amber-900 rounded-full 
                   shadow-xl font-bold active:scale-95 transition-transform"
      >
        <span className="text-xl">🏆</span>
        <span>음식 월드컵</span>
      </button>

      <BottomNav />
    </div>
  );
}
