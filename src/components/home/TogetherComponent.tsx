interface TogetherComponentProps {
    name: string;
    date: string;
    category: string;
    store: string;
    participant: string;
    onClick: () => void;
  }
  
  export function TogetherComponent({ name, date, category, store, participant, onClick }: TogetherComponentProps) {
    return (
      <button
        onClick={onClick}
       className="w-full flex flex-col items-start gap-3 p-5 bg-white hover:bg-orange-50/40 transition-all text-left"
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-orange-500 font-bold text-sm bg-orange-50 px-2 py-0.5 rounded">
              {name}
            </span>
            <span className="text-gray-400 text-xs">{date}</span>
          </div>
          
        </div>
  
        {/* 2. 본문 내용 (두 줄 제한 등 추가 가능) */}
        <div className="text-gray-800 text-sm font-medium leading-relaxed line-clamp-2">
          {store}
        </div>
  
        {/* 3. 하단 태그 (카테고리, 모집인원) */}
        <div className="flex gap-2">
          <span className="bg-purple-50 text-purple-500 text-xs px-2.5 py-1 rounded-md">
            {category}
          </span>
          <span className="bg-green-50 text-green-600 text-xs px-2.5 py-1 rounded-md">
            {participant}명 모집
          </span>
        </div>
      </button>
    );
  }