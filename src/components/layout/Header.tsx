
"use client";

export function Header() {
    return (
      // fixed top-0으로 변경하여 상단에 고정합니다.
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-md mx-auto px-5 py-4 flex flex-col gap-1">
          {/* 로고 크기를 적절하게 조절 (w-24는 약 96px) */}
          <img src="/logo.svg" className="w-24 h-auto" alt="foodia 로고" />
          <p className="text-[11px] text-gray-400">
            오늘 뭐먹지? 근처 맛집을 빠르게 찾아보세요
          </p>
        </div>
      </header>
    );
  }



