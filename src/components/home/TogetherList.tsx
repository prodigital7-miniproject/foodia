import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { TogetherComponent } from './TogetherComponent';


export default function TogetherList() {

    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleTogetherClick = (togtherId: string) => {
        router.push(`/together/${encodeURIComponent(togtherId)}`);
      };

  const allData = [
    { 
      id: "1", 
      name: "김희선", 
      date: "2026-02-27", 
      category: "카페", 
      store: "아띠카페", 
      participant: "2" 
    },
    { 
      id: "2", 
      name: "김준수", 
      date: "2026-02-27", 
      category: "한식", 
      store: "뼈탄집", 
      participant: "2" 
    },
    { 
      id: "3", 
      name: "강문군", 
      date: "2026-02-27", 
      category: "일식", 
      store: "멘츠루", 
      participant: "4" 
    },
    { 
      id: "4", 
      name: "김범창", 
      date: "2026-02-27", 
      category: "한식", 
      store: "우향가", 
      participant: "2" 
    },
  ];

  const visibleData = isExpanded ? allData : allData.slice(0, 2);
  const remainingCount = allData.length - 2;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800">같이먹기 모집 공고</h2>
        <span className="text-xs text-orange-500 font-medium">총 {allData.length}개</span>
      </div>

      {/* 리스트 영역 */}
      <div className="flex flex-col">
        {visibleData.map((item, index) => (
          <div key={item.id} className="border-b border-gray-50 last:border-none">
            <TogetherComponent
              name={item.name}
              date={item.date}
              category={item.category}
              store={item.store}
              participant={item.participant}
              onClick={() => handleTogetherClick("2")}
            />
          </div>
        ))}
      </div>

      {!isExpanded && remainingCount > 0 && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full py-4 text-orange-500 text-sm font-semibold transition-colors border-t border-gray-50"
        >
          나머지 {remainingCount}개 더보기 ▼
        </button>
      )}

      {isExpanded && (
        <button 
          onClick={() => setIsExpanded(false)}
          className="w-full py-4 text-gray-400 text-sm font-medium transition-colors border-t border-gray-50"
        >
          접기 ▲
        </button>
      )}
    </div>
  );
}