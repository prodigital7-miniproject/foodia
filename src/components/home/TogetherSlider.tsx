'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { TogetherCard } from './TogetherCard';

/** GET /api/together-posts 응답 한 건 타입 */
type TogetherPostItem = {
  id: number;
  rid: string;
  title: string;
  content: string;
  status: string;
  isAnonymous: boolean;
  createdAt: string;
  storeName: string | null;
  storeCategory: string | null;
};

type TogetherSliderProps = {
  /** 요청할 게시글 개수 (API 최대 100). 미지정 시 20. 전체 목록은 100. */
  limit?: number;
};

export default function TogetherSlider({ limit = 20 }: TogetherSliderProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [posts, setPosts] = useState<TogetherPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/together-posts?limit=${limit}`);
        const json = await response.json();
        if (!response.ok) {
          setError(json?.error?.message ?? '목록을 불러오지 못했습니다.');
          setPosts([]);
          return;
        }
        setPosts(Array.isArray(json?.data) ? json.data : []);
      } catch {
        setError('목록을 불러오지 못했습니다.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [limit]);

  const moveScroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const moveDistance = clientWidth * 0.8; 

    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - moveDistance : scrollLeft + moveDistance,
      behavior: 'smooth',
    });
    }, []);


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
    }, 3000); // 3초마다 이동

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
        <span className="text-orange-500 font-bold text-sm mb-5">총 {posts.length}개</span>
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
        {loading ? (
          <p className="text-sm text-gray-500 py-4">불러오는 중...</p>
        ) : error ? (
          <p className="text-sm text-red-500 py-4">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">게시물이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <TogetherCard
              key={post.id}
              store={post.storeName ?? '-'}
              date={format(new Date(post.createdAt), 'yyyy-MM-dd')}
              category={post.storeCategory ?? '-'}
              content={post.content}
              participant="0"
              onClick={() => router.push(`/together/post/${post.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}