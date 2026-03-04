'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { TogetherCard } from './TogetherCard';

export default function TogetherSlider() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const allData = [
    { id: "1", store: "아도르 성수", date: "2026-02-27", category: "카페", content: "카페에서 공부하실 분 있나요? 조용히 각자 할 일 해요!", participant: "2" },
    { id: "2", store: "맛든", date: "2026-02-27", category: "한식", content: "성수동 맛집 같이 가실 분? 혼밥 탈출하고 싶어요.", participant: "2" },
    { id: "3", store: "호랑이 초밥", date: "2026-03-01", category: "일식", content: "역전 앞 초밥집 번개 모임 하실 분 구함!", participant: "4" },
    { id: "4", store: "그리노", date: "2026-03-02", category: "양식", content: "파스타 새로 생긴 곳 가보실 분 있나요?", participant: "2" },
    { id: "5", store: "김푸디", date: "2026-03-04", category: "전체", content: "푸디 선정 맛집 탐방대 1기 모집합니다!", participant: "3" },
  ];


  const moveScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const moveDistance = clientWidth * 0.8; 

    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - moveDistance : scrollLeft + moveDistance,
      behavior: 'smooth',
    });
  };


  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        moveScroll('right');
      }
    }, 3000); // 2초마다 이동

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="relative w-full py-6 bg-white group"
      onMouseEnter={() => setIsPaused(true)} 
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 타이틀 및 헤더 */}
      <div className="flex justify-between items-end px-5 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">같이먹기 모집 공고</h2>
          <p className="text-xs text-gray-500 font-medium mb-5">근처에서 함께 식사할 메이트를 찾아보세요</p>
        </div>
        <span className="text-orange-500 font-bold text-sm mb-5">총 {allData.length}개</span>
      </div>

  
      <button 
        onClick={() => moveScroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow-lg text-gray-400 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
      >
        <span className="text-xl">〈</span>
      </button>

      <button 
        onClick={() => moveScroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow-lg text-gray-400 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
      >
        <span className="text-xl">〉</span>
      </button>

      {/* 가로 스크롤 영역 */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide scroll-smooth"
      >
        {allData.map((data) => (
          <TogetherCard
            key={data.id}
            store={data.store}
            date={data.date}
            category={data.category}
            content={data.content}
            participant={data.participant}
            onClick={() => router.push(`/together/${data.id}`)}
          />
        ))}
      </div>
    </div>
  );
}