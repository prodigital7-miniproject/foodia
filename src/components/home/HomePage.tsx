"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CategoryButton } from "@/components/home/CategoryButton";
import { BottomNav } from "@/components/layout/BottomNav";
import TogetherSlider from "./TogetherSlider";
import { Header } from "../layout/Header";

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

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── HEADER ── */}
     <Header/>

          {/* 검색창 */}
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="지역명을 검색하세요 (예: 성수역)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>
      

      {/* ── MAIN ── */}
      <main className="pt-14 pb-24 max-w-screen-lg mx-auto px-4">

        {/* 히어로 배너 */}
        <section className="mt-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 px-6 py-8 flex items-center justify-between overflow-hidden relative">
          <div className="z-10">
            <p className="text-xs font-semibold text-orange-400 mb-1 tracking-wide uppercase">
              음식 이상형 월드컵
            </p>
            <h1 className="text-2xl font-black text-gray-900 leading-snug">
              오늘 뭐 먹지?<br />
              <span className="text-orange-500">취향대로</span> 골라봐요
            </h1>
            <button
              onClick={() => router.push("/ideal-cup")}
              className="mt-4 inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md transition-all"
            >
              지금 시작하기 →
            </button>
          </div>
          {/* 플로팅 이미지 */}
          <div className="relative shrink-0 ml-4">
            <div className="absolute -top-8 -left-16 whitespace-nowrap bg-white text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10">
              오늘 뭐 먹지? 🤔
              <div className="absolute right-3 -bottom-1.5 w-3 h-3 bg-white rotate-45" />
            </div>
            <img
              src="/idel-cup.svg"
              alt="음식 월드컵"
              className="w-24 h-auto drop-shadow-lg"
            />
          </div>
        </section>

        {/* 카테고리 */}
        <section className="mt-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            음식 종류별로 찾기
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <CategoryButton icon="🍚" label="한식" onClick={() => handleCategoryClick("한식")} />
            <CategoryButton icon="🍜" label="중식" onClick={() => handleCategoryClick("중식")} />
            <CategoryButton icon="🍣" label="일식" onClick={() => handleCategoryClick("일식")} />
            <CategoryButton icon="🍝" label="양식" onClick={() => handleCategoryClick("양식")} />
            <CategoryButton icon="☕" label="카페"  onClick={() => handleCategoryClick("카페")} />
            <CategoryButton icon="🍴" label="전체" onClick={() => handleCategoryClick("전체")} />
          </div>
        </section>

        {/* 같이먹기 슬라이더 */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">같이먹기 모집</h2>
            <button
              onClick={() => router.push("/together")}
              className="text-xs text-orange-500 font-semibold hover:underline"
            >
              전체보기 →
            </button>
          </div>
          <TogetherSlider limit={100} />
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-50 border-t border-gray-100 pb-24">
        <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-4">
          {/* 링크 */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
            {["개인정보처리방침", "이용약관", "고객센터", "공지사항"].map((item) => (
              <button
                key={item}
                className="hover:text-orange-500 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-200" />

          {/* 주소 & 카피라이트 */}
          <div className="space-y-1 text-xs text-gray-400 leading-relaxed">
            <p className="font-semibold text-gray-600">이델컵</p>
            <p>서울특별시 OO구 OO로 123</p>
            <p>고객센터: 02-0000-0000 (평일 09:00 – 18:00)</p>
            <p className="pt-1">
              Copyright © {new Date().getFullYear()} 이델컵 All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}