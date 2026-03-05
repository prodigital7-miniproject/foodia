interface TogetherComponentProps {
    date: string;
    category: string;
    content: string;
    store: string;
    participant: string;
    onClick: () => void;
  }
  

export function TogetherCard({ store, date, category, content, participant, onClick }: TogetherComponentProps) {
    return (
      <button
        onClick={onClick}
        className="flex-shrink-0 w-[160px] h-[200px] flex flex-col items-start gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-500 transition-all text-left"
      >
        {/* 상단 타이틀 및 카테고리 태그 */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-start w-full">
            <span className="text-[13px] font-bold text-gray-800 truncate">{store}</span>
            <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 rounded">
              {category}
            </span>
          </div>
          {/* 인원 정보 (아이콘 포함 시안 반영) */}
          <div className="flex items-center gap-1 text-[10px] text-orange-400">
            👥 {participant}
          </div>
        </div>
  
        {/* 중간 본문 (3줄 정도 제한) */}
        <div className="flex-1 text-[11px] text-gray-600 line-clamp-3 leading-snug pt-1">
          {content}
        </div>
  
        {/* 하단 날짜 */}
        <div className="text-[10px] text-gray-400 mt-auto">
          {date}
        </div>
      </button>
    );
  }